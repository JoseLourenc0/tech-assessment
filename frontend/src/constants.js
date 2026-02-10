export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_PAGE_NUMBER = 1

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUSES.PENDING, label: 'pending' },
  { value: ORDER_STATUSES.PROCESSING, label: 'processing' },
  { value: ORDER_STATUSES.COMPLETED, label: 'completed' },
  { value: ORDER_STATUSES.CANCELLED, label: 'cancelled' }
]

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.COMPLETED]: 'success',
  [ORDER_STATUSES.CANCELLED]: 'error',
  [ORDER_STATUSES.PROCESSING]: 'warning',
  [ORDER_STATUSES.PENDING]: 'default'
}

export const DEFAULT_CURRENCY = 'USD'

