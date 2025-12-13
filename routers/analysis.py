from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
import pickle
import numpy as np
import os
import logging
router = APIRouter(
    prefix="/analyze",
    tags=["analysis"]
)

# Chemin absolu vers model.pkl basé sur ce fichier
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../ml/model.pkl")

# Charger le modèle
with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

model = data["model"]
scaler = data["scaler"]

# 1. GET /analyze/{user_id} avec ML
@router.get("/{user_id}", response_model=schemas.AnalysisResultOut)
def analyze_user(user_id: int, db: Session = Depends(get_db)):
    # Récupérer les données de l'utilisateur
    history = crud.get_daily_data(db, user_id)
    if not history:
        raise HTTPException(status_code=404, detail="Aucune donnée trouvée pour cet utilisateur")

    # Préparer les features pour le modèle
    X_user = np.array([
        [d.sommeil_h, d.pas, d.sport_min, d.calories, d.humeur_0_5, d.stress_0_5, d.fc_repos]
        for d in history
    ])

    # Standardiser
    X_scaled = scaler.transform(X_user)

    # Prédiction du score moyen
    score = float(model.predict(X_scaled).mean())

    # Déterminer la catégorie
    if score > 60:
        category = "Excellent"
    elif score > 40:
        category = "Bon"
    elif score > 20:
        category = "Moyen"
    else:
        category = "Faible"

    # Explanations basées sur l'importance des features
    feature_names = ["sommeil_h", "pas", "sport_min", "calories", "humeur_0_5", "stress_0_5", "fc_repos"]
    importances = model.feature_importances_
    explanations = {name: round(float(imp), 3) for name, imp in zip(feature_names, importances)}

    # Recommendations simples
    recommendations = [
        "Dormir plus régulièrement",
        "Réduire le stress",
        "Faire une activité physique légère"
    ]

    # Créer l'objet AnalysisResult pour la DB
    analysis_data = schemas.AnalysisResultCreate(
        user_id=user_id,
        score=score,
        category=category,
        explanations=explanations,
        recommendations=recommendations
    )
    logging.info(f"Analyse effectuée pour l'utilisateur {user_id}, score: {score}")


    return crud.create_analysis_result(db, analysis_data)

@router.post("/custom", response_model=schemas.CustomAnalysisOut)
def analyze_custom(data: schemas.CustomAnalysisInput):
    X = np.array([[ 
        data.sommeil_h,
        data.pas,
        data.sport_min,
        data.calories,
        data.humeur_0_5,
        data.stress_0_5,
        data.fc_repos
    ]])

    X_scaled = scaler.transform(X)
    score = float(model.predict(X_scaled)[0])

    if score > 60:
        category = "Excellent"
    elif score > 40:
        category = "Bon"
    elif score > 20:
        category = "Moyen"
    else:
        category = "Faible"

    feature_names = ["sommeil_h", "pas", "sport_min", "calories", "humeur_0_5", "stress_0_5", "fc_repos"]
    importances = model.feature_importances_
    explanations = {name: round(float(imp), 3) for name, imp in zip(feature_names, importances)}

    recommendations = [
        "Dormir plus régulièrement",
        "Réduire le stress",
        "Faire une activité physique légère"
    ]

    return {
        "score": score,
        "category": category,
        "explanations": explanations,
        "recommendations": recommendations
    }

@router.get("/recommend/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Retourne uniquement les recommandations personnalisées
    pour un utilisateur donné.
    """
    # On récupère la dernière analyse stockée
    analysis = crud.get_latest_analysis(db, user_id)

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Aucune analyse trouvée pour cet utilisateur"
        )

    return {
        "user_id": user_id,
        "recommendations": analysis.recommendations
    }