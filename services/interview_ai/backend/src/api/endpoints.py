# api/endpoints.py
 
import logging

from fastapi import APIRouter, HTTPException, Depends
from uuid import uuid4
from bson import ObjectId

from src.api.config import settings
from src.api.utils import send_email_notification
from src.api.dependencies import get_mongo_db, get_redis_client
from src.api.schemas import SessionData, SessionResponse, ChatRequest, ChatResponse, ChatState, ScheduleRequest, ScheduleResponse, EmailType
from src.interview_ai import unified_interface

router = APIRouter()

logger = logging.getLogger(__name__)

FRONTEND_BASE_URL = settings.FRONTEND_BASE_URL # FOR EMAILS

@router.post("/schedule", response_model=ScheduleResponse)
async def schedule_interview(schedule_request: ScheduleRequest,
                             mongo_db=Depends(get_mongo_db)):
    """
    Accepts scheduling details, validates and transforms the skills input,
    stores the scheduling information in MongoDB, and returns a success status
    along with the generated interview_id.
    """
    transformed_skills = {}
    for skill_name, details in schedule_request.skills.items():
        required_level = details.get("required_level")
        # Map "advanced" to "expert" if provided
        if required_level == "advanced":
            required_level = "expert"
        if required_level not in ["expert", "intermediate", "beginner"]:
            return {"success": False, "error": f"Invalid required_level for skill '{skill_name}'"}
        transformed_skills[skill_name] = {
            "required_level": required_level,
            "rating": 0,
            "questions_asked": 0,
            "weight": 10
        }
    
    # Create the session data using the strongly typed model
    session_data = SessionData(
        user_info=schedule_request.user_info,
        role_info=schedule_request.role_info,
        skills=transformed_skills,
        conversation_history=[],  # Initialize as empty
        user_answer="",            # Default empty string
        name=schedule_request.name,
        user_email=schedule_request.user_email
    )
    
    try:
        result = await mongo_db.interviews.insert_one(session_data.model_dump())
        interview_id = str(result.inserted_id)
        interview_link = f"{FRONTEND_BASE_URL}/interview/{interview_id}"
        try:
            result = send_email_notification(
                    to=schedule_request.user_email,
                    type=EmailType.interview_scheduled,
                    subject="Your Interview has been Scheduled!",
                    interview_link=interview_link,
                    name=schedule_request.name,
                    title=schedule_request.job_title,
                )
        except Exception as e:
            logger.error(f"Failed to send email to {schedule_request.user_email}")

        return {"success": True, "interview_id": interview_id}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/start_interview/{interview_id}", response_model=SessionResponse)
async def start_interview(interview_id: str,
                          mongo_db=Depends(get_mongo_db),
                          redis_client=Depends(get_redis_client)):
    """
    Retrieves interview details from MongoDB, creates a new session in Redis,
    and returns the generated session_id.
    """
    try:
        interview_obj_id = ObjectId(interview_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid interview ID format")

    # Fetch the interview details from the MongoDB collection (assume collection "interviews")
    interview_data = await mongo_db.interviews.find_one({"_id": interview_obj_id})
    if not interview_data:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Expecting interview_data to contain 'user_info', 'role_info', and 'skills_required'
    try:
        # Map "skills_required" from MongoDB to "skills" expected by our SessionData model.
        session = SessionData(
            user_info=interview_data["user_info"],
            role_info=interview_data["role_info"],
            skills=interview_data["skills"],  # This should be a dict in the correct format.
            conversation_history=[],  # default empty list
            user_answer="", # default empty string
            interview_id=interview_id,
            user_email=interview_data["user_email"]
        )
    
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required field: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid interview data: {str(e)}")

    # Generate a random session_id
    session_id = str(uuid4())

    # Store session data in Redis (serialize as JSON)
    redis_client.set(session_id, session.json())

    return SessionResponse(session_id=session_id)


@router.post("/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    redis_client=Depends(get_redis_client),
    mongo_db=Depends(get_mongo_db)
):
    """
    Processes a chat message by retrieving the session, updating it with the
    user's answer, calling the kickoff function, and returning the state and text.
    """
    # Retrieve session data from Redis
    session_json = redis_client.get(chat_request.session_id)
    if not session_json:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        session_data = SessionData.model_validate_json(session_json)
    except Exception as e:
        # Consider logging the error
        raise HTTPException(status_code=500, detail=f"Failed to parse session data: {e}")

    # Update conversation history with the user's answer
    user_message = f"User: {chat_request.user_answer}" if chat_request.user_answer else ""
    if user_message != "":
        session_data.conversation_history.append(user_message)
    session_data.user_answer = chat_request.user_answer

    try:
        interviewer_result = unified_interface.kickoff(session_data.model_dump(), max_conversation_history=settings.MAX_CONVERSATION_HISTORY)
    except Exception as e:
        # Consider logging the error
        raise HTTPException(status_code=500, detail=f"Failed to call the crew interface: {e}")

    interviewer_text = interviewer_result.get("text", "")

    if not interviewer_text:
        logger.error(f"No response text returned from kickoff: {interviewer_result}")
        raise HTTPException(status_code=500, detail="No response text returned from kickoff")

    state = interviewer_result.get("state")
    if not state:
        raise HTTPException(status_code=500, detail="State not returned from kickoff")

    session_data.conversation_history.append(f"Interviewer: {interviewer_text}")

    if state == "completed":
        # Process completed state: extract and save interview results
        interview_results = {
            "interview_id": session_data.interview_id,
            "hiring_decision": interviewer_result.get("hiring_decision", ""),
            "reasoning": interviewer_result.get("reasoning", ""),
            "skills": interviewer_result.get("skills", {}),
            "conversation_history": session_data.conversation_history,
            "user_info": session_data.user_info,
            "role_info": session_data.role_info,
        }
        await mongo_db.interview_results.insert_one(interview_results)
        redis_client.delete(chat_request.session_id)

        # Send an email notification to the user
        result = send_email_notification(
            to=session_data.user_email,
            subject="Your Interview has been Completed!",
            type=EmailType.interview_completed,
            name=session_data.name,
        )

        if not result:
            logger.error(f"Failed to send interview completion email to {session_data.user_email}")

    elif state == "ongoing":
        session_data.skills = interviewer_result.get("skills", {})

    # Save the updated session data back into Redis
    redis_client.set(chat_request.session_id, session_data.model_dump_json())

    # Validate that the state is one of our allowed enum values
    try:
        state_enum = ChatState(state)
    except ValueError:
        raise HTTPException(status_code=500, detail="Invalid state returned from kickoff")

    return ChatResponse(state=state_enum, text=interviewer_text)
