import os

class Config:
    RABBITMQ_URL = os.getenv("RABBITMQ_URL")
    MONGODB_URL = os.getenv("MONGODB_URI")
    QUEUE_NAME = "application_queue"
    UPLOAD_DIR = "/shared_volume"

    @classmethod
    def check_config(cls):
        assert cls.RABBITMQ_URL, "RabbitMQ URL is not set"
        assert cls.MONGODB_URL, "MongoDB URL is not set"
        assert cls.QUEUE_NAME, "Queue name is not set"
        assert cls.UPLOAD_DIR, "Upload directory is not set"

Config.check_config()