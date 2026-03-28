from fastapi import APIRouter
from services.supabase_client import get_line_movement

router = APIRouter()


@router.get("/{game_id}/movement")
async def get_movement(game_id: str):
    snapshots = await get_line_movement(game_id)
    return {"game_id": game_id, "snapshots": snapshots}
