create table odds_snapshots (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  book text not null,
  home_price int not null,
  away_price int not null,
  recorded_at timestamptz not null default now()
);

create index idx_odds_snapshots_game_id on odds_snapshots(game_id);
create index idx_odds_snapshots_recorded_at on odds_snapshots(recorded_at);
