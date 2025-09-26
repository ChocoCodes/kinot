import { Loading } from '@components/layouts/_components'
import type { ChildProps, User } from '@type/types'
import { useNavigate } from 'react-router-dom';
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
    
    useEffect(() => {
        const cachedUser = localStorage.getItem('user')
        if(cachedUser) {
            try {
                const parsed = JSON.parse(cachedUser)
                setUser(parsed)
            } catch (err) {
                console.error('CacheError: ', err)
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])
    
    const login = (user: User) => {
        console.log(user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
    }

    if (loading) return <Loading />
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}