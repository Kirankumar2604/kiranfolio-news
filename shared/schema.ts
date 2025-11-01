import { z } from "zod";

export const newsArticleSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  content: z.string().nullable(),
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;

export const newsResponseSchema = z.object({
  status: z.string(),
  totalResults: z.number(),
  articles: z.array(newsArticleSchema),
});

export type NewsResponse = z.infer<typeof newsResponseSchema>;

export const techCategory = z.enum([
  "all",
  "google",
  "apple",
  "microsoft",
  "meta",
  "tesla",
  "amazon",
  "openai",
  "nvidia",
]);

export type TechCategory = z.infer<typeof techCategory>;

export const categoryConfig: Record<TechCategory, { label: string; query: string }> = {
  all: { label: "All News", query: "technology OR AI OR machine learning OR innovation" },
  google: { label: "Google", query: "Google OR Alphabet OR Android OR Chrome" },
  apple: { label: "Apple", query: "Apple OR iPhone OR MacBook OR iOS OR iPadOS" },
  microsoft: { label: "Microsoft", query: "Microsoft OR Windows OR Azure OR Office 365" },
  meta: { label: "Meta", query: "Meta OR Facebook OR Instagram OR WhatsApp OR Oculus" },
  tesla: { label: "Tesla", query: "Tesla OR SpaceX OR Elon Musk electric vehicle" },
  amazon: { label: "Amazon", query: "Amazon OR AWS OR Alexa OR Amazon Web Services" },
  openai: { label: "OpenAI", query: "OpenAI OR ChatGPT OR GPT OR artificial intelligence" },
  nvidia: { label: "NVIDIA", query: "NVIDIA OR GPU OR graphics card OR AI chip" },
};
