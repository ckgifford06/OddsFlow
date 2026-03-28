from fastapi import APIRouter
from services.odds_api import fetch_odds
from services.ev_calculator import get_ev_results
from models.schemas import EVResult

router = APIRouter()


@router.get("/{sport}", response_model=list[EVResult])
async def get_ev(sport: str, min_ev: float = 0.0):
    games = await fetch_odds(sport)
    results = get_ev_results(games)
    return [r for r in results if r.ev_percent >= min_ev]
