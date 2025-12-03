from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base, engine

# Modèle User
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    genre = Column(String, nullable=False)
    taille_cm = Column(Float, nullable=False)
    poids_kg = Column(Float, nullable=False)
    objectif = Column(String, nullable=True)

    # Relation avec DailyData
    daily_data = relationship("DailyData", back_populates="user")
    # Relation optionnelle avec AnalysisResult
    analysis_results = relationship("AnalysisResult", back_populates="user")


# Modèle DailyData
class DailyData(Base):
    __tablename__ = "daily_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False)
    sommeil_h = Column(Float, nullable=False)
    pas = Column(Integer, nullable=False)
    sport_min = Column(Float, nullable=False)
    calories = Column(Float, nullable=False)
    humeur_0_5 = Column(Float, nullable=False)
    stress_0_5 = Column(Float, nullable=False)
    fc_repos = Column(Float, nullable=False)

    # Relation avec User
    user = relationship("User", back_populates="daily_data")


# Modèle AnalysisResult
class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    explanations = Column(JSON, nullable=True)  
    recommendations = Column(JSON, nullable=True) 

    # Relation avec User
    user = relationship("User", back_populates="analysis_results")