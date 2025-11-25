import { financeMeta } from "@pages/home-page";
import { toTitle } from '@utils/helpers';

type CategoryTagProps = {
    category: string;
    tagKey: keyof typeof financeMeta;
}

const colorSettings: Record<keyof typeof financeMeta, string> =  {
    'savings': 'bg-fill-green',
    'allowance': 'bg-fill-blue',
    'expenses': 'bg-fill-red',
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category, tagKey }) => {
    return (
        <p className={`py-3 ${colorSettings[tagKey]} rounded-full `}>{ toTitle(category) ?? "N/A" }</p>
    )
}

export default CategoryTag