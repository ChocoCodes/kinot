import { IoIosAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";

export const financeMeta = {
    savings: {
        title: "Savings",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-green',
        borderColor: 'border-2 border-outl-green',
    },
    allowance: {
        title: "Allowance",
        icon: <MdEdit />,
        bgColor: 'bg-fill-blue',
        borderColor: 'border-2 border-outl-blue',
    },
    expenses: {
        title: "Expenses",
        icon: <IoIosAdd />,
        bgColor: 'bg-fill-red',
        borderColor: 'border-2 border-outl-red',
    },

} as const;