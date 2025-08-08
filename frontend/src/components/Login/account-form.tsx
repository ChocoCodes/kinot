import { useState } from 'react'
import type { UserInfo } from './register-form'
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { BiSolidChevronRightSquare } from "react-icons/bi";

interface AccountProps {
    onNext: (newData: Partial<UserInfo>) => void;
    data: UserInfo;
}

// Pass reqs: 1 uppercase, 1 lowercase, 1 digit, 8 min length
const passRegexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";

export const AccountForm = ({ onNext, data }: AccountProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [passErr, setPassErr] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget) // Create a reference to the form

        const confirm = form.get('confirm') as string
        const password = form.get('password') as string
        if (password !== confirm) {
            setPassErr("Passwords do not match!")
            return;
        }
        // Construct the data captured from step 1 and send to the next step
        const newData: Partial<UserInfo> = {
            fullname: form.get('fullname') as string,
            username: form.get('username') as string,
            password
        }

        onNext(newData)
    }

    return (
        <form
            action='submit'
            onSubmit={ handleSubmit }
            className='flex flex-col gap-3 py-3 w-9/10'
        >
            <div className='flex flex-col gap-2'>
                <label htmlFor="fullname" className='text-xl font-bold'>Fullname</label>
                <input 
                    type='text' 
                    className='w-9/10 h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='fullname' 
                    name='fullname'
                    placeholder='John Doe'
                    defaultValue={ data.fullname }
                    autoComplete='off'
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="username" className='text-xl font-bold'>Username</label>
                <input 
                    type='text' 
                    className='w-9/10 h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='username' 
                    name='username'
                    placeholder='johndoe123'
                    defaultValue={ data.username }
                    autoComplete='off'
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <div className="relative w-9/10">
                    <label htmlFor="password" className='text-xl font-bold'>
                        Password 
                    </label>
                    <button 
                        type="button"
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:cursor-pointer"
                        onClick={() => setVisible(!visible)}
                    >
                        {visible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <input 
                    type={ visible ? 'text' : 'password' } 
                    className='w-9/10 h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='password' 
                    name='password'
                    pattern={ passRegexp }
                    title="Password must be at least 8 characters and include uppercase, lowercase, and a number."
                    placeholder='●●●●●●●●●'
                    defaultValue={ data.password }
                    required
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="confirm" className='text-xl font-bold'>Confirm Password</label>
                <input 
                    type={ visible ? 'text' : 'password' } 
                    className='w-9/10 h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                    id='confirm' 
                    name='confirm'
                    placeholder='●●●●●●●●●'
                    required
                />
                { passErr && <p className='text-red-400 text-sm -mt-2'>{ passErr }</p> }
            </div>
            <button type='submit' className={`${ passErr ? '-mt-3' : '' } self-end mr-10 flex items-center gap-1 text-xl hover:scale-110 font-medium hover:cursor-pointer transition-transform duration-200 ease-in-out`}>
                Next
                <BiSolidChevronRightSquare className='text-4xl text-[#1A1A1A]'/>
            </button>
        </form>
    )
}
