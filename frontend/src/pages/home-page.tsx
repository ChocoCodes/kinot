import { useState } from 'react'
import { Header } from '@components/layouts/components'
import { useUserDashboard } from '@hooks/use-user-dashboard'
import { FinanceCard, Form, TransactionTable, Section } from '@components/home-page/components'
import { IoIosAdd }  from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { BsDashLg } from "react-icons/bs";
import { useUpdateFinance } from '@hooks/use-update-finance'


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
    const { userData } = useUserDashboard()
    const { updateFinance } = useUpdateFinance()

    const finances = userData?.finances
    const transactions = userData?.transactions || []
    const goals = userData?.goals || []
    
    console.log("Goals: ", goals)
    //console.log(finances);
    //console.log(transactions);
    //console.log(userData?.transactions[0].created_at)

    const handleClose = () => {
        setIsVisible(!isVisible)
    }

    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins gap-3'>
            <Header />
            <section className='w-7/10 mx-auto flex justify-between py-4'>
                {Object.entries(financeMeta).map(([key, config]) => {
                    const cardKey = key as keyof typeof financeMeta
                    const current = finances?.current
                    const previous = finances?.previous

                    const currentAmount = current?.[cardKey] ?? 0.0
                    const previousAmount = previous?.[cardKey] ?? 0.0

                    const percentageIcon = currentAmount > previousAmount ? <FaArrowTrendUp /> : 
                                           currentAmount < previousAmount ? <FaArrowTrendDown /> : <BsDashLg /> 

                    const percentage = (() => {
                        if (cardKey === 'savings') return finances?.savings_pct ?? 0.0
                        if (cardKey === 'expenses') return finances?.spendings_pct ?? 0.0
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
            <Section
                title={ "Recent Transactions" } 
                route={ "/transactions" } 
            >
                <TransactionTable data={ transactions } />
            </Section>
            {/* TODO: Add Goal Cards */}
            <Section
                title={ "My Goals" } 
                route={ "/transactions" } 
            >
                <TransactionTable data={ transactions } />
            </Section> 
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