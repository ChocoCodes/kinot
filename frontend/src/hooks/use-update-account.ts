import { useNavigate } from 'react-router-dom'
import { useToast } from '@context/toast-context'
import { useAuth } from '@context/auth-context'

export const useUpdateAccount = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { addToast } = useToast()

    const handleDelete = async () => {
        const response = await fetch('api/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ user?.token }`
            }
        })

        if(!response.ok) {
            console.error("[DELETE_ACCOUNT_ERROR] ResponseNotOK: Failed to delete account")
            throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
        }

        navigate('/login', { replace: true })
        addToast('Account Deleted Successfully.')
    }

    return { handleDelete }
}