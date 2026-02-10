import {
  Chip,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'
import { ORDER_STATUS_COLORS } from '../constants'

function chipColor(status) {
  return ORDER_STATUS_COLORS[status] ?? 'default'
}

export default function OrdersTable({ orders }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={80}>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.title}</TableCell>
              <TableCell>
                <Chip size="small" label={order.status} color={chipColor(order.status)} variant="outlined" />
              </TableCell>
              <TableCell align="right">{order.total_cents}</TableCell>
              <TableCell>{order.currency}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
