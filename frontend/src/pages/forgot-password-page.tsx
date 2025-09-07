import { useState } from 'react'
import { Footer } from "@components/layouts/_components"
import { StepOneCredentials, StepTwoNewPassword } from '@components/forgot-password/_components'
import type { UserCredentials, NewPassword } from '@type/types'

const defaultNewPass: NewPassword = {
    password: "",
    confirmedPassword: "",
    token: ""
}

const defaultUserCreds : UserCredentials = {
    username: "",
    question: "",
    answer: ""
}

function ForgotPasswordPage() {
    const [step, setStep] = useState<1 | 2>(1)
    const [newPassword, setNewPassword] = useState<NewPassword>(defaultNewPass)
    const [userCredential, setUserCredential] = useState<UserCredentials>(defaultUserCreds)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (step == 1) {
            setUserCredential(
                prev => ({
                    ...prev,
                    [name]: value
                })
            )
        } else {
            setNewPassword(
                prev => ({
                    ...prev,
                    [name]: value
                })
            )
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(step == 1) {
            console.log(userCredential)
            setStep(2)
        }
        if(step == 2) {
            console.log(newPassword)
        }
    }

    return (
        <div className='flex flex-col gap-5 items-center justify-center w-screen h-screen py-10'>
            <h1 className="text-start text-4xl font-semibold">Forgot Password</h1>
            <ul className='flex justify-between w-60'>
                <li className="relative flex-1 flex justify-center">
                    <span className="bg-black text-white px-3 py-1 rounded-sm z-10">1</span>
                    <span className="absolute top-1/2 left-1/2 w-full border-t-2 border-black -z-0"></span>
                </li>
                <li className="relative flex-1 flex justify-center">
                    <span className={`${step == 2 ? 'bg-black text-white' : 'border-2 border-black bg-white'} px-3 py-1 rounded-sm z-10`}>2</span>
                </li>
            </ul>
            <form
                className='w-2/5 h-3/5 gap-7 flex flex-col'
                action='submit'
                onSubmit={ handleSubmit }
            >
                { step == 1 && <StepOneCredentials data={ userCredential } handleChange={ handleChange }/> }
                { step == 2 && <StepTwoNewPassword data={ newPassword } handleChange={ handleChange }/> }
                <button 
                    type='submit'
                    className='p-2 bg-black text-white w-50 text-2xl text-center rounded-md mx-auto hover:cursor-pointer'
                >
                    { step == 1 ? "Next" : "Submit" }
                </button>
            </form>
            <Footer />
        </div>
    )
}

export { ForgotPasswordPage }