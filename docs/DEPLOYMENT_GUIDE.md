# Deployment Guide

**ClearLeaf MVP — Production Deployment Checklist**

This guide covers deploying ClearLeaf to Vercel for public access.

---

## Pre-Deployment Checklist

### 1. Legal Documents Ready
- [ ] ToS finalized + lawyer reviewed
- [ ] Privacy Policy published
- [ ] E&O Insurance purchased (certificate obtained)
- [ ] CPHR MOU signed (optional but recommended)

### 2. Environment Variables Configured
- [ ] Create `.env.production` (Vercel doesn't read `.env.local`)
- [ ] Supabase Pro plan activated
- [ ] All API keys obtained (OpenRouter, Stripe, etc.)
- [ ] Test all integrations in staging

### 3. Database Ready
- [ ] Supabase migrations pushed
- [ ] Knowledge base ingested (statutes loaded)
- [ ] Embeddings generated for all chunks
- [ ] Golden Q&A test suite: 9/10 pass per province

### 4. Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No console errors in dev mode

### 5. Security Hardened
- [ ] Disclaimers on every page
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Secrets NOT in `.env.local`

### 6. Monitoring Setup
- [ ] Sentry project created + DSN added
- [ ] PostHog project created + key added
- [ ] Error alerts configured
- [ ] Uptime monitoring enabled

---

## Step 1: Prepare Vercel Environment

### 1.1 Create `.env.production` File

```bash
# CORE SERVICES
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI
OPENROUTER_API_KEY=sk-or-xxx...
OPENAI_API_KEY=sk-xxx...

# PAYMENTS
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx...
STRIPE_SECRET_KEY=sk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# EMAIL
RESEND_API_KEY=re_xxx...

# INNGEST (Background Jobs)
INNGEST_API_KEY=xxx...
INNGEST_EVENT_KEY=xxx...

# MONITORING
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx...
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx...

# CONFIG
NEXT_PUBLIC_APP_URL=https://clearleaf.ca
NODE_ENV=production
```

### 1.2 Vercel Project Setup

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Or link existing project
vercel link

# Set environment variables in Vercel Dashboard:
# Dashboard → Settings → Environment Variables
# Paste all vars from .env.production
```

### 1.3 Custom Domain

**Vercel Dashboard → Domains:**
1. Add domain: `clearleaf.ca`
2. Update DNS records (Vercel will provide)
3. Wait for DNS propagation (10–30 min)

---

## Step 2: Supabase Production Hardening

### 2.1 Enable RLS (Row-Level Security)

All user data tables should have RLS enabled:

```sql
-- Verify RLS is enabled
SELECT * FROM pg_class
WHERE relname IN ('user_profiles', 'chat_messages', 'usage_records')
AND relrowsecurity = true;
```

### 2.2 Backup Configuration

Supabase Pro includes daily backups. **Verify in Dashboard:**
- Settings → Backups → Check daily backups enabled
- Retention: 28 days (default)

### 2.3 Connection Pooling (Optional)

If you expect high concurrent users:
- Dashboard → Connection Pooling
- Enable PgBouncer (recommended for Vercel)

### 2.4 Restrict IP Access (Advanced)

For additional security (not required at MVP):
- Supabase → Settings → Network
- Whitelist Vercel IP ranges

---

## Step 3: Stripe Production Setup

### 3.1 Switch to Live Keys

1. **Stripe Dashboard:** Settings → API Keys
2. Copy LIVE keys (blue badges, not test keys)
3. Update Vercel environment variables:
   - `STRIPE_SECRET_KEY` = Live secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = Live publishable key

### 3.2 Webhook Configuration

1. **Stripe Dashboard:** Webhooks
2. Create new webhook endpoint:
   - URL: `https://clearleaf.ca/api/webhooks/stripe`
   - Events to subscribe:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copy webhook signing secret
4. Update `.env.production`:
   - `STRIPE_WEBHOOK_SECRET` = Webhook signing secret

### 3.3 Test Webhook Delivery

```bash
# Simulate test event from Stripe Dashboard
# Webhooks → [Your Endpoint] → Test Signing Secret
# Send a test event; verify it appears in logs
```

### 3.4 Customer Portal

Enable Stripe Customer Portal (users manage subscriptions):
1. Stripe Dashboard → Customer Portal
2. Allow: Subscription updates, billing history
3. Note portal link for user account page

---

## Step 4: Sentry Error Monitoring

### 4.1 Create Sentry Project

1. **sentry.io** → Create Project
2. Select: Node.js + Next.js
3. Copy DSN and Auth Token
4. Update `.env.production`:
   - `NEXT_PUBLIC_SENTRY_DSN` = DSN
   - `SENTRY_AUTH_TOKEN` = Auth token

### 4.2 Configure Alerts

1. **Sentry Dashboard:** Alerts
2. Create alert rule:
   - Condition: New issues
   - Action: Send email to your email
3. Set notification frequency: Immediate

### 4.3 Test Error Tracking

Deploy a test error:
```javascript
// Add to a page component temporarily
throw new Error("Test error for Sentry verification");
```

Deploy → trigger error → verify appears in Sentry

---

## Step 5: PostHog Analytics

### 5.1 Create PostHog Project

1. **posthog.com** → Create Team
2. Select: Next.js
3. Copy API key
4. Update `.env.production`:
   - `NEXT_PUBLIC_POSTHOG_KEY` = API key

### 5.2 Configure Feature Flags

1. **PostHog Dashboard:** Feature Flags
2. Create flags:
   - `enable_quebec_qa`
   - `enable_professional_tier`
   - `enable_walkthrough_export`

---

## Step 6: OpenRouter & AI Setup

### 6.1 Verify Production Keys

1. **OpenRouter.ai** → Dashboard
2. Copy API key for production
3. Update Vercel: `OPENROUTER_API_KEY`

### 6.2 Test AI Integration

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-haiku-3.5",
    "messages": [{"role": "user", "content": "Test"}],
    "max_tokens": 100
  }'
