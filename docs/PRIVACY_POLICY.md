# Privacy Policy

**ClearLeaf — Canada's HR Intelligence Layer**  
Effective Date: March 2026

---

## 1. Introduction

ClearLeaf ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with:
- **PIPEDA** (Personal Information Protection and Electronic Documents Act)
- **Provincial privacy laws** (Quebec Law 25, Ontario PHIPA, etc.)
- **GDPR** (if you access from the EU)

---

## 2. Information We Collect

### 2.1 Information You Provide Directly

#### Account Registration
- Email address
- Name (optional)
- Organization name (optional)
- Preferred province(s)
- Password or OAuth credentials

#### During Service Use
- Chat queries and conversation history
- Document uploads (policy templates)
- Feedback on responses (thumbs-down tags)
- Feature usage data (which pages you visit)
- Payment information (processed by Stripe; we do NOT store full credit card data)

#### Communications
- Emails you send to support@clearleaf.ca
- Support tickets or feedback forms
- Survey responses (if you participate)

### 2.2 Information Collected Automatically

#### Server Logs
- IP address
- Browser type and version
- Device type and operating system
- Pages visited and time spent
- Referral source
- Error messages and exceptions

#### Cookies & Tracking
- Session cookies (required for login)
- Authentication tokens
- Analytics cookies (PostHog)
- No third-party advertising cookies

#### Performance Data
- Chat response times and token usage
- Feature engagement metrics
- Error rates and crash reports (Sentry)

---

## 3. How We Use Your Information

### 3.1 To Provide the Service
- Process and respond to chat queries
- Store conversation history (see Section 3.4)
- Issue invoices and manage subscriptions
- Provide customer support
- Verify your account and prevent fraud
- Send account notifications and password resets

### 3.2 To Improve the Service
- Analyze how features are used
- Identify bugs and performance issues
- Train model improvements using non-personal aggregated data
- Develop new features and functionality
- Conduct A/B testing

### 3.3 Legal & Compliance
- Comply with legal obligations
- Respond to lawful government requests
- Enforce our Terms of Service
- Protect against fraud, abuse, or security threats
- Maintain audit trails for regulatory compliance

### 3.4 Chat Data — Special Rules
**Your chat messages are NOT used to train AI models.**

- Chat messages are stored in your account for history (see retention section)
- Responses are generated using OpenRouter's API (see Section 5)
- You can request deletion of chat history anytime
- System monitors for errors, not content analysis
- Feedback (thumbs-down) helps us improve accuracy; feedback tags are reviewed by our team

### 3.5 What We DO NOT Do
- ❌ Sell your personal data to third parties
- ❌ Use your data for marketing to external customers
- ❌ Train large language models on your chat content
- ❌ Share your data with HR analytics providers
- ❌ Disclose your queries to your organization (even if your employer hosts the account)

---

## 4. Data Retention

### 4.1 Account Data
- **Active Accounts**: Data retained as long as account is active
- **Deleted Accounts**: Data deleted within 30 days of account deletion
- **Suspended Accounts**: Data retained for 90 days; then deleted

### 4.2 Chat History by Plan
| Plan | Retention |
|------|-----------|
| **Free** | No history stored; queries are deleted immediately after response |
| **Starter** | No chat history (Ontario queries only; immediate deletion) |
| **Professional** | 90 days of chat history |
| **Team** | Unlimited chat history (stored indefinitely until deleted by admin) |

### 4.3 Other Data
- **Server logs**: 90 days
- **Error reports (Sentry)**: 30 days
- **Analytics data**: 12 months
- **Payment records**: 7 years (CRA compliance)
- **Feedback tags**: Indefinitely (for accuracy tracking)

### 4.4 Right to Deletion
You can request deletion of:
- Your entire account and all associated data
- Specific chat messages or history
- Feedback submissions

Requests are processed within 30 days. Some data may be retained for legal or compliance reasons (e.g., transaction records for disputes).

---

## 5. Data Sharing & Third Parties

### 5.1 Service Providers (We Disclose Data To)

#### Required for Service Function
| Service | Data Shared | Purpose |
|---------|------------|---------|
| **Supabase** | All account & chat data | Database storage + auth |
| **AWS ca-central-1** | All data in transit | Infrastructure hosting |
| **Stripe** | Name, email, payment info | Billing & subscriptions |
| **Resend** | Email address | Transactional emails |
| **OpenRouter** | Chat queries (anonymized) | AI response generation |
| **OpenAI** | Chat queries (for embeddings only) | Knowledge base retrieval |
| **Sentry** | Error logs (no personal data) | Error monitoring |
| **PostHog** | Anonymized usage events | Product analytics |

#### All Processors Sign Data Processing Agreements
We require all third parties to:
- Process data only for the service specified
- Implement appropriate security measures
- Comply with PIPEDA and applicable laws
- Delete data upon contract termination

### 5.2 Data Location
**All data is stored in Canada (AWS ca-central-1 region).**

- ✅ Compliant with PIPEDA
- ✅ Not subject to US Patriot Act
- ✅ Secured with encryption in transit and at rest

### 5.3 Legal Disclosure
We may disclose your data when required by:
- Court orders or subpoenas
- Law enforcement requests
- Regulatory investigations
- Legal proceedings (with notice where possible)

We will NOT voluntarily disclose data without legal process.

