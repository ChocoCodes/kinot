import { financeMeta } from "@pages/home-page";
import { toTitle } from '@utils/helpers';

type CategoryTagProps = {
    category: string;
    tagKey: keyof typeof financeMeta | 'goals';
}

const colorSettings: Record<keyof typeof financeMeta | 'goals', string> =  {
    'savings': 'bg-fill-green',
    'allowance': 'bg-fill-blue',
    'expenses': 'bg-fill-red',
    'goals': 'bg-yellow-100',
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category, tagKey }) => {
    return (
        <p className={`py-3 ${colorSettings[tagKey] ?? 'bg-gray-400'} rounded-full `}>{ toTitle(category) ?? "N/A" }</p>
    )
}

export default CategoryTag