import { Header } from '@components/layouts/components'

function HomePage() {
    return (
        <main className='flex flex-col w-screen h-screen '>
            <Header />
            <p>Dashboard Page</p>
        </main>
    )
}

export { HomePage }