import { useState, useEffect, useRef } from "react"
import axios from "axios"

const API = "https://oddsflow-production.up.railway.app"
const REFRESH_INTERVAL = 5 * 60 * 1000

export function useOdds(league) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = (isInitial = false) => {
    if (isInitial) setLoading(true)
    setError(null)
    axios.get(`${API}/api/odds/${league}`)
      .then(r => {
        setData(r.data)
        setLastUpdated(new Date())
      })
      .catch(e => setError(e.message))
      .finally(() => { if (isInitial) setLoading(false) })
  }

  useEffect(() => {
    setData([])
    fetchData(true)
    const interval = setInterval(() => fetchData(false), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [league])

  return { data, loading, error, lastUpdated }
}

export function useEV(league) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = (isInitial = false) => {
    if (isInitial) setLoading(true)
    setError(null)
    axios.get(`${API}/api/ev/${league}`)
      .then(r => {
        setData(r.data)
        setLastUpdated(new Date())
      })
      .catch(e => setError(e.message))
      .finally(() => { if (isInitial) setLoading(false) })
  }

  useEffect(() => {
    setData([])
    fetchData(true)
    const interval = setInterval(() => fetchData(false), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [league])

  return { data, loading, error, lastUpdated }
}
