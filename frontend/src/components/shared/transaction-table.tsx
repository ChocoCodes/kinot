import { toUpper, formatDate } from '@utils/helpers'
import { CategoryTag } from '@components/home-page/_components'
import { financeMeta } from '@pages/home-page';
import type { TransactionData, Transaction } from '@type/types'
import type React from 'react';

interface TransactionTableProps {
  data: TransactionData[];
}

const COLUMNS = [
    'id',
    'category',
    'amount',
    'method',
    'description',
    'date',
]

const TransactionTable = ({ data }: TransactionTableProps) => {
    const transactions: Transaction[] = data.map(({ user_id, ...rest }) => rest) 

    const getCellComponent = (col: string, row: Transaction): React.ReactNode => {
        if (col === 'date') {
            return formatDate(row.created_at)
        }
        if (col === 'category') {
            return (
                <CategoryTag 
                    category={ row.category }
                    tagKey={ row.category.toLowerCase() as keyof typeof financeMeta }
                />
            )
        }
        return row[col as keyof Transaction] as React.ReactNode;
    }

    console.log(transactions)
    return (
        <table className="w-full mx-auto text-center text-xl font-poppins rounded-xl border-separate bg-light-gray border-2 border-dark-gray drop-shadow-md">
            <thead>
                <tr>
                    {COLUMNS.map(col => (
                        <th 
                            key={ col } 
                            className={`font-normal py-2 ${col === 'id' ? 'w-[90px]' : 'w-[150px]'} text-xl py-2`}>
                                { toUpper(col) }
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className='divide-x divide-dark-gray'>
                { transactions.length > 0 ? transactions.map((row, index) => (
                    <tr key={index}>
                        {COLUMNS.map(col => (
                            <td key={col} className={`${col === 'id' ? 'w-[90px]' : ''} truncate text-ellipsis py-3 text-xl`}>
                                {getCellComponent(col, row)}
                            </td>
                        ))}
                    </tr>
                )) : (                    
                    <tr>
                        <td colSpan={ COLUMNS.length } className='py-2'>No transactions available.</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export { TransactionTable }