import { useState } from 'react'

type UserCreds = {
    username: string;
    password: string;
}

const LoginForm = () => {
    const [userCreds, setUserCreds] = useState<UserCreds>({
        username: '',
        password: ''
    })

    const handleSubmit = () => {

    }

    return (
        <form 
            action='submit' 
            onSubmit={handleSubmit} 
            className='flex flex-col gap-6 py-3'
        >
            <div className='flex flex-col gap-3'>
                <label htmlFor="username" className='text-2xl font-bold'>Username</label>
                <input 
                    type='text' 
                    className='w-9/10 h-[3rem] p-2 text-lg placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='username' 
                    placeholder='loren ipsum'
                />
            </div>
            <div className='flex flex-col gap-3'>
                <label htmlFor="password" className='text-2xl font-bold'>Password</label>
                <input 
                    type='password' 
                    className='w-9/10 h-[3rem] p-2 text-lg placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='password' 
                    placeholder='●●●●●●●●●'
                />
            </div>
            <button className="self-end hover:cursor-pointer underline mr-14 -mt-4">Forgot Password?</button>
            <button className='w-9/10 h-[3rem] p-2 text-lg bg-[#1A1A1A] text-white rounded-md hover:cursor-pointer hover:bg-black mt-5'>Log in</button>
        </form>
    )
}


export default LoginForm