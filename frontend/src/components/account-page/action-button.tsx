interface ActionButtonProps { 
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "danger";
    className?: string;
    type?: "button" | "submit";
    disabled?: boolean;
}

const ActionButton = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false
}: ActionButtonProps) => {
    const base = 'px-4 py-2 rounded-sm transition-colors hover:cursor-pointer'
    const scheme = {
        primary: 'bg-black text-white',
        danger: 'bg-[#D66A6A] text-[#FBF5F5]'
    }
    return (
        <button
            type={ type }
            onClick={ onClick }
            className={`${ base } ${ scheme[variant] } ${ className }`}
            disabled={ disabled }
        >
            { children }
        </button>
    )
}


export { ActionButton }