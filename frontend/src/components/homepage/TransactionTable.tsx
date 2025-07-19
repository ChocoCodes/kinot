interface Column {
    header: string;
}

interface TransactionTableProps<T> {
  columns: Column[];
  data: Record<string, T>[];
}

const TransactionTable = <T,> ({ columns, data }: TransactionTableProps<T | undefined>) => {
    return (
        <table className="w-7/10 mx-auto text-center text-xl font-poppins bg-red-200 rounded-lg border-collapse">
            <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.header} className="font-normal py-2">{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                { data.length > 0 ? data.map((row, index) => (
                    <tr key={index}>
                        {columns.map(col => (
                            <td key="col.header">
                                { row[col.header] as React.ReactNode }
                            </td>
                        ))}
                    </tr>
                )) : (                    
                    <tr>
                        <td colSpan={ columns.length }>No data available.</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default TransactionTable