// import { useState } from 'react'

interface GoalCardProps {
    id: number;
    current_amount: number;
    required_amount: number;
    image_path: string;
    title: string;
}

const GoalCard = ({ 
    id,
    current_amount,
    required_amount,
    image_path,
    title
}: GoalCardProps) => {
    // const [visible, isVisible] = useState<boolean>(false)

    // handle complete -> route to /update-goal/<id> 
    return (
        <div className="w-1/5 mx-auto bg-red-300 flex flex-col gap-2 justify-center items-center p-3">
            <img src={image_path} alt={title} />
            <div className="flex flex-col">
                <h3>{title}</h3>
                <div>{id} Progress Bar Here</div>
                <p>₱{current_amount} out of ₱{required_amount}</p>
                <p>You added ₱XX,XXX this month.</p>
            </div>
            <div className="flex w-3/4 mx-auto items-center justify-between">
                <button>Contribute</button>
                <button>Delete</button>
            </div>
        </div>
    )
}

export default GoalCard