const retrieveQuestions = [
    "What was your favorite cartoon or TV show growing up?",
    "What is the name of your first pet?",
    "What is the name of a teacher you disliked the most?"
]

function ForgotPasswordPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submit pressed')
    }

    return (
        <div className='flex items-center justify-center w-screen h-screen'>
            <form
                className='w-2/5 h-4/5 gap-6 py-3 flex flex-col'
                action='submit'
                onClick={ handleSubmit }
            >
                <input 
                    type="text" 
                    name="username"
                    maxLength={ 50 }
                    className='bg-bg-input placeholder-ph-gray h-[3rem] rounded-md px-3 border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out'
                    placeholder='Username'
                    autoComplete='off'
                    required
                />                
                <select 
                    name="question"
                    className='h-[3rem] bg-bg-input text-ph-gray px-3 rounded-md'
                    required
                >
                    <option value="">Select your recovery question</option>
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
                    maxLength={ 50 }
                    className='bg-bg-input placeholder-ph-gray h-[3rem] rounded-md px-3 border-0 border-l-5 border-transparent focus:outline-none focus:border-l-black transition-all duration-200 ease-in-out'
                    placeholder='Type your answer here...'
                    autoComplete='off'
                    required
                />
                <button 
                    type='submit'
                    className='px-3 py-2 bg-black text-white w-25 rounded-md mx-auto hover:cursor-pointer'
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export { ForgotPasswordPage }