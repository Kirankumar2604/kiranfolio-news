# Tech News Aggregation Platform - Design Guidelines

## Design Approach
**Reference-Based Approach** drawing inspiration from premium tech news platforms like The Verge, TechCrunch, and Medium's clean editorial layouts, combined with Google News's efficient filtering systems.

## Core Design Principles
1. **Editorial Excellence**: Typography-first design that prioritizes readability and content hierarchy
2. **Information Density**: Maximum content visibility without overwhelming users
3. **Effortless Navigation**: Company filtering should be immediately accessible and intuitive
4. **Professional Restraint**: Clean, sophisticated layouts that convey authority and credibility

## Typography System

**Primary Font**: Inter or SF Pro Display (via Google Fonts CDN)
**Secondary Font**: Georgia or Merriweather for article excerpts

**Hierarchy**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold, leading-tight
- Section Headlines: text-3xl md:text-4xl, font-bold
- Article Titles: text-xl md:text-2xl, font-semibold
- Article Descriptions: text-base md:text-lg, font-normal, leading-relaxed
- Meta Information: text-sm, font-medium (source, date, category)
- Body Text: text-base, leading-relaxed

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, and 24
- Section padding: py-16 md:py-24
- Card spacing: gap-6 md:gap-8
- Content margins: mb-4, mb-6, mb-8
- Container padding: px-4 md:px-6 lg:px-8

**Container Strategy**:
- Maximum width: max-w-7xl mx-auto
- Article content: max-w-4xl mx-auto
- Reading content: max-w-prose

## Page Structure

### 1. Navigation Header (Sticky)
**Height**: h-16 md:h-20
**Layout**: Horizontal flex with logo left, navigation center, search right
**Elements**:
- Logo/Brand name (text-2xl font-bold)
- Primary navigation links (Home, Categories, About)
- Search icon button
- Responsive hamburger menu for mobile

### 2. Hero Section
**Height**: Natural height based on content (min-h-[500px] md:min-h-[600px])
**Layout**: Featured article with large imagery
**Elements**:
- Large featured article image (aspect-ratio: 16/9, w-full, object-cover)
- Overlay gradient for text readability
- Category badge (px-3 py-1, text-sm, rounded-full)
- Headline (text-4xl md:text-5xl lg:text-6xl, font-bold, mb-4)
- Article excerpt (text-lg md:text-xl, mb-6, max-w-3xl)
- Meta info (source, author, date, reading time)
- Primary CTA button with backdrop-blur-md background
- Secondary featured articles (2-3 smaller cards in grid below main hero)

### 3. Category Filter Bar
**Height**: h-auto, sticky positioning below header
**Layout**: Horizontal scrollable chips/pills
**Elements**:
- "All News" default filter
- Company chips: Google, Apple, Microsoft, Meta, Tesla, Amazon, NVIDIA, OpenAI, etc.
- Each chip: px-6 py-3, rounded-full, text-sm font-medium
- Active state: Different treatment with bold text
- Horizontal scroll on mobile, full display on desktop

### 4. Main News Grid
**Layout**: Grid system with varying card sizes
**Desktop**: grid-cols-3 gap-8
**Tablet**: grid-cols-2 gap-6
**Mobile**: grid-cols-1 gap-6

**Article Card Components**:
- Card container: Bordered or subtle shadow, rounded-lg, overflow-hidden
- Article image: aspect-ratio 16/9, object-cover, w-full
- Content padding: p-6
- Category badge: Absolute positioned top-4 left-4 on image
- Title: text-xl md:text-2xl font-semibold, line-clamp-2, mb-3
- Description: text-base, line-clamp-3, mb-4
- Meta row: flex justify-between items-center
  - Source logo/name (text-sm font-medium)
  - Date (text-sm)
  - Reading time (text-sm)
- Hover state: Subtle scale transform (scale-[1.02])

**Grid Variations**:
- Featured cards (span 2 columns): Larger images, more description lines
- Standard cards (1 column): Balanced layout
- Compact cards: Horizontal layout with smaller image for "more news" section

