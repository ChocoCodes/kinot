import { useState } from 'react'
import type { UserInfo } from './RegisterForm'
import { BiSolidChevronLeftSquare } from "react-icons/bi";

interface RecoveryProps {
    onBack: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onUpdate: (newData: Partial<UserInfo>) => void;
}

const retrieveQuestions = [
    "What was your favorite cartoon or TV show growing up?",
    "What is the name of your first pet?",
    "What is the name of a teacher you disliked the most?"
]

export const RecoveryForm = ({ onBack, onSubmit, onUpdate }: RecoveryProps) => {
    const [recovery, setRecovery] = useState<Partial<UserInfo>>({
        question: '',
        answer: ''
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onUpdate(recovery)
        onSubmit(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setRecovery(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <form
            action='submit'
            onSubmit={ handleSubmit }
            className='flex flex-col gap-4 py-3'
        >
            <select 
                name="question"
                value={ recovery.question } 
                onChange={ handleChange }
                required
            >
                <option value="">Select a recovery question</option>
                {
                    retrieveQuestions.map((question, index) => {
                        return (
                            <option key={index} value={question}>{ question }</option>
                        )
                    })
                }
            </select>
            <input 
                type="text" 
                name="answer"
                value={ recovery.answer }
                onChange={ handleChange }
                required
            />
        </form>
    )
}
