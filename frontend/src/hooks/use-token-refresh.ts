import { useEffect } from 'react'

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