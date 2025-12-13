from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
from typing import Optional
from datetime import date
import logging

router = APIRouter(
    prefix="/data",
    tags=["daily_data"]
)

# POST /data : ajouter un enregistrement quotidien
@router.post("/", response_model=schemas.DailyDataOut)
def add_daily_data(daily_data: schemas.DailyDataCreate, db: Session = Depends(get_db)):
    db_data = crud.create_daily_data(db, daily_data)
    logging.info(f"Données journalières ajoutées pour l'utilisateur {daily_data.user_id}")
    return db_data

# GET /data/{user_id} : récupérer l'historique
@router.get("/{user_id}", response_model=list[schemas.DailyDataOut])
def get_daily_data(
    user_id: int,
    start: Optional[date] = None,
    end: Optional[date] = None,
    db: Session = Depends(get_db)
):
    data = crud.get_daily_data(db, user_id=user_id, start=start, end=end)
    return data