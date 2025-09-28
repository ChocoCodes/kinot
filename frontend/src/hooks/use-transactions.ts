import { useState } from 'react'
import type { TransactionData } from '@type/types'
import { useAuth } from '@context/auth-context'
import { useToast } from '@context/toast-context'

export const useTransactions = () => {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [transactions, setTransactions] = useState<TransactionData[]>([])

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                }
            })

            if(!response.ok) {
                console.error("[FETCH_TRANSACTIONS_ERROR] ResponseNotOK: Failed to fetch transactions")
                addToast("ResponseNotOK: Failed to fetch transactions", "danger")
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
            }

            const data: TransactionData[] = await response.json()
            setTransactions(data)
        } catch (error: unknown) {
            console.error("[FETCH_TRANSACTIONS_ERROR] ExceptionCaught: ", error)
            addToast(error instanceof Error ? error.message : 'Unknown error occured.', "danger")
            throw new Error(`[FETCH_TRANSACTIONS_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    return { 
        transactions, 
        fetchTransactions 
    }
}
