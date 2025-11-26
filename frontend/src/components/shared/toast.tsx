interface ToastProps {
    message: string;    
    ms: number;
    variant: 'danger' | 'primary'
}

const ToastCountdown = ({ message, ms, variant = "primary" }: ToastProps) => {
    const color = {
        danger: 'bg-[#D66A6A]',
        primary: 'bg-black'
    }

    return <div className={`relative w-[400px] ${ color[variant] } text-white px-5 py-3 rounded-tl-md`}>
        <p>{ message }</p>
        <div className="w-full h-1 bg-[#1A1A1A] absolute bottom-0 left-0 overflow-x-hidden">
            <div 
                className="w-full bg-white h-1 transition-[width] ease-linear" 
                style={{ 
                    animation: `shrink ${ ms }ms linear forwards`,
                }} 
            >
            </div>
        </div>
    </div>
}

export { ToastCountdown }