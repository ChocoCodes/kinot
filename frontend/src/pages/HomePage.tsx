import { Header } from '@components/layouts/components'
import { useUserFinance } from '@hooks/useUserFinance';
import { FinanceCard } from '@components/homepage/components'
import { financeMeta } from '@utils/config';

function HomePage() {
    const { userData } = useUserFinance()
    return (
        <main className='flex flex-col w-screen h-screen mx-auto font-poppins'>
            <Header />
            <section className='w-7/10 mx-auto flex justify-between py-4'>
                { Object.entries(financeMeta).map(([key, cfg] )=> (
                    <FinanceCard
                        key={ key }
                        cardTitle= { cfg.title }
                        icon={ cfg.icon }
                        bgColor={ cfg.bgColor }
                        borderColor={ cfg.borderColor }

                    />
                ))}
            </section>
        </main>
    )
}

export { HomePage }