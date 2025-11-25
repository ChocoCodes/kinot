import { useEffect, useCallback } from 'react';
import { useToast } from '@context/toast-context';

export const useTokenRefresh = (
    userToken: string | null, 
    setToken: (token: string) => void
) => {

    const refreshToken = useCallback(async () => {
        if (!userToken) return null;

        try {
            const res = await fetch('api/refresh', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (!res.ok) throw new Error("Failed to refresh token.");

            const data = await res.json();
            setToken(data.token);
            return data.token;
        } catch (err) {
            console.error('[REFRESH_TOKEN_ERROR]', err);
            return null;
        }
    }, [userToken, setToken]);

    useEffect(() => {
        if(!userToken) return;

        // time to refresh every 55 mins
        const TTR = 55 * 60 * 1000;
        const refreshInterval = setInterval(() => {
            refreshToken();
        }, TTR);

        // Clear on re-run or unmount
        return () => clearInterval(refreshInterval);
    }, [userToken, refreshToken]);

    return { refreshToken }
}

export const useVerifyToken = (updateAccessToken: (token: string) => void) => {
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
            if (!body) return { ok: false, expired: false };
            // Attempt a token refresh when token is expired
            if (response.status === 401 && body.expired) {
                const refreshRes = await fetch('api/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (!refreshRes.ok) throw new Error("Failed to refresh token.");

                const data = await refreshRes.json();
                updateAccessToken(data.token);
                return { ok: true, expired: true };
            }

            return { ok: false, expired: false };
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'An unknown error occured in verifying access token.';
            addToast(errorMsg, 'danger');
            console.error(errorMsg);
            return { ok: false, expired: false };
        }
    }, [addToast, updateAccessToken]);

    return { verifyToken };
}