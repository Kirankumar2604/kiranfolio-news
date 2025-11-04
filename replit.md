# Kiranfolio - Technology News Aggregation Platform

## Overview
Kiranfolio is a modern, professional tech news aggregation website that provides real-time technology news from around the world. The platform features a sophisticated monochrome design with elegant typography, smooth interactions, and comprehensive category filtering for major tech companies.

## Project Goals
- Deliver a visually stunning news reading experience with professional monochrome styling
- Aggregate technology news from multiple sources via News API
- Enable easy filtering by major tech companies (Google, Apple, Microsoft, Meta, Tesla, Amazon, OpenAI, NVIDIA)
- Provide powerful search functionality for finding specific topics
- Ensure responsive design across all devices with flawless UX

## Recent Changes

### November 4, 2025 - Security Hardening & Replit Setup
- **Security Improvements**: Moved all API integrations to backend for production security
  - Created secure `/api/ai` backend endpoint for Gemini AI integration
  - Removed all frontend API key exposure (VITE_GEMINI_API_KEY)
  - All API keys (NEWS_API_KEY, GEMINI_API_KEY) now managed server-side only
  - Frontend now calls backend endpoints exclusively - no direct external API calls
  - Implemented proper error handling and validation for all backend endpoints
- **Replit Environment Setup**:
  - Configured server to run on port 5000 with 0.0.0.0 binding for Replit webview
  - Set up workflow for development server
  - Configured Replit Secrets for secure API key management
  - Updated deployment configuration for Replit publishing

### November 1, 2025 - Initial MVP Launch
- **Initial MVP Launch**: Built complete news aggregation platform from scratch
  - Implemented schema-first architecture with TypeScript types shared between frontend and backend
  - Created stunning hero section with featured articles and overlay gradients
  - Built comprehensive component library (Header, CategoryFilter, Hero, ArticleGrid, ArticleCard, Footer)
  - Integrated News API with intelligent caching layer for performance
  - Added category filtering for 9 major tech companies
  - Implemented search functionality across all tech news
  - Created beautiful loading skeletons and empty/error states
  - Added comprehensive data-testid attributes for testing
  - Achieved full responsive design from mobile to desktop
  - Successfully passed all end-to-end tests

## User Preferences
- **Design Philosophy**: Classic, professional monochrome color scheme for timeless elegance
- **Content Focus**: Technology news from major companies and innovations
- **UX Priority**: Clean, organized, modern interface that prioritizes readability
- **Target Audience**: Tech enthusiasts who want to stay informed about industry developments

## Project Architecture

### Tech Stack
- **Frontend**: React with TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js with TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components, custom monochrome theme
- **Data Source**: News API for real-time tech news
- **Storage**: In-memory caching for API responses (5-minute TTL)

### Directory Structure
```
client/
  src/
    components/        # Reusable UI components
      Header.tsx       # Sticky header with search
      CategoryFilter.tsx # Category badges filter bar
      Hero.tsx         # Featured article hero section
      ArticleCard.tsx  # Individual article card
      ArticleGrid.tsx  # Article grid layout
      LoadingSkeleton.tsx # Loading state
      EmptyState.tsx   # Error/no-results states
      Footer.tsx       # Footer with links
    pages/
      Home.tsx         # Main homepage
    lib/
      queryClient.ts   # TanStack Query configuration
server/
  routes.ts           # API endpoints and News API integration
shared/
  schema.ts           # Shared TypeScript types and Zod schemas
```

### Key Features

#### 1. Category Filtering
Users can filter news by major tech companies:
- All News (default) - General tech innovations
- Google - Android, Chrome, Alphabet news
- Apple - iPhone, MacBook, iOS updates
- Microsoft - Windows, Azure, Office 365
- Meta - Facebook, Instagram, WhatsApp
- Tesla - Electric vehicles, SpaceX
- Amazon - AWS, Alexa, e-commerce
- OpenAI - ChatGPT, AI developments
- NVIDIA - GPU, AI chips

#### 2. Search Functionality
- Real-time search across all tech news
- Desktop search in header
- Mobile-optimized search with toggle
- Search results displayed in same hero + grid layout

