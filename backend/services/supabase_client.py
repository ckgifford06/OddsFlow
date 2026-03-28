import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)


async def save_odds_snapshot(game_id: str, book: str, home_price: int, away_price: int):
    supabase.table("odds_snapshots").insert({
        "game_id": game_id,
        "book": book,
        "home_price": home_price,
        "away_price": away_price,
        "recorded_at": datetime.utcnow().isoformat(),
    }).execute()


async def get_line_movement(game_id: str) -> list[dict]:
    result = supabase.table("odds_snapshots") \
        .select("*") \
        .eq("game_id", game_id) \
        .order("recorded_at") \
        .execute()
    return result.data
