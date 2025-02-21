from fastapi import APIRouter, status, HTTPException, BackgroundTasks
from app.schemas import EmailNotification
from app.services.email_service import send_email_notification

router = APIRouter()

@router.post("/notify/email", status_code=status.HTTP_200_OK)
def notify_email(notification: EmailNotification, background_tasks: BackgroundTasks):
    """
    Endpoint to send an email notification.
    Usage:
    POST /notify/email
    { "to": "user@example.com", "subject": "Hello", "body": "Hello World!" }
    """
    background_tasks.add(send_email_notification, to=notification.to, subject=notification.subject, body=notification.body, html=notification.html)

    return {"message": "Added to Queue."}