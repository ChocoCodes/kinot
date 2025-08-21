import { Link } from 'react-router-dom'

interface SectionProps {
    title?: string;
    route?: string;
    children: React.ReactNode;
}

const Section = ({ title, route, children }: SectionProps) => {
    return (
        <section className="w-7/10 mx-auto flex flex-col gap-4 text-black p-6">
            { (title && route) && (
                <div className="w-full flex justify-between items-center mx-auto">
                    <p className="font-bold text-3xl">{ title }</p>
                    <Link to={ route } className='text-xl'>View All</Link>
                </div>
            )}
            { children }
        </section>
    )
}

export default Section