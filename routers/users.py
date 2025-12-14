from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db
import logging
from fastapi.responses import JSONResponse
import hashlib

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)

    if not db_user:
        raise HTTPException(status_code=401, detail="Utilisateur inexistant")

    import hashlib
    hashed_password = hashlib.sha256(user.password.encode("utf-8")).hexdigest()

    if hashed_password != db_user.password:
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")

    return {
        "token": "dummy-token",
        "userId": db_user.id
    }



# POST /users : créer un user
@router.post("/")
def create_user_endpoint(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user)
    logging.info(f"Création de l'utilisateur: {db_user.id}")
    # Ici tu peux créer un vrai token JWT, pour l'instant on met un dummy
    token = "dummy-token"
    return JSONResponse(content={"token": token, "userId": db_user.id})




# GET /users/{user_id} : récupérer un user
@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

