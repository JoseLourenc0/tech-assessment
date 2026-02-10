import { useCallback, useEffect, useState } from 'react'
import { getOrdersStats } from '../api/orders'

export default function useOrdersStats() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await getOrdersStats()
      setCount(res.count)
    } catch (e) {
      setError(e?.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [])

  return { count, loading, error, refresh }
}
