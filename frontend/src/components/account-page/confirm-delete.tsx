import { IoIosClose } from "react-icons/io";
import { ActionButton } from "./_components";

interface ConfirmDeleteProps {
    onClose?: () => void;
    onSubmit?: () => void;
}

const ConfirmDelete = ({
    onClose,
    onSubmit
}: ConfirmDeleteProps) => {
    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <div className="w-[500px] p-6 bg-white/90 rounded-md flex flex-col gap-6 font-poppins">
                <div className="flex w-9/10 justify-between mx-auto items-center text-xl font-semibold pb-4 border-b-2 border-gray-400">
                    <p>Delete Account</p>
                    <button className="text-3xl hover:cursor-pointer" type="button" onClick={ onClose }>
                        <IoIosClose />
                    </button>
                </div>
                <p className="w-9/10 mx-auto text-xl text-center">Are you sure? This action is irreversible.</p>
                <ActionButton 
                    variant="danger" 
                    onClick={ onSubmit }
                    className="w-9/10 mx-auto"
                >
                    Delete My Account
                </ActionButton>
            </div>
        </div>
    )
}

export { ConfirmDelete }