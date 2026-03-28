from fastapi import APIRouter
from services.odds_api import fetch_odds
from services.supabase_client import save_odds_snapshot
from models.schemas import Game

router = APIRouter()

VALID_SPORTS = ["nfl", "nba", "mlb", "ncaaf", "ncaab"]


@router.get("/{sport}", response_model=list[Game])
async def get_odds(sport: str):
    games = await fetch_odds(sport)

    for game in games:
        for book_odd in game.odds:
            await save_odds_snapshot(
                game.id,
                book_odd.book,
                book_odd.home_price,
                book_odd.away_price,
            )

    return games
