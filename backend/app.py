from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware  # <-- ajouter ceci
from routers import users, data, analysis
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI()

#CORS 
origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],     
)


# Inclure les routers
app.include_router(users.router)
app.include_router(data.router)
app.include_router(analysis.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur ElevAI"}

# Gestion globale des erreurs
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})