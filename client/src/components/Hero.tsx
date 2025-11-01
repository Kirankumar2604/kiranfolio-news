import { type NewsArticle } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HeroProps {
  article: NewsArticle;
}

export function Hero({ article }: HeroProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  const defaultImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1600&q=80";
  const imageUrl = article.urlToImage || defaultImage;

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        data-testid="img-hero-background"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full min-h-[500px] md:min-h-[600px] flex flex-col justify-end pb-12 md:pb-16">
        <div className="max-w-4xl space-y-6">
          <Badge 
            variant="secondary" 
            className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-primary-border"
            data-testid="badge-hero-source"
          >
            {article.source.name}
          </Badge>

          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            data-testid="text-hero-title"
          >
            {article.title}
          </h1>

          {article.description && (
            <p 
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl"
              data-testid="text-hero-description"
            >
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2" data-testid="text-hero-time">
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
            {article.author && (
              <span data-testid="text-hero-author">By {article.author}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button 
              asChild
              size="lg"
              className="bg-primary/90 backdrop-blur-sm border-primary-border hover:bg-primary"
              data-testid="button-hero-read"
            >
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="bg-background/10 backdrop-blur-md border-white/20 text-white hover:bg-background/20"
              data-testid="button-hero-external"
            >
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
