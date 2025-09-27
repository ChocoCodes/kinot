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

    const deleteAccount = async () => {
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
            addToast('Account Deleted Successfully.', "primary")
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

    // Send info as 'multipart/form-data' for image uploads
    const updateAccount = async (payload: FormData) => {
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

    const updatePassword = async <T extends unknown>(payload: T) => {
        try {
            const response = await fetch('api/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                },
                body: JSON.stringify(payload)
            })

            return response
        } catch (error: unknown) {
            console.error("[UPDATE_PASS_ERROR] ExceptionCaught: ", error)
            throw new Error(`[UPDATE_PASS_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }

    }

    return { 
        accountData,
        setAccountData,
        deleteAccount, 
        fetchAccount,
        updateAccount,
        updatePassword
    }
}