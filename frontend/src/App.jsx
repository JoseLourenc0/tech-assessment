import { Navigate, Route, Routes } from 'react-router-dom'
import OrdersPage from './pages/OrdersPage'

export default function App() {
  return (
    <Routes>
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="*" element={<Navigate to="/orders" replace />} />
    </Routes>
  )
}
