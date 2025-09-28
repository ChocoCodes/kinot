
const CSVButton = () => {

    const handleCSVExport = () => {

    }

    return (
        <button
            type="button"
            onClick={ handleCSVExport }
            className="hover:cursor-pointer bg-black text-white px-4 h-10 rounded-sm"
        >
            Export to CSV
        </button>
    )
}

export { CSVButton }