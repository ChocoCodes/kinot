import { Routes, Route } from 'react-router-dom'
import { LoginPage, ForgotPasswordPage, HomePage } from '@pages/pages'

function App() {
  return (
    <Routes>
      <Route path='/' element={ <LoginPage /> } />
      <Route path='/forgot-password' element={ <ForgotPasswordPage /> } />
      <Route path='/home' element={ <HomePage /> } />
    </Routes>
  )
}

export default App
