import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
    criteria: string;
    onChange: (query: string) => void;
}

const SearchBar = ({ criteria, onChange }: SearchBarProps) => {
    return (
        <div className="relative w-1/4">
            <input 
                type="text" 
                placeholder={`Search ${ criteria }`}
                onChange={ e => onChange(e.target.value) }
                className="w-full h-10 px-2 border-1 border-gray-400 focus:border-black rounded-sm placeholder-ph-gray font-medium"
            />
            <IoSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-ph-gray"/>
        </div>
    )
}


export { SearchBar }