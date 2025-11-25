import { Loading } from '@components/layouts/_components'
import type { ChildProps, User } from '@type/types'
import { useNavigate } from 'react-router-dom';
import { useTokenRefresh, useVerifyToken } from '@hooks/use-token-refresh';
import { useToast } from '@context/toast-context';
import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
} from 'react'

type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx;
}

export function AuthProvider({ children }: ChildProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { verifyToken } = useVerifyToken();
    const { addToast } = useToast();

    // Refresh access_token every 55 mins
    useTokenRefresh(user?.token ?? null, (newToken: string) => {
        // update user info in both states and cache
        setUser(prev => {
            if(!prev) return null;
            const updated = { ...user, token: newToken } as User;
            localStorage.setItem('user', JSON.stringify(updated))
            return updated;
        })
    })

    useEffect(() => {
        const parseAndVerifyCache = async () => {
            setLoading(true);
            const cachedUser = localStorage.getItem('user')
            if(!cachedUser) {
                setLoading(false);
                return;
            }

            try {
                const parsed = JSON.parse(cachedUser);
                if (!parsed || !parsed.token) {
                    addToast("Cache data is corrupted.", "danger");
                    logout();
                    setLoading(false);
                    return;
                }

                const { ok, expired } = await verifyToken(parsed.token);
                if (ok) {
                    setUser(parsed);
                } else {
                    const toastMessage = expired ? 'Token has expired. Redirecting to login...' : 'Invalid cache token. Redirecting to login...';
                    addToast(toastMessage, 'danger');
                    logout();
                }
                setLoading(false);
            } catch (err) {
                console.error('CacheError: ', err);
                logout();
                setLoading(false);
            }
        }

        parseAndVerifyCache();
    }, [])
    
    const login = (user: User) => {
        console.log(user);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home', { replace: true });
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/', { replace: true });
    }

    if (loading) return <Loading />
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}