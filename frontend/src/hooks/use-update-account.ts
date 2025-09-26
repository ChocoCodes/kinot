import { useToast } from '@context/toast-context'
import { useAuth } from '@context/auth-context'
import type { AccountInfo } from '@type/types'

export const useUpdateAccount = () => {
    const { user, logout } = useAuth()
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

        logout()
        addToast('Account Deleted Successfully.')
    }

    const fetchAccount = async () => {
        const response = await fetch('api/account', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ user?.token }`
            },
        })

        if (!response.ok) {
            console.error("[FETCH_ACCOUNT_ERROR] ResponseNotOK: Failed to fetch account data.")
            throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
        }

        const raw = await response.json()
        const accountInfo: AccountInfo = {
            username: raw.username,
            fullname: raw.fullname,
            imgPath: raw.profile_path
        }
        return accountInfo
    }

    return { 
        handleDelete, 
        fetchAccount 
    }
}