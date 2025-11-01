import { categoryConfig, type TechCategory } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  activeCategory: TechCategory;
  onCategoryChange: (category: TechCategory) => void;
}

const categories: TechCategory[] = [
  "all",
  "google",
  "apple",
  "microsoft",
  "meta",
  "tesla",
  "amazon",
  "openai",
  "nvidia",
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-16 md:top-20 z-40 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <Badge
                  key={category}
                  variant={isActive ? "default" : "secondary"}
                  className="cursor-pointer px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 no-default-active-elevate"
                  onClick={() => onCategoryChange(category)}
                  data-testid={`button-category-${category}`}
                >
                  {categoryConfig[category].label}
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
