import { useState } from 'react'
import { AccountForm } from './AccountForm'
import { RecoveryForm } from './RecoveryForm'

export type UserInfo = {
    fullname: string,
    username: string,
    password: string,
    question: string,
    answer: string
}

const defaultUserInfo: UserInfo = {
    fullname: '',
    username: '',
    password: '',
    question: '',
    answer: '',
}

const RegisterForm = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<UserInfo>(defaultUserInfo)

    const handleBack = () => setStep(step - 1)

    const handleNext = (next: Partial<UserInfo>) => {
        setFormData(prev => ({...prev, ...next}))
        setStep(step => step + 1)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(formData);
    }

    return (
        <>
            { step === 1 && (
                <AccountForm 
                    onNext={ handleNext } 
                />
            )}
            { step === 2 && (
                <RecoveryForm 
                    onBack={ handleBack }
                    onSubmit={ handleSubmit }
                    onUpdate = { data => setFormData(prev => ({...prev, ...data})) }
                />
            )}
        </>
    )
}

export default RegisterForm