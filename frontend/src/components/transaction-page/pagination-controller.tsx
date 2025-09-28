import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

interface PageControllerProps {
    totalPage: number;
    tablePage: number;
    onPrev: () => void;
    onNext: () => void;
}

const PaginationController = ({
    tablePage,
    totalPage,
    onPrev,
    onNext
}: PageControllerProps) => {
    const prevDisabled = tablePage === 1
    const nextDisabled = tablePage === totalPage 
    return (
        <div className="flex gap-4 justify-end items-center text-xl">
            <button 
                className={`p-2 text-white bg-black rounded-sm hover:cursor-pointer ${ prevDisabled ? 'hidden' : 'block' }`}
                onClick={ onPrev }
                disabled={ prevDisabled }
            >
                <MdOutlineKeyboardDoubleArrowLeft />
            </button>
            <span>{ tablePage } of { totalPage }</span>
            <button 
                className={`p-2 text-white bg-black rounded-sm hover:cursor-pointer ${ nextDisabled ? 'hidden' : 'block' }`}
                onClick={ onNext }
                disabled={ nextDisabled }
            >
                <MdOutlineKeyboardDoubleArrowRight />
            </button>
        </div>
    )
}

export { PaginationController }