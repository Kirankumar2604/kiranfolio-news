import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type TechCategory, type NewsResponse } from "@shared/schema";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Hero } from "@/components/Hero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<TechCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const buildQueryUrl = () => {
    const params = new URLSearchParams();
    params.append("category", activeCategory);
    if (searchQuery) {
      params.append("q", searchQuery);
    }
    return `/api/news?${params.toString()}`;
  };

  const { data, isLoading, error } = useQuery<NewsResponse>({
    queryKey: [buildQueryUrl()],
  });

  const handleCategoryChange = (category: TechCategory) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory("all");
  };

  const handleReset = () => {
    setActiveCategory("all");
    setSearchQuery("");
  };

  const articles = data?.articles || [];
  const hasNoResults = !isLoading && articles.length === 0;
  const [heroArticle, ...restArticles] = articles;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
      />
      
      <main className="flex-1">
        {isLoading && <LoadingSkeleton />}
        {error && <EmptyState type="error" onReset={handleReset} />}
        {hasNoResults && <EmptyState type="no-results" onReset={handleReset} />}
        {!isLoading && !error && articles.length > 0 && (
          <>
            {heroArticle && <Hero article={heroArticle} />}
            {restArticles.length > 0 && <ArticleGrid articles={restArticles} />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
