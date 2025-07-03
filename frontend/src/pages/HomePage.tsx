import { useState } from 'react'
import { Header } from '@components/layouts/components'
import { useUserFinance, type UserFinanceData } from '@hooks/useUserFinance'
import { useAuth } from '@context/AuthContext'
import { FinanceCard, Form } from '@components/homepage/components'
import { IoIosAdd } from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { BsDashLg } from "react-icons/bs";

export const financeMeta = {
    savings: {
        title: "Savings",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-green',
        borderColor: 'border-2 border-outl-green',
    },
    allowance: {
        title: "Allowance",
        icon: <MdEdit />,
        bgColor: 'bg-fill-blue',
        borderColor: 'border-2 border-outl-blue',
    },
    expenses: {
        title: "Expenses",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-red',
        borderColor: 'border-2 border-outl-red',
    },
} as const;

function HomePage() {
    const [activeForm, setActiveForm] = useState<keyof typeof financeMeta | null>(null)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { userData } = useUserFinance()
    const { user } = useAuth() 

    const handleClose = () => setIsVisible(!isVisible)
    const handleSubmit = async <T,>(route: string, payload: T): Promise<T> => {
        try {
            const response = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(payload),
            })

            if(!response.ok) {
                console.error('ResponseNotOkError[HOME]: ', response.status, await response.text())
                throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error("PostRequestError[HOME]: ", error)
            throw error
        }
    }

    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins'>
            <Header />
            <section className='w-7/10 mx-auto flex justify-between py-4'>
                { userData ? Object.entries(financeMeta).map(([key, cfg]) => {
                    const cardKey = key as keyof typeof financeMeta;
                    const percentage = userData[`${cardKey}PCT` as keyof UserFinanceData] as number ?? 0.0;
                    const currentAmount = userData[cardKey as keyof UserFinanceData] as number ?? 0.0;
                    const previousAmount = Math.round(currentAmount / (1 + percentage / 100)) ?? 0.0;

                    return (
                        <FinanceCard
                            key={ key }
                            cardTitle={ cfg.title }
                            icon={ cfg.icon }
                            bgColor={ cfg.bgColor }
                            borderColor={ cfg.borderColor }
                            onIconClick={ () => {
                                setActiveForm(cardKey)
                                setIsVisible(true)
                            }}
                            percentage={ percentage }
                            currentAmount={ currentAmount }
                            previousAmount={ previousAmount }
                            percentageIcon={ 
                                currentAmount > previousAmount ? 
                                    <FaArrowTrendUp /> : 
                                currentAmount < previousAmount ? 
                                    <FaArrowTrendDown /> : <BsDashLg /> 
                            }
                        />
                    )}
                ) : (
                    <p>No Data Found.</p>
                )}
            </section>
            { (activeForm === 'allowance' && isVisible) && 
                <Form 
                    formTitle={ activeForm } 
                    handleOnClose={ handleClose } 
                    handleSubmit={ handleSubmit }
                /> 
            }
            { (activeForm === 'expenses' && isVisible) && 
                <Form 
                    formTitle={ activeForm } 
                    handleOnClose={ handleClose }
                    handleSubmit={ handleSubmit }
                /> }
            { (activeForm === 'savings' && isVisible) && 
                <Form 
                    formTitle={ activeForm } 
                    handleOnClose={ handleClose } 
                    handleSubmit={ handleSubmit }
                /> 
            }
        </main>
    )
}

export { HomePage }