import { useGoals } from '@hooks/_hooks'
import { IoIosClose } from 'react-icons/io';

interface DeleteGoalProps {
    onClose: () => void;
    name: string;
    id: number;
}

export const DeleteGoal = ({ onClose, name, id }: DeleteGoalProps) => {
    const { deleteGoal } = useGoals()
    
    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <div className='w-1/5 h-1/5 bg-white p-4 rounded-md flex flex-col gap-4 items-center font-poppins'>
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>Delete Goal "{ name }"</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ onClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div>
                    <p>Are you sure? This action is <span className='font-bold'>irreversible!</span></p>
                </div>
                <div className='w-9/10'>
                    <button 
                        className='text-lg text-white rounded-md bg-destructive py-2 px-4 hover:cursor-pointer'
                        onClick={ () => deleteGoal(id) }
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
