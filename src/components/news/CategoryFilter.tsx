import { NewsCategory } from "../../types/news";
import { categoryColors } from "../../utils/newsUtils";

interface CategoryFilterProps {
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories: NewsCategory[] = [
  "all",
  "technology",
  "sports",
  "business",
  "entertainment",
  "food",
  "politics",
  "custom",
];

export const CategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => {
        const colors = categoryColors[category];
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? `${colors.bg} ${colors.text} ${colors.border} border-2`
                : `${colors.chip.bg} ${colors.chip.text} ${colors.chip.border} border hover:${colors.hover}`
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        );
      })}
    </div>
  );
};

