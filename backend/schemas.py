from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

# Schéma pour User
class UserBase(BaseModel):
    age: int = Field(..., gt=0, description="Âge de l'utilisateur")
    genre: str = Field(..., description="Genre de l'utilisateur")
    taille_cm: float = Field(..., gt=0, description="Taille en cm")
    poids_kg: float = Field(..., gt=0, description="Poids en kg")
    objectif: Optional[str] = Field(None, description="Objectif personnel")

class UserCreate(UserBase):
    pass  

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True  

# Schéma pour DailyData
class DailyDataBase(BaseModel):
    date: date
    sommeil_h: float = Field(..., ge=0)
    pas: int = Field(..., ge=0)
    sport_min: float = Field(..., ge=0)
    calories: float = Field(..., ge=0)
    humeur_0_5: float = Field(..., ge=0, le=5)
    stress_0_5: float = Field(..., ge=0, le=5)
    fc_repos: float = Field(..., ge=0)

class DailyDataCreate(DailyDataBase):
    user_id: int

class DailyDataOut(DailyDataBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# Schéma pour AnalysisResult
class AnalysisResultBase(BaseModel):
    score: float
    category: str
    explanations: Optional[dict] = None
    recommendations: Optional[List[str]] = None

class AnalysisResultCreate(AnalysisResultBase):
    user_id: int

class AnalysisResultOut(AnalysisResultBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True