import { useState, useEffect } from 'react'
import { GoPlus } from "react-icons/go";
import { financeMeta } from './home-page';
import { Header } from "@components/layouts/_components"
import { useTransactions } from '@hooks/use-transactions'
import { 
    SearchBar, 
    TransactionTable 
} from "@components/shared/_components";
import { 
    CriteriaDropdown, 
    CSVButton,
    PaginationController,
    AddTransactionForm
} from '@components/transaction-page/_components';

const FILTERS = [...Object.keys(financeMeta), 'goals'];
const SORT_OPTIONS = [
    'amount',
    'date'
];

function TransactionPage() {
    const LIMIT = 10;
    const [tablePage, setTablePage] = useState(1);
    const [filterBy, setFilterBy] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [query, setQuery] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { transactions, fetchTransactions } = useTransactions();
    let filtered = transactions;

    const handleClose = async () => {
        setIsFormVisible(false);
        await fetchTransactions();
    }
    
    // Filtering
    if(filterBy) {
        filtered = filtered.filter(transaction => transaction.category.toLowerCase() === filterBy);
    }
    // Searching
    if(query) {
        filtered = filtered.filter(transaction => transaction.description.toLowerCase().includes(query.toLowerCase()));
    }
    // Sorting
    if(sortBy) {
        if (sortBy === "amount") {
            filtered = [...filtered].sort((a, b) => b.amount - a.amount);
        } else if (sortBy === "date") {
            filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    }

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const startIndex = (tablePage - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;
    const paginated = filtered.slice(startIndex, endIndex);

    useEffect(() => {
        setTablePage(1);
    }, [filterBy, query, sortBy]);

    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins gap-4 overflow-x-hidden'>
            <Header />
            <section className='w-7/10 mx-auto flex flex-col gap-8 py-6'>
                <div className="flex w-full justify-between items-center">
                    <h1 className='text-4xl font-bold'>Transaction Logs</h1>
                    <button 
                        className='inline-flex justify-between items-center gap-2 text-xl text-white bg-black rounded-md px-4 py-1 hover:cursor-pointer'
                        onClick={ () => setIsFormVisible(true) }
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
                            onChange={ (val: string) => setFilterBy(val === 'expenses' ? 'spendings' : val) }
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
                <TransactionTable data={ paginated }/>
                { filtered.length !== 0 && (
                    <PaginationController 
                        tablePage={ tablePage } 
                        totalPage={ totalPages } 
                        onPrev={ () => setTablePage(page => Math.max(1, page - 1)) }
                        onNext={ () => setTablePage(page => Math.min(totalPages, page + 1)) }
                    />
                )}
                { isFormVisible && (
                    <AddTransactionForm onClose={ handleClose } />
                )}
            </section>
        </main>
    )
}

export { TransactionPage }