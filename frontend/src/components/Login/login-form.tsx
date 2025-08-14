import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type User } from '@context/auth-context'
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type UserCreds = {
    username: string;
    password: string;
}

const defaultCreds = {
    username: '',
    password: '' 
}

const LoginForm = () => {
    const { login } = useAuth()
    const [userCreds, setUserCreds] = useState<UserCreds>(defaultCreds)
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserCreds(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCreds)
            })
            
            if(response.status === 404) {
                const error = await response.json()
                setError(error.error)
                return;
            }
            
            if(response.status === 401) {
                const error = await response.json()
                setError(error.error)
                return;
            }

            if(!response.ok) {
                alert('Failed to log in.')
                return;
            }

            const result = await response.json()
            console.log('Login Data from Flask: ', result)
            // Convert to frontend format
            const user: User = {
                id: result.id,
                username: result.user,
                token: result.token,
                profilePath: result.profile_path,
            }
            login(user)
            navigate('/home')
        } catch (error: unknown) {
            console.error('Error: ', (error as Error).message)
        }
    }

    return (
        <form 
            action='submit' 
            onSubmit={ handleFormSubmit } 
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
                <div className="relative w-9/10">
                    <input 
                        type={ visible ? 'text' : 'password' } 
                        className='w-full h-[3rem] p-2 text-lg placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                        id='password' 
                        name='password'
                        value={ userCreds.password }
                        placeholder='●●●●●●●●●'
                        onChange={ handleInputChange }
                        required
                    />
                    <button
                        type='button'
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 focus:outline-none text-xl text-ph-gray'
                        onClick={ () => setVisible(!visible) }
                    >
                        { visible ? <FaEyeSlash /> : <FaEye /> }
                    </button>
                </div>
            </div>
            <div className="w-9/10 text-right -mt-3">
                <button 
                    className=" hover:cursor-pointer underline"     
                    onClick={ () => navigate('/forgot-password') }
                >
                    Forgot Password?
                </button>
            </div>
            <button     
                type='submit'
                className='w-9/10 h-[3rem] p-2 text-lg bg-[#1A1A1A] text-white rounded-md hover:cursor-pointer hover:bg-black mt-4'
            >
                Log in
            </button>
            { error && <p className='text-red-400 text-sm -mt-2'>{ error }</p> }
        </form>
    )
}


export default LoginForm