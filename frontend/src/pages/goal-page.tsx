import { useState } from 'react'
import { Header } from "@components/layouts/_components"
import { GoPlus } from 'react-icons/go'
import { SearchBar, GoalCard } from '@components/shared/_components'
import { useGoals } from '@hooks/use-goals'
import { AddGoalForm } from '@components/goal-page/_components'

function GoalPage() {
    const { goals, fetchGoals } = useGoals()
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [query, setQuery] = useState("")
    let filtered = goals;

    // Search by title
    if (query) {
        filtered = filtered.filter(goal => goal.title.includes(query))
    }

    return (
        <main className='flex flex-col w-screen h-screen gap-4'>
            <Header />
            <section className='w-7/10 mx-auto flex flex-col gap-8'>
                <div className="flex w-full justify-between items-center">
                    <h1 className='text-4xl font-bold'>My Goals</h1>
                    <button 
                        className='inline-flex justify-between items-center gap-2 text-xl text-white bg-black rounded-md px-4 py-1 hover:cursor-pointer'
                        onClick={ () => setIsFormVisible(true) }
                    >
                        <GoPlus />New
                    </button>
                </div>
                <div className="flex w-full items-start">
                    <SearchBar 
                        criteria={"Goals"} 
                        onChange={ setQuery } 
                    />
                </div>
                <div className="flex justify-between gap-2">
                    {goals.length !== 0 ? filtered.map(goal => (
                        <GoalCard key={goal.id} {...goal} refetch={ fetchGoals }/>
                    )) : (
                        <p className="text-center w-full text-xl">No Goals for now. Add a new one!</p>
                    )}
                </div>
            </section>
            { isFormVisible && (
                <AddGoalForm onClose={ () => setIsFormVisible(false) }/>
            )}
        </main>
    )
}

export { GoalPage }