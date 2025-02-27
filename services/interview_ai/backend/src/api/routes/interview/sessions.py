from fastapi import APIRouter, Depends, Request
from uuid import uuid4
from bson import ObjectId
import logging
from typing import Dict
from src.api.models.schemas import SessionResponse, SessionData
from src.api.db.dependencies import get_mongo_db, get_redis_client
from src.api.core.config import get_settings

router = APIRouter(prefix="/session", tags=["sessions"])
logger = logging.getLogger(__name__)
settings = get_settings()

@router.post("/{interview_id}", response_model=SessionResponse)
async def manage_session(
    request: Request,
    interview_id: str,
    continue_existing: bool = False,
    mongo_db=Depends(get_mongo_db),
    redis_client=Depends(get_redis_client)
) -> Dict:
    try:
        interview_obj_id = ObjectId(interview_id)
    except Exception as e:
        logger.error(f"Invalid interview ID: {interview_id}")
        return {
            "success": False,
            "error": "Invalid interview ID format",
            "interview_id": interview_id,
            "session_id": None,
            "chat_history": []
        }

    try:
        if continue_existing:
            existing_session_id = redis_client.get(f"interview:{interview_id}")
            if existing_session_id:
                session_data = redis_client.get(existing_session_id.decode())
                if session_data:
                    try:
                        parsed_data = SessionData.model_validate_json(session_data)
                        return {
                            "success": True,
                            "interview_id": interview_id,
                            "session_id": existing_session_id.decode(),
                            "chat_history": parsed_data.conversation_history,
                            "error": None
                        }
                    except Exception as e:
                        logger.error(f"Session data corruption: {str(e)}")
                        redis_client.delete(f"interview:{interview_id}")
                        redis_client.delete(existing_session_id.decode())

        interview_data = await mongo_db.interviews.find_one({"_id": interview_obj_id})
        if not interview_data:
            return {
                "success": False,
                "error": "Interview not found",
                "interview_id": interview_id,
                "session_id": None,
                "chat_history": []
            }

        try:
            session = SessionData(**interview_data)
            session_id = str(uuid4())
            
            redis_client.setex(
                session_id, 
                86400, 
                session.model_dump_json()
            )
            redis_client.setex(
                f"interview:{interview_id}",
                86400,
                session_id
            )
            
            return {
                "success": True,
                "interview_id": interview_id,
                "session_id": session_id,
                "chat_history": session.conversation_history,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Session creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "interview_id": interview_id,
                "session_id": None,
                "chat_history": []
            }

    except Exception as e:
        logger.error(f"Session management error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "interview_id": interview_id,
            "session_id": None,
            "chat_history": []
        }