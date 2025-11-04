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
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY is not set. News API will not work.");
  }

  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. AI features will not work.");
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

  // AI endpoint - secure backend proxy for Gemini API
  app.post("/api/ai", async (req, res) => {
    try {
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ 
          error: "AI service is not configured. Please set GEMINI_API_KEY." 
        });
      }

      const { query } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ 
          error: "Query parameter is required and must be a non-empty string" 
        });
      }

      // Add context to make AI focus on news and tech
      const contextualPrompt = `You are a tech news assistant. Only answer questions related to technology, news, tech companies, innovations, or current events. 
If the question is not related to news or technology (like booking tickets, cooking recipes, etc.), politely respond: "I'm a tech news assistant. I can only help with technology and news-related questions. Please ask something about tech news, companies, or innovations."

User question: ${query}`;

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [
                {
                  text: contextualPrompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        res.json({ 
          response: response.data.candidates[0].content.parts[0].text 
        });
      } else {
        throw new Error("Invalid response format from AI API");
      }
    } catch (error) {
      console.error("AI request failed:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return res.status(429).json({ 
            error: "AI rate limit exceeded. Please try again later." 
          });
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          return res.status(401).json({ 
            error: "Invalid AI API key" 
          });
        }
      }
      
      res.status(500).json({ 
        error: "Failed to process AI request" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
