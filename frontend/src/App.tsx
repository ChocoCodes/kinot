import { useState } from 'react'
import { Tabs, LoginForm, RegisterForm } from '@components/login/components'

function App() {
  const [formDisplayed, setFormDisplayed] = useState<'login' | 'register'>('login');
  return (
    <>
      <main className='w-screen h-screen flex items-center justify-center overflow-x-hidden'>
        <div className='w-1/2 h-full flex flex-col gap-15 items-center justify-center mx-auto'>
          <div className="flex flex-col font-poppins text-left w-3/5 h-4/5">
            <Tabs currentTab={formDisplayed} onChangeTab={setFormDisplayed}/>
            <div className="flex flex-col gap-2 mb-10">
              <h1 className='text-4xl font-bold'>Welcome to <span className='italic'>Kinot</span>!</h1>
              <p className='text-xl'>Your personal expense tracker.</p>
            </div>
            { formDisplayed === 'login' ? 
              <LoginForm/> : 
              <RegisterForm /> 
            }
          </div>
        </div>
        <div className='hidden w-1/2 h-full text-center lg:flex justify-center items-center'>
          <img src="/login-right.jpg" alt="Kinot: Expense Tracker" className='w-full h-full object-cover' />
        </div>
      </main>
    </>
  )
}

export default App
