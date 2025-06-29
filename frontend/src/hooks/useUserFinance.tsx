import { useEffect, useState } from 'react'
import { useAuth } from '@context/AuthContext'

type UserFinanceData = {
    id: number;
    userId: number;
    date: Date;
    savings: number;
    spendings: number;
    allowance: number;
    savingsPCT: number;
    spendingsPCT: number;
    allowancePCT: number;
}

export const useUserFinance = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserFinanceData | null>(null);

    useEffect(() => {
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

                const data: UserFinanceData = await response.json()
                setUserData(data)
            } catch (err) {
                console.error('[InternalError]: ', err)
                setUserData(null)
            }
        }
        fetchFinances()
    }, [])

    return { userData }
}