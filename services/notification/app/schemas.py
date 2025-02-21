from pydantic import BaseModel, EmailStr
from typing import Union
from enum import Enum

class NotificationType(str, Enum):
    interview_scheduled = "interview_scheduled"
    interview_completed = "interview_completed"
    text = "text"

from typing import Literal
from pydantic import BaseModel, EmailStr

class BaseNotification(BaseModel):
    type: NotificationType
    subject: str
    to: EmailStr

class InterviewScheduledNotification(BaseNotification):
    type: Literal[NotificationType.interview_scheduled]
    interview_link: str
    name: str
    title: str  # Job title

class InterviewCompletedNotification(BaseNotification):
    type: Literal[NotificationType.interview_completed]
    name: str
    title: str  # Job title

class TextNotification(BaseNotification):
    type: Literal[NotificationType.text]
    message: str



NotificationUnion = Union[
    InterviewScheduledNotification,
    InterviewCompletedNotification,
    TextNotification
]