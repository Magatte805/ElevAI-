from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db

router = APIRouter(
    prefix="/analyze",
    tags=["analysis"]
)

# 1. GET /analyze/{user_id}
@router.get("/{user_id}", response_model=schemas.AnalysisResultOut)
def analyze_user(user_id: int, db: Session = Depends(get_db)):
    history = crud.get_daily_data(db, user_id)

    if not history:
        raise HTTPException(status_code=404, detail="Aucune donnée trouvée pour cet utilisateur")

    # Calculs simples 
    avg_sleep = sum(d.sommeil_h for d in history) / len(history)
    avg_stress = sum(d.stress_0_5 for d in history) / len(history)
    avg_humeur = sum(d.humeur_0_5 for d in history) / len(history)

    score = (avg_sleep * 10) - (avg_stress * 5) + (avg_humeur * 3)

    if score > 60:
        category = "Excellent"
    elif score > 40:
        category = "Bon"
    elif score > 20:
        category = "Moyen"
    else:
        category = "Faible"

    explanations = {
        "avg_sleep": avg_sleep,
        "avg_stress": avg_stress,
        "avg_humeur": avg_humeur
    }

    recommendations = [
        "Dormir plus régulièrement",
        "Réduire les sources de stress",
        "Pratiquer une activité physique légère",
    ]

    analysis_data = schemas.AnalysisResultCreate(
        user_id=user_id,
        score=score,
        category=category,
        explanations=explanations,
        recommendations=recommendations,
    )

    return crud.create_analysis_result(db, analysis_data)


# 2. POST /analyze/custom : analyser une journée sans stocker
@router.post("/custom")
def analyze_custom(data: schemas.DailyDataBase):
    score = (data.sommeil_h * 10) - (data.stress_0_5 * 5) + (data.humeur_0_5 * 3)

    if score > 60:
        category = "Excellent"
    elif score > 40:
        category = "Bon"
    elif score > 20:
        category = "Moyen"
    else:
        category = "Faible"

    return {
        "score": score,
        "category": category,
        "explanations": {
            "sommeil_h": data.sommeil_h,
            "stress_0_5": data.stress_0_5,
            "humeur_0_5": data.humeur_0_5
        },
        "recommendations": [
            "Méditer 10 minutes",
            "Faire une courte marche",
            "Limiter les écrans avant le coucher"
        ]
    }