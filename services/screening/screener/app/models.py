from database import results_collection, job_collection, applications_collection
from datetime import datetime
from bson import ObjectId
from pymongo import ReturnDocument

class ResultDocument:
    @classmethod
    def create(cls, result_data):
        result_data["created_at"] = datetime.utcnow()
        result = results_collection.insert_one(result_data)
        return results_collection.find_one({"_id": result.inserted_id})

    @classmethod
    def get_by_id(cls, application_id):
        if not isinstance(application_id, ObjectId):
            application_id = ObjectId(application_id)
        
        result = results_collection.find_one({"app_id": application_id})
        if result:
            result["_id"] = str(result["_id"])
            result["app_id"] = str(result["app_id"])
        return result

class JobDocument:

    @classmethod
    def get_job_by_id(cls, job_id):
        job = job_collection.find_one({"job_id": job_id})
        if job:
            job["_id"] = str(job["_id"])
            job["applications"] = [str(app_id) for app_id in job["applications"]]
        return job

    @classmethod
    def get_all_jobs(cls):
        jobs = list(job_collection.find())
        for job in jobs:
            job["_id"] = str(job["_id"])
            job["applications"] = [str(app_id) for app_id in job["applications"]]
        return jobs

class ApplicationDocument:  # Fixed typo in class name
    @classmethod
    def create_application(cls, application_data):
        application_data.update({
            "date": datetime.utcnow(),
            "created_at": datetime.utcnow()
        })

        result = applications_collection.insert_one(application_data)
        new_application = applications_collection.find_one({"_id": result.inserted_id})
        
        # Update the job's applications array
        job_collection.update_one(
            {"job_id": application_data["job_id"]},
            {"$push": {"applications": result.inserted_id}}
        )

        if new_application:
            new_application["_id"] = str(new_application["_id"])
            new_application["job_id"] = int(new_application["job_id"])
            
        return new_application

    @classmethod
    def get_application_by_id(cls, application_id):
        if not isinstance(application_id, ObjectId):
            application_id = ObjectId(application_id)
        
        application = applications_collection.find_one({"_id": application_id})
        if application:
            application["_id"] = str(application["_id"])
            application["job_id"] = int(application["job_id"])
        return application