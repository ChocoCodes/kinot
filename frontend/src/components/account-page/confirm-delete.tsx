import { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { ActionButton } from "./_components";

interface ConfirmDeleteProps {
    onClose?: () => void;
    onSubmit?: () => void;
    username: string;
}

const ConfirmDelete = ({
    onClose,
    onSubmit,
    username
}: ConfirmDeleteProps) => {
    const [confirm, setConfirm] = useState("")
    const confirmDelete = `delete-${username}`

    return (

        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <div className="w-[550px] p-6 bg-white/90 rounded-md flex flex-col gap-6 font-poppins">
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>Delete Account</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ onClose }>
                        <IoIosClose />
                    </button>
                </div>
                <div className="flex flex-col gap-1 w-9/10 mx-auto text-lg text-center">
                    <p>You are about to delete your account permanently. This will erase all your data and <span className="italic font-bold">cannot be reversed.</span></p>
                    <p>To confirm, type <span className="italic font-bold">{`'${ confirmDelete }'`}</span></p>
                </div>
                <input 
                    type="text" 
                    id="confirm" 
                    name="confirm" 
                    className='w-3/5 mx-auto border-2 border-gray-400 px-2 py-1 rounded-md'
                    value={ confirm } 
                    placeholder='Type Here...' 
                    onChange={ e => setConfirm(e.target.value) }
                />
                <ActionButton 
                    variant="danger" 
                    className="mx-auto"
                    disabled={ !(confirm === confirmDelete) }
                    onClick={ onSubmit }
                >
                    Delete
                </ActionButton> 
            </div>
        </div>
    )
}

export { ConfirmDelete }