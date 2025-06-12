interface TabProps {
    currentTab: string;
    onChangeTab: (tab: 'login' | 'register') => void;
}

const Tabs = ({ currentTab, onChangeTab }: TabProps) => {
    return (
        <div className="flex gap-3 font-poppins font-medium text-[32px]">
            <button 
                className={`${currentTab == 'login' ? 'border-b-3': 'border-0'} px-3 py-2`}
                onClick={() => onChangeTab('login')}
            >
                Login
            </button>
            <button                 
                className={`${currentTab == 'register' ? 'border-b-3': 'border-0'} px-3 py-2`}
                onClick={() => onChangeTab('register')}
            >
                Register
            </button>
        </div>
    )
}

export default Tabs