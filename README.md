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
```bash
ElevAI/
│
├── backend/
│   ├── app.py                 # Point d’entrée FastAPI
│   ├── database.py            # Configuration base de données
│   ├── models.py              # Modèles SQLAlchemy
│   ├── schemas.py             # Schémas Pydantic
│   ├── crud.py                # Logique métier (CRUD)
│   ├── tables.py              # Création des tables à partir des modèles SQLAlchemy
│   ├── requirements.txt       # Dépendances backend
    └── test_models.py
│   └──test_endpoints.py
│   │
│   ├── routers/               # Routes de l’API
│   │   ├── users.py           # Authentification & utilisateurs
│   │   ├──data.py            # Données quotidiennes
│   │   └── analysis.py        # Analyse ML, score, anomalies
│   │
│   ├── ml/                    # Machine Learning
│   │   ├── train.py           # Entraînement du modèle
│   │   └── model.pkl          # Modèle entraîné
│   │
│                
│      
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── pages/             # Pages principales
│   │   └── utils/             # Fonctions utilitaires
        └── app.jsx  
        └── api.js                  
│   │
│   ├── package.json           # Dépendances frontend
│   └── vite.config.js         # Configuration Vite
    └── tests/                 # Les tests plawright
    
│
└── README.md                  # Documentation du projet
```
## ⚙️ Prérequis
Outils nécessaires : 
- Node.js ≥ 18
- Python ≥ 3.10
- pip
- Git

## Comment lancer le site?

### Étape 1 : Cloner le projet
```bash
git clone "https://github.com/Magatte805/ElevAI-.git"
```

## Lancement du projet
Après avoir cloné le projet et ouvert le dossier dans votre éditeur (VS Code par exemple), voici les étapes pour pouvoir lancer le projet correctement.

