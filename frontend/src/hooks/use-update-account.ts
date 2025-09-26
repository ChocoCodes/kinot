import { useToast } from '@context/toast-context'
import { useAuth } from '@context/auth-context'
import type { AccountInfo } from '@type/types'
import { useState } from 'react'

export const useUpdateAccount = () => {
    const { user, logout } = useAuth()
    const { addToast } = useToast()
    const [accountData, setAccountData] = useState<AccountInfo>({
        username: "",
        fullname: "",
        imgPath: "",
    })

    const handleDelete = async () => {
        try {
            const response = await fetch('api/account', {
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
        } catch (error: unknown) {
            console.error("[DELETE_ACCOUNT_ERROR] ExceptionCaught: ", error)
            throw new Error(`[DELETE_ACCOUNT_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    const fetchAccount = async () => {
        try {
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
            setAccountData({
                username: raw.username,
                fullname: raw.fullname,
                imgPath: raw.profile_path
            } as AccountInfo)
        } catch (error: unknown) {
            console.error("[FETCH_ACCOUNT_ERROR] ExceptionCaught: ", error)
            throw new Error(`[FETCH_ACCOUNT_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    // Accommodate images (BLOB) and normal input field saves
    const handleSaveInfo = async (payload: FormData) => {
        try {
            const response = await fetch('api/account', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${ user?.token }`
                },
                body: payload
            })

            if (!response.ok) {
                console.error("[SAVE_INFO_ERROR] ResponseNotOK: Failed to fetch account data.")
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
            }

            const data = await response.json()
            setAccountData(data as AccountInfo)
        } catch (error: unknown) {
            console.error("[SAVE_INFO_ERROR] ExceptionCaught: ", error)
            throw new Error(`[SAVE_INFO_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    return { 
        accountData,
        setAccountData,
        handleDelete, 
        fetchAccount,
        handleSaveInfo
    }
}