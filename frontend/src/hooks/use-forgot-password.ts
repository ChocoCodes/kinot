import { useState } from 'react'
import type { UserCredentials, NewPassword } from '@type/types'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@context/toast-context'

const defaultNewPass: NewPassword = {
    password: "",
    confirm: "",
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
    const { addToast } = useToast()
    const navigate = useNavigate()

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
                const token = data.reset_token
                console.log(data)
                setNewPassword(prev => ({ ...prev, token }))
                setStep(2)
                addToast('Account validation is completed.', "primary")
            } catch(err: any) {
                console.error('[ForgotPasswordSubmitError | Step 1]: ', err)
                setUserCredential(defaultUserCreds)
                addToast('An error occured. Failed to update password.', "danger")
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
                    body: JSON.stringify({ "new_password": newPassword.password })
                })
                
                if (!response.ok) {
                    console.error('[ForgotPasswordSubmitError | Step 2] ResponseNotOk: Failed to fetch data.') 
                    setNewPassword(defaultNewPass)   
                    return
                }

                // Redirect to login page
                navigate('/', { replace: true })
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