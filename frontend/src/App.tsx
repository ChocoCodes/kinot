import { useState } from 'react'
import Tabs from "@components/Login/Tabs"

function App() {
  const [formDisplayed, setFormDisplayed] = useState<'login' | 'register'>('login');
  return (
    <>
      <main className='w-screen h-screen flex-col items-center justify-center'>
        <Tabs currentTab={formDisplayed} onChangeTab={setFormDisplayed}/>
        {formDisplayed}
      </main>
    </>
  )
}

export default App
