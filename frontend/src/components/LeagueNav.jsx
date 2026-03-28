import "./LeagueNav.css"

const LABELS = { nfl: "NFL", nba: "NBA", mlb: "MLB", ncaaf: "NCAAF", ncaab: "NCAAB" }

export default function LeagueNav({ leagues, active, onChange }) {
  return (
    <div className="league-nav">
      <div className="league-nav-inner">
        {leagues.map(l => (
          <button
            key={l}
            className={l === active ? "league-btn active" : "league-btn"}
            onClick={() => onChange(l)}
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