```

---

## Step 7: Final Deployment

### 7.1 Pre-Deploy Test

```bash
# Build locally with production config
NEXT_PUBLIC_SUPABASE_URL=xxx NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx npm run build

# Check build size
npm run build 2>&1 | grep "Total size"
# Target: < 150KB gzipped
```

### 7.2 Deploy to Vercel

```bash
# Push to main branch (Vercel auto-deploys)
git push origin main

# Or deploy from CLI
vercel --prod
```

### 7.3 Verify Deployment

1. Visit https://clearleaf.ca
2. Test landing page loads
3. Test login/signup flow
4. Check Vercel Analytics: Settings → Analytics
5. Verify all API keys working in Sentry/PostHog

### 7.4 Monitor First Hour

- [ ] Check Sentry: any errors?
- [ ] Check PostHog: users landing?
- [ ] Test chat endpoint: working?
- [ ] Test Stripe: test subscription
- [ ] Check email: Resend working?

---

## Step 8: Soft Launch Preparation

### 8.1 Waitlist Activation

1. Notify 200 waitlist users via email (Resend)
2. Provide free Professional access for 30 days
3. Share feedback link
4. Monitor Sentry daily for errors

### 8.2 Launch Communication

- [ ] Blog post: "ClearLeaf is live"
- [ ] LinkedIn: "Exciting news..."
- [ ] Email: Personal note to CPHR contacts
- [ ] Slack: Share with HR tech communities

### 8.3 Daily Monitoring (First Week)

- [ ] Check Sentry alerts
- [ ] Review PostHog: user engagement
- [ ] Read user feedback
- [ ] Monitor Stripe: subscription health
- [ ] Check database: query performance

---

## Step 9: Production Monitoring Setup

### 9.1 Uptime Monitoring

Use Uptime Robot (free tier):
1. Create monitor: https://clearleaf.ca/api/health
2. Alert email: your@email.com
3. Check frequency: Every 5 minutes

### 9.2 Performance Monitoring

**Vercel Dashboard → Analytics:**
- Track: FCP, LCP, CLS
- Alert if performance degrades

### 9.3 Database Monitoring

**Supabase Dashboard → Monitoring:**
- Track: Database size, query performance
- Alert if size > 6GB (Pro plan limit is 8GB)

---

## Step 10: Post-Launch Checklist

### Week 1 After Launch
- [ ] Zero critical errors
- [ ] < 5 users reported bugs
- [ ] Email campaigns sent
- [ ] CPHR engagement confirmed
- [ ] No security issues

### Month 1 After Launch
- [ ] 50–100 active users
- [ ] 5+ paying customers
- [ ] Knowledge base 90%+ accurate (golden Q&A)
- [ ] Stripe webhook 100% reliable
- [ ] All notifications working

### Ongoing
- [ ] Monthly security updates (next upgrade)
- [ ] Weekly backup verification
- [ ] Monthly statute review (update knowledge base)
- [ ] Quarterly insurance renewal

---

## Rollback Procedure

If critical error detected:

```bash
# Revert to previous deployment
vercel rollback

# Or manually:
vercel --prod --prebuilt=[previous build id]

# Check Vercel Dashboard → Deployments
# Click [arrow] → Promote to production
```

---

## Emergency Contacts

- **Vercel Support**: vercel.com/help
- **Supabase Support**: supabase.com/support
- **Sentry Support**: sentry.io/support
- **Stripe Support**: stripe.com/support

---

## Deployment Validation Script

```bash
#!/bin/bash
# deployment_check.sh - Run before going live

echo "🔍 Pre-Deployment Validation"

# Check build
npm run build > /dev/null 2>&1 && echo "✓ Build passes" || echo "✗ Build fails"

# Check types
npm run type-check > /dev/null 2>&1 && echo "✓ Types pass" || echo "✗ Types fail"

# Check lints
npm run lint > /dev/null 2>&1 && echo "✓ Lints pass" || echo "✗ Lints fail"

# Check env vars
[[ -n "$SUPABASE_SERVICE_ROLE_KEY" ]] && echo "✓ Supabase configured" || echo "✗ Supabase missing"
[[ -n "$OPENROUTER_API_KEY" ]] && echo "✓ OpenRouter configured" || echo "✗ OpenRouter missing"
[[ -n "$STRIPE_SECRET_KEY" ]] && echo "✓ Stripe configured" || echo "✗ Stripe missing"

echo ""
echo "Ready to deploy! ✨"
```

---

**Last Updated**: March 2026  
**Status**: Ready for MVP Launch  
**Next**: Execute deployment steps above
