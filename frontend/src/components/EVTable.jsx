import { useEV } from "../hooks/useOdds"

const AFFILIATE_LINKS = {
  draftkings: "https://www.draftkings.com",
  fanduel: "https://www.fanduel.com",
  betmgm: "https://www.betmgm.com",
  caesars: "https://www.caesars.com/sportsbook",
  pointsbet: "https://www.pointsbet.com",
}

const BOOK_LABELS = {
  draftkings: "DraftKings",
  fanduel: "FanDuel",
  betmgm: "BetMGM",
  caesars: "Caesars",
  pointsbet: "PointsBet",
}

function formatOdds(price) {
  return price > 0 ? `+${price}` : `${price}`
}

export default function EVTable({ league }) {
  const { data, loading, error } = useEV(league)

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Calculating EV...
    </div>
  )

  if (error) return <div className="empty">Error loading EV data. Is the backend running?</div>

  const positive = data.filter(r => r.ev_percent > 0)
  const rest = data.filter(r => r.ev_percent <= 0).slice(0, 20)

  return (
    <div>
      <p className="section-title">{league.toUpperCase()} — Expected Value Finder</p>
      <div className="card">
        <table className="ev-table">
          <thead>
            <tr>
              <th>Matchup</th>
              <th>Side</th>
              <th>Book</th>
              <th>Price</th>
              <th>Implied</th>
              <th>Fair</th>
              <th>EV%</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...positive, ...rest].map((r, i) => (
              <tr key={i}>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>
                  {r.away_team} @ {r.home_team}
                </td>
                <td style={{ fontWeight: 600 }}>{r.side.split(" ").at(-1)}</td>
                <td>
                  <a href={AFFILIATE_LINKS[r.book]} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--muted)", textDecoration: "none" }}>
                    {BOOK_LABELS[r.book] ?? r.book}
                  </a>
                </td>
                <td style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {formatOdds(r.price)}
                </td>
                <td className="prob">{(r.implied_prob * 100).toFixed(1)}%</td>
                <td className="prob">{(r.fair_prob * 100).toFixed(1)}%</td>
                <td>
                  <span className={`ev-badge ${r.ev_percent > 0 ? "pos" : "neg"}`}>
                    {r.ev_percent > 0 ? "+" : ""}{r.ev_percent.toFixed(2)}%
                  </span>
                </td>
                <td>
                  <a href={AFFILIATE_LINKS[r.book]} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                    Bet →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
