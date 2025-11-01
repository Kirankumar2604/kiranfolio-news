import { useState, useEffect, useRef } from "react";
import { Search, X, ExternalLink, TrendingUp, Loader2, Sparkles, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { type NewsResponse, type NewsArticle } from "@shared/schema";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Pull Gemini API configuration from Vite environment variables.
// NOTE: Exposing private API keys in client-side code is insecure. Prefer proxying
// requests through the server for any secret keys. These env vars are used here
// for development convenience only.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL ??
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("VITE_GEMINI_API_KEY is not set. AI requests will fail and exposing keys in client is insecure.");
}

interface FullScreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export function FullScreenSearch({ isOpen, onClose, initialQuery = "", onSearch }: FullScreenSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isAnimating, setIsAnimating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string>("");
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false); // Track if AI mode is active
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef<number>(0);

  // Debounce search query - only for normal search mode
  useEffect(() => {
    if (!isAiMode) {
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchQuery, isAiMode]);

  // Fetch search results from API - only in normal search mode
  const { data, isLoading } = useQuery<NewsResponse>({
    queryKey: [`/api/news?q=${debouncedQuery}`],
    enabled: debouncedQuery.trim().length > 0 && !isAiMode,
  });

  const searchResults = data?.articles || [];

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Focus input after animation starts
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Touch handlers for swipe down to close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only track swipes that start near the top of the search box
    const target = e.target as HTMLElement;
    const rect = e.currentTarget.getBoundingClientRect();
    const touchY = e.touches[0].clientY;
    
    // Only allow swipe from top 50px of the search box
    if (touchY - rect.top < 50) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === 0) return; // Not a valid swipe start
    
    const touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchEndY - touchStartY.current;
    
    // If swiped down more than 80px, close the search
    if (swipeDistance > 80) {
      handleClose();
    }
    
    // Reset
    touchStartY.current = 0;
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setSearchQuery("");
      setAiResponse("");
      setShowAiResponse(false);
      setAiError("");
      setIsAiMode(false); // Reset AI mode
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If in AI mode, trigger AI request on Enter
    if (isAiMode) {
      handleAiRequest();
    } else {
      // Normal search mode
      onSearch?.(searchQuery);
      handleClose();
    }
  };

  const handleResultClick = (article: NewsArticle) => {
    // Open the article in a new tab
    window.open(article.url, '_blank');
  };

  const handleAiRequest = async () => {
    if (!searchQuery.trim()) {
      setAiError("Please enter a question first");
      return;
    }

    // If already in AI mode, just make the request
    // Otherwise toggle AI mode on
    if (!isAiMode) {
      setIsAiMode(true);
    }

    setIsAiLoading(true);
    setAiError("");
    setShowAiResponse(true);
    setAiResponse("");

    try {
      // Add context to make AI focus on news and tech
      const contextualPrompt = `You are a tech news assistant. Only answer questions related to technology, news, tech companies, innovations, or current events. 
If the question is not related to news or technology (like booking tickets, cooking recipes, etc.), politely respond: "I'm a tech news assistant. I can only help with technology and news-related questions. Please ask something about tech news, companies, or innovations."

User question: ${searchQuery}`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: contextualPrompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setAiResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("AI request failed:", error);
      setAiError("Sorry, AI couldn't answer your question. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleAiMode = () => {
    if (isAiMode) {
      // Turning off AI mode
      setIsAiMode(false);
      setAiResponse("");
      setShowAiResponse(false);
      setAiError("");
    } else {
      // Turning on AI mode
      setIsAiMode(true);
      setShowAiResponse(true);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay - Click/tap to close */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        onTouchEnd={handleClose}
        role="button"
        aria-label="Close search"
        style={{ cursor: 'pointer' }}
      />

      {/* Search Container */}
      <div
        className={`fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4 transition-all duration-500 pointer-events-none ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="w-full max-w-3xl relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile hint - Tap outside or swipe down to close */}
          <div className="md:hidden text-center mb-2 text-xs text-white/70 flex items-center justify-center gap-1">
            <span>Tap outside or swipe down to close</span>
          </div>

          {/* Search Box */}
          <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
            {/* Swipe indicator - mobile only */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30"></div>
            </div>
            
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center p-4 md:p-6 border-b border-border/50 gap-2">
                <Search className="absolute left-7 md:left-9 h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={isAiMode ? "Ask AI anything..." : "Search news articles..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isAiLoading}
                  className="pl-12 md:pl-16 pr-32 md:pr-36 text-lg md:text-xl h-12 md:h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
                />
                <div className="absolute right-4 md:right-6 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={isAiMode ? "default" : "ghost"}
                    className={`h-9 md:h-10 px-3 md:px-4 gap-2 ${
                      isAiMode 
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white" 
                        : "bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/20"
                    }`}
                    onClick={toggleAiMode}
                    disabled={isAiLoading}
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className={`h-4 w-4 ${isAiMode ? "text-white" : ""}`} />
                    )}
                    <span className="hidden sm:inline text-xs md:text-sm font-medium">
                      {isAiLoading ? "Thinking..." : isAiMode ? "AI Mode" : "Ask AI"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 md:h-10 md:w-10 hover:bg-muted active:bg-muted/80 touch-manipulation"
                    onClick={handleClose}
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>
            </form>

            {/* AI Response Section */}
            {isAiMode && (
              <div className="border-b border-border/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          AI Tech News Assistant
                          <Sparkles className="h-3 w-3 text-purple-500" />
                        </h4>
                      </div>
                      {isAiLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">AI is analyzing your tech question...</p>
                        </div>
                      ) : aiError ? (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <p className="text-sm text-destructive">{aiError}</p>
                        </div>
                      ) : aiResponse ? (
                        <div className="text-sm md:text-base text-foreground leading-relaxed">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Customize markdown elements
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 text-foreground" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 text-foreground" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 text-foreground" {...props} />,
                              p: ({node, ...props}) => <p className="mb-3 text-foreground leading-relaxed" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                              code: ({node, inline, ...props}: any) => 
                                inline ? (
                                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                ) : (
                                  <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3" {...props} />
                                ),
                              a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-3" {...props} />,
                            }}
                          >
                            {aiResponse}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-2">✨ <strong>AI Mode Active</strong></p>
                          <p className="text-xs">Ask me anything about:</p>
                          <ul className="text-xs mt-1 ml-4 space-y-1">
                            <li>• Technology news and trends</li>
                            <li>• Tech companies and innovations</li>
                            <li>• AI, machine learning, blockchain</li>
                            <li>• Latest gadgets and software</li>
                          </ul>
                          <p className="text-xs mt-2 italic">Press Enter or type your question above</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results - Only show in normal search mode */}
            {!isAiMode && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchQuery.trim() === "" ? (
                  <div className="p-8 md:p-12 text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-base md:text-lg">Start typing to search news...</p>
                    <p className="text-sm mt-2 opacity-75">Or click "Ask AI" to get AI-powered answers</p>
                  </div>
                ) : isLoading ? (
                  <div className="p-8 md:p-12 text-center text-muted-foreground">
                    <Loader2 className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 animate-spin" />
                    <p className="text-base md:text-lg">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-8 md:p-12 text-center text-muted-foreground">
                    <Search className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-base md:text-lg">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2 opacity-75">Try a different search term or ask AI</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {searchResults.map((article, index) => (
                      <button
                        key={article.url + index}
                        onClick={() => handleResultClick(article)}
                        className="w-full text-left p-4 md:p-6 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                                {article.source.name}
                              </span>
                            </div>
                            <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
                              {article.description || "No description available"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-muted-foreground/75">
                              <span className="truncate">{new URL(article.url).hostname}</span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer with result count - Only in normal search mode */}
            {!isAiMode && searchResults.length > 0 && !isLoading && (
              <div className="px-4 md:px-6 py-3 border-t border-border/50 bg-muted/20 text-xs md:text-sm text-muted-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-center text-xs md:text-sm text-muted-foreground/75">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close
          </div>
        </div>
      </div>
    </>
  );
}
