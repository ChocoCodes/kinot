import { useState } from 'react'
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

export const useForgotPassword = () => {
    const [step, setStep] = useState<1 | 2>(1)
    const [userCredential, setUserCredential] = useState<UserCredentials>(defaultUserCreds)
    const [newPassword, setNewPassword] = useState<NewPassword>(defaultNewPass)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (step == 1) {
            setUserCredential(prev => ({ ...prev, [name]: value }))
        } else {
            setNewPassword(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(step === 1) {
            console.log(userCredential)
            try {
                const response = await fetch('api/forgot/validate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userCredential)
                })
                
                if (!response.ok) {
                    console.error('[ForgotPasswordSubmitError | Step 1] ResponseNotOk: Failed to fetch data.') 
                    setUserCredential(defaultUserCreds)   
                    return
                }

                const data = await response.json()
                const token = data.token
                
                setNewPassword(prev => ({ ...prev, token }))
                setStep(2)
            } catch(err: any) {
                console.error('[ForgotPasswordSubmitError | Step 1]: ', err)
                setUserCredential(defaultUserCreds)
            }
        }
        if(step === 2) {
            console.log(newPassword)
            try {
                const response = await fetch('api/forgot/reset-password', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${ newPassword.token }`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userCredential)
                })
                
                if (!response.ok) {
                    console.error('[ForgotPasswordSubmitError | Step 2] ResponseNotOk: Failed to fetch data.') 
                    setNewPassword(defaultNewPass)   
                    return
                }
            } catch(err: any) {
                console.error('[ForgotPasswordSubmitError | Step 2]: ', err)
                setNewPassword(defaultNewPass)   
            }
        }
    }

    return {
        step, 
        userCredential,
        newPassword,
        handleChange,
        handleSubmit
    }
}