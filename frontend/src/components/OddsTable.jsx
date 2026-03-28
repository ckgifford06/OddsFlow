import { useState } from "react"
import { useOdds } from "../hooks/useOdds"
import LineMovement from "./LineMovement"

const BOOKS = ["draftkings", "fanduel", "betmgm", "caesars", "pointsbet"]

const BOOK_LABELS = {
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  betmgm: "BetMGM",
  caesars: "Caesars",
  pointsbet: "PointsBet",
}

const AFFILIATE_LINKS = {
  draftkings: "https://www.draftkings.com",
  fanduel: "https://www.fanduel.com",
  betmgm: "https://www.betmgm.com",
  caesars: "https://www.caesars.com/sportsbook",
  pointsbet: "https://www.pointsbet.com",
}

function formatOdds(price) {
  if (!price) return "-"
  return price > 0 ? `+${price}` : `${price}`
}

function findBestOdds(games) {
  const best = {}
  for (const game of games) {
    const homeOdds = game.odds.map(o => o.home_price).filter(Boolean)
    const awayOdds = game.odds.map(o => o.away_price).filter(Boolean)
    best[game.id] = {
      home: homeOdds.length ? Math.max(...homeOdds) : null,
      away: awayOdds.length ? Math.max(...awayOdds) : null,
    }
  }
  return best
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

export default function OddsTable({ league }) {
  const { data, loading, error } = useOdds(league)
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Loading odds...
    </div>
  )

  if (error) return <div className="empty">Error loading odds. Is the backend running?</div>
  if (!data.length) return <div className="empty">No games found for {league.toUpperCase()}.</div>

  const bestOdds = findBestOdds(data)

  return (
    <div>
      <p className="section-title">{league.toUpperCase()} — Moneyline Comparison</p>
      {data.map(game => {
        const bookMap = {}
        for (const o of game.odds) bookMap[o.book] = o
        const isExpanded = expanded[game.id]

        return (
          <div key={game.id} className="card">
            <div className="game-header" style={{ cursor: "pointer" }} onClick={() => toggleExpand(game.id)}>
              <span className="game-title">{game.away_team} @ {game.home_team}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="game-time">{formatTime(game.commence_time)}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{isExpanded ? "▲ Hide" : "▼ Movement"}</span>
              </div>
            </div>

            <div className="odds-grid">
              <div className="odds-header">
                <div className="cell header">Book</div>
                <div className="cell header">{game.away_team.split(" ").at(-1)}</div>
                <div className="cell header">{game.home_team.split(" ").at(-1)}</div>
                <div className="cell header">Spread</div>
                <div className="cell header">Total</div>
                <div className="cell header"></div>
              </div>

              {BOOKS.map(book => {
                const o = bookMap[book]
                if (!o) return null
                const isHomeBest = o.home_price === bestOdds[game.id].home
                const isAwayBest = o.away_price === bestOdds[game.id].away

                return (
                  <div key={book} className="odds-row">
                    <div className="cell book-name">
                      <a href={AFFILIATE_LINKS[book]} target="_blank" rel="noopener noreferrer">
                        {BOOK_LABELS[book]}
                      </a>
                    </div>
                    <div className="cell">
                      <span className={`odds-value ${isAwayBest ? "best" : o.away_price > 0 ? "" : "neg"}`}>
                        {formatOdds(o.away_price)}
                      </span>
                    </div>
                    <div className="cell">
                      <span className={`odds-value ${isHomeBest ? "best" : o.home_price > 0 ? "" : "neg"}`}>
                        {formatOdds(o.home_price)}
                      </span>
                    </div>
                    <div className="cell">
                      <span className="odds-value neg">{o.spread ?? "-"}</span>
                    </div>
                    <div className="cell">
                      <span className="odds-value neg">{o.total ? `O/U ${o.total}` : "-"}</span>
                    </div>
                    <div className="cell">
                      <a href={AFFILIATE_LINKS[book]} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                        Bet →
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {isExpanded && <LineMovement gameId={game.id} book="draftkings" />}
          </div>
        )
      })}
    </div>
  )
}
