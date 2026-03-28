import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://oddsflow-production.up.railway.app"

export function useEV(league) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setData([])
    setError(null)
    axios.get(`${API}/api/ev/${league}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [league])

  return { data, loading, error }
}
