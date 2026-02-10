import { useCallback, useEffect, useState } from 'react'
import { getOrders } from '../api/orders'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../constants'

export default function useOrdersList({ per = DEFAULT_PAGE_SIZE } = {}) {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({ page: DEFAULT_PAGE_NUMBER, per, total: 0 })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async ({ page = DEFAULT_PAGE_NUMBER, nextStatus = status } = {}) => {
    setError(null)
    setLoading(true)
    try {
      const res = await getOrders({ page, per: meta.per, status: nextStatus || undefined })
      setOrders(res.data)
      setMeta(res.meta)
      setStatus(nextStatus)
    } catch (e) {
      setError(e?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [meta.per, status])

  useEffect(() => {
    load({ page: DEFAULT_PAGE_NUMBER })
  }, [load])

  return { orders, meta, status, setStatus, loading, error, load }
}
