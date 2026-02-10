import { Card, CardContent, Typography } from '@mui/material'

export default function StatCard({ label, value }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
      </CardContent>
    </Card>
  )
}
