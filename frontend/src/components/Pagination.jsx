import { Pagination as MuiPagination, Stack } from '@mui/material'

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <Stack direction="row" justifyContent="flex-end">
      <MuiPagination
        page={page}
        count={totalPages}
        onChange={(_, value) => onChange(value)}
        color="primary"
        shape="rounded"
      />
    </Stack>
  )
}
