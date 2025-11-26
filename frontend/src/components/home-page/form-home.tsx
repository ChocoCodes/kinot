import { type Payload } from '@type/types';
import { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { useToast } from '@context/toast-context';

interface FormProps {
    handleOnClose: () => void
    formTitle: string
    handleSubmit: (payload: Payload) => Promise<void>
    refetch: () => Promise<void>
    currentAllowance?: number
}

const Form = ({ handleOnClose, formTitle, handleSubmit, refetch, currentAllowance }: FormProps ) => {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [description, setDescription] = useState("");
    const { addToast } = useToast();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (amount === "" || isNaN(Number(amount))) {
            alert("Please enter a valid amount");
            setAmount("");
            return;
        }

        const requireAllowanceCheck = ['savings', 'expenses'].includes(formTitle);
        const numericAmount = Number(amount);

        if (requireAllowanceCheck) {
            // userData was not loaded
            if (currentAllowance == null) {
                addToast('Current allowance data not available.', 'danger');
                return;
            }

            // intended amount exceeds the current allowance
            if (numericAmount > currentAllowance) {
                addToast(`Amount cannot exceed allowance: ${ currentAllowance }.`, 'danger');
                return;
            }
        }

        const now = new Date()
        const payload: Payload = {
            field: formTitle,
            amount: numericAmount,
            method,
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            description
        }
        
        try {
            await handleSubmit(payload);
            await refetch();
            handleOnClose();
        } catch (err) {
            console.error("SubmitError: ", err);
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <form 
                action="submit"
                onSubmit={ onSubmit }
                className="w-[500px] p-6 bg-white/90 rounded-md flex flex-col gap-6"
            >
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>{ formTitle.charAt(0).toUpperCase() + formTitle.slice(1) }</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ handleOnClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="w-9/10 mx-auto flex flex-col gap-6">
                    <input 
                        type="text" 
                        className="no-spinner w-full mx-auto h-14 px-4 text-xl border-1 border-gray-400 focus:border-black rounded-lg" 
                        placeholder={`Enter ${ formTitle } amount`} 
                        value={ amount }
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input 
                        type="text" 
                        className="no-spinner w-full mx-auto h-14 px-4 text-xl border-1 border-gray-400 focus:border-black rounded-lg" 
                        placeholder={`Enter method`} 
                        value={ method }
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <input 
                        type="text" 
                        className="no-spinner w-full mx-auto h-14 px-4 text-xl border-1 border-gray-400 focus:border-black rounded-lg" 
                        placeholder={`Enter top-up description`} 
                        value={ description }
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className='h-12 text-lg text-white rounded-md bg-black py-2 px-4 self-end hover:cursor-pointer'
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Form