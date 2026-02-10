import { http } from './http'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../constants'

export async function getOrders({ page = DEFAULT_PAGE_NUMBER, per = DEFAULT_PAGE_SIZE, status } = {}) {
  const params = { page, per }
  if (status) params.status = status
  const { data } = await http.get('/orders', { params })
  return data
}

export async function getOrdersStats() {
  const { data } = await http.get('/orders/stats')
  return data
}

export async function postOrder(payload) {
  const { data } = await http.post('/orders', { order: payload })
  return data
}
