import { useState } from 'react'
import { Header } from '@components/layouts/components'
import { useUserFinance } from '@hooks/useUserFinance'
import { FinanceCard, Form } from '@components/homepage/components'
import { IoIosAdd }  from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { BsDashLg } from "react-icons/bs";
import { useUpdateFinance } from '@hooks/useUpdateFinance'

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
    const { updateFinance } = useUpdateFinance()
    const handleClose = () => setIsVisible(!isVisible)

    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins'>
            <Header />
            <section className='w-7/10 mx-auto flex justify-between py-4'>
                {Object.entries(financeMeta).map(([key, config]) => {
                    const cardKey = key as keyof typeof financeMeta
                    const current = userData?.current
                    const previous = userData?.previous

                    const currentAmount = current?.[cardKey] ?? 0.0
                    const previousAmount = previous?.[cardKey] ?? 0.0

                    const percentageIcon = currentAmount > previousAmount ? <FaArrowTrendUp /> : 
                                           currentAmount < previousAmount ? <FaArrowTrendDown /> : <BsDashLg /> 

                    const percentage = (() => {
                        if (cardKey === 'savings') return userData?.savings_pct ?? 0.0
                        if (cardKey === 'expenses') return userData?.spendings_pct ?? 0.0
                        return 0.0;
                    })()

                    return (
                        <FinanceCard 
                            key={ key }
                            cardTitle={ config.title }
                            icon={ config.icon }
                            bgColor={ config.bgColor }
                            borderColor={ config.borderColor }
                            onIconClick={() => {
                                setActiveForm(cardKey)
                                setIsVisible(true)
                            }}
                            percentage={ percentage }
                            currentAmount={ currentAmount }
                            previousAmount={ previousAmount }
                            percentageIcon={ percentageIcon }
                        />
                    )
                })}
            </section>
            {(activeForm && isVisible) && 
                <Form 
                    formTitle={ activeForm } 
                    handleOnClose={ handleClose } 
                    handleSubmit={ updateFinance }
                />
            }
        </main>
    )
}

export { HomePage }