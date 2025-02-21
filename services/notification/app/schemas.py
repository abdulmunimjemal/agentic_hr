from pydantic import BaseModel, EmailStr
from typing import Optional

class EmailNotification(BaseModel):
    to: EmailStr
    subject: str
    body: Optional[str] = None
    html: Optional[str] = None

