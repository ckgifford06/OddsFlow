import httpx
from models.schemas import Game, BookOdds
from datetime import datetime
import os

API_KEY = os.getenv("ODDS_API_KEY")
BASE_URL = "https://api.the-odds-api.com/v4"

SPORT_KEYS = {
    "nfl": "americanfootball_nfl",
    "nba": "basketball_nba",
    "mlb": "baseball_mlb",
    "ncaaf": "americanfootball_ncaaf",
    "ncaab": "basketball_ncaab",
}

BOOKS = ["draftkings", "fanduel", "betmgm", "caesars", "pointsbet"]


async def fetch_odds(sport: str) -> list[Game]:
    sport_key = SPORT_KEYS.get(sport)
    if not sport_key:
        return []

    url = f"{BASE_URL}/sports/{sport_key}/odds"
    params = {
        "apiKey": API_KEY,
        "regions": "us",
        "markets": "h2h",
        "oddsFormat": "american",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    games = []
    for item in data:
        book_odds = []
        for bookmaker in item.get("bookmakers", []):
            h2h = next((m for m in bookmaker["markets"] if m["key"] == "h2h"), None)
            spreads = next((m for m in bookmaker["markets"] if m["key"] == "spreads"), None)
            totals = next((m for m in bookmaker["markets"] if m["key"] == "totals"), None)

            if not h2h:
                continue

            outcomes = {o["name"]: o["price"] for o in h2h["outcomes"]}
            spread_val = spreads["outcomes"][0]["point"] if spreads else None
            total_val = totals["outcomes"][0]["point"] if totals else None

            book_odds.append(BookOdds(
                book=bookmaker["key"],
                home_price=outcomes.get(item["home_team"], 0),
                away_price=outcomes.get(item["away_team"], 0),
                spread=spread_val,
                total=total_val,
            ))

        games.append(Game(
            id=item["id"],
            sport=sport,
            home_team=item["home_team"],
            away_team=item["away_team"],
            commence_time=datetime.fromisoformat(item["commence_time"].replace("Z", "+00:00")),
            odds=book_odds,
        ))

    return games
