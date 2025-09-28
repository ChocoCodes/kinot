import type { TransactionData } from '@type/types'
import { useToast } from '@context/toast-context'
import { FiDownload } from "react-icons/fi";

interface CSVButtonProps {
    transactions: TransactionData[];
}

const CSVButton = ({ transactions }: CSVButtonProps) => {
    const { addToast } = useToast()
    
    const handleCSVExport = () => {
        // No need to extract CSV since there is no transactions
        if(transactions.length === 0) {
            addToast("No transactions found for export!", "danger")
            return
        }
        // Extract all keys for CSV header
        const headers = Object.keys(transactions[0])
        // Construct and join CSV rows
        const rows = [
            headers,
            ...transactions.map(transaction => 
                headers.map(key => transaction[key as keyof TransactionData])
            )
        ]
        const csvString = rows.map(row => row.join(',')).join('\n')
        // Create CSV File as BLOB and Download
        const csvBlob = new Blob([csvString], { type: 'text/csv' })

        const url = URL.createObjectURL(csvBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transaction-log-${ new Date().getTime() }.csv`

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <button
            type="button"
            onClick={ handleCSVExport }
            className="hover:cursor-pointer bg-black text-white px-4 h-10 rounded-sm inline-flex items-center gap-2"
        >
            <FiDownload />Export to CSV
        </button>
    )
}

export { CSVButton }