#### 3. Hero Section
- Large featured article with background image
- Gradient overlay for text readability
- Source badge, headline, description, author, and time
- Dual CTAs: "Read Full Article" and "Open in New Tab"
- Fully responsive with different sizing on mobile/tablet/desktop

#### 4. Article Grid
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Article cards with:
  - High-quality images with fallback
  - Source badge overlay
  - Title with hover effect
  - Description excerpt (3 lines)
  - Publication time (relative format)
  - Author information
  - External link indicator on hover
- Smooth hover animations and transitions

#### 5. Performance Optimizations
- 5-minute server-side caching for News API responses
- Skeleton loading states for better perceived performance
- Optimized image loading with fallbacks
- TanStack Query for efficient data fetching and caching

### API Integration & Security

#### Security Architecture
**All API integrations are server-side only for production security:**
- ✅ All API keys stored in environment variables (Replit Secrets)
- ✅ Frontend never has direct access to any API keys
- ✅ All external API calls proxied through secure backend endpoints
- ✅ Proper error handling and validation on all endpoints
- ✅ Rate limiting handled at the backend level

#### Backend API Endpoints

**News API** - `GET /api/news`
- **Query Parameters**:
  - `category`: TechCategory enum (all, google, apple, microsoft, etc.)
  - `q`: Optional search query string
- **Caching**: 5-minute in-memory cache per category/query combination
- **Response**: NewsResponse with articles array
- **Error Handling**: Rate limiting (429), invalid API key (401), network failures (500)

**AI Assistant** - `POST /api/ai`
- **Request Body**: `{ query: string }`
- **Purpose**: Secure proxy for Gemini AI tech news assistant
- **Response**: `{ response: string }` with AI-generated answer
- **Error Handling**: Missing API key (503), invalid query (400), rate limiting (429)
- **Security**: API key never exposed to frontend, all requests validated

#### Environment Variables
- `NEWS_API_KEY`: API key for newsapi.org (required for news features)
- `GEMINI_API_KEY`: API key for Google Gemini (optional, enables AI assistant)
- `SESSION_SECRET`: Session secret for Express (optional)

### Design System

#### Color Palette (Monochrome)
- Light Mode: Clean whites and grays (98% to 12% lightness)
- Dark Mode: Rich blacks and light grays (8% to 92% lightness)
- Semantic colors configured in index.css with automatic dark mode support

#### Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Hierarchy**:
  - Hero headline: 4xl-6xl, bold, tight leading
  - Article titles: xl-2xl, semibold
  - Body text: base, normal weight, relaxed leading
  - Meta information: sm, medium weight

#### Spacing & Layout
- Consistent spacing scale: 4, 6, 8, 12, 16, 20, 24 (Tailwind units)
- Max content width: 7xl (1280px)
- Section padding: 8-12 (py-8 md:py-12)
- Card gaps: 6-8 (gap-6 md:gap-8)

### Testing
- **Test Coverage**: End-to-end tests using Playwright
- **Test IDs**: Comprehensive data-testid attributes on all interactive elements
- **Tested Scenarios**:
  - Homepage loading and hero display
  - Category filtering (all categories)
  - Search functionality
  - Article card interactions
  - Responsive design
  - Error and empty states

## Future Enhancements
- Bookmarking functionality for saving favorite articles
- Date range filtering and relevance sorting
- Trending topics section
- RSS feed integration for additional sources
- Social sharing capabilities
- Dark mode toggle (currently auto-detects system preference)
- Pagination or infinite scroll for more articles
- Article reading time estimates
- Newsletter subscription

## Development Guidelines
- Follow the monochrome color scheme defined in index.css
- Use Shadcn UI components for consistency
- Maintain comprehensive data-testid coverage for testing
- Ensure all new features work across mobile, tablet, and desktop
- Keep loading and error states polished and user-friendly
- Follow the schema-first approach for new data models
- Cache API responses appropriately to avoid rate limits

## Deployment
The application is ready for deployment on Replit's publishing platform. The News API key is configured via Replit Secrets for secure production usage.
