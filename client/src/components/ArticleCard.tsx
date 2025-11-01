import { type NewsArticle } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: NewsArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  const defaultImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80";
  const imageUrl = article.urlToImage || defaultImage;

  const articleId = article.url.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);

  return (
    <Card 
      className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-200"
      data-testid={`card-article-${articleId}`}
    >
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block h-full"
        data-testid={`link-article-${articleId}`}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
            data-testid={`img-article-${articleId}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="bg-background/90 backdrop-blur-sm"
              data-testid={`badge-source-${articleId}`}
            >
              {article.source.name}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 
            className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors"
            data-testid={`text-title-${articleId}`}
          >
            {article.title}
          </h3>

          {article.description && (
            <p 
              className="text-muted-foreground mb-4 line-clamp-3 text-base"
              data-testid={`text-description-${articleId}`}
            >
              {article.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2" data-testid={`text-time-${articleId}`}>
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
            {article.author && (
              <span 
                className="truncate max-w-[150px]"
                data-testid={`text-author-${articleId}`}
              >
                {article.author}
              </span>
            )}
          </div>
        </div>
      </a>
    </Card>
  );
}
