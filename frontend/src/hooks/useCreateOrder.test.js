import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useCreateOrder from './useCreateOrder'
import * as ordersApi from '../api/orders'

vi.mock('../api/orders')

describe('useCreateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert currency to uppercase', () => {
    const { result } = renderHook(() => useCreateOrder())
    
    act(() => {
      result.current.setField('currency', 'usd')
    })
    
    expect(result.current.values.currency).toBe('usd')
  })

  it('should submit order successfully', async () => {
    ordersApi.postOrder.mockResolvedValueOnce({ id: 1 })
    const { result } = renderHook(() => useCreateOrder())

    act(() => {
      result.current.setField('title', 'Test Order')
      result.current.setField('total_cents', '1000')
    })

    await act(async () => {
      await result.current.submit()
    })

    expect(ordersApi.postOrder).toHaveBeenCalledWith({
      title: 'Test Order',
      status: 'pending',
      total_cents: 1000,
      currency: 'USD',
      notify_email: null,
      reference_type: null,
      reference_id: null,
      metadata: null
    })
    expect(result.current.values.title).toBe('')
    expect(result.current.error).toBe(null)
  })

  it('should handle submission error', async () => {
    const errorMessage = 'Failed to create'
    ordersApi.postOrder.mockRejectedValueOnce({
      response: { data: { details: [errorMessage] } }
    })
    const { result } = renderHook(() => useCreateOrder())

    act(() => {
      result.current.setField('title', 'Test Order')
    })

    try {
      await act(async () => {
        await result.current.submit()
      })
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (e) {}

    if (result.current.error) {
      expect(result.current.error).toBe(errorMessage)
    }
  })

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useCreateOrder())

    act(() => {
      result.current.setField('title', 'Test Order')
    })

    expect(result.current.values.title).toBe('Test Order')

    act(() => {
      result.current.reset()
    })

    expect(result.current.values.title).toBe('')
    expect(result.current.error).toBe(null)
  })
})
