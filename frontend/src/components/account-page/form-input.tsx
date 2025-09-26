interface FormInputProps {
    label: string;
    type?: string;
    id: string;
    value?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
    id,
    label,
    type = "text",
    value,
    placeholder,
    onChange
}: FormInputProps) => {
    return (
        <div className='flex flex-col gap-1 w-1/2'>
            <label htmlFor={ id } className="text-2xl font-semibold">{ label }</label>
            <input 
                type={ type } 
                name={ id } 
                id={ id } 
                value={ value || "" }
                placeholder={ placeholder }    
                onChange={ onChange }
                className="h-10 px-2 border-1 border-gray-400 focus:border-black rounded-md placeholder-ph-gray" 
            />
        </div>
    )
}

export { FormInput }