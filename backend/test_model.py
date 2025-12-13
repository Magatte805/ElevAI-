import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../ml/model.pkl")

with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

print("Modèle chargé avec succès :", data.keys())
