import { useAuth } from '@context/auth-context'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = {
    home: '/home',
    transactions: '/transactions',
    goals: '/goals'
}

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const toUpper = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

    return (
        <header className='flex w-7/10 h-15 justify-between items-center py-10 px-3 mx-auto text-lg'>
            <div className="flex">
                <Link to='/account'>
                    <div className="flex gap-3 justify-center hover:underline items-center">
                        <img src={ user?.profilePath } alt={ `Image of ${ user?.username }` } className='w-11 h-11 rounded-full object-cover' />
                        <p className=''>{ user?.username }</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-1 gap-15 justify-center items-center">
                { Object.entries(NAV_ITEMS).map(([key, value]) =>(
                    <Link 
                        key={key} 
                        to={value}
                        className={`${ location.pathname === value ? 'border-b-black border-b-2': 'hover:-translate-y-[2px]'} h-full py-2 transform transition-transform duration-300 `}
                    >
                        { toUpper(key) }
                    </Link>
                ))}
            </div>
            <button 
                className='w-30 py-2 bg-[#1A1A1A] text-white rounded-md hover:cursor-pointer hover:bg-black'
                onClick={ logout }
            >
                Sign Out
            </button>
        </header>
    )
}

export default Header