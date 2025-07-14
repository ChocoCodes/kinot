import { useEffect, useState } from 'react'
import { useAuth } from '@context/AuthContext'

type FinanceRecord = {
    id: number;
    user_id: number;
    date: string;
    savings: number;
    year: number;
    month: number;
    expenses: number;
    allowance: number;
}

export type UserFinanceData = {
    current: FinanceRecord;
    previous: FinanceRecord;
    savings_pct: number;
    spendings_pct: number;
}

export const useUserFinance = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserFinanceData | null>(null);
    const fetchFinances = async () => {
        try {
            const response = await fetch('api/finances', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            })

            if(!response.ok) {
                console.error('[ResponseNotOK]: Failed to fetch finance')
                setUserData(null)
            }

            const data = await response.json()
            console.log(data)
            setUserData(data)
        } catch (err) {
            console.error('[InternalError]: ', err)
            setUserData(null)
        }
    }

    useEffect(() => {
        fetchFinances()
    }, [])

    return { userData, fetchFinances }
}