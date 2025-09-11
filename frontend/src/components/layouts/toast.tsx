interface ToastProps {
    message: string;    
    ms: number;
}

const ToastCountdown = ({ message, ms }: ToastProps) => {
    return <div className="relative w-[400px] bg-black text-white px-5 py-3">
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

export default ToastCountdown