from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookOdds(BaseModel):
    book: str
    home_price: int
    away_price: int
    spread: Optional[float] = None
    total: Optional[float] = None


class Game(BaseModel):
    id: str
    sport: str
    home_team: str
    away_team: str
    commence_time: datetime
    odds: list[BookOdds]


class OddsSnapshot(BaseModel):
    game_id: str
    book: str
    home_price: int
    away_price: int
    recorded_at: datetime


class EVResult(BaseModel):
    game_id: str
    home_team: str
    away_team: str
    book: str
    side: str
    price: int
    implied_prob: float
    fair_prob: float
    ev_percent: float