---

## 6. Data Security

### 6.1 Technical Safeguards
- **Encryption in Transit**: TLS 1.2+ (all connections over HTTPS)
- **Encryption at Rest**: AES-256 encryption for databases
- **Authentication**: Supabase Auth with magic links and OAuth
- **Session Management**: httpOnly, Secure cookies (prevent XSS/CSRF)
- **Rate Limiting**: Protection against brute force attacks
- **Regular Backups**: Daily automated backups (Supabase Pro)

### 6.2 Organizational Safeguards
- **Access Controls**: Role-based access (admin only)
- **Audit Logging**: All data access is logged
- **Incident Response**: Documented breach response procedures
- **Employee Training**: All staff trained on data protection
- **Vendor Audits**: Third-party security assessments

### 6.3 Your Responsibility
- Keep your password confidential
- Log out on shared devices
- Do not share account credentials
- Notify us immediately of unauthorized access

---

## 7. Your Privacy Rights (PIPEDA & Provincial Laws)

### 7.1 Right to Access
You have the right to:
- Request a copy of all personal data we hold about you
- Receive it in an accessible, understandable format
- Know why we collect and use it

**Request process**: Email privacy@clearleaf.ca with "Subject: Access Request"  
**Response time**: 30 days

### 7.2 Right to Correction
You can:
- Correct inaccurate information in your account
- Request we add information explaining a correction
- Update preferences anytime

### 7.3 Right to Deletion
You can request deletion of:
- Your entire account
- Specific data elements
- Chat history

Some data may be retained for legal reasons (clearly communicated).

### 7.4 Right to Withdraw Consent
You can:
- Opt out of analytics tracking (PostHog)
- Opt out of promotional emails
- Disable usage data collection

Note: Withdrawing consent to core services may prevent the Service from functioning.

### 7.5 Right to Portability
You can:
- Export your chat history (JSON format)
- Export your account data (CSV format)
- Migrate to another platform

### 7.6 Exercising Your Rights
Contact us:
- **Email**: privacy@clearleaf.ca
- **Mail**: ClearLeaf, Canada
- **In-App**: Settings → Privacy → Request

We will verify your identity before processing requests.

---

## 8. Children's Privacy

ClearLeaf is not intended for users under 18. We do not knowingly collect data from children. If we discover we have collected data from a child, we will delete it immediately.

---

## 9. Cross-Border Data Transfers

### 9.1 US Service Providers
Some service providers (Stripe, OpenRouter, Sentry, PostHog) are US-based. By using ClearLeaf, you consent to transfer of limited data to the US for these services. We minimize transfers and use contractual safeguards (Data Processing Agreements, Standard Contractual Clauses).

### 9.2 No Direct US Storage
Your primary data (chat history, account data) is stored exclusively in Canada (AWS ca-central-1).

---

## 10. Cookies & Tracking

### 10.1 Types of Cookies We Use
| Cookie | Purpose | Duration |
|--------|---------|----------|
| `session_token` | Authentication | Session |
| `supabase_auth` | Login state | 7 days |
| `ph_sessionid` | PostHog analytics (optional) | Session |
| `ph_uid` | PostHog user tracking (optional) | 12 months |

### 10.2 Cookie Preferences
- Session cookies are required for login
- Analytics cookies are optional (you can disable in settings)
- No third-party advertising cookies

### 10.3 Opt-Out
You can disable cookies in your browser settings, but this may prevent login.

---

## 11. Contact & Complaints

### 11.1 Questions About This Policy
**Email**: privacy@clearleaf.ca  
**Response Time**: 10 business days

### 11.2 Privacy Complaints
If you believe we have misused your data:
1. Contact us at privacy@clearleaf.ca
2. We will investigate within 30 days
3. We will provide a response and remediation plan

### 11.3 Escalation
If you are unsatisfied, you can file a complaint with:
- **Office of the Privacy Commissioner of Canada** (federal)
- **Provincial Privacy Commissioner** (if applicable)
- **Your provincial labor board** (employment-specific concerns)

---

## 12. EU Users (GDPR Compliance)

If you access ClearLeaf from the EU:
- Your data processing is based on "legitimate interests" (HR compliance)
- You have additional rights under GDPR (data portability, erasure, etc.)
- Our Data Controller is: ClearLeaf Inc., Canada
- Our Data Protection Officer: privacy@clearleaf.ca
- Any transfers to Canada are under Standard Contractual Clauses

---

## 13. Updates to This Policy

We may update this Privacy Policy to reflect legal changes or improvements. Changes are effective upon posting to the website. Material changes will be communicated via email. Your continued use constitutes acceptance.

---

## 14. Key Privacy Principles

1. **Your data is your own**: You control how it's used
2. **Transparency first**: We tell you what data we collect and why
3. **Security always**: Your data is encrypted and protected
4. **No selling**: We never sell your data
5. **Privacy by default**: We minimize data collection
6. **Local storage**: Your primary data stays in Canada

---

## Contact & Effective Date

**Effective Date**: March 2026  
**Last Updated**: March 2026  
**Version**: 1.0

For privacy inquiries:
- **Email**: privacy@clearleaf.ca
- **Website**: clearleaf.ca/privacy

---

**ClearLeaf is committed to respecting your privacy. If you have concerns, contact us immediately.**
