import { useState } from 'react'
import { Header } from '@components/layouts/_components'
import { IoIosAdd }  from "react-icons/io"
import { MdEdit } from "react-icons/md"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { BsDashLg } from "react-icons/bs";
import { type FinanceMeta } from '@type/types'
import { 
    useDashboard, 
    useUpdateFinance 
} from '@hooks/_hooks'
import { 
    FinanceCard, 
    Form, 
    Section, 
} from '@components/home-page/_components'
import {
    GoalCard,
    TransactionTable
} from '@components/shared/_components'

export const financeMeta = {
    savings: {
        title: "Savings",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-green',
        borderColor: 'border-2 border-outl-green',
        percentageKey: 'savings_pct',
    },
    allowance: {
        title: "Allowance",
        icon: <MdEdit />,
        bgColor: 'bg-fill-blue',
        borderColor: 'border-2 border-outl-blue',
        percentageKey: null,
    },
    expenses: {
        title: "Expenses",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-red',
        borderColor: 'border-2 border-outl-red',
        percentageKey: 'spendings_pct',
    },
} as const;

function HomePage() {
    const [activeForm, setActiveForm] = useState<FinanceMeta | null>(null)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const { userData, fetchData } = useDashboard()
    const { updateFinance } = useUpdateFinance()

    const { finances, transactions = [], goals = [] } = userData || {}
    
    const handleClose = () => setIsVisible(false)

    return (
        <main className='flex flex-col w-full h-screen mx-auto font-poppins gap-3'>
            <Header />
            <Section>
                <div className="flex justify-between">
                    {Object.entries(financeMeta).map(([key, config]) => {
                        const cardKey = key as FinanceMeta
                        const current = finances?.current
                        const previous = finances?.previous

                        const currentAmount = current?.[cardKey] ?? 0.0
                        const previousAmount = previous?.[cardKey] ?? 0.0

                        const percentageIcon = currentAmount > previousAmount ? <FaArrowTrendUp /> : 
                                            currentAmount < previousAmount ? <FaArrowTrendDown /> : <BsDashLg /> 

                        const percentage = (config.percentageKey && finances) ? finances[config.percentageKey] ?? 0.0 : 0.0

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
                </div>
            </Section>
            <Section
                title={ "Recent Transactions" } 
                route={ "/transactions" } 
            >
                <TransactionTable data={ transactions } />
            </Section>
            <Section
                title={ "My Goals" } 
                route={ "/transactions" } 
            >
                {goals.length === 0 ? (
                    <p className="text-xl text-center">No goals found. Add your first goal!</p>
                ) : (
                    goals.map(goal => {
                        return <GoalCard key={goal.id} {...goal} />
                    })
                )}
            </Section> 
            {(activeForm && isVisible) && 
                <Form 
                    formTitle={ activeForm } 
                    handleOnClose={ handleClose } 
                    handleSubmit={ updateFinance }
                    refetch={ fetchData }
                />
            }
        </main>
    )
}

export { HomePage }