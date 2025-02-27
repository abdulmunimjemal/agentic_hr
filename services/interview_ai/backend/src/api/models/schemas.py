# models/schemas.py
from .enums import ChatState
from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict

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

class ChatRequest(BaseModel):
    session_id: str
    user_answer: str

class ChatResponse(BaseModel):
    state: ChatState
    text: str
    success: bool
    error: str = None

class ScheduleRequest(BaseModel):
    name: str
    user_info: str
    user_email: EmailStr
    role_info: str
    job_title: str
    skills: Dict[str, dict]

class ScheduleResponse(BaseModel):
    success: bool
    interview_id: str = None
    error: str = None


class SessionResponse(BaseModel):
    interview_id: str
    chat_history: List[str] = []
    success: bool
    error: str = None