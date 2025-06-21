import { Routes, Route } from 'react-router-dom'
import { LoginPage, ForgotPasswordPage, HomePage } from '@pages/pages'
import { ProtectedRoute } from '@components/layouts/components'

function App() {
  return (
    <Routes>
      <Route path='/' element={ <LoginPage /> } />
      <Route path='/forgot-password' element={ <ForgotPasswordPage /> } />
      {/* Protected Routes */}
      <Route element={ <ProtectedRoute /> }>
        <Route path='/home' element={ <HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
