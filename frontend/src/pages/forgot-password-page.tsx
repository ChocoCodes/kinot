import { Footer } from "@components/layouts/_components"
import { StepOneCredentials, StepTwoNewPassword } from '@components/forgot-password/_components'
import { useForgotPassword } from "@hooks/_hooks"

function ForgotPasswordPage() {
    const { step, userCredential, newPassword, handleChange, handleSubmit } = useForgotPassword()

    return (
        <div className='flex flex-col gap-5 items-center justify-center w-screen h-screen py-10'>
            <h1 className="text-start text-4xl font-semibold">Forgot Password</h1>
            <ul className='flex justify-between w-60'>
                <li className="relative flex-1 flex justify-center">
                    <span className="bg-black text-white px-3 py-1 rounded-sm z-10">1</span>
                    <span className="absolute top-1/2 left-1/2 w-full border-t-2 border-black -z-0"></span>
                </li>
                <li className="relative flex-1 flex justify-center">
                    <span className={`${step == 2 ? 'bg-black text-white' : 'border-2 border-black bg-white'} px-3 py-1 rounded-sm z-10`}>2</span>
                </li>
            </ul>
            <form
                className='w-2/5 h-3/5 gap-7 flex flex-col'
                action='submit'
                onSubmit={ handleSubmit }
            >
                { step === 1 && <StepOneCredentials data={ userCredential } handleChange={ handleChange }/> }
                { step === 2 && <StepTwoNewPassword data={ newPassword } handleChange={ handleChange }/> }
                <button 
                    type='submit'
                    className='p-2 bg-black text-white w-50 text-2xl text-center rounded-md mx-auto hover:cursor-pointer'
                >
                    { step == 1 ? "Next" : "Submit" }
                </button>
            </form>
            <Footer />
        </div>
    )
}

export { ForgotPasswordPage }