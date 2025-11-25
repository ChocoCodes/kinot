import { useEffect, useCallback } from 'react';
import { useToast } from '@context/toast-context';

export const useTokenRefresh = (
    userToken: string | null, 
    setToken: (token: string) => void
) => {
    useEffect(() => {
        if(!userToken) return

        // time to refresh every 55 mins
        const TTR = 55 * 60 * 1000
        const refreshInterval = setInterval(async () => {
            const res = await fetch('api/refresh', {
                method: 'POST',
                credentials: 'include'
            })

            if(!res.ok) {
                console.log("[REFRESH_TOKEN_ERROR] Failed to refresh token.")
                return
            }

            const data = await res.json()
            setToken(data.token)
        }, TTR)

        // Clear on re-run or unmount
        return () => clearInterval(refreshInterval)
    }, [userToken, setToken])
}

export const useVerifyToken = () => {
    const { addToast } = useToast();

    const verifyToken = useCallback(async (token: string) => {
        if (!token) {
            addToast("Token not found.", "danger");
            return { ok: false, expired: false };
        }

        try {
            const response = await fetch('api/verify-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            
            if (response.ok) return { ok: true, expired: false };

            const body = await response.json();
            if(!body) return { ok: false, expired: false };

            if (response.status === 404 && body.expired) return { ok: false, expired: true };

            return { ok: false, expired: false };
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'An unknown error occured in verifying access token.';
            addToast(errorMsg, 'danger');
            console.error(errorMsg);
            return { ok: false, expired: false };
        }
    }, [])

    return { verifyToken };
}