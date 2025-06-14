import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type UserCreds = {
    username: string;
    password: string;
}

const defaultUserCreds: UserCreds = {
    username: '',
    password: '' 
}

const LoginForm = () => {
    const [userCreds, setUserCreds] = useState<UserCreds>(defaultUserCreds)
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserCreds(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return;
    }

    return (
        <form 
            action='submit' 
            onSubmit={handleFormSubmit} 
            className='flex flex-col gap-4 py-3'
        >
            <div className='flex flex-col gap-3'>
                <label htmlFor="username" className='text-2xl font-bold'>Username</label>
                <input 
                    type='text' 
                    className='w-9/10 h-[3rem] p-2 text-lg placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='username' 
                    name='username'
                    value={userCreds.username}
                    placeholder='loren ipsum'
                    onChange={handleInputChange}
                    autoComplete='off'
                    required
                />
            </div>
            <div className='flex flex-col gap-3'>
                <label htmlFor="password" className='text-2xl font-bold'>Password</label>
                <input 
                    type='password' 
                    className='w-9/10 h-[3rem] p-2 text-lg placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='password' 
                    name='password'
                    value={userCreds.password}
                    placeholder='●●●●●●●●●'
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button 
                className="self-end hover:cursor-pointer underline mr-14 -mt-4"     
                onClick={() => navigate('/forgot-password')}
            >
                Forgot Password?
            </button>
            <button     
                className='w-9/10 h-[3rem] p-2 text-lg bg-[#1A1A1A] text-white rounded-md hover:cursor-pointer hover:bg-black mt-4'
                onClick={() => navigate('/home')}
            >
                Log in
            </button>
        </form>
    )
}


export default LoginForm