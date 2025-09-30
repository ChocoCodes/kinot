import { useState } from 'react'
import { TopUp, DeleteDialog } from '@components/home-page/_components'

interface GoalCardProps {
    id: number;
    current_amount: number;
    required_amount: number;
    image_path: string;
    title: string;
    monthly_contribution: number;
}

const GoalCard = ({ 
    id,
    current_amount,
    required_amount,
    image_path,
    title,
    monthly_contribution
}: GoalCardProps) => {
    const [activeModal, setActiveModal] = useState<"contribute" | "delete" | null>(null)
    // handle contribute -> route to /update-goal/<id> 
    // handle delete -> route to /delete-goal/<id>

    const handleClose = () => setActiveModal(null)
    
    return (
        <>
            <div className="max-w-2/5 mx-auto bg-light-gray flex flex-col gap-3 justify-center items-center p-4 rounded-lg border-2 border-dark-gray drop-shadow-md">
                <img src={ image_path } alt={ title } className="rounded-md h-64 w-full object-cover border-2 border-dark-gray"/>
                <div className="w-full flex flex-col gap-2 text-left">
                    <h3 className="text-2xl font-bold">{ title }</h3>
                    <div className="flex flex-col gap-1">
                        <div className="w-full h-2 rounded-full bg-bg-input">
                            <div className="h-2 rounded-full bg-outl-green" style={{ width: `${(current_amount / required_amount ) * 100}%`}}></div>
                        </div>
                        <p className="text-sm">₱{ current_amount } out of ₱{ required_amount }</p>
                    </div>
                    <p>You added ₱{ monthly_contribution } this month.</p>
                </div>
                <div className="flex w-full mx-auto items-center justify-between mt-4 text-white text-lg">
                    <button 
                        className="w-45/100 bg-black p-2 rounded-lg hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                        onClick={ () => setActiveModal("contribute") }
                    >
                        Contribute
                    </button>
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
                />
            )}
            { activeModal === "delete" && (
                <DeleteDialog title={ title } />
            )}

        </>
    )
}

export { GoalCard }