import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@context/auth-context'
import type { DashboardData } from '@type/types';

export const useDashboard = () => {
    const { user } = useAuth()
    const [userData, setUserData] = useState<DashboardData | null>(null);

    console.log('userData in useDashboard hook: ' + JSON.stringify(userData?.transactions));
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('api/home', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                },
            });

            if(!response.ok) {
                console.error('[ResponseNotOK]: Failed to fetch homepage data');
                setUserData(null);
            }

            const data = await response.json();
            setUserData(data);
        } catch (err: any) {
            console.error('[InternalError]: ', err);
            setUserData(null);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { userData, fetchData, setUserData }
}