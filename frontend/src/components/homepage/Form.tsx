import { IoIosClose } from "react-icons/io";

interface FormProps {
    handleOnClose: () => void
    formTitle: string
    handleSubmit: <T,>(route: string, payload: T) => Promise<T>
}

const Form = ({ handleOnClose, formTitle, handleSubmit }: FormProps ) => {
    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <form className="w-[500px] h-[250px] p-6 bg-white/90 rounded-md flex flex-col gap-6">
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>{ formTitle.charAt(0).toUpperCase() + formTitle.slice(1) }</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ handleOnClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="w-9/10 mx-auto flex flex-col gap-6">
                    <input type="number" className="no-spinner w-full mx-auto h-14 px-4 text-xl border-1 border-gray-400 focus:border-black rounded-lg" placeholder={`Enter ${ formTitle } amount`} />
                    <button className='h-12 text-lg text-white rounded-md bg-black py-2 px-4 self-end hover:cursor-pointer' onClick={ () => handleSubmit }>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Form