### 5. Sidebar (Desktop Only)
**Width**: w-80 on lg screens
**Position**: Sticky, top-24
**Elements**:
- "Trending Topics" section
  - List of 5-7 trending keywords/topics
  - Small pill tags with article counts
- "Top Sources" section
  - Vertical list of major tech news sources
  - Source logos with article counts
- Newsletter signup card
  - Headline, input field, submit button
  - Compact, non-intrusive design

### 6. Load More / Pagination
**Layout**: Centered button or infinite scroll indicator
**Elements**:
- "Load More Articles" button (px-8 py-4, rounded-lg)
- Or skeleton loading cards during fetch
- Smooth transition animations

### 7. Footer
**Height**: Auto, py-16
**Layout**: 4-column grid on desktop, stacked on mobile
**Sections**:
- About column: Brief description, mission statement
- Categories: Quick links to all company filters
- Resources: Privacy, Terms, Contact, About
- Social links: Icon buttons for social platforms
- Bottom bar: Copyright, Additional links

## Component Library

### Icons
**Library**: Heroicons via CDN (outline and solid variants)
**Usage**:
- Navigation: Bars3Icon, MagnifyingGlassIcon, XMarkIcon
- Categories: Squares2X2Icon, FunnelIcon
- Actions: BookmarkIcon, ShareIcon, ArrowRightIcon
- Meta: ClockIcon, UserIcon, CalendarIcon
**Size**: w-5 h-5 (standard), w-6 h-6 (larger CTAs)

### Search Modal
**Trigger**: Click search icon in header
**Layout**: Full-screen overlay with backdrop blur
**Elements**:
- Large centered search input (text-2xl)
- Recent searches list
- Suggested categories
- Close button (top-right)
- Keyboard shortcut indicator (Cmd+K or Ctrl+K)

### Empty States
**Layout**: Centered content, py-20
**Elements**:
- Icon (w-16 h-16)
- Headline (text-2xl font-semibold)
- Description text
- Suggested action button

### Article Modal/Detail View
**Layout**: Centered modal or new page
**Width**: max-w-4xl
**Elements**:
- Full article image (aspect-ratio 21/9)
- Headline (text-4xl md:text-5xl font-bold)
- Author info with avatar
- Publication meta (source, date, time)
- Article content with proper typography
- Share buttons (fixed or floating)
- Related articles section at bottom

## Responsive Behavior

**Mobile (< 768px)**:
- Single column layouts
- Hamburger menu navigation
- Horizontal scrolling category filters
- Stacked article cards
- Full-width images
- Larger touch targets (min-h-12)

**Tablet (768px - 1024px)**:
- 2-column article grid
- Condensed sidebar or bottom placement
- Balanced image-to-text ratios

**Desktop (> 1024px)**:
- 3-column article grid with sidebar
- Full navigation visible
- Larger featured sections
- Richer hover interactions

## Interaction Patterns

**Minimal Animations**:
- Card hover: subtle scale and shadow increase (transition-transform duration-200)
- Category selection: smooth background transition
- Modal appearance: fade + slide from center
- Loading states: skeleton screens, not spinners

**Microinteractions**:
- Bookmark toggle animation
- Share button copy confirmation
- Search input focus state expansion
- Smooth scrolling for anchor links

## Images

**Hero Image**: 
Large, high-impact tech photography or illustration representing cutting-edge technology (circuit boards, AI visualization, sleek devices). Aspect ratio 21/9 or 16/9, full-width with overlay gradient for text contrast.

**Article Cards**:
Each article includes a thumbnail image (16:9 aspect ratio) showing relevant tech products, company logos, or abstract tech imagery. Images should be high-quality, consistent in treatment.

**Featured Section**:
2-3 secondary featured articles below main hero, each with prominent imagery.

## Accessibility

- Semantic HTML5 structure (article, section, nav, aside)
- ARIA labels for interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Alt text for all images
- Sufficient contrast ratios maintained through grayscale palette
- Screen reader friendly meta information