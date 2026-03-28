import { useState } from "react"
import OddsTable from "./components/OddsTable"
import EVTable from "./components/EVTable"
import LeagueNav from "./components/LeagueNav"
import "./App.css"

const LEAGUES = ["nfl", "nba", "mlb", "ncaaf", "ncaab"]

export default function App() {
  const [league, setLeague] = useState("nba")
  const [tab, setTab] = useState("odds")

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">OF</span>
            <span className="logo-text">OddsFlow</span>
          </div>
          <nav className="tabs">
            <button className={tab === "odds" ? "tab active" : "tab"} onClick={() => setTab("odds")}>Odds</button>
            <button className={tab === "ev" ? "tab active" : "tab"} onClick={() => setTab("ev")}>+EV Finder</button>
          </nav>
        </div>
      </header>

      <LeagueNav leagues={LEAGUES} active={league} onChange={setLeague} />

      <main className="main">
        {tab === "odds" ? (
          <OddsTable league={league} />
        ) : (
          <EVTable league={league} />
        )}
      </main>
    </div>
  )
}
