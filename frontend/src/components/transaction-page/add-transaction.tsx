import { useState } from 'react'
import { FormInput } from '@components/shared/_components'
import type { Transaction } from '@type/types'
import { IoIosClose } from 'react-icons/io';
import { financeMeta } from '@pages/home-page';
import { toUpper } from '@utils/helpers';
import { useTransactions } from '@hooks/use-transactions';
interface AddTransactionProps {
    onClose: () => void;
}

type TransactionEntry = Omit<Transaction, "id" | "created_at">

const CATEGORIES = Object.keys(financeMeta)

export const AddTransactionForm = ({ onClose }: AddTransactionProps) => {
    const { addTransaction } = useTransactions()
    const [transactionEntry, setTransactionEntry] = useState<TransactionEntry>({
        amount: 0,
        category: "",
        method: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setTransactionEntry(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload: TransactionEntry = { ...transactionEntry }
        await addTransaction(payload)
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <form 
                action="submit"
                onSubmit={ handleSubmit }
                className="w-[500px] p-6 bg-white/90 rounded-md flex flex-col gap-3"
            >
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-2 border-b-2 border-gray-400">
                    <p>New Transaction</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ onClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="w-9/10 mx-auto flex flex-col gap-3">
                
                    <FormInput 
                        id="amount"
                        label="Amount"
                        value={ transactionEntry.amount }
                        onChange={ handleChange }
                        placeholder='Enter amount'
                    />
                    <FormInput 
                        id="method"
                        label="Method"
                        value={ transactionEntry.method }
                        onChange={ handleChange }
                        placeholder='Enter cash method'
                    />
                    <FormInput 
                        id="description"
                        label="Description"
                        value={ transactionEntry.description }
                        onChange={ handleChange }
                        placeholder='Enter description'
                    />
                    <label htmlFor="category" className='text-2xl font-semibold'>Category</label>
                    <select
                        name="category"
                        id="category"
                        value={ transactionEntry.category }
                        onChange={ handleChange }
                        className='h-10 px-2 border-1 border-gray-400 text-ph-gray rounded-md'
                    >
                        <option value="">Select Method</option>
                        {CATEGORIES.map(category => (
                            <option key={ category } value={ category }>{ toUpper(category) }</option>
                        ))}
                    </select>
                </div>
                <button
                    type='submit'
                    className='bg-black text-white px-3 h-10 w-1/4 mx-auto rounded-sm mt-2'
                >
                    Add
                </button>
            </form>
        </div>
    )      
}