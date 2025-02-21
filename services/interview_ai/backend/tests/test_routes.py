# tests/test_routes.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import MongoDB, RedisDB
from bson import ObjectId

client = TestClient(app)

@pytest.fixture(autouse=True)
async def setup_and_teardown():
    # Setup test data
    test_interview = {
        "_id": ObjectId(),
        "user_info": "test_user",
        "role_info": "test_role",
        "skills": {"Python": {"required_level": "intermediate"}}
    }
    await MongoDB.db.schedules.insert_one(test_interview)
    yield
    # Cleanup
    await MongoDB.db.schedules.delete_many({})
    await MongoDB.db.results.delete_many({})
    await RedisDB.redis.flushall()

def test_create_schedule():
    response = client.post("/api/v1/schedule", json={
        "user_info": "test",
        "role_info": "developer",
        "skills": {"Python": {"required_level": "intermediate"}}
    })
    assert response.status_code == 200
    assert "interview_id" in response.json()

def test_invalid_session_id():
    response = client.post("/api/v1/chat?session_id=invalid", json={"user_answer": "test"})
    assert response.status_code == 400
    assert "Invalid session ID format" in response.text