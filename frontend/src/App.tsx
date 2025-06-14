import { Routes, Route } from 'react-router-dom'
import { LoginPage, ForgotPasswordPage } from '@pages/pages'

function App() {
  return (
    <Routes>
      <Route path='/' element={ <LoginPage /> } />
      <Route path='/forgot-password' element={ <ForgotPasswordPage /> } />
    </Routes>
  )
}

export default App
