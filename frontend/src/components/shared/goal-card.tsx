import { useState } from 'react';
import { TopUp } from '@components/home-page/_components';
import { DeleteGoal } from '@components/goal-page/_components';
import { useDashboard } from '@hooks/use-dashboard';

interface GoalCardProps {
    id: number;
    current_amount: number;
    required_amount: number;
    image_path: string;
    title: string;
    monthly_contribution: number;
    refetch: () => Promise<void>;
}

const GoalCard = ({ 
    id,
    current_amount,
    required_amount,
    image_path,
    title,
    monthly_contribution,
    refetch
}: GoalCardProps) => {
    const [activeModal, setActiveModal] = useState<"contribute" | "delete" | null>(null)
    
    const { userData } = useDashboard();
    const currentAllowance = userData?.finances?.current?.allowance ?? 0;

    const handleClose = async () => {
        setActiveModal(null);
        await refetch();
    }
    
    return (
        <>
            <div className="w-[300px] bg-light-gray flex flex-col gap-3 justify-between items-center p-4 rounded-lg border-2 border-dark-gray drop-shadow-md">
                <div className="w-full">
                    <img src={ image_path } alt={ title } className="rounded-md h-64 w-full max-w-full object-cover border-2 border-dark-gray"/>
                </div>
                <div className="w-full flex flex-col gap-2 text-left">
                    <h3 className="text-xl font-bold">{ title }</h3>
                    <div className="flex flex-col gap-1">
                        <div className="w-full h-2 rounded-full bg-bg-input">
                            <div className="h-2 rounded-full bg-outl-green" style={{ width: `${(current_amount / required_amount ) * 100}%`}}></div>
                        </div>
                        <p className="text-sm">₱{ current_amount } out of ₱{ required_amount }</p>
                    </div>
                    <p>You added ₱{ monthly_contribution } this month.</p>
                </div>
                <div className="flex w-full mx-auto items-center justify-between mt-4 text-white text-lg">
                    { current_amount !== required_amount && (
                        <button 
                            className="w-45/100 bg-black p-2 rounded-lg hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                            onClick={ () => setActiveModal("contribute") }
                        >
                            Contribute
                        </button>
                    )}
                    <button 
                        className="w-45/100 bg-destructive p-2 rounded-lg hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                        onClick={ () => setActiveModal("delete") }
                    >
                        Delete
                    </button>
                </div>
            </div>
            { activeModal === "contribute" && (
                <TopUp
                    goalName={ title }
                    handleOnClose={ handleClose }
                    goalId={ id }
                    currentAllowance={ currentAllowance }
                />
            )}
            { activeModal === "delete" && (
                <DeleteGoal onClose={ handleClose } name={ title } id={ id } />
            )}

        </>
    )
}

export { GoalCard }