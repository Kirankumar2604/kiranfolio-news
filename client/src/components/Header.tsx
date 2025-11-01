import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FullScreenSearch } from "@/components/FullScreenSearch";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const [isFullScreenSearchOpen, setIsFullScreenSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleFullScreenSearch = (query: string) => {
    setLocalQuery(query);
    onSearch?.(query);
  };

  const openFullScreenSearch = () => {
    setIsFullScreenSearchOpen(true);
  };

  const closeFullScreenSearch = () => {
    setIsFullScreenSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2" data-testid="link-home">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg md:text-xl">K</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Kiranfolio</h1>
              </a>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div 
                onClick={openFullScreenSearch}
                className="w-full relative cursor-pointer group"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background hover:bg-accent hover:border-accent-foreground/20 transition-all flex items-center text-sm text-muted-foreground cursor-text"
                >
                  Search or ask AI anything...
                </div>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={openFullScreenSearch}
              data-testid="button-search-toggle"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <FullScreenSearch
        isOpen={isFullScreenSearchOpen}
        onClose={closeFullScreenSearch}
        initialQuery={localQuery}
        onSearch={handleFullScreenSearch}
      />
    </>
  );
}
