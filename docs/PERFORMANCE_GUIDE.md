// Performance optimization guide

export const performanceGuide = {
  bundleSize: {
    target: "< 150KB gzipped",
    analysis:
      "Run: npm run build -- --analyze or ANALYZE=true npm run build",
    tools: ["next/bundle-analyzer", "webpack-bundle-analyzer", "source-map-explorer"],
  },

  codeSplitting: {
    dynamic: `
      import dynamic from 'next/dynamic';
      
      const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
        loading: () => <div>Loading...</div>,
        ssr: false,
      });
    `,
    lazyRoutes: `
      // Automatic route-based code splitting in Next.js App Router
      // Each route gets its own bundle
    `,
  },

  imageOptimization: {
    formats: ["image/avif", "image/webp", "image/png"],
    sizes: "100vw",
    quality: 75,
    example: `
      <Image
        src="/logo.png"
        alt="Logo"
        width={128}
        height={128}
        priority={isAboveFold}
        quality={75}
      />
    `,
  },

  caching: {
    staticPage: `
      export const revalidate = 3600; // ISR: revalidate every hour
    `,
    dynamicData: `
      export const revalidate = 0; // No caching
    `,
  },

  metrics: {
    fcp: "< 1.2s (First Contentful Paint)",
    lcp: "< 2.5s (Largest Contentful Paint)",
    cls: "< 0.1 (Cumulative Layout Shift)",
    ttfb: "< 600ms (Time To First Byte)",
    ttft: "< 800ms (Time To First Token - AI chat)",
  },

  tools: {
    lighthouse: "Chrome DevTools built-in - free",
    webVitals: "npm install web-vitals",
    sentry: "Real user monitoring",
    speedCurve: "Continuous performance monitoring",
    databox: "Dashboard monitoring",
  },

  recommendations: [
    "Use next/dynamic for component lazy loading",
    "Implement route-based code splitting (automatic in App Router)",
    "Optimize images: use AVIF/WebP, compress with sharp",
    "Tree-shake unused dependencies",
    "Use Tailwind's purge for unused CSS",
    "Enable gzip compression at Vercel",
    "Minimize JavaScript: Remove debug code, unused imports",
    "Defer non-critical JavaScript",
    "Use Service Workers for offline support (post-MVP)",
    "Implement virtualization for large lists",
  ],

  webVitals: {
    fcp: "First Contentful Paint - when first pixel appears",
    lcp: "Largest Contentful Paint - main content visible",
    cls: "Cumulative Layout Shift - unexpected layout changes",
    fid: "First Input Delay - responsiveness to interaction",
    ttfb: "Time To First Byte - server response time",
  },
};

// Next.js specific optimizations
export const nextjsOptimizations = {
  useCacheDirective: `
    // app/dashboard/news/page.tsx
    import { unstable_cache } from 'next/cache';
    
    export default async function NewsPage() {
      const cachedNews = await unstable_cache(
        async () => {
          return await fetchNews();
        },
        ['news'],
        { revalidate: 3600, tags: ['news'] }
      )();
      
      return <NewsFeed data={cachedNews} />;
    }
  `,

  serverComponents: `
    // Fetch data on server, not client
    // This reduces JavaScript shipped to browser
    async function ChatHistory() {
      const messages = await db.messages.findRecent();
      return <MessageList items={messages} />;
    }
  `,

  dynamicImports: `
    import dynamic from 'next/dynamic';
    
    // Heavy component loaded on-demand
    const CompareTable = dynamic(() => import('@/components/CompareTable'), {
      loading: () => <Skeleton />,
      ssr: false,
    });
  `,

  routeHandlers: `
    // Use Route Handlers (app/api/route.ts) instead of older middleware
    // More performant, better error handling
    export async function POST(request: Request) {
      const data = await request.json();
      return Response.json({ success: true });
    }
  `,
};

// Lighthouse performance budget
export const lighthouseBudget = {
  performance: 85,
  accessibility: 90,
  bestPractices: 90,
  seo: 95,
  pwa: 80,
};

// Performance checklist
export const performanceChecklist = [
  { task: "Run Lighthouse audit", priority: "HIGH" },
  { task: "Analyze bundle with webpack-bundle-analyzer", priority: "HIGH" },
  { task: "Test Core Web Vitals on staging", priority: "HIGH" },
  { task: "Optimize above-fold images", priority: "HIGH" },
  { task: "Enable gzip compression", priority: "MEDIUM" },
  { task: "Implement Service Worker", priority: "LOW" },
  { task: "Set up performance monitoring", priority: "MEDIUM" },
  { task: "Audit third-party scripts", priority: "MEDIUM" },
  { task: "Implement request prioritization", priority: "LOW" },
  { task: "Profile runtime performance", priority: "LOW" },
];
