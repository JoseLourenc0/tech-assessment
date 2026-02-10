import {
  Alert,
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Grid,
  MenuItem,
  TextField
} from '@mui/material'
import useCreateOrder from '../hooks/useCreateOrder'
import { ORDER_STATUS_OPTIONS } from '../constants'

const FORM_ID = 'new-order-form'

export default function NewOrderDialog({ open, onClose, onCreated }) {
  const form = useCreateOrder()

  async function handleSubmit(event) {
    event.preventDefault()
    await form.submit()
    onClose()
    onCreated()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Order</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <form onSubmit={handleSubmit} id={FORM_ID}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                required
                value={form.values.title}
                onChange={(e) => form.setField('title', e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Total (cents)"
                fullWidth
                value={form.values.total_cents}
                onChange={(e) => form.setField('total_cents', e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Currency"
                fullWidth
                value={form.values.currency}
                onChange={(e) => form.setField('currency', e.target.value.toUpperCase())}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Status"
                fullWidth
                value={form.values.status}
                onChange={(e) => form.setField('status', e.target.value)}
              >
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notify email (optional)"
                fullWidth
                value={form.values.notify_email}
                onChange={(e) => form.setField('notify_email', e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Reference type (optional)"
                fullWidth
                value={form.values.reference_type}
                onChange={(e) => form.setField('reference_type', e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Reference id (optional)"
                fullWidth
                value={form.values.reference_id}
                onChange={(e) => form.setField('reference_id', e.target.value)}
              />
            </Grid>

            {form.error ? (
              <Grid item xs={12}>
                <Alert severity="error">{form.error}</Alert>
              </Grid>
            ) : null}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={form.loading}>Cancel</Button>
        <Button type="submit" form={FORM_ID} variant="contained" disabled={form.loading}>
          {form.loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
