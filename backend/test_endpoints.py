import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app import app
from backend.database import Base, get_db


# CONFIG DATABASE TEST 
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_endpoints.db"

engine_test = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_test
)

Base.metadata.drop_all(bind=engine_test)
Base.metadata.create_all(bind=engine_test)


# Override FastAPI dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


# Client FastAPI
client = TestClient(app)


# TEST USERS

def test_create_user():
    response = client.post("/users/", json={
        "age": 25,
        "genre": "Homme",
        "taille_cm": 180,
        "poids_kg": 75,
        "objectif": "Perte de poids"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["age"] == 25
    assert data["genre"] == "Homme"
    assert "id" in data


def test_get_user():
    resp = client.post("/users/", json={
        "age": 30,
        "genre": "Femme",
        "taille_cm": 165,
        "poids_kg": 60
    })
    user_id = resp.json()["id"]

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["id"] == user_id


# TEST DAILY DATA

def test_post_daily_data():
    resp = client.post("/users/", json={
        "age": 28,
        "genre": "Homme",
        "taille_cm": 175,
        "poids_kg": 70
    })
    user_id = resp.json()["id"]

    response = client.post("/data/", json={
        "user_id": user_id,
        "date": "2025-12-06",
        "sommeil_h": 7.5,
        "pas": 9000,
        "sport_min": 30,
        "calories": 2200,
        "humeur_0_5": 4,
        "stress_0_5": 2,
        "fc_repos": 60
    })

    assert response.status_code == 200
    assert response.json()["pas"] == 9000


def test_get_daily_data():
    resp = client.post("/users/", json={
        "age": 22,
        "genre": "Femme",
        "taille_cm": 160,
        "poids_kg": 55
    })
    user_id = resp.json()["id"]

    client.post("/data/", json={
        "user_id": user_id,
        "date": "2025-12-06",
        "sommeil_h": 6,
        "pas": 8000,
        "sport_min": 20,
        "calories": 2000,
        "humeur_0_5": 3,
        "stress_0_5": 3,
        "fc_repos": 65
    })

    response = client.get(f"/data/{user_id}")
    assert response.status_code == 200
    assert len(response.json()) > 0


# TEST ANALYSE

def test_analyze_user():
    resp = client.post("/users/", json={
        "age": 26,
        "genre": "Homme",
        "taille_cm": 180,
        "poids_kg": 75
    })
    user_id = resp.json()["id"]

    client.post("/data/", json={
        "user_id": user_id,
        "date": "2025-12-06",
        "sommeil_h": 7,
        "pas": 8500,
        "sport_min": 25,
        "calories": 2100,
        "humeur_0_5": 4,
        "stress_0_5": 2,
        "fc_repos": 62
    })

    response = client.get(f"/analyze/{user_id}")
    assert response.status_code == 200
    assert "score" in response.json()


def test_analyze_custom():
    response = client.post("/analyze/custom", json={
        "sommeil_h": 7,
        "pas": 8000,
        "sport_min": 30,
        "calories": 2200,
        "humeur_0_5": 4,
        "stress_0_5": 2,
        "fc_repos": 60
    })
    assert response.status_code == 200
    assert "score" in response.json()