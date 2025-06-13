interface TabProps {
    currentTab: string;
    onChangeTab: (tab: 'login' | 'register') => void;
}

const Tabs = ({ currentTab, onChangeTab }: TabProps) => {
    return (
        <div className="flex w-[270px] items-left justify-between font-poppins font-medium text-[32px] mb-10">
            <button 
                className={`${currentTab == 'login' ? 'border-b-3': 'border-0'} py-2 hover:cursor-pointer`}
                onClick={() => onChangeTab('login')}
            >
                Login
            </button>
            <button                 
                className={`${currentTab == 'register' ? 'border-b-3': 'border-0'} py-2 hover:cursor-pointer`}
                onClick={() => onChangeTab('register')}
            >
                Register
            </button>
        </div>
    )
}

export default Tabs