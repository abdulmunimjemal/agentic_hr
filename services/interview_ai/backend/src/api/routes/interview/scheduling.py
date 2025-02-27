from typing import Dict
from fastapi import APIRouter, Depends, Request
from bson import ObjectId
import logging
from src.api.models.schemas import ScheduleRequest, ScheduleResponse, SessionData
from src.api.db.dependencies import get_mongo_db
from src.api.core.config import get_settings
from src.api.services.email import send_email_notification

router = APIRouter(prefix="/schedule", tags=["scheduling"])
logger = logging.getLogger(__name__)
settings = get_settings()

@router.post("", response_model=ScheduleResponse)
async def schedule_interview(
    request: Request,
    schedule_request: ScheduleRequest,
    mongo_db=Depends(get_mongo_db)
) -> Dict:
    try:
        transformed_skills = {}
        for skill_name, details in schedule_request.skills.items():
            required_level = details.get("required_level")
            if required_level == "advanced":
                required_level = "expert"
            if required_level not in ["expert", "intermediate", "beginner"]:
                return {
                    "success": False,
                    "error": f"Invalid required_level for skill '{skill_name}'",
                    "interview_id": None
                }
            transformed_skills[skill_name] = {
                "required_level": required_level,
                "rating": 0,
                "questions_asked": 0,
                "weight": 10
            }
        
        session_data = SessionData(
            
            user_info=schedule_request.user_info,
            role_info=schedule_request.role_info,
            skills=transformed_skills,
            user_email=schedule_request.user_email,
            name=schedule_request.name,
            job_title=schedule_request.job_title,
        )
        
        result = await mongo_db.interviews.insert_one(session_data.model_dump())
        interview_id = str(result.inserted_id)
        interview_link = f"{settings.FRONTEND_BASE_URL}/interview/{interview_id}"
        
        try:
            send_email_notification(
                to=schedule_request.user_email,
                type="interview_scheduled",
                subject="Your Interview has been Scheduled!",
                interview_link=interview_link,
                name=schedule_request.name,
                title=schedule_request.job_title,
            )
        except Exception as e:
            logger.error(f"Email notification failed: {str(e)}")

        return {
            "success": True,
            "interview_id": interview_id,
            "error": None
        }
    except Exception as e:
        logger.error(f"Scheduling failed: {str(e)}")
        return {
            "success": False,
            "interview_id": None,
            "error": str(e)
        }