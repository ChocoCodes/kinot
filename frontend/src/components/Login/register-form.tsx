import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountForm } from './account-form'
import { RecoveryForm } from './recovery-form'
import { useAuth } from '@context/auth-context'
import type { User } from '@type/types'

export type UserInfo = {
    fullname: string,
    username: string,
    password: string,
    question: string,
    answer: string
}

const defaultInfo: UserInfo = {
    fullname: '',
    username: '',
    password: '',
    question: '',
    answer: '',
}

const RegisterForm = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<UserInfo>(defaultInfo)

    const handleBack = () => {
        setStep(step - 1)
        console.log(formData);
    }

    const handleNext = (next: Partial<UserInfo>) => {
        setFormData(prev => ({...prev, ...next}))
        setStep(step => step + 1)
    }

    const handleFullSubmit = async (updatedData: Partial<UserInfo>, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const final = { ...formData, ...updatedData }
        // console.log(final);
        try {
            const response = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(final)
            })
            
            // Username is already taken when form is submitted
            if(response.status === 409) {
                const errorData = await response.json()
                alert(errorData.error)
                setFormData(prev => ({
                    ...prev,
                    username: ''
                }))
                return;
            }

            if(!response.ok) {
                alert('Failed to send data.')
                return;
            }

            const result: User = await response.json()
            // Set the user logged-in in AuthProvider
            login(result)
            console.log('Data from Flask: ', result)
            navigate('/home')
        } catch (error: unknown) {
            console.error('Error: ', (error as Error).message)
        }
    }

    return (
        <>
            { step === 1 && (
                <AccountForm 
                    onNext={ handleNext } 
                    data={ formData }
                />
            )}
            { step === 2 && (
                <RecoveryForm 
                    onBack={ handleBack }
                    onSubmit={ handleFullSubmit }
                />
            )}
        </>
    )
}

export default RegisterForm