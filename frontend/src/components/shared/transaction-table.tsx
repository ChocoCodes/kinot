import { toUpper, formatDate } from '@utils/helpers'
import { CategoryTag } from '@components/home-page/_components'
import { financeMeta } from '@pages/home-page';
import type { Transaction } from '@type/types'
import type React from 'react';

interface TransactionTableProps {
  data: Transaction[];
}

const COLUMNS = ['id', 'category', 'amount', 'method', 'description', 'created_at']

const TransactionTable = ({ data }: TransactionTableProps) => {

    const getCellComponent = (col: string, row: Transaction): React.ReactNode => {
        if (col === 'created_at') {
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

    console.log(data)
    return (
        <table className="w-full mx-auto text-center text-xl font-poppins rounded-lg border-separate bg-light-gray border-2 border-dark-gray drop-shadow-md">
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
                { data.length > 0 ? data.map((row, index) => (
                    <tr key={index}>
                        {COLUMNS.map(col => (
                            <td key={col} className={`${col === 'id' ? 'w-[90px]' : ''} truncate text-ellipsis py-3 text-lg`}>
                                { getCellComponent(col, row) }
                            </td>
                        ))}
                    </tr>
                )) : (                    
                    <tr>
                        <td colSpan={ COLUMNS.length } className='py-2 text-center text-lg'>No transactions available.</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export { TransactionTable }