import { useState, useEffect } from 'react'
import { useAuth } from '@context/auth-context'
import { useToast } from '@context/toast-context'
import type { GoalData } from '@type/types'

export const useGoals = () => {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [goals, setGoals] = useState<GoalData[]>([])

    const fetchGoals = async () => {
        try {
            const response = await fetch('api/goals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                }
            })

            if (!response.ok) {
                console.error("[FETCH_GOALS_ERROR] ResponseNotOK: Failed to fetch goal")
                addToast("ResponseNotOK: Failed to fetch goal.", "danger")
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
            }

            const data: GoalData[] = await response.json()
            console.log(data)
            setGoals(data)
        } catch (error: unknown) {
            console.error("[FETCH_GOALS_ERROR] ExceptionCaught: ", error)
            throw new Error(`[FETCH_GOALS_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    const updateGoalContribution = async (payload: any) => {
        try {
            const response = await fetch(`api/goal/${ payload.id }/contribute`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ user?.token }`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error("[UPDATE_GOAL_ERROR] ResponseNotOK: Failed to update goal");
                addToast("ResponseNotOK: Failed to update goal.", "danger");
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`);
            }

            addToast('Goal updated successfully.', 'primary');
        } catch (error) {
            console.error("PostRequestError[GOAL_UPDATE]: ", error);
            throw error;
        }
    }
    
    const addGoal = async (payload: FormData) => {
        try {
            const response = await fetch('api/goal', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ user?.token }`,
                },
                body: payload
            });

            if(!response.ok) {
                console.error("[ADD_GOAL_ERROR] ResponseNotOK: Failed to add goal");
                addToast("Unable to add goal.", "danger");
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`);
            }

            addToast('Goal added successfully.', 'primary');
        } catch (error: unknown) {
            console.error("[ADD_GOAL_ERROR] ExceptionCaught: ", error);
            throw new Error(`[ADD_GOAL_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `);
        }
    }

    const deleteGoal = async (id: number) => {
        try {
            const response = await fetch(`api/goal/${ id }`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${ user?.token }`,
                    'Content-Type': 'application/json'
                }
            })

            if(!response.ok) {
                console.error("[DELETE_GOAL_ERROR] ResponseNotOK: Failed to delete goal")
                addToast("Unable to delete goal.", "danger")
                throw new Error(`Request failed with status ${ response.status } | ${ response.statusText }`)
            }

            await fetchGoals();
            addToast('Goal deleted successfully.', 'primary');
        } catch (error: unknown) {
            console.error("[DELETE_GOAL_ERROR] ExceptionCaught: ", error)
            throw new Error(`[DELETE_GOAL_ERROR] ${ error instanceof Error ? error.message : 'Unknown error occured.'} `)
        }
    }

    useEffect(() => {
        fetchGoals()
    }, [])

    return { 
        goals,
        fetchGoals,
        updateGoalContribution,
        deleteGoal,
        addGoal
    }
}