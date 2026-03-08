# ClearLeaf Quick Reference Card

## Development Commands

```bash
# Installation
npm install --legacy-peer-deps     # First time setup

# Development
npm run dev                         # Start dev server (localhost:3000)
npm run storybook                  # Start Storybook (localhost:6006)

# Testing
npm test                           # Run tests once
npm run test:watch                # Watch mode
npm run test:coverage             # Coverage report

# Quality
npm run lint                       # ESLint check
npm run type-check                # TypeScript check
npm run build                      # Build test
npm run bundle-analyze            # Bundle size analysis

# Pre-commit (runs automatically)
# Runs: lint + type-check + tests
git commit -m "message"
```

## File Structure Quick Navigation

```
📁 app/                    - Next.js pages
  📁 dashboard/
    📁 chat/               - AI Chat feature
    📁 news/               - News Feed feature
    📁 library/            - Policy Library
    📁 compare/            - Province Comparison
    📁 walkthroughs/       - HR Walkthroughs

📁 components/             - Reusable components
  📁 ui/                   - UI components + ErrorBoundary

📁 lib/                    - Utilities & helpers
  📄 mock-data.ts         - Enhanced demo data
  📄 accessibility.ts     - A11y utilities

📁 docs/                   - Documentation
  📄 INFRASTRUCTURE_GUIDE.md - Complete dev guide
  📄 ACCESSIBILITY_GUIDE.md  - A11y details
  📄 PERFORMANCE_GUIDE.md    - Performance tips

📁 .github/workflows/      - CI/CD pipelines
📁 .storybook/            - Component documentation
📁 .husky/                - Git hooks
```

## Testing Commands Reference

```bash
# Run all tests
npm test

# Run specific file
npm test -- page.test.tsx

# Watch mode (auto re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Clear Jest cache
npm test -- --clearCache

# Verbose output
npm test -- --verbose
```

## Storybook Usage

```bash
# Start Storybook dev server
npm run storybook
# Visit: http://localhost:6006

# Build static docs
npm run build-storybook

# Creating new story:
# 1. Create ComponentName.stories.tsx
# 2. Export Meta and Story variants
# 3. Run npm run storybook
# 4. View in sidebar
```

## Performance Analysis

```bash
# Analyze bundle size
npm run bundle-analyze

# Check current metrics
# FCP: < 1.2s
# LCP: < 2.5s
# CLS: < 0.1
# JS Bundle: < 150KB gzipped

# Use Lighthouse (Chrome DevTools)
# F12 > Lighthouse > Analyze page load
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# (pre-commit hook runs lint + type check + tests)

# Commit (hook prevents bad code)
git commit -m "feat: add new feature"

# If commit fails
# Fix the error and try again
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# GitHub Actions runs CI checks
# Vercel creates preview deployment
```

## Deployment

```bash
# Local testing before deploy
npm run build              # Test build
npm run start              # Run production server

# Deploy to Vercel
# 1. Push to main branch
# 2. GitHub Actions runs tests
# 3. If tests pass, Vercel auto-deploys
# 4. Monitor at vercel.com
```

## Accessibility Testing

```bash
# Manual testing
1. Tab through all elements
2. Test with VoiceOver (Mac) or NVDA (Windows)
3. Zoom to 200% - check readability
4. Use Chrome DevTools accessibility tab

# Automated testing
npm install --save-dev @axe-core/cli
npx axe https://localhost:3000
```

## Environment Variables

```bash
# .env.local (for development)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
INNGEST_EVENT_KEY=
RESEND_API_KEY=
DATABASE_URL=

# Demo mode (leave empty to use mock data)
# If vars missing → app uses mock responses
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Tests fail | `npm test -- --clearCache` |
| Build fails | `rm -rf .next` then `npm run build` |
| Pre-commit hook fails | `npm run lint` and `npm run type-check` |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Module not found | `npm install` and restart dev server |
| Type errors | `npm run type-check` for details |

## Documentation Links

| Resource | Location |
|----------|----------|
| Infrastructure Guide | `docs/INFRASTRUCTURE_GUIDE.md` |
| Accessibility Guide | `docs/ACCESSIBILITY_GUIDE.md` |
| Performance Guide | `docs/PERFORMANCE_GUIDE.md` |
| Component Docs | Storybook (`npm run storybook`) |
| Build Status | `BUILD_STATUS.md` |

## Quick Feature Checklist

- ✅ Jest + React Testing Library
- ✅ GitHub Actions CI/CD
- ✅ WCAG 2.1 AA Accessibility
- ✅ Performance Optimization
- ✅ Storybook Documentation
- ✅ Pre-commit Hooks
- ✅ Error Handling & UI Polish
- ✅ Vercel Configuration
- ✅ Mock Data for Demo
- ✅ Bundle Analysis

## Demo Mode Status

When API keys are missing:
- ✅ App fully functional
- ✅ Chat uses mock responses
- ✅ All navigation works
- ✅ No external API calls
- ✅ Perfect for demos & testing

## Production Checklist

Before launch:
- [ ] All tests passing
- [ ] Lighthouse score > 85
- [ ] Zero linting errors
- [ ] WCAG 2.1 AA audit passed
- [ ] API keys configured in Vercel
- [ ] GitHub Actions secrets set
- [ ] Database migrated
- [ ] Sentry configured
- [ ] PostHog set up
- [ ] Stripe live keys ready

## Support

- 📖 Read: `docs/INFRASTRUCTURE_GUIDE.md`
- 🔍 Search: Grep docs for keywords
- 🧪 Test: `npm run test:watch`
- 📚 Docs: `npm run storybook`

---

**Last Updated:** March 8, 2026
**Status:** Production Ready ✅
