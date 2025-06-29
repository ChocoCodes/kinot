import type { JSX } from "react";

interface FinanceCardProps {
    cardTitle: string,
    currentAmount: number,
    previousAmount: number,
    icon: JSX.Element,
    percentage: number,
    percentageIcon: JSX.Element,
    percentageColor: string,
    bgColor: string,
    borderColor: string,
    onIconClick: () => void;    
}

const FinanceCard = ({
    cardTitle,
    currentAmount,
    previousAmount,
    icon,
    percentage,
    percentageIcon,
    percentageColor,
    bgColor,
    borderColor,
    onIconClick,
}: FinanceCardProps) => {
    return (
        <div className={`flex flex-col w-[300px] px-4 py-5 rounded-xl ${ bgColor } ${ borderColor }`}>
            <div className="flex justify-between">
                <p className='text-2xl'>{ cardTitle }</p>
                <button 
                    className='text-2xl hover:cursor-pointer' 
                    onClick={ () => onIconClick() }
                >
                    { icon }
                </button>
            </div>
            <h1 className="text-4xl font-bold py-2">₱ { currentAmount }</h1>
            <p>vs last month</p>
            <div className="flex gap-2 items-center text-lg">
                <h1 className="font-bold">₱ { previousAmount }</h1>
                <p className={`${ percentageColor }`}>{ percentageIcon } { percentage }</p>
            </div>
        </div>
    )
}

export default FinanceCard