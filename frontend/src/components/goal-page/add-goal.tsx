import { useState } from 'react'
import { useGoals } from "@hooks/_hooks"
import { FormInput } from "@components/shared/form-input"
import { IoIosClose } from 'react-icons/io';

type GoalEntry = {
    title: string;
    description: string;
    required: number;
}

interface AddGoalFormProps {
    onClose: () => void;
}
 
export const AddGoalForm = ({ onClose }: AddGoalFormProps) => {
    const { addGoal } = useGoals()
    const [image, setImage] = useState<{
        blob: File,
        url: string
    }| null>(null)
    const [goalEntry, setGoalEntry] = useState<GoalEntry>({
        title: "",
        description: "",
        required: 0.0,
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return 

        const file = e.target.files?.[0]
        if (file) {
            if (image) { 
                URL.revokeObjectURL(image.url) 
            }
            setImage({
                blob: file,
                url: URL.createObjectURL(file)
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target 
        setGoalEntry(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const payload = new FormData()
            payload.append('title', goalEntry.title)
            payload.append('description', goalEntry.description)
            payload.append('required_amount', goalEntry.required.toString())
            if (image) {
                payload.append('image', image.blob)
            }

            addGoal(payload)
        } catch (error: unknown) {
            console.error(`[ADD_GOAL_ERROR]: ${ error instanceof Error ? error.message : 'Unknown error occured. '}`)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <form 
                action="submit"
                className="w-[500px] p-6 bg-white/90 rounded-md flex flex-col gap-3"
                onSubmit={ handleSubmit }
            >
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-2 border-b-2 border-gray-400">
                    <p>New Goal</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ onClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="flex flex-col gap-4 w-9/10 mx-auto"> 
                    <FormInput 
                        id={"title"}
                        label={"Title"}
                        placeholder='Enter goal title'
                        value={ goalEntry.title }
                        onChange={ handleChange }
                    />
                    <FormInput 
                        id={"required"}
                        label={"Required Amount"}
                        placeholder='Enter required amount'
                        value={ goalEntry.required }
                        onChange={ handleChange }
                    />
                    <FormInput 
                        id={"description"}
                        label={"Description"}
                        placeholder='Enter goal description'
                        value={ goalEntry.description }
                        onChange={ handleChange }
                    />
                    <div className="flex w-full justify-between items-center">
                        <p>Add Goal Image</p>
                        <div>
                            <label htmlFor="image" className='hover:cursor-pointer inline-block px-4 py-2 bg-black text-white rounded-md border hover:bg-white hover:text-black hover:border-black transition-colors'>Upload Image</label>
                            <input 
                                type="file" 
                                name="image" 
                                id="image" 
                                className="hidden" 
                                accept="image/png, image/jpg"
                                onChange={ handleImageChange }
                            />
                        </div>
                    </div>
                    { image && (
                        <img src={ image.url } alt="preview" className='w-32 h-32 rounded-md object-cover mx-auto'/>
                    )}
                </div>
                <button
                    type='submit'
                    className='hover:cursor-pointer bg-black text-white px-2 h-10 w-1/4 mx-auto rounded-sm mt-2 border hover:bg-white hover:text-black hover:border-black transition-colors'
                >
                    Create
                </button>
            </form>
        </div>
    )
}