import { financeMeta } from "@pages/home-page"

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
    console.log(`Category ${category}, TagKey ${tagKey}`)
    return (
        <p className={`py-3 ${colorSettings[tagKey]} rounded-full `}>{ category ?? "N/A" }</p>
    )
}

export default CategoryTag