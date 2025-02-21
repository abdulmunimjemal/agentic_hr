# dependencies.py

from motor.motor_asyncio import AsyncIOMotorClient
import redis
from fastapi import Request
from src.api.config import settings

def setup_dependencies(app):
   """
   Creates one instance of MongoDB and Redis and attaches them to the app's state.
   """
   # Create a single MongoDB client and database instance.
   mongo_client = AsyncIOMotorClient(settings.MONGO_URI)
   app.state.mongo_client = mongo_client
   app.state.mongo_db = mongo_client[settings.MONGO_DB]
   
   # Create a single Redis client instance.
   app.state.redis_client = redis.Redis.from_url(settings.REDIS_URI, db=0)

def get_mongo_db(request: Request):
   """
   Dependency that returns the MongoDB database from the app state.
   """
   return request.app.state.mongo_db

def get_redis_client(request: Request):
   """
   Dependency that returns the Redis client from the app state.
   """
   return request.app.state.redis_client
