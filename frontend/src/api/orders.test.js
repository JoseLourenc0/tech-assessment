import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getOrders, getOrdersStats, postOrder } from './orders'
import * as httpModule from './http'

vi.mock('../api/http')

describe('Orders API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrders', () => {
    it('should fetch orders with default params', async () => {
      const mockData = {
        data: [],
        meta: { page: 1, per: 20, total: 0 }
      }
      httpModule.http.get = vi.fn().mockResolvedValue({ data: mockData })

      const result = await getOrders()

      expect(httpModule.http.get).toHaveBeenCalledWith('/orders', {
        params: { page: 1, per: 20 }
      })
      expect(result).toEqual(mockData)
    })

    it('should fetch orders with custom page and per params', async () => {
      const mockData = {
        data: [],
        meta: { page: 2, per: 10, total: 0 }
      }
      httpModule.http.get = vi.fn().mockResolvedValue({ data: mockData })

      const result = await getOrders({ page: 2, per: 10 })

      expect(httpModule.http.get).toHaveBeenCalledWith('/orders', {
        params: { page: 2, per: 10 }
      })
      expect(result).toEqual(mockData)
    })

    it('should fetch orders with status filter', async () => {
      const mockData = {
        data: [],
        meta: { page: 1, per: 20, total: 0 }
      }
      httpModule.http.get = vi.fn().mockResolvedValue({ data: mockData })

      await getOrders({ status: 'completed' })

      expect(httpModule.http.get).toHaveBeenCalledWith('/orders', {
        params: { page: 1, per: 20, status: 'completed' }
      })
    })

    it('should not include status when not provided', async () => {
      const mockData = {
        data: [],
        meta: { page: 1, per: 20, total: 0 }
      }
      httpModule.http.get = vi.fn().mockResolvedValue({ data: mockData })

      await getOrders({ page: 1, per: 20 })

      expect(httpModule.http.get).toHaveBeenCalledWith('/orders', {
        params: { page: 1, per: 20 }
      })
    })
  })

  describe('getOrdersStats', () => {
    it('should fetch orders stats', async () => {
      const mockData = { count: 42 }
      httpModule.http.get = vi.fn().mockResolvedValue({ data: mockData })

      const result = await getOrdersStats()

      expect(httpModule.http.get).toHaveBeenCalledWith('/orders/stats')
      expect(result).toEqual(mockData)
    })
  })

  describe('postOrder', () => {
    it('should create a new order', async () => {
      const payload = {
        title: 'Test Order',
        status: 'pending',
        total_cents: 1000,
        currency: 'USD'
      }
      const mockResponse = { id: 1, ...payload }
      httpModule.http.post = vi.fn().mockResolvedValue({ data: mockResponse })

      const result = await postOrder(payload)

      expect(httpModule.http.post).toHaveBeenCalledWith('/orders', { order: payload })
      expect(result).toEqual(mockResponse)
    })

    it('should send order wrapped in order key', async () => {
      const payload = { title: 'Test' }
      httpModule.http.post = vi.fn().mockResolvedValue({ data: { id: 1 } })

      await postOrder(payload)

      const callArgs = httpModule.http.post.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('order')
      expect(callArgs[1].order).toEqual(payload)
    })
  })
})
