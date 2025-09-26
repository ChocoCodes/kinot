import { useState } from 'react'
import { Header } from "@components/layouts/_components"
import { useUpdateAccount } from '@hooks/use-update-account'
import { FormInput, ActionButton } from '@components/account-page/_components'

type AccountInfo = {
    username: string;
    fullname: string;
    imgPath: string;
}

type PasswordInfo = {
    current: string;
    new: string;
    confirm: string;
}

type AccountData = AccountInfo & PasswordInfo;

const defaultAccountData: AccountData = {
    username: "",
    fullname: "",
    imgPath: "",
    current: "",
    new: "",
    confirm: ""
}

function AccountPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [formData, setFormData] = useState<AccountData>(defaultAccountData)
    const { handleDelete } = useUpdateAccount()
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = e.target
       setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <main className='flex flex-col gap-2 w-screen h-screen font-poppins overflow-x-hidden'>
            <Header />
            <section className="flex flex-col w-7/10 mx-auto gap-6 py-3">
                <h1 className='text-4xl font-bold'>Account Management</h1>
                {/* Personal Information */}
                <form className='flex flex-col gap-6'>
                    <div className="flex gap-6">
                        <img src="" alt="" className="rounded-md bg-red-300 w-48 h-48" />
                        <div className='flex flex-col gap-3'>
                            <p className='text-3xl font-semibold'>Username</p>
                            <button className='px-4 py-2 text-lg bg-black text-white rounded-sm'>Change Image</button>
                        </div>
                    </div>
                    <FormInput id={"username"} label={"Username"} value={ formData.username } placeholder={ formData.username } onChange={ handleChange }/>
                    <FormInput id={"fullname"} label={"Full Name"} value={ formData.fullname } placeholder={ formData.fullname } onChange={ handleChange }/>
                    <div>
                        <ActionButton onClick={() => {}} className={'w-1/10'} >
                            Save
                        </ActionButton>
                    </div>
                </form>
                {/* Change Password */}
                <div className='flex flex-col gap-3'>
                    <p className="text-4xl font-semibold">Password</p>
                    <ActionButton 
                        className='w-1/10'
                        onClick={ () => setIsPasswordVisible(!isPasswordVisible) }
                    >
                        { isPasswordVisible ? "Hide" : "Change" }
                    </ActionButton>
                    { isPasswordVisible && (
                        <form 
                            className="flex w-4/5 gap-5 justify-center items-end"
                        >
                            <FormInput id={"current"} label={"Current"} type={"password"} placeholder={'********'} onChange={ handleChange } />
                            <FormInput id={"new"} label={"Enter New"} type={"password"} placeholder={'********'} onChange={ handleChange } />
                            <FormInput id={"confirm"} label={"Confirm New"} type={"password"} placeholder={'********'} onChange={ handleChange } />
                            <ActionButton 
                                type="submit" 
                                className='w-1/3 h-10'
                                onClick={() => {}}
                            >
                                Save
                            </ActionButton>
                        </form> 
                    )}
                </div>
                {/* Divider */}
                <div className='w-full h-2 bg-dark-gray rounded-full my-3'></div>
                {/* Delete Account */}
                <div className="flex flex-col gap-4 items-start">
                    <h1 className='font-semibold text-4xl'>Delete Account</h1>
                    <div className='text-xl'>
                        <p>Would you like to delete your account?</p>
                        <p>All data linked to this account will be permanently deleted.</p>
                        <p className='font-semibold'>This is an irreversible action!</p>
                    </div>
                    <ActionButton 
                        variant="danger"
                        className='py-3 text-lg w-3/25'
                        onClick={ handleDelete }
                    >
                        Yes, Delete
                    </ActionButton>
                </div>
            </section>
        </main>
    )
}

export { AccountPage }