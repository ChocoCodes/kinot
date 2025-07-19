import { useEffect, useState } from 'react'
import { useAuth } from '@context/AuthContext'

type FinanceSnapshot = {
    id: number;
    user_id: number;
    date: string;
    savings: number;
    year: number;
    month: number;
    expenses: number;
    allowance: number;
}

export type FinanceData = {
    current: FinanceSnapshot;
    previous: FinanceSnapshot;
    savings_pct: number;
    spendings_pct: number;
}

type TransactionData = {
    id: number;
    user_id: number;
    category: string;
    amount: number;
    created_at: string;
    method: string;
    description: string;
}

type DashboardData = {
    finance: FinanceData;
    transaction: TransactionData[];
}

export const useUserDashboard = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<DashboardData | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch('api/home', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            })

            if(!response.ok) {
                console.error('[ResponseNotOK]: Failed to fetch homepage data')
                setUserData(null)
            }

            const data = await response.json()
            console.log(data)
            setUserData(data)
        } catch (err: any) {
            console.error('[InternalError]: ', err)
            setUserData(null)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { userData, fetchData }
}