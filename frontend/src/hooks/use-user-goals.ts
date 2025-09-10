import { useAuth } from '@context/auth-context'


export const useUserGoals = () => {
    const { user } = useAuth()

    const updateGoalContribution = async (payload: any) => {
        try {
            const response = await fetch(`api/update-goal/${ payload.id }`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error("PostRequestError[GOAL_UPDATE]: ", error)
            throw error
        }
    }

    return { updateGoalContribution }
}