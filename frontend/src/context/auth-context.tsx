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
    updateAccessToken: (token: string) => void;
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
    const { addToast } = useToast();
    
    const updateAccessToken = (token: string) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, token };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    }

    const { verifyToken } = useVerifyToken(updateAccessToken);

    // Refresh access_token every 55 mins
    useTokenRefresh(user?.token ?? null, (newToken: string) => {
        updateAccessToken(newToken);
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
            } catch (err) {
                console.error('CacheError: ', err);
                logout();
            } finally {
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
        <AuthContext.Provider value={{ user, login, logout, updateAccessToken }}>
            { children }
        </AuthContext.Provider>
    )
}