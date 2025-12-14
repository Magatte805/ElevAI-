# ElevAI – Plateforme d’analyse du bien-être quotidien
## Présentation du projet

ElevAI est une application web complète (frontend + backend) permettant d’analyser le bien-être quotidien d’un utilisateur à partir de données personnelles telles que :

- le sommeil,
- l’activité physique,
- le stress,
- l’humeur,
- la fréquence cardiaque.

Grâce à un modèle de Machine Learning, l’application calcule :
- un score global de bien-être,
- une évaluation qualitative (faible, moyen, bon, excellent),
- des recommandations personnalisées,
- des analyses visuelles (graphiques, radar, historique).

Le projet vise à sensibiliser l’utilisateur à ses habitudes de vie et à l’aider à les améliorer de manière simple et visuelle.

## 🎯 Objectifs du projet:
- Collecter des données de santé quotidiennes
- Analyser ces données avec un modèle ML
- Produire un score normalisé (0–100 %)
- Générer des recommandations personnalisées
- Visualiser les résultats via un dashboard interactif
- Proposer une architecture claire frontend / backend

## Architecture du projet 
ElevAI/
│
├── backend/
│   ├── app.py                 # Point d’entrée FastAPI
│   ├── database.py            # Configuration base de données
│   ├── models.py              # Modèles SQLAlchemy
│   ├── schemas.py             # Schémas Pydantic
│   ├── crud.py                # Logique métier (CRUD)
│   ├── tables.py              # Définition des tables
│   ├── requirements.txt       # Dépendances backend
│   │
│   ├── routers/               # Routes de l’API
│   │   ├── users.py           # Authentification & utilisateurs
│   │   ├── data.py            # Données quotidiennes
│   │   └── analysis.py        # Analyse ML, score, anomalies
│   │
│   ├── ml/                    # Machine Learning
│   │   ├── train.py           # Entraînement du modèle
│   │   └── model.pkl          # Modèle entraîné
│   │
│   └── tests/                 # Tests unitaires et fonctionnels
│       ├── test_models.py
│       ├── test_crud.py
│       └── test_endpoints.py
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/             # Pages principales
│   │   ├── styles/            # Fichiers CSS
│   │   └── utils/             # Fonctions utilitaires
│   │
│   ├── package.json           # Dépendances frontend
│   └── vite.config.js         # Configuration Vite
│
└── README.md                  # Documentation du projet

## ⚙️ Prérequis
Outils nécessaires : 
- Node.js ≥ 18
- Python ≥ 3.10
- pip
- Git

### Étape 1 : Cloner le projet
```bash
git clone "https://github.com/Magatte805/ElevAI-.git"
cd ElevAI
```

## Lancement du projet
Après avoir cloné le projet et ouvert le dossier dans votre éditeur (VS Code par exemple), voici les étapes pour pouvoir lancer le projet correctement.

### 1️⃣ Créer un environnement virtuel (venv)
Un environnement virtuel est un espace isolé qui permet d’installer des librairies Python spécifiques à ce projet, sans interférer avec d’autres projets ou avec les packages Python globaux de votre machine.

Pourquoi c’est important :
- Évite les conflits entre différentes versions de librairies.
- Garantit que le projet fonctionne exactement comme prévu.

Comment créer et activer le venv :
```bash
# Créer un environnement virtuel dans le dossier "venv"
python -m venv venv

# Activer l'environnement
# Sur Windows
venv\Scripts\activate
# Sur macOS / Linux
source venv/bin/activate
```

### 2️⃣ Installer les dépendances du backend
Le backend est basé sur Python et utilise FastAPI pour l’API REST. Il contient :
- Gestion des utilisateurs et authentification
- Gestion des données quotidiennes de l’utilisateur
- Analyse des données avec un modèle de Machine Learning
- CRUD complet pour interagir avec la base de données

Librairies principales à installer (déjà listées dans requirements.txt) :
- fastapi : framework pour créer l’API REST
- uvicorn : serveur pour exécuter FastAPI
- sqlalchemy : gestion de la base de données
- pydantic : validation des données
- pytest : pour les tests
- joblib : pour charger le modèle ML
- numpy, pandas : manipulation de données

### Installation :
``` bash
pip install -r backend/requirements.txt
```
⚠️ Assurez-vous que le venv est activé avant d’installer les dépendances.

### 3️⃣ Lancer le backend
Le point d’entrée de l’application backend est app.py dans le dossier backend.
```bash
# Se placer dans le dossier backend
cd backend

# Lancer le serveur FastAPI
uvicorn app:app --reload
```
- L’option --reload permet de recharger automatiquement le serveur si vous modifiez le code.
- Par défaut, le backend tourne sur http://127.0.0.1:8000.
- Vous pouvez tester que l’API fonctionne en ouvrant http://127.0.0.1:8000/docs dans votre navigateur pour accéder à la documentation interactive.

### 4️⃣ Lancer le frontend
Le frontend est développé avec React et permet d’afficher le dashboard interactif avec toutes les visualisations (score, radar, recommandations, 5 derniers scores, prévisions, anomalies…).

💡 Astuce : ouvrez deux terminaux côte à côte. Dans l’un vous lancez le backend, dans l’autre le frontend.

#### 1. Installer les dépendances
Le frontend utilise plusieurs librairies :
- react / react-dom : base du projet React
- react-router-dom : navigation entre pages
- recharts : graphiques et visualisations
- axios : appels API vers le backend
- tailwindcss / shadcn/ui : styles et composants

##### Installation :
```bash
# Se placer dans le dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install
```
⚠️ Assurez-vous d’avoir Node.js ≥ 18 et npm installés sur votre machine.

#### 2. Lancer le frontend
```bash
# Dans le terminal du frontend
npm run dev
```
- Le projet va s’ouvrir automatiquement sur http://localhost:5173/.
- Vous arriverez d’abord sur la page d’accueil avec deux boutons : Se connecter ou S’inscrire.
- Après la connexion, vous accéderez à la page pour ajouter votre journée et vous avez un bouton pour accéder au dashboard où toutes les visualisations interagissent avec le backend.

3. Vérification
- Backend sur http://127.0.0.1:8000
- Frontend sur http://localhost:5173
- Les deux doivent tourner simultanément pour que l’application fonctionne correctement.