import os
from dotenv import load_dotenv

load_dotenv() # Load variables from .env if present

class Settings:
    PROJECT_NAME: str = "NotificationService"
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASS: str = os.getenv("SMTP_PASS", "")
    SENDER_EMAIL: str = os.getenv("SENDER_EMAIL")

    def __init__(self):
        # Check
        required_vars = [self.SMTP_HOST, self.SMTP_PORT, self.SMTP_USER, self.SMTP_PASS, self.SENDER_EMAIL]
        if not all(required_vars):
            missing_vars = [var for var, val in zip(required_vars, ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SENDER_EMAIL"]) if not val]
            raise ValueError(f"SMTP configuration is missing. Please check your environment variables.\nMissing: {missing_vars}")

settings = Settings()