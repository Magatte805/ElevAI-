from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL vers la base SQLite
DATABASE_URL = "sqlite:///./elevai.db"

# Création du moteur SQLAlchemy
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session pour interagir avec la base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles ORM
Base = declarative_base()


# Obtenir une session de base de données pour chaque requête
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()