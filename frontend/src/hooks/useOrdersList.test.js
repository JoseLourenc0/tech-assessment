import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useOrdersList from './useOrdersList'
import * as ordersApi from '../api/orders'

vi.mock('../api/orders')

const mockOrdersResponse = {
  data: [
    { id: 1, title: 'Order 1', status: 'completed', total_cents: 1000, currency: 'USD', created_at: '2024-01-01T10:00:00Z' },
    { id: 2, title: 'Order 2', status: 'pending', total_cents: 2000, currency: 'USD', created_at: '2024-01-02T10:00:00Z' }
  ],
  meta: { page: 1, per: 20, total: 2 }
}

describe('useOrdersList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load orders on mount', async () => {
    ordersApi.getOrders.mockResolvedValueOnce(mockOrdersResponse)
    const { result } = renderHook(() => useOrdersList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.orders).toEqual(mockOrdersResponse.data)
    expect(result.current.meta).toEqual(mockOrdersResponse.meta)
  })

  it('should load orders with custom page size', async () => {
    ordersApi.getOrders.mockResolvedValueOnce({
      data: mockOrdersResponse.data.slice(0, 1),
      meta: { page: 1, per: 10, total: 2 }
    })
    const { result } = renderHook(() => useOrdersList({ per: 10 }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(ordersApi.getOrders).toHaveBeenCalledWith({
      page: 1,
      per: 10,
      status: undefined
    })
  })

  it('should load orders by page', async () => {
    ordersApi.getOrders.mockResolvedValueOnce(mockOrdersResponse)
    const { result } = renderHook(() => useOrdersList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    ordersApi.getOrders.mockResolvedValueOnce({
      data: [{ id: 3, title: 'Order 3', status: 'processing' }],
      meta: { page: 2, per: 20, total: 40 }
    })

    await act(async () => {
      await result.current.load({ page: 2 })
    })

    expect(ordersApi.getOrders).toHaveBeenLastCalledWith({
      page: 2,
      per: 20,
      status: undefined
    })
  })

  it('should handle load error', async () => {
    const errorMessage = 'Network error'
    ordersApi.getOrders.mockRejectedValueOnce(new Error(errorMessage))
    const { result } = renderHook(() => useOrdersList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.orders).toEqual([])
  })

  it('should load orders with status filter', async () => {
    ordersApi.getOrders.mockResolvedValueOnce({
      data: [mockOrdersResponse.data[0]],
      meta: { page: 1, per: 20, total: 1 }
    })
    const { result } = renderHook(() => useOrdersList())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    ordersApi.getOrders.mockResolvedValueOnce({
      data: [mockOrdersResponse.data[0]],
      meta: { page: 1, per: 20, total: 1 }
    })

    await act(async () => {
      await result.current.load({ nextStatus: 'completed' })
    })

    expect(ordersApi.getOrders).toHaveBeenLastCalledWith({
      page: 1,
      per: 20,
      status: 'completed'
    })
  })
})
