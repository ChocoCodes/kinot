import { useAuth } from "@context/auth-context"
import { useDashboard } from './use-dashboard'
import type { FinanceData, Payload } from "@type/types"

export const useUpdateFinance = () => {
    const { user } = useAuth() 
    const { userData, setUserData } = useDashboard()

    const updateFinance =  async (payload: Payload): Promise<void> => {
        // console.log("Json payload: " + JSON.stringify(payload))
        // console.log(user?.token)
        try {
            const response = await fetch('api/finance-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(payload),
            })

            if(!response.ok) {
                console.error('ResponseNotOkError[HOME]: ', response.status, await response.text())
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result: FinanceData = await response.json()
            console.log(result)

            if(userData) {
                setUserData(prev => ({
                    ...prev!,
                    finances: result,
                }))
            }

        } catch (error) {
            console.error("PostRequestError[HOME]: ", error)
            throw error
        }
    }
    return { updateFinance }
}