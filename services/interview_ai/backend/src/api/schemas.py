# api/schemas.py

from typing import List, Dict
from enum import Enum
from pydantic import BaseModel, Field, EmailStr


class RequiredLevel(str, Enum):
    expert = "expert"
    intermediate = "intermediate"
    beginner = "beginner"


class Skill(BaseModel):
    required_level: RequiredLevel
    rating: int = 0
    questions_asked: int = 0
    weight: int = 10


class SessionData(BaseModel):
    conversation_history: List[str] = Field(default_factory=list)
    skills: Dict[str, Dict]
    user_info: str
    role_info: str
    user_answer: str = ""
    interview_id: str = ""
    user_email: EmailStr = ""
    name: str = ""
    job_title: str = ""

class ChatState(str, Enum):
    welcome = "welcome"
    ongoing = "ongoing"
    completed = "completed"

class SessionResponse(BaseModel):
    session_id: str

class ChatRequest(BaseModel):
    session_id: str
    user_answer: str

class ChatResponse(BaseModel):
    state: ChatState
    text: str


class ScheduleRequest(BaseModel):
    name: str
    user_info: str
    user_email: EmailStr
    role_info: str
    job_title: str
    # The input skills dict only provides 'required_level' for each skill.
    # Example:
    # {
    #   "skill_1": {"required_level": "advanced"},
    #   "skill_2": {"required_level": "intermediate"},
    #   "skill_3": {"required_level": "beginner"}
    # }
    skills: Dict[str, dict]

class ScheduleResponse(BaseModel):
    success: bool
    interview_id: str = None
    error: str = None

class EmailType(str, Enum):
    interview_scheduled = "interview_scheduled"
    interview_completed = "interview_completed"
    text = "text"

