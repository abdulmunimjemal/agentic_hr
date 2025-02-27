from fastapi import APIRouter, Depends, Request
import logging
from typing import Dict
from src.api.models.schemas import ChatRequest, ChatResponse, SessionData
from src.api.db.dependencies import get_mongo_db, get_redis_client
from src.api.core.config import get_settings
from src.api.services.email import send_email_notification
from src.interview_ai import unified_interface

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)
settings = get_settings()

@router.post("", response_model=ChatResponse)
async def process_chat(
    request: Request,
    chat_request: ChatRequest,
    redis_client=Depends(get_redis_client),
    mongo_db=Depends(get_mongo_db)
) -> Dict:
    try:
        if not chat_request.session_id:
            return {
                "success": False,
                "error": "Missing session ID",
                "state": None,
                "text": ""
            }

        session_json = redis_client.get(chat_request.session_id)
        if not session_json:
            return {
                "success": False,
                "error": "Session not found",
                "state": None,
                "text": ""
            }

        try:
            session_data = SessionData.model_validate_json(session_json)
        except Exception as e:
            logger.error(f"Session data parse error: {str(e)}")
            return {
                "success": False,
                "error": "Invalid session data",
                "state": None,
                "text": ""
            }

        if chat_request.user_answer:
            session_data.conversation_history.append(
                f"User: {chat_request.user_answer}"
            )
            session_data.user_answer = chat_request.user_answer

        try:
            interviewer_result = unified_interface.kickoff(
                session_data.model_dump(),
                max_conversation_history=settings.MAX_CONVERSATION_HISTORY
            )
        except Exception as e:
            logger.error(f"AI processing failed: {str(e)}")
            return {
                "success": False,
                "error": "Interview processing failed",
                "state": None,
                "text": ""
            }

        interviewer_text = interviewer_result.get("text", "")
        state = interviewer_result.get("state", "ongoing")
        session_data.conversation_history.append(f"Interviewer: {interviewer_text}")

        if state == "completed":
            try:
                await mongo_db.interview_results.insert_one({
                    "interview_id": session_data.interview_id,
                    "hiring_decision": interviewer_result.get("hiring_decision", ""),
                    "reasoning": interviewer_result.get("reasoning", ""),
                    "skills": interviewer_result.get("skills", {}),
                    "conversation_history": session_data.conversation_history,
                    "user_info": session_data.user_info,
                    "role_info": session_data.role_info,
                })
                redis_client.delete(chat_request.session_id)
                
                send_email_notification(
                    to=session_data.user_email,
                    type="interview_completed",
                    subject="Interview Completed",
                    name=session_data.name,
                    title=session_data.job_title
                )
            except Exception as e:
                logger.error(f"Completion processing failed: {str(e)}")

        elif state == "ongoing":
            session_data.skills = interviewer_result.get("skills", {})

        redis_client.setex(
            chat_request.session_id,
            86400,
            session_data.model_dump_json()
        )

        return {
            "success": True,
            "error": None,
            "state": state,
            "text": interviewer_text
        }

    except Exception as e:
        logger.error(f"Chat processing error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "state": None,
            "text": ""
        }