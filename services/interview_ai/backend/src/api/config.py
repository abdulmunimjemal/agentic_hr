from pydantic_settings import BaseSettings
from pydantic import Field, ValidationError
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class Settings(BaseSettings):
    MONGO_URI: str = Field(..., env="MONGO_URI")
    MONGO_DB: str = Field(..., env="MONGO_DB")
    REDIS_URI: str = Field(..., env="REDIS_URI")
    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    MODEL: str = Field(..., env="MODEL")
    MAX_CONVERSATION_HISTORY: int = Field(6, env="MAX_CONVERSATION_HISTORY")
    NOTIFICATION_SERVICE_URL: str = Field(..., env="NOTIFICATION_SERVICE_URL")
    FRONTEND_BASE_URL: str = Field(..., env="FRONTEND_BASE_URL")
        

try:
    settings = Settings()
except ValidationError as e:
    logger.error("Configuration error:", e.json())
    raise e