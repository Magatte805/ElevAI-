from sqlalchemy.orm import Session
from backend import models, schemas
from typing import List, Optional
from datetime import date
import hashlib
from fastapi import HTTPException


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    # Vérifie si l'utilisateur existe déjà
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Utilisateur existant. Veuillez vous connecter."
        )

    # Hash du mot de passe
    hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()

    # Création du nouvel utilisateur
    db_user = models.User(
        username=user.username,
        password=hashed_password,
        age=user.age,
        genre=user.genre,
        taille_cm=user.taille_cm,
        poids_kg=user.poids_kg,
        objectif=user.objectif
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

# DAILY DATA
def create_daily_data(db: Session, daily_data: schemas.DailyDataCreate) -> models.DailyData:
    db_data = models.DailyData(**daily_data.dict())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

def get_daily_data(db: Session, user_id: int, start: Optional[date] = None, end: Optional[date] = None) -> List[models.DailyData]:
    query = db.query(models.DailyData).filter(models.DailyData.user_id == user_id)
    if start:
        query = query.filter(models.DailyData.date >= start)
    if end:
        query = query.filter(models.DailyData.date <= end)
    return query.all()

# ANALYSIS RESULT
def create_analysis_result(db: Session, analysis: schemas.AnalysisResultCreate) -> models.AnalysisResult:
    db_analysis = models.AnalysisResult(**analysis.dict())
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_analysis_results(db: Session, user_id: int) -> List[models.AnalysisResult]:
    return db.query(models.AnalysisResult).filter(models.AnalysisResult.user_id == user_id).all()
def get_latest_analysis(db: Session, user_id: int) -> models.AnalysisResult | None:
    return (
        db.query(models.AnalysisResult)
        .filter(models.AnalysisResult.user_id == user_id)
        .order_by(models.AnalysisResult.id.desc())
        .first()
    )
