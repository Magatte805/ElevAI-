import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend import crud, models, schemas
from datetime import date

# Configuration DB test
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Créer les tables
Base.metadata.create_all(bind=engine)

# Fixture pour session
@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tests CRUD pour User 
def test_create_user(db):
    user_in = schemas.UserCreate(age=25, genre="Homme", taille_cm=180, poids_kg=75)
    user = crud.create_user(db, user_in)
    assert user.id is not None
    assert user.age == 25
    assert user.genre == "Homme"

def test_get_user(db):
    user_in = schemas.UserCreate(age=30, genre="Femme", taille_cm=165, poids_kg=60)
    created_user = crud.create_user(db, user_in)
    fetched_user = crud.get_user(db, created_user.id)
    assert fetched_user.id == created_user.id

# Tests CRUD pour DailyData
def test_create_daily_data(db):
    # Créer d'abord un utilisateur
    user_in = schemas.UserCreate(age=28, genre="Homme", taille_cm=175, poids_kg=70)
    user = crud.create_user(db, user_in)
    
    daily_data_in = schemas.DailyDataCreate(
        user_id=user.id,
        date=date.today(),
        sommeil_h=7.5,
        pas=8000,
        sport_min=30,
        calories=2200,
        humeur_0_5=4,
        stress_0_5=2,
        fc_repos=60
    )
    data_entry = crud.create_daily_data(db, daily_data_in)
    assert data_entry.id is not None
    assert data_entry.user_id == user.id
    assert data_entry.pas == 8000

def test_get_daily_data(db):
    user_in = schemas.UserCreate(age=32, genre="Femme", taille_cm=160, poids_kg=55)
    user = crud.create_user(db, user_in)
    daily_data_in = schemas.DailyDataCreate(
        user_id=user.id,
        date=date.today(),
        sommeil_h=6,
        pas=7500,
        sport_min=25,
        calories=2000,
        humeur_0_5=3,
        stress_0_5=3,
        fc_repos=65
    )
    created_data = crud.create_daily_data(db, daily_data_in)
    fetched_data = crud.get_daily_data(db, user.id)
    assert len(fetched_data) >= 1
    assert fetched_data[0].user_id == user.id

# Tests CRUD pour AnalysisResult
def test_create_analysis_result(db):
    user_in = schemas.UserCreate(age=35, genre="Homme", taille_cm=170, poids_kg=68)
    user = crud.create_user(db, user_in)

    analysis_in = schemas.AnalysisResultCreate(
        user_id=user.id,
        score=85.0,
        category="Excellent",
        explanations={"sommeil_h": 7.5, "stress_0_5": 2, "humeur_0_5": 4},
        recommendations=["Dormir plus", "Faire du sport"]
    )
    analysis_entry = crud.create_analysis_result(db, analysis_in)
    assert analysis_entry.id is not None
    assert analysis_entry.user_id == user.id
    assert analysis_entry.category == "Excellent"

def test_get_analysis_results(db):
    user_in = schemas.UserCreate(age=40, genre="Femme", taille_cm=165, poids_kg=60)
    user = crud.create_user(db, user_in)

    analysis_in = schemas.AnalysisResultCreate(
        user_id=user.id,
        score=70.0,
        category="Bon",
        explanations={"sommeil_h": 6.5, "stress_0_5": 3, "humeur_0_5": 3.5},
        recommendations=["Méditer", "Marcher 10 min"]
    )
    crud.create_analysis_result(db, analysis_in)
    results = crud.get_analysis_results(db, user.id)
    assert len(results) >= 1
    assert results[0].user_id == user.id