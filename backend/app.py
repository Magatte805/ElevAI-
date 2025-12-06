from fastapi import FastAPI
from routers import users, data, analysis

app = FastAPI()
app.include_router(users.router)
app.include_router(data.router)
app.include_router(analysis.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur ElevAI"}