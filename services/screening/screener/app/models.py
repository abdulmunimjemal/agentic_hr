from app.database import database
from datetime import datetime
from bson import ObjectId
from pymongo import ReturnDocument

class BaseDocument:
    """Base class for common database operations."""
    
    collection_name = ""

    @classmethod
    def get_collection(cls):
        return database.get_collection(cls.collection_name)

class ResultDocument(BaseDocument):
    collection_name = "screening_results"

    @classmethod
    def create(cls, result_data):
        result_data["created_at"] = datetime.utcnow()
        result = cls.get_collection().insert_one(result_data)
        return cls.get_collection().find_one({"_id": result.inserted_id})

    @classmethod
    def get_by_id(cls, application_id):
        application_id = ObjectId(application_id) if not isinstance(application_id, ObjectId) else application_id
        result = cls.get_collection().find_one({"app_id": application_id})
        
        if result:
            result["_id"] = str(result["_id"])
            result["app_id"] = str(result["app_id"])
        return result

class JobDocument(BaseDocument):
    collection_name = "jobs"

    @classmethod
    def get_job_by_id(cls, job_id):
        job = cls.get_collection().find_one({"job_id": job_id})
        if job:
            job["_id"] = str(job["_id"])
            job["applications"] = [str(app_id) for app_id in job.get("applications", [])]
        return job

    @classmethod
    def get_all_jobs(cls):
        jobs = list(cls.get_collection().find())
        for job in jobs:
            job["_id"] = str(job["_id"])
            job["applications"] = [str(app_id) for app_id in job.get("applications", [])]
        return jobs

class ApplicationDocument(BaseDocument):
    collection_name = "applications"

    @classmethod
    def create_application(cls, application_data):
        application_data.update({
            "date": datetime.utcnow(),
            "created_at": datetime.utcnow()
        })

        result = cls.get_collection().insert_one(application_data)
        new_application = cls.get_collection().find_one({"_id": result.inserted_id})
        
        # Update the job's applications array
        database.get_collection("jobs").update_one(
            {"job_id": application_data["job_id"]},
            {"$push": {"applications": result.inserted_id}}
        )

        if new_application:
            new_application["_id"] = str(new_application["_id"])
            new_application["job_id"] = int(new_application["job_id"])
            
        return new_application

    @classmethod
    def get_application_by_id(cls, application_id):
        application_id = ObjectId(application_id) if not isinstance(application_id, ObjectId) else application_id
        application = cls.get_collection().find_one({"_id": application_id})

        if application:
            application["_id"] = str(application["_id"])
            application["job_id"] = int(application["job_id"])
        return application
