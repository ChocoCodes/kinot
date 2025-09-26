import { Toast } from '@components/layouts/_components';
import type { ChildProps } from '@type/types'
import {
    createContext,
    useContext,
    useState
} from 'react'

interface ToastProps {
    id: number;
    message: string;
    variant: 'danger' | 'primary';
}

type ToastContextType = {
    addToast: (message: string, variant: 'danger' | 'primary') => void;
}

const ToastContext = createContext<ToastContextType>({
    addToast: () => {}
})

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if(!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}

const TOAST_MS = 5000

export function ToastProvider({ children }: ChildProps) {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const addToast = (message: string, variant: 'danger' | 'primary') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, variant }])
        
        setTimeout(() => {
            setToasts((prev) => prev.filter(toast => toast.id !== id))
        }, TOAST_MS)
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            { children }

            <div className="max-w-[400px] fixed bottom-0 right-0 space-y-2 z-50 shadow-md">
                { toasts.map(toast => (
                    <Toast key={ toast.id } message={ toast.message } ms={ TOAST_MS } variant={ toast.variant }/>
                ))}
            </div>
        </ToastContext.Provider>
    )
}