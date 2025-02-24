from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGODB_URI", "mongodb+srv://yohannesaabdi:yohannes6460@cluster0.78zf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

client = MongoClient(MONGO_URI)

db = client.hr_db
results_collection = db["screening_results"]
job_collection = db["jobs"]
applications_collection = db["applications"]