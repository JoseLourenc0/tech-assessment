import { useMemo, useState } from 'react'
import {
  Box, Container, Stack, Typography, Button, Grid, Alert, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import StatCard from '../components/StatCard'
import OrdersTable from '../components/OrdersTable'
import Pagination from '../components/Pagination'
import NewOrderDialog from '../components/NewOrderDialog'
import useOrdersList from '../hooks/useOrdersList'
import useOrdersStats from '../hooks/useOrdersStats'
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../constants'

export default function OrdersPage() {
  const [open, setOpen] = useState(false)
  const ordersList = useOrdersList({ per: DEFAULT_PAGE_SIZE })
  const ordersStats = useOrdersStats()

  const totalPages = useMemo(() => {
    const pageSize = ordersList.meta.per || DEFAULT_PAGE_SIZE
    const totalItems = ordersList.meta.total || 0
    return Math.max(1, Math.ceil(totalItems / pageSize))
  }, [ordersList.meta.per, ordersList.meta.total])

  async function handleOrderCreated() {
    await Promise.all([
      ordersStats.refresh(),
      ordersList.load({ page: DEFAULT_PAGE_NUMBER, nextStatus: ordersList.status })
    ])
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Orders</Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Order
        </Button>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard label="Orders created" value={ordersStats.count} />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 3 }}>
        {ordersList.error && <Alert severity="error" sx={{ mb: 2 }}>{ordersList.error}</Alert>}

        {ordersList.loading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <OrdersTable orders={ordersList.orders} />
        )}

        <Box sx={{ mt: 2 }}>
          <Pagination
            page={ordersList.meta.page}
            totalPages={totalPages}
            onChange={(page) => ordersList.load({ page, nextStatus: ordersList.status })}
          />
        </Box>
      </Box>

      <NewOrderDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={handleOrderCreated}
      />
    </Container>
  )
}
