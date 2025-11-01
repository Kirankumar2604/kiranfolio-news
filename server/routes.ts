import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { newsResponseSchema, categoryConfig, type TechCategory } from "@shared/schema";

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(category: string, query: string): string {
  return `${category}:${query}`;
}

function getCachedData(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || "https://newsapi.org/v2";

  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY is not set. News API will not work.");
  }

  app.get("/api/news", async (req, res) => {
    try {
      const category = (req.query.category as TechCategory) || "all";
      const searchQuery = (req.query.q as string) || "";
      
      const cacheKey = getCacheKey(category, searchQuery);
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }

      let query = "";
      
      if (searchQuery) {
        query = searchQuery;
      } else if (category && categoryConfig[category]) {
        query = categoryConfig[category].query;
      } else {
        query = categoryConfig.all.query;
      }

      const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          q: query,
          apiKey: NEWS_API_KEY,
          language: "en",
          sortBy: "publishedAt",
          pageSize: 30,
        },
        timeout: 10000,
      });

      const validatedData = newsResponseSchema.parse(response.data);
      
      const result = {
        ...validatedData,
        articles: validatedData.articles.filter(
          (article) => 
            article.title && 
            article.title !== "[Removed]" &&
            article.description &&
            article.url
        ),
      };

      setCachedData(cacheKey, result);
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching news:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return res.status(429).json({ 
            error: "Rate limit exceeded. Please try again later." 
          });
        }
        if (error.response?.status === 401) {
          return res.status(401).json({ 
            error: "Invalid API key" 
          });
        }
      }
      
      res.status(500).json({ 
        error: "Failed to fetch news articles" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
