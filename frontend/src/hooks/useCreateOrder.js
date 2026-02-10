import { useState } from 'react'
import { postOrder } from '../api/orders'
import { DEFAULT_CURRENCY } from '../constants'

const initialFormState = {
  title: '',
  total_cents: '',
  currency: DEFAULT_CURRENCY,
  status: 'pending',
  notify_email: '',
  reference_type: '',
  reference_id: ''
}

export default function useCreateOrder() {
  const [values, setValues] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function setField(name, value) {
    setValues((previousValues) => ({ ...previousValues, [name]: value }))
  }

  function reset() {
    setValues(initialFormState)
    setError(null)
  }

  async function submit() {
    setError(null)
    setLoading(true)
    try {
      await postOrder({
        title: values.title,
        status: values.status,
        total_cents: Number(values.total_cents || 0),
        currency: values.currency,
        notify_email: values.notify_email || null,
        reference_type: values.reference_type || null,
        reference_id: values.reference_id || null,
        metadata: null
      })
      reset()
    } catch (e) {
      const msg = e?.response?.data?.details?.join(', ') || e?.message || 'Failed to create order'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { values, setField, loading, error, submit, reset }
}
