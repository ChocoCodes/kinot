import { useState, useEffect } from 'react'
import { GoPlus } from "react-icons/go";
import { financeMeta } from './home-page';
import { toUpper } from '@utils/helpers'
import { Header } from "@components/layouts/_components"
import { SearchBar } from "@components/shared/_components";
import { CriteriaDropdown, CSVButton } from '@components/transaction-page/_components';
import { useTransactions } from '@hooks/use-transactions'

const FILTERS = Object.keys(financeMeta).map(filter => toUpper(filter))
const SORT_OPTIONS = [
    'category',
    'amount',
    'method',
    'date'
].map(options => toUpper(options))

function TransactionPage() {
    const { transactions, fetchTransactions } = useTransactions()
    const [filterBy, setFilterBy] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [query, setQuery] = useState("")

    useEffect(() => {
        fetchTransactions()
    }, [])

    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins gap-4'>
            <Header />
            <section className='w-7/10 mx-auto flex flex-col gap-6'>
                <div className="flex w-full justify-between items-center">
                    <h1 className='text-4xl font-bold'>Transaction Logs</h1>
                    <button 
                        className='inline-flex justify-between items-center gap-2 text-xl text-white bg-black rounded-md px-4 py-1 hover:cursor-pointer'
                    >
                        <GoPlus />New
                    </button>
                </div>
                <div className="flex w-full justify-between items-center gap-4">
                    <SearchBar 
                        criteria={"Description"} 
                        onChange={ setQuery }
                    />
                    <div className='flex gap-4'>
                        <CriteriaDropdown 
                            options={ FILTERS }
                            label={"Filter By"}
                            value={ filterBy }
                            onChange={ setFilterBy }
                        />
                        <CriteriaDropdown 
                            options={ SORT_OPTIONS }
                            label={"Sort By"}
                            value={ sortBy }
                            onChange={ setSortBy }
                        />
                        <CSVButton transactions={ transactions }/>
                    </div>
                </div>
            </section>
        </main>
    )
}

export { TransactionPage }