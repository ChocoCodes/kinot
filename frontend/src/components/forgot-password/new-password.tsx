import { useState } from 'react'
import type { NewPassword } from "@type/types";
import { passRegexp } from '@utils/helpers';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface NewPasswordProps {
    data: NewPassword;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StepTwoNewPassword = ({ data, handleChange }: NewPasswordProps) => {
    const [visible, setVisible] = useState(false);
    return ( 
    <>
        <div className="flex flex-col gap-2">
            <h2 className="text-xl">Enter your new password. Your password should consist of the ff:</h2>
            <ul className='font-medium mx-3'>
                <li>1 Uppercase Letter</li>
                <li>1 Digit</li>
                <li>Minumum length of 8 characters</li>
            </ul>
        </div>
        <div className='flex flex-col gap-1'>
            <div className="relative">
                <label htmlFor="password" className='font-medium text-lg'>
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
                className='w-full h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                id='password' 
                name='password'
                pattern={ passRegexp }
                title="Password must be at least 8 characters and include uppercase, lowercase, and a number."
                placeholder='●●●●●●●●●'
                defaultValue={ data.password }
                onChange={ handleChange }
                required
            />
        </div>
        <div className='flex flex-col gap-1'>
            <label htmlFor="confirm" className='font-medium text-lg'>Confirm Password</label>
            <input 
                type={ visible ? 'text' : 'password' } 
                className='w-full h-9 p-2 text-md placeholder-ph-gray rounded-md bg-bg-input border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out' 
                id='confirm' 
                name='confirm'
                placeholder='●●●●●●●●●'
                onChange={ handleChange }
                required
            />
        </div>
    </>
    )
}

export default StepTwoNewPassword