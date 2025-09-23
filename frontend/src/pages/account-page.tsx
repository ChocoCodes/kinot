import { useState } from 'react'
import { Header } from "@components/layouts/_components"

function AccountPage() {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    return (
        <main className='flex flex-col gap-2 w-screen h-screen font-poppins overflow-x-hidden'>
            <Header />
            <section className="flex flex-col w-7/10 mx-auto gap-6 py-3">
                <h1 className='text-4xl font-bold'>Account Management</h1>
                <div className='flex flex-col gap-6'>
                    {/* Personal Information */}
                    <div className="flex gap-6">
                        <img src="" alt="" className="rounded-md bg-red-300 w-48 h-48" />
                        <div className='flex flex-col gap-3'>
                            <p className='text-3xl font-semibold'>Username</p>
                            <button className='px-4 py-2 text-lg bg-black text-white rounded-sm'>Change Image</button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-1/2'>
                        <label htmlFor="username" className="text-2xl font-semibold">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            className="h-10 px-2 border-1 border-gray-400 focus:border-black rounded-md placeholder-ph-gray"
                            value={"Username"}
                            placeholder={"Sample Value"}
                        />
                    </div>
                    <div className='flex flex-col gap-1 w-1/2'>
                        <label htmlFor="fullname" className="text-2xl font-semibold">Full Name</label>
                        <input 
                            type="text" 
                            name="fullname" 
                            id="fullname" 
                            className="h-10 px-2 border-1 border-gray-400 focus:border-black rounded-md placeholder-ph-gray" 
                            value={"Full Name"}
                            placeholder={"Sample Value"}    
                        />
                    </div>
                    <div>
                        <button className='px-4 py-2 bg-black text-white rounded-sm w-1/10'>Save</button>
                    </div>
                </div>
                {/* Change Password */}
                <div className='flex flex-col gap-3'>
                    <p className="text-4xl font-semibold">Password</p>
                    <button 
                        className='px-4 py-2 bg-black text-white rounded-sm w-1/10'
                        onClick={ () => setIsPasswordVisible(!isPasswordVisible) }
                    >
                        { isPasswordVisible ? "Hide" : "Change" }
                    </button>
                    { isPasswordVisible && (
                        <div className="flex w-4/5 gap-5 justify-center items-end">
                            <div className="flex flex-col gap-1 w-1/2">
                                <label htmlFor="current" className="text-xl">Current</label>
                                <input 
                                    type="password" 
                                    name="current" 
                                    id="current" 
                                    className="h-10 p-2 border border-gray-400 focus:border-black rounded-md placeholder-ph-gray" 
                                    placeholder="********"    
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <label htmlFor="new" className="text-xl">Enter New</label>
                                <input 
                                    type="password" 
                                    name="new" 
                                    id="new" 
                                    className="h-10 p-2 border border-gray-400 focus:border-black rounded-md placeholder-ph-gray" 
                                    placeholder="********"    
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <label htmlFor="confirm" className="text-xl">Confirm New</label>
                                <input 
                                    type="password" 
                                    name="confirm" 
                                    id="confirm" 
                                    className="h-10 p-2 border border-gray-400 focus:border-black rounded-md placeholder-ph-gray" 
                                    placeholder="********"    
                                />
                            </div>
                            <button className='px-4 py-2 bg-black text-white rounded-sm w-1/3 h-10'>Save</button>
                        </div>
                    )}
                </div>
                {/* Divider */}
                <div className='w-full h-2 bg-dark-gray rounded-full my-3'></div>
                {/* Delete Account */}
                <div className="flex flex-col gap-3 items-start">
                    <h1 className='font-semibold text-4xl'>Delete Account</h1>
                    <div className='text-xl'>
                        <p>Would you like to delete your account?</p>
                        <p>All data linked to this account will be permanently deleted.</p>
                        <p className='font-semibold'>This is an irreversible action!</p>
                    </div>
                    <button className='py-3 bg-[#D66A6A] text-[#FBF5F5] rounded-sm text-lg w-1/10'>Yes, Delete</button>
                </div>
            </section>
        </main>
    )
}

export { AccountPage }