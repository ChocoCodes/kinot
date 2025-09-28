import { RiArrowDownSLine } from "react-icons/ri";
import { toUpper } from "@utils/helpers";

interface CriteriaDropdownProps {
    options: string[];
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const CriteriaDropdown = ({
    options,
    label,
    value,
    onChange
}: CriteriaDropdownProps) => {
    return (
        <div className="relative">
            <select 
                value={ value } 
                onChange={ e => onChange(e.target.value) }
                className='border-2 border-ph-gray rounded-sm px-2 text-ph-gray font-medium appearance-none h-10 w-[110px]'
            >
                <option value="">{ label }</option>
                {options.map(option => (
                    <option key={ option } value={ option } className="text-black">{ toUpper(option) }</option>                
                ))}
            </select>
            <RiArrowDownSLine className='absolute right-2 top-1/2 -translate-y-1/2 text-ph-gray'/>
        </div>
    )
}


export { CriteriaDropdown }