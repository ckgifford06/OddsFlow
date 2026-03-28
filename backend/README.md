# Odds Dashboard

Sports betting analytics dashboard -- live odds comparison, line movement tracking, and EV calculator across NFL, NBA, MLB, NCAAF, and NCAAB.

## Stack
- **Backend:** FastAPI (Python)
- **Frontend:** React (Vite) -- to be scaffolded
- **Database:** Supabase (Postgres)
- **Odds Data:** The Odds API
- **Hosting:** Vercel (frontend) + Railway (backend)

## Backend Setup

1. Clone the repo and navigate to `/backend`
2. Create a virtual environment: `python -m venv venv && source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and fill in your keys
5. Run the Supabase migration in `supabase_migration.sql`
6. Start the server: `uvicorn main:app --reload`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/odds/{sport}` | Live odds comparison across all books |
| GET | `/api/games/{game_id}/movement` | Line movement history for a game |
| GET | `/api/ev/{sport}` | EV-positive bets, sorted by EV% |

### Sports
`nfl` `nba` `mlb` `ncaaf` `ncaab`

## Supabase Table

Run `supabase_migration.sql` in your Supabase SQL editor to create the `odds_snapshots` table used for line movement tracking.

## Environment Variables

```
ODDS_API_KEY=      # from the-odds-api.com
SUPABASE_URL=      # from your Supabase project settings
SUPABASE_KEY=      # anon/public key from Supabase
```
