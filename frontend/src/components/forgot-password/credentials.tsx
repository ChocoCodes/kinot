import { RiArrowDropDownLine } from "react-icons/ri";
import type { UserCredentials } from "@type/types";

const retrieveQuestions = [
    "What was your favorite cartoon or TV show growing up?",
    "What is the name of your first pet?",
    "What is the name of a teacher you disliked the most?"
]

interface CredentialProps {
    data: UserCredentials;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StepOneCredentials = ({ data, handleChange }: CredentialProps) => {
    return (
    <>
        <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-medium text-lg">Username</label>
            <input 
                id="username"
                type="text" 
                name="username"
                maxLength={ 50 }
                className='bg-bg-input placeholder-ph-gray h-[3rem] rounded-md px-3 border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out'
                placeholder='Enter username'
                autoComplete='off'
                value={ data.username }
                onChange={ handleChange }
                required
            />                
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="question" className="font-medium text-lg">Recovery Question</label>
            <div className="relative">
                <select 
                    id="question"
                    name="question"
                    className='w-full appearance-none h-[3rem] bg-bg-input text-ph-gray px-3 rounded-md'
                    required
                    value={ data.question }
                    onChange={ handleChange }
                >
                    <option value="">Select your recovery question</option>
                    {
                        retrieveQuestions.map((question, index) => {
                            return (
                                <option key={ index } value={ question }>{ question }</option>
                            )
                        })
                    }
                </select>
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-3xl pointer-events-none'>
                    <RiArrowDropDownLine className="text-ph-gray"/>
                </span>
            </div>
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="answer" className="font-medium text-lg">Secret Answer</label>
            <input 
                id="answer"
                type="text" 
                name="answer"
                maxLength={ 50 }
                className='bg-bg-input placeholder-ph-gray h-[3rem] rounded-md px-3 border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out'
                placeholder='Type your answer here...'
                autoComplete='off'
                value={ data.answer }
                onChange={ handleChange }
                required
            />
        </div>
    </>
    )
}

export default StepOneCredentials