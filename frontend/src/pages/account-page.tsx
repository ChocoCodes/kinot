import { useState, useEffect, useRef } from 'react'
import { Header } from "@components/layouts/_components"
import { useUpdateAccount } from '@hooks/use-update-account'
import type { AccountInfo, PasswordInfo } from '@type/types'
import { passRegexp } from '@utils/helpers'
import { useToast } from '@context/toast-context'
import { 
    FormInput, 
    ActionButton, 
    ConfirmDelete 
} from '@components/account-page/_components'

function AccountPage() {
    const { 
        deleteAccount, 
        fetchAccount, 
        updateAccount, 
        accountData,
        updatePassword
    } = useUpdateAccount()
    const { addToast } = useToast()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isVisible, setIsVisible] = useState<"passwordChange" | "deleteModal" | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [formData, setFormData] = useState<AccountInfo>({
        username: "",
        fullname: "",
        imgPath: "",
    })
    const [passwordChange, setPasswordChange] = useState<PasswordInfo>({
        current: "",
        new: "",
        confirm: "",
    })

    useEffect(() => {
        fetchAccount()
    }, [])

    useEffect(() => {
        if (accountData) {
            setFormData(accountData)
        }
    }, [accountData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, target: "info" | "password") => {
       const { name, value } = e.target
       if (target === "info") {
           setFormData(prev => ({ ...prev, [name]: value }))
           return
       }
       if (target === "password") {
           setPasswordChange(prev => ({ ...prev, [name]: value }))
           return
       }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return 

        const file = e.target.files[0]
        setSelectedImage(file)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const payload = new FormData()
            payload.append('username', formData.username)
            payload.append('fullname', formData.fullname)
            if (selectedImage) {
                payload.append('image', selectedImage)
            }
            
            updateAccount(payload)
            fetchAccount()
            setSelectedImage(null)
        } catch (error: unknown) {
            console.error(`[UPDATE_ACCOUNT_ERROR]: ${ error instanceof Error ? error.message : 'Unknown error occured. '}`)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (passwordChange.new !== passwordChange.confirm) {
            addToast('New password and confirmation do not match!', "danger")
            setPasswordChange(prev => ({
                ...prev,
                new: "",
                confirm: ""
            }))
            return;
        }

        const payload: Omit<PasswordInfo, 'confirm'> =  {
            current: passwordChange.current,
            new: passwordChange.new
        }
    
        try {
            const response = await updatePassword(payload)
            if(response.ok) {
                setPasswordChange(prev => ({
                    ...prev,
                    new: "",
                    confirm: ""
                }))
            }
            const data = await response.json()
            addToast(data.message, response.ok ? "primary" : "danger")
        } catch (error: unknown) {
            addToast(error instanceof Error ? error.message :  'An unknown error occurred.', "danger")
        }
    }

    return (
        <main className='flex flex-col gap-2 w-screen h-screen font-poppins overflow-x-hidden'>
            <Header />
            <section className="flex flex-col w-7/10 mx-auto gap-6 py-3">
                <h1 className='text-4xl font-bold'>Account Management</h1>
                {/* Personal Information */}
                <form 
                    onSubmit={ handleUpdate }
                    className='flex flex-col gap-6'
                >
                    <div className="flex gap-6">
                        <img 
                            src={ selectedImage ? URL.createObjectURL(selectedImage) : formData.imgPath } 
                            alt={`Image of ${ accountData.fullname }`} 
                            className="rounded-md bg-red-300 w-48 h-48 object-cover" 
                        />
                        <div className='flex flex-col gap-3'>
                            <p className='text-3xl font-semibold'>{ accountData.username }</p>
                            <input 
                                type="file" 
                                name="image" 
                                id="image" 
                                className="hidden" 
                                ref={ fileInputRef }
                                accept="image/png, image/jpg"
                                onChange={ handleImageChange }
                            />
                            <ActionButton
                                type="button"
                                onClick={ () => fileInputRef.current?.click() }
                                className='w-[150px]'
                            >
                                Change Image
                            </ActionButton>
                        </div>
                    </div>
                    <FormInput id={"username"} label={"Username"} value={ formData.username } placeholder={ accountData.username } onChange={ (e) => handleChange(e, "info") }/>
                    <FormInput id={"fullname"} label={"Full Name"} value={ formData.fullname } placeholder={ accountData.fullname } onChange={ (e) => handleChange(e, "info") }/>
                    <div>
                        <ActionButton type="submit" className={'w-1/10'} >
                            Save
                        </ActionButton>
                    </div>
                </form>
                {/* Change Password */}
                <div className='flex flex-col gap-3'>
                    <p className="text-4xl font-semibold">Password</p>
                    <ActionButton 
                        className='w-1/10'
                        onClick={ 
                            () => setIsVisible(prev => prev === "passwordChange" ? null : "passwordChange") 
                        }
                    >
                        { isVisible === "passwordChange" ? "Hide" : "Change" }
                    </ActionButton>
                    { isVisible === "passwordChange" && (
                        <form 
                            onSubmit={ handlePasswordSubmit }
                            className="flex w-4/5 gap-5 justify-center items-end"
                        >
                            <FormInput
                                id={"current"} 
                                label={"Enter Current"} 
                                type={"password"} 
                                placeholder={'********'} 
                                value={ passwordChange.current }
                                onChange={ (e) => handleChange(e, "password") } 
                            />
                            <FormInput 
                                id={"new"} 
                                label={"Enter New"} 
                                type={"password"} 
                                placeholder={'********'} 
                                value={ passwordChange.new }
                                onChange={ (e) => handleChange(e, "password") } 
                                pattern={ passRegexp }
                            />
                            <FormInput 
                                id={"confirm"} 
                                label={"Confirm New"} 
                                type={"password"} 
                                placeholder={'********'} 
                                value={ passwordChange.confirm }
                                onChange={ (e) => handleChange(e, "password") } 
                            />
                            <ActionButton 
                                type="submit" 
                                className='w-1/3 h-10'
                            >
                                Update
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
                        onClick={
                            () => setIsVisible(prev => prev === "deleteModal" ? null : "deleteModal")
                         }
                    >
                        Yes, Delete
                    </ActionButton>
                    { isVisible === "deleteModal" && (
                        <ConfirmDelete 
                            onClose={
                                () => setIsVisible(null)
                            } 
                            onSubmit={ deleteAccount }
                        />
                    )}
                </div>
            </section>
        </main>
    )
}

export { AccountPage }