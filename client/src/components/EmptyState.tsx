import { Newspaper, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "no-results" | "error";
  onReset?: () => void;
}

export function EmptyState({ type = "no-results", onReset }: EmptyStateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          {type === "error" ? (
            <Newspaper className="h-10 w-10 text-muted-foreground" />
          ) : (
            <Search className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            {type === "error" ? "Unable to Load News" : "No Articles Found"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            {type === "error" 
              ? "We're having trouble fetching the latest tech news. Please try again later."
              : "We couldn't find any articles matching your criteria. Try a different category or search term."}
          </p>
        </div>

        {onReset && (
          <Button 
            onClick={onReset}
            size="lg"
            data-testid="button-reset-filters"
          >
            View All News
          </Button>
        )}
      </div>
    </div>
  );
}
