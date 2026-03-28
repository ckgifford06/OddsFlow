import { useEffect, useState } from "react"
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts"
import axios from "axios"

const API = "http://127.0.0.1:8000"

function SparkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: "var(--bg3)",
      border: "1px solid var(--border2)",
      borderRadius: 6,
      padding: "6px 10px",
      fontSize: 11,
      color: "var(--text)"
    }}>
      <div style={{ color: "var(--muted)", marginBottom: 2 }}>{new Date(d.recorded_at).toLocaleTimeString()}</div>
      <div>Home: <strong>{d.home_price > 0 ? "+" : ""}{d.home_price}</strong></div>
      <div>Away: <strong>{d.away_price > 0 ? "+" : ""}{d.away_price}</strong></div>
    </div>
  )
}

export default function LineMovement({ gameId, book = "draftkings" }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) return
    axios.get(`${API}/api/games/${gameId}/movement`)
      .then(r => {
        const filtered = r.data.snapshots.filter(s => s.book === book)
        setData(filtered)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [gameId, book])

  if (loading) return <div style={{ height: 40 }} />
  if (data.length < 2) return (
    <div style={{ height: 40, display: "flex", alignItems: "center", paddingLeft: 14 }}>
      <span style={{ fontSize: 11, color: "var(--muted)" }}>Waiting for movement data...</span>
    </div>
  )

  const allPrices = [...data.map(d => d.home_price), ...data.map(d => d.away_price)]
  const min = Math.min(...allPrices) - 5
  const max = Math.max(...allPrices) + 5

  return (
    <div style={{ padding: "8px 14px 12px", borderTop: "1px solid var(--border)" }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Line Movement — {book}
      </div>
      <ResponsiveContainer width="100%" height={52}>
        <LineChart data={data}>
          <YAxis domain={[min, max]} hide />
          <Tooltip content={<SparkTooltip />} />
          <Line
            type="monotone"
            dataKey="home_price"
            stroke="var(--accent)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: "var(--accent)" }}
          />
          <Line
            type="monotone"
            dataKey="away_price"
            stroke="var(--blue)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: "var(--blue)" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        <span style={{ fontSize: 11, color: "var(--accent)" }}>— Home</span>
        <span style={{ fontSize: 11, color: "var(--blue)" }}>— Away</span>
      </div>
    </div>
  )
}
