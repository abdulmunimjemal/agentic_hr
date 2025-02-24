from config_local import Config
from fastapi import FastAPI, Form, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import uuid
import os
from producer import publish_application
from models import JobDocument, ApplicationDocument
import aiofiles
import logging
from bson import ObjectId
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import requests
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

email_server = os.getenv("NOTIFICATION_SERVICE_URL")

if email_server is None:
    logger.error("NOTIFICATION_SERVICE_URL environment variable not set")

BASE_URL = email_server.rstrip("/") + "/notify/email"

def send_email_notification(to: str, subject: str, type = "application_received", **kwargs) -> Dict[str, Any]:
    """Send an email notification via the notification service.

    Args:
        type (EmailType): Type of email notification.
        to (str): Recipient email address.
        subject (str): Email subject.
        body (str): Plain text email body.
        html (str): HTML formatted email body.

    Returns:
        Dict[str, Any]: Response containing status and message.
    """
    
    payload = {
        "to": to,
        "subject": subject,
        **kwargs,
    }

    payload['type'] = type


    logger.info(f"Sending email notification to {to} with subject: {subject}")
    logger.info(f"Base URL: {BASE_URL}")
    logger.info(f"Payload: {payload}")

    try:
        response = requests.post(BASE_URL, json=payload, timeout=10)
        response.raise_for_status()
        return {"status": "success", "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}


logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can specify a list like ["http://localhost", "http://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like GET, POST, etc.
    allow_headers=["*"],  # Allows all headers
)

class JobPostRequest(BaseModel):
    title: str
    description: str

@app.post("/job_post", status_code=status.HTTP_201_CREATED)
async def post_job(request: JobPostRequest):
    if not request.description.strip() or not request.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title and description cannot be empty"
        )

    job_data = {
        "title": request.title,
        "description": request.description
    }

    try:
        job = JobDocument.create_job(job_data)
        return {
            "job_id": job.job_id,
            "message": "Job posted successfully"
        }
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create job"
        )

@app.get("/jobs")
def get_jobs():
    try:
        return JobDocument.get_all_jobs()
    except Exception as e:
        logger.error(f"Error fetching jobs: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch jobs"
        )

@app.get("/jobs/{job_id}")
def get_job(job_id: int):  # Changed to int to match schema
    try:
        job = JobDocument.get_job_by_id(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job ID format")

@app.post("/jobs/{job_id}/apply", status_code=status.HTTP_201_CREATED)
async def submit_application(
    job_id: int,  # Changed to int to match schema
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        os.makedirs(Config.UPLOAD_DIR, exist_ok=True)
        file_uuid = uuid.uuid4()
        resume_filename = f"{file_uuid}_{resume.filename}"
        resume_path = os.path.join(Config.UPLOAD_DIR, resume_filename)

        # Save file first
        async with aiofiles.open(resume_path, "wb") as f:
            await f.write(await resume.read())

        # Create application document
        application_data = {
            "job_id": job_id,
            "name": name,
            "email": email,
            "cv": resume_path
        }

        application = ApplicationDocument.create_application(application_data)
        application_id = application["_id"]

        
        logger.info(f"Application submitted successfully: {application_id}")
        logger.info(f"Publishing application for {application_id}")
        # send email
        if email_server:
            # get job title
            job = JobDocument.get_job_by_id(job_id)
            job_title = job["title"]

            send_email_notification(
                email,
                "Application Received!",
                type="application_received",
                name=name,
                title=job_title
            )

        await publish_application({
            "app_id": application_id,
            "resume_path": resume_path,
            "job_id": job_id
        })

        logger.info(f"Application published for {application_id}")
        

        return {
            "app_id": application_id,
            "message": "Application submitted successfully"
        }

    except Exception as e:
        logger.error(f"Application submission failed: {str(e)}")
        if os.path.exists(resume_path):
            os.remove(resume_path)
        raise HTTPException(
            status_code=500,
            detail="Failed to submit application"
        )