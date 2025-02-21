from pydantic_settings import BaseSettings
from pydantic import Field, ValidationError

class Settings(BaseSettings):
    MONGO_URI: str = Field(..., env="MONGO_URI")
    MONGO_DB: str = Field(..., env="MONGO_DB")
    REDIS_URI: str = Field(..., env="REDIS_URI")
    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    MODEL: str = Field(..., env="MODEL")
    MAX_CONVERSATION_HISTORY: int = Field(6, env="MAX_CONVERSATION_HISTORY")

    class Config:
        env_file = ".env"         
        env_file_encoding = "utf-8"
        

try:
    settings = Settings()
except ValidationError as e:
    print("Configuration error:", e.json())
    raise e