### 1. Installer les dépendances du backend
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
# Se placer dans le dossier racine du projet
cd ELEVAI-
# Installer les dépendances
pip install -r backend/requirements.txt
```
#### Remarque si pip ne fonctionne pas
- Sur certaines machines, pip peut ne pas être reconnu.
- Dans ce cas, utilisez une des commandes suivantes selon votre configuration :

```bash
py -m pip install -r backend/requirements.txt
# ou
python -m pip install -r backend/requirements.txt
```

### 2. Lancer le backend
Le point d’entrée de l’application backend est app.py dans le dossier backend.
Le backend doit être lancé depuis le dossier racine du projet (ElevAi).
Se placer dans le dossier ElEVAI- (si ce n’est pas déjà fait) :
```bash
# Lancer le serveur FastAPI
uvicorn backend.app:app --reload
```
#### Remarque si la commande uvicorn ne fonctionne pas
- Sur certaines machines vous pouvez obtenir une erreur « uvicorn : Le terme n’est pas reconnu ».
- Dans ce cas, utilisez une des commandes suivantes :
```bash
py -m uvicorn backend.app:app --reload
# ou
python -m uvicorn backend.app:app --reload
```
- Par défaut, le backend tourne sur http://127.0.0.1:8000.
- Vous pouvez tester que l’API fonctionne en ouvrant http://127.0.0.1:8000/docs dans votre navigateur pour accéder à la documentation interactive.

### 3. Lancer le frontend
Le frontend est développé avec React et permet d’afficher le dashboard interactif avec toutes les visualisations (score, radar, recommandations, évolution des scores, prévisions, anomalies…).

💡 Astuce : ouvrez deux terminaux côte à côte. Dans l’un vous lancez le backend, dans l’autre le frontend.

#### a. Installer les dépendances
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

#### b. Lancer le frontend
```bash
# Dans le terminal du frontend
npm run dev
```
- Le projet va s’ouvrir automatiquement sur http://localhost:5173/.
- Vous arriverez d’abord sur la page d’accueil avec deux boutons : Se connecter ou S’inscrire.
- Après la connexion, vous accéderez à la page pour ajouter votre journée et vous avez un bouton pour accéder au dashboard où toutes les visualisations interagissent avec le backend.

## Vérification
- Backend sur http://127.0.0.1:8000
- Frontend sur http://localhost:5173
- Les deux doivent tourner simultanément pour que l’application fonctionne correctement.

## Les tests playwright
Les tests frontend simulent le parcours complet d’un utilisateur dans l’application.

Ils vérifient notamment :
- la création d’un utilisateur et la redirection,
- l’ajout d’une journée de données,
- l’affichage du score et des recommandations,
- la mise à jour du graphique d’évolution.

📌 Prérequis
- Le backend doit être lancé 
- Le frontend doit être lancé 

📌 Lancer les tests 
Les tests doivent être lancés dans un autre terminal, une fois le backend et le frontend démarrés.

1. Se placer dans le dossier frontend
```bash
cd frontend
```

2. Installer Playwright
```bash
npx playwright install
```

3. Lancer les tests
```bash
npx playwright test --reporter=html
```


## Questions de réflexion

### 1.Pourquoi avoir choisi ce type de modèle ? Quelles alternatives envisagées ?

Nous avons choisi un **RandomForestRegressor** car il est bien adapté à notre problème de prédiction d’un score à partir de données hétérogènes (sommeil, pas, sport, humeur, stress, etc.).
Les principales raisons de ce choix sont :
- il gère bien les **relations non linéaires** entre les variables,
- il est **robuste au bruit** et aux petites variations des données,
- il fonctionne correctement même avec un **jeu de données de taille limitée**,
- il ne nécessite pas d’hypothèses fortes sur la distribution des données.

De plus, le Random Forest permet d’analyser l’**importance des features**, ce qui est intéressant pour expliquer les résultats à l’utilisateur.

**Alternatives envisagées :**

-  **Régression linéaire** : trop simpliste pour capturer les relations complexes entre les variables.
-  **Gradient Boosting / XGBoost** : potentiellement plus performant, mais plus complexe à régler.
- **Réseaux de neurones** : nécessitent plus de données et sont moins interprétables pour ce type d’application.

### 2. Comment gérer l’échelle naturelle des features (ex : pas vs humeur) ?

Les features ont des échelles très différentes :
- `pas` : valeurs élevées (milliers),
- `humeur` et `stress` : échelle réduite (0 à 5),
- `sommeil_h` ou `sport_min` : valeurs intermédiaires.

Pour éviter qu’une feature domine les autres, nous appliquons une **standardisation** des données avec `StandardScaler` :
- centrage des données autour de 0,
- réduction à une variance unitaire.


### 3. Quelles métriques d’évaluation sont pertinentes pour votre approche ?

Le problème est un **problème de régression**, les métriques pertinentes sont donc :
-  **MAE (Mean Absolute Error)** : mesure l’erreur moyenne, facile à interpréter.
- **RMSE (Root Mean Squared Error)** : pénalise davantage les grandes erreurs.
- **R² score** : indique la proportion de variance expliquée par le modèle.

### 4. Comment assurer la reproductibilité (random_state, versions, seeds) ?

La reproductibilité est assurée par plusieurs éléments :

- l’utilisation d’un **`random_state=42`** dans le `RandomForestRegressor`,
- la séparation claire entre données, preprocessing et modèle,
- la sauvegarde du modèle et du scaler avec `pickle`,
- le versioning du code via **Git**,
- la liste des dépendances dans `requirements.txt`.

Ainsi, à partir des mêmes données et du même code, le modèle produit toujours les mêmes résultats.

### 5. Quelles seraient les failles de sécurité à traiter avant un déploiement public ?

Avant un déploiement réel, plusieurs points doivent être renforcés :

- **Sécurité de l’authentification** :
  * hashage des mots de passe,
  * gestion sécurisée des tokens (JWT avec expiration).
- **Sécurité des données utilisateur** :
  - protection des données personnelles (RGPD),
  - limitation de l’accès aux données par utilisateur.
- **Sécurité de l’API** :

  - validation stricte des entrées (Pydantic),
  - protection contre les attaques par injection.
- **Sécurité du modèle** :

  - contrôle des données envoyées au modèle,
  - éviter l’exposition directe du fichier `model.pkl`.
- **Configuration serveur** :

  - gestion correcte des CORS,
  - stockage sécurisé des clés et secrets.
