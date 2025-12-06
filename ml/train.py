import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import pickle

# Données simulées
data = pd.DataFrame({
    "sommeil_h": [7.0, 6.5, 8.0, 7.5],
    "pas": [8000, 7500, 10000, 9000],
    "sport_min": [30, 20, 45, 35],
    "calories": [2200, 2100, 2500, 2300],
    "humeur_0_5": [4, 3, 5, 4],
    "stress_0_5": [2, 3, 1, 2],
    "fc_repos": [60, 65, 58, 62],
    "score": [80, 70, 90, 85]
})

# Séparer features et target
X = data.drop("score", axis=1)
y = data["score"]

# Préprocessing : standardisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Modèle ML : RandomForestRegressor
model = RandomForestRegressor(random_state=42)
model.fit(X_scaled, y)

# Sauvegarde du modèle + scaler
with open("model.pkl", "wb") as f:
    pickle.dump({"model": model, "scaler": scaler}, f)

print("Modèle entraîné et sauvegardé dans model.pkl")