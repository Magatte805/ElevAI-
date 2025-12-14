from .database import Base, engine
from .models import User, DailyData, AnalysisResult

# Crée toutes les tables définies dans models.py
Base.metadata.create_all(bind=engine)

print("✅ Les tables ont été créées avec succès !")