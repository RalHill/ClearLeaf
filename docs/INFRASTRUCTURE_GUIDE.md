# ClearLeaf Development Infrastructure & Best Practices

Complete guide to the testing, performance, accessibility, and CI/CD infrastructure built into ClearLeaf.

## 📋 Table of Contents
1. [Testing Framework](#testing-framework)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Accessibility](#accessibility)
4. [Performance](#performance)
5. [Component Documentation](#component-documentation)
6. [Pre-commit Hooks](#pre-commit-hooks)
7. [Deployment](#deployment)

---

## Testing Framework

### Jest + React Testing Library

**Setup Files:**
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup

**Running Tests:**
```bash
npm test                    # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
```

**Test Structure:**
```
├── app/dashboard/chat/page.test.tsx
├── lib/__tests__/
└── components/__tests__/
```

**Writing Tests:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'

describe('Component Name', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('result')).toBeInTheDocument()
  })
})
```

**Coverage Goals:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

---

## CI/CD Pipeline

### GitHub Actions Workflow

**Location:** `.github/workflows/ci-cd.yml`

**Triggers:**
- Push to `main` and `develop`
- Pull requests to `main` and `develop`

**Jobs:**
1. **Lint & Type Check** - ESLint + TypeScript
2. **Unit Tests** - Jest + Coverage
3. **Build** - Next.js build validation
4. **Security** - npm audit
5. **Accessibility** - Basic checks
6. **Deploy Preview** - PR deployments
7. **Deploy Production** - Main branch deployments

**Required Environment Variables:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
GITHUB_TOKEN (auto-supplied)
```

**Adding to GitHub:**
1. Push code to main branch
2. Go to Settings → Secrets and Variables → Actions
3. Add the three Vercel secrets
4. Workflow runs automatically on push/PR

---

## Accessibility

### Accessibility Standards

**Target:** WCAG 2.1 AA compliance

**Key Files:**
- `docs/ACCESSIBILITY_GUIDE.md` - Complete guide
- `lib/accessibility.ts` - ARIA labels & utilities

### Implementation Checklist

✅ **Semantic HTML**
- Use proper heading hierarchy (h1, h2, h3)
- Use `<button>` for clickable elements
- Use semantic landmarks (`<nav>`, `<main>`, etc.)

✅ **ARIA Labels**
- All buttons have `aria-label`
- Form inputs have associated labels
- Live regions marked with `aria-live`

✅ **Keyboard Navigation**
- All interactive elements accessible via Tab
- Logical focus order
- Escape closes modals

✅ **Color Contrast**
- All text meets 4.5:1 contrast ratio (AA)
- No information conveyed by color alone

✅ **Screen Reader Support**
- Skip-to-content link
- Form error announcements
- Loading status updates

### Testing Accessibility

```bash
# Manual testing
- Test with Tab/Shift+Tab keyboard navigation
- Test with VoiceOver (Mac) or NVDA (Windows)
- Zoom to 200% - should remain readable
- Use browser DevTools accessibility tree

# Automated testing
npm install --save-dev @axe-core/cli
npx axe https://localhost:3000
```

---

## Performance

### Performance Budgets

| Metric | Target |
|--------|--------|
| FCP (First Contentful Paint) | < 1.2s |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| JS Bundle (gzipped) | < 150KB |
| Chat TTFT (Time to First Token) | < 800ms |

### Bundle Analysis

```bash
npm run bundle-analyze    # Analyze bundle size
npm run build             # Standard build
```

**Output:** `.next/static/chunks/` - inspect chunk sizes

### Optimization Strategies

1. **Code Splitting**
   - Use `next/dynamic` for heavy components
   - Route-based splitting is automatic

2. **Image Optimization**
   - Use Next.js `Image` component
   - AVIF/WebP formats
   - Lazy load below-fold images

3. **Caching**
   - Static pages: ISR with `revalidate`
   - Dynamic pages: `use cache` directive
   - Browser cache via headers

4. **Monitoring**
   - Lighthouse audits (Chrome DevTools)
   - Sentry performance tracking
   - PostHog analytics

---

## Component Documentation

### Storybook

**Start Storybook:**
```bash
npm run storybook          # Dev server on port 6006
npm run build-storybook   # Build static docs
```

**Story Structure:**
```typescript
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Chat/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ChatInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { disabled: false }
}

export const Disabled: Story = {
  args: { disabled: true }
}
```

**Creating Stories:**
1. Create file: `ComponentName.stories.tsx` next to component
2. Export Meta config and Story variants
3. Run `npm run storybook` to preview
4. Stories auto-document in `/docs`

---

## Pre-commit Hooks

### Husky + Lint-Staged

**Configuration Files:**
- `.lintstagedrc.json` - Staged file rules
- `.husky/pre-commit` - Pre-commit hook

**What Runs Before Commit:**
1. ESLint on `.ts`/`.tsx` files
2. Prettier formatting
3. Type checking

**Setup:**
```bash
npx husky install        # Initialize hooks
npm install             # Install pre-commit hook
```

**Bypassing (not recommended):**
```bash
git commit --no-verify
```

---

## Deployment

### Vercel Configuration

**File:** `vercel.json`

**Key Sections:**
- Build command: `next build`
- Environment variables (mapped to secrets)
- Cache headers for static assets
- Function timeouts (60s for API routes)

**Environment Variables:**
Set in Vercel Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENROUTER_API_KEY
STRIPE_SECRET_KEY
INNGEST_EVENT_KEY
...
```

**Deployment Flow:**
1. Push to GitHub
2. GitHub Actions runs CI/CD
3. On PR: Vercel creates preview deployment
4. On merge to main: Vercel deploys to production

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Run tests
npm run test:watch

# Start Storybook
npm run storybook

# Check types
npm run type-check

# Lint code
npm run lint
```

### Before Pushing Code

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm test

# Build test (catches runtime issues)
npm run build

# Visual check in Storybook
npm run storybook
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes (pre-commit hooks run automatically)
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request
# GitHub Actions runs CI checks
# Vercel creates preview deployment
# Review and merge
```

---

## Troubleshooting

### Tests Failing

```bash
# Clear cache
npm run test -- --clearCache

# Run with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- path/to/test.tsx
```

### Build Issues

```bash
# Clean build
rm -rf .next
npm run build

# Check type errors
npm run type-check

# View bundle size
npm run bundle-analyze
```

### Pre-commit Hook Issues

```bash
# See what's being linted
npm run lint

# Format code
npx prettier --write .

# Check git hooks
ls -la .husky/

# Reinstall hooks
npx husky install
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Storybook for Next.js](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [Vercel Deployment](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/actions)

---

## Next Steps

1. **Before Public Launch (MVP):**
   - ✅ Set up Jest + tests
   - ✅ Configure GitHub Actions
   - ✅ Implement accessibility
   - ✅ Set up Storybook
   - ⚠️ Run full accessibility audit with axe CLI
   - ⚠️ Test on production-like environment

2. **Post-MVP (Month 2):**
   - E2E tests with Playwright
   - Integration test coverage
   - Performance monitoring in production
   - User accessibility feedback

3. **Scale (Month 3+):**
   - Automated accessibility testing in CI
   - Quarterly security audits
   - Performance profiling
   - Load testing for traffic spikes
