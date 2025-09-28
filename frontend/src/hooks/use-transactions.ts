import { useEffect, useState } from 'react'
import type { TransactionData } from '@type/types'
import { useAuth } from '@context/auth-context'
import { useToast } from '@context/toast-context'

export const useTransactions = (page = 1, limit = 10) => {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [transactions, setTransactions] = useState<TransactionData[]>([])
    const [total, setTotal] = useState(0)

    const fetchTransactions = async () => {
        const offset = (page - 1) * limit
        try {
            const response = await fetch(`/api/transactions?limit=${ limit }&offset=${ offset }`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                }
            })

            if(!response.ok) {
                console.error("[FETCH_TRANSACTIONS_ERROR] ResponseNotOK: Failed to fetch transactions")
                addToast("ResponseNotOK: Failed to fetch transactions", "danger")
                setTotal(0)
                setTransactions([])
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
            }

            const data = await response.json()
            data.transactions.created_at
            setTransactions(data.transactions)
            setTotal(data.total)
        } catch (error: unknown) {
            console.error("[FETCH_TRANSACTIONS_ERROR] ExceptionCaught: ", error)
            addToast(error instanceof Error ? error.message : 'Unknown error occured.', "danger")
            throw new Error(`[FETCH_TRANSACTIONS_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [user, page, limit])

    return { 
        transactions, 
        total 
    }
}
