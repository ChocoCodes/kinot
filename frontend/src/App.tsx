import { Routes, Route } from 'react-router-dom'
import { 
  LoginPage, 
  ForgotPasswordPage, 
  HomePage, 
  GoalPage, 
  TransactionPage, 
  AccountPage 
} from '@pages/_pages'
import ProtectedRoute from '@components/layouts/protected-route'

function App() {
  return (
    <Routes>
      <Route path='/' element={ <LoginPage /> } />
      <Route path='/forgot-password' element={ <ForgotPasswordPage /> } />
      {/* Protected Routes */}
      <Route element={ <ProtectedRoute /> }>
        <Route path='/home' element={ <HomePage />} />
        <Route path='/goals' element={ <GoalPage />} />
        <Route path='/transactions' element={ <TransactionPage />} />
        <Route path='/account' element={ <AccountPage />} />
      </Route>
    </Routes>
  )
}

export default App
