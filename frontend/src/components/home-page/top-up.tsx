import { useState } from 'react'
import { IoIosClose } from 'react-icons/io';
import { useToast } from '@context/toast-context'
import { useGoals } from '@hooks/use-goals';

interface TopUpProps {
    goalName: string;
    handleOnClose: () => void;
    goalId: number;
}

const TopUp = ({ goalName, handleOnClose, goalId }: TopUpProps) => {
    const [amount, setAmount] = useState("")
    const { addToast } = useToast()
    const { updateGoalContribution } = useGoals()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (amount === "" || isNaN(Number(amount))) {
            addToast('Invalid. Please enter a valid amount.', "danger")
            setAmount("")
            return
        }
        
        const payload = {
            id: goalId,
            amount: Number(amount)
        }
        
        updateGoalContribution(payload)   
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <form 
                action="submit"
                onSubmit={ handleSubmit }
                className="w-[500px] h-[250px] p-6 bg-white/95 rounded-md flex flex-col gap-6"
            >
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>{`Contribute to Goal "${ goalName }"`}</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ handleOnClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="w-9/10 mx-auto flex flex-col gap-6">
                    <input 
                        type="text" 
                        className="no-spinner w-full mx-auto h-14 px-4 text-xl border-1 border-gray-400 focus:border-black rounded-lg" 
                        placeholder={`Enter amount`} 
                        value={ amount }
                        onChange={ (e) => setAmount(e.target.value) }
                    />
                    <button 
                        type="submit"
                        className='h-12 text-lg text-white rounded-md bg-black py-2 px-4 self-end hover:cursor-pointer'
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}


export default TopUp