import { useAuth } from "@context/auth-context";
import { useToast } from '@context/toast-context';
import type { Payload } from "@type/types";

export const useUpdateFinance = () => {
    const { user } = useAuth() ;
    const { addToast } = useToast();

    const updateFinance =  async (payload: Payload): Promise<void> => {
        // console.log("Json payload: " + JSON.stringify(payload))
        // console.log(user?.token)
        if (!user?.token) return;
    
        try {
            const response = await fetch('api/finance-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(payload),
            });

            if(!response.ok) {
                console.error('ResponseNotOkError[HOME]: ', response.status, await response.text())
                throw new Error(`Request failed with status ${response.status}`);
            }
            
            const result = await response.json();
            addToast(result.message, "primary");

        } catch (error) {
            console.error("PostRequestError[HOME]: ", error);
            throw error;
        }
    }
    return { updateFinance };
}