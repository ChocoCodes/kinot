import { Link } from 'react-router-dom'

interface SectionProps {
    title: string;
    route: string;
    children: React.ReactNode;
}

const Section = ({ title, route, children }: SectionProps) => {
    return (
        <section className="w-full mx-auto flex flex-col gap-4 text-black">
            <div className="w-7/10 flex justify-between items-center mx-auto">
                <p className="font-bold text-3xl">{ title }</p>
                <Link to={ route } className='text-xl'>View All</Link>
            </div>
            { children }
        </section>
    )
}

export default Section