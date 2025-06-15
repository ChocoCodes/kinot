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
            className='flex flex-col gap-6 py-3'
        >
            <select 
                name="question"
                value={ recovery.question } 
                onChange={ handleChange }
                className='h-[3rem] bg-bg-input text-ph-gray px-3 rounded-md'
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
                className='bg-bg-input placeholder-ph-gray h-[3rem] focus:outline-none rounded-md px-3'
                placeholder='Type your answer here...'
                required
            />
            <div className="flex justify-between items-center">
                <button 
                    onClick={ onBack } 
                    type='button' 
                    className='mr-10 flex items-center gap-1 text-xl hover:scale-110 font-medium hover:cursor-pointer transition-transform duration-200 ease-in-out'
                >
                    <BiSolidChevronLeftSquare className='text-4xl text-[#1A1A1A]'/>
                    Back
                </button>
                <button 
                    type='submit'
                    className='bg-[#1A1A1A] text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-black'
                >
                    Register
                </button>
            </div>
        </form>
    )
}
