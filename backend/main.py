from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import odds, games, ev

app = FastAPI(title="Odds Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(odds.router, prefix="/api/odds", tags=["odds"])
app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(ev.router, prefix="/api/ev", tags=["ev"])

@app.get("/")
def health():
    return {"status": "ok"}
