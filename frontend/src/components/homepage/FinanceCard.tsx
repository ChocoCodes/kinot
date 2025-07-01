import type { JSX } from "react";

interface FinanceCardProps {
    cardTitle: string,
    currentAmount: number,
    previousAmount: number,
    icon: JSX.Element,
    percentage: number,
    percentageIcon: JSX.Element,
    bgColor: string,
    borderColor: string,
    onIconClick: () => void;    
}

const FinanceCard = ({
    cardTitle,
    icon,
    bgColor,
    percentageIcon,
    onIconClick,
    borderColor,
    currentAmount,
    previousAmount,
    percentage,
}: FinanceCardProps) => {
    return (
        <div className={`flex flex-col w-[300px] px-4 py-5 rounded-xl ${ bgColor } ${ borderColor }`}>
            <div className="flex justify-between">
                <p className='text-2xl'>{ cardTitle }</p>
                <button 
                    className='text-2xl hover:cursor-pointer' 
                    onClick={ onIconClick }
                >
                    { icon }
                </button>
            </div>
            <h1 className="text-4xl font-bold py-2">₱ { currentAmount.toLocaleString() }</h1>
            <p>vs last month</p>
            <div className="flex gap-2 items-center text-xl">
                <h1 className="font-bold">₱ { previousAmount.toLocaleString() }</h1>
                <p className={`${percentage > 0.0 ? 'text-green-400' : 'text-red-400'}`}> 
                    { percentage !== 0 && 
                        <>
                            { percentageIcon } { percentage }%  
                        </>
                    }
                </p>
            </div>
        </div>
    )
}

export default FinanceCard