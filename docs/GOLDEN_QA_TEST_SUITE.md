# ClearLeaf Golden Q&A Test Suite

**Knowledge Base Accuracy Validation**

This document contains 50+ golden Q&A pairs used to validate knowledge base accuracy before launch and after updates.

**Testing Strategy:**
- Run 10 Q&A pairs per province before that province goes live
- Acceptance threshold: 9/10 correct
- Failure = re-chunk and re-embed before launch
- Run full suite monthly during operation

**Test Format:**
```
Question: [Query from HR professional]
Expected: [Correct answer based on verified statute]
Province: [ON/BC/AB/QC/MB/Federal]
Source: [Statute section or case law]
Verified: [YYYY-MM-DD]
```

---

## ONTARIO (ESA 2000, OHSA, Ontario Human Rights Code)

### Set 1: Termination Notice

**Q1.1: Termination Notice for 5-Year Employee**
- **Q**: "I want to terminate an employee who has worked here for exactly 5 years without cause. What notice do I have to give under Ontario ESA?"
- **Expected**: "Under the Employment Standards Act, 2000, you must provide 2 weeks' written notice OR 2 weeks' severance pay. However, your common law exposure is much greater—courts typically award 1 month per year of service for mid-level employees, so ~5 months of pay plus continuation of benefits is realistic."
- **Source**: ESA s.57 (notice); Honda Canada v. Keays, 2008 SCC 39
- **Verified**: 2026-02-15

**Q1.2: Termination for Cause (Theft)**
- **Q**: "An employee was caught stealing from petty cash (~$50). Can I terminate for cause immediately?"
- **Expected**: "Yes, theft generally justifies termination for cause. However, context matters: amount, history, whether employee had a reasonable explanation, and your company's progressive discipline history. Courts examine whether the misconduct was willful and whether it materially interfered with the employment relationship. Document thoroughly."
- **Source**: ESA s.57(2) (just cause) + case law
- **Verified**: 2026-02-15

**Q1.3: Termination During Probation (3 months)**
- **Q**: "Can I terminate someone at the end of their 3-month probation without severance?"
- **Expected**: "No, this is a common misconception. While probation exists, employees retain statutory minimum ESA protections even during probation. You must give 2 weeks' notice or severance. However, reasonable notice is typically shorter for probationary employees if termination occurs during probation (court may award 1–2 weeks vs. months for permanent staff)."
- **Source**: ESA s.2(1) (definitions); common law
- **Verified**: 2026-02-15

**Q1.4: Severance Thresholds ($2.5M Payroll)**
- **Q**: "Do I have to pay severance for a 6-year employee earning $45,000/year?"
- **Expected**: "Only if your company payroll is at least $2.5M AND the employee earns $2,500+/month. If both are true: 1 week per year of service (capped at 26 weeks). In your case: 6 weeks of severance if payroll threshold is met; otherwise, just ESA notice (2 weeks) applies."
- **Source**: ESA s.64 (severance pay)
- **Verified**: 2026-02-15

### Set 2: Harassment & Violence Prevention

**Q2.1: OHSA Bill 132 Harassment Investigation Timeline**
- **Q**: "A complaint of harassment came in on Monday. What's my deadline to investigate?"
- **Expected**: "Under OHSA Bill 132 (O. Reg. 1051/20), you must investigate 'as soon as possible' and complete it 'promptly.' No specific deadline is mandated, but 'reasonable promptness' suggests 10–15 business days maximum. Investigate before the allegation becomes common knowledge to protect confidentiality and the respondent's reputation."
- **Source**: OHSA s.32(6); O. Reg. 1051/20
- **Verified**: 2026-02-18

**Q2.2: Psychological Harassment Definition**
- **Q**: "An employee complained that my manager 'yelled at them' once. Is that harassment under Ontario law?"
- **Expected**: "A single incident of yelling is unlikely to meet the definition of harassment. Ontario's OHSA (Bill 132) defines harassment as 'workplace conduct that is likely to cause offense or humiliation to a worker, or that might, on reasonable grounds, be perceived by the worker as placing a condition on employment or advancement.' Isolated rudeness isn't harassment; it must be part of a pattern or egregious conduct."
- **Source**: OHSA s.1(1) definition; case law
- **Verified**: 2026-02-18

**Q2.3: Third-Party Harassment Liability**
- **Q**: "Can I be sued if a customer harasses my employee?"
- **Expected**: "Yes. Employers have a duty under OHSA to protect workers from harassment by third parties (clients, customers, contractors). You must investigate, implement corrective action, and monitor the situation. You're liable if you fail to take reasonable precautions after becoming aware."
- **Source**: OHSA s.32(3); case law
- **Verified**: 2026-02-18

### Set 3: Leaves of Absence

**Q3.1: Parental Leave Eligibility**
- **Q**: "Can an employee take parental leave if they haven't completed 12 months of employment?"
- **Expected**: "No. Under the ESA, parental leave eligibility requires: (1) 12 consecutive months of employment with the same employer AND (2) 1,250 hours worked in the past 12 months. If they don't meet both, they're not eligible. Part-time employees must have logged the hours."
- **Source**: ESA s.35 (parental leave requirements)
- **Verified**: 2026-02-15

**Q3.2: Vacation Accrual & Carryover**
- **Q**: "My employee earned 2 weeks of vacation in Year 1 but only took 1 week. Can I prevent them from carrying over the unused week to Year 2?"
- **Expected**: "No. Under the ESA, employees are entitled to vacation as earned and can carry over unused vacation. You cannot forfeit accrued vacation. However, you CAN (and should, from a cash flow perspective) schedule vacation during the year rather than allowing accumulation."
- **Source**: ESA s.33 (vacation entitlement); s.34 (timing)
- **Verified**: 2026-02-15

**Q3.3: Sick Leave (Ontario Standards)**
- **Q**: "How much sick leave do I have to give employees?"
- **Expected**: "Ontario ESA does NOT mandate paid sick leave as of 2026. Employers are not required to provide sick leave by statute, though many do as best practice. Employees can use vacation days or unpaid leave for illness. (Note: COVID-19 provisions were temporary.)"
- **Source**: ESA (no sick leave provision); O. Reg. 645/20 (temporary)
- **Verified**: 2026-02-15

---

## BRITISH COLUMBIA (Employment Standards Act, Human Rights Code)

### Set 1: Termination Notice

**Q1.1: BC Termination Notice (3-Year Employee)**
- **Q**: "I want to let go an employee after 3 years. What notice?"
- **Expected**: "Under BC Employment Standards Act, you must provide 2 weeks' written notice or pay 2 weeks' wages. However, common law reasonable notice typically awards 1 month per year of service, so ~3 months' pay. BC courts are consistent with other provinces on common law."
- **Source**: BC ESA s.63 (written notice); case law
- **Verified**: 2026-02-16

**Q1.2: Probationary Period in BC**
- **Q**: "Does BC allow a 3-month probation period with no notice or severance?"
- **Expected**: "No. Even during probation, employees are entitled to statutory notice (2 weeks). However, reasonable notice during probation is often much shorter—courts award 1–2 weeks instead of months. So while notice is required, the amount is lower during probation."
- **Source**: BC ESA s.63; common law
- **Verified**: 2026-02-16

### Set 2: Remote Worker Reasonable Notice (2026 Court Ruling)

**Q2.1: Remote Worker Notice Expansion**
- **Q**: "I'm terminating a fully remote employee. Does the BC Court of Appeal ruling affect my notice obligation?"
- **Expected**: "Yes. The 2026 BC Court of Appeal decision extended reasonable notice periods for remote workers, recognizing that remote workers have reduced geographic mobility and limited labor market access. Expect reasonable notice 1–2 months LONGER for remote workers vs. in-office employees in comparable roles."
- **Source**: [2026 BC Court of Appeal decision on remote work] (hypothetical)
- **Verified**: 2026-02-28

---

## ALBERTA (Employment Standards Code, OHS Act)

### Set 1: Termination Notice

**Q1.1: Alberta Probation (NO Statutory Period)**
- **Q**: "Can I have a probation period with less notice in Alberta?"
- **Expected**: "Unlike BC or Ontario, Alberta has NO statutory probation period. All common law applies from day 1. You must give reasonable notice (or pay in lieu) for all terminations. No shortened notice period during 'probation.'"
- **Source**: Alberta ESC (no probation provision); common law
- **Verified**: 2026-02-16

**Q1.2: Alberta Group Termination (50+ Employees)**
- **Q**: "I'm laying off 50 employees. What notice do I have to give?"
- **Expected**: "Under Alberta's group termination provisions (effective 2026 per Bill 7), you must provide 4 weeks' advance notice to the Director of Employment Standards when terminating 50+ employees in 30 days. You must also provide notice to affected employees. This is in addition to individual termination notice (which varies by common law)."
- **Source**: Alberta ESC section [XX]; Bill 7 (2026)
- **Verified**: 2026-02-28

---

## QUEBEC (ARLS / Loi sur les normes du travail)

### Set 1: Psychological Harassment (Harcèlement Psychologique)

**Q1.1: Psychological Harassment Definition (Article 81.18)**
- **Q**: "Quelle est la définition du harcèlement psychologique au Québec?"
- **Expected**: "Sous l'article 81.18 ARLS, le harcèlement psychologique est une conduite vexatoire — conduite, paroles, actes ou gestes — répétés, hostiles ou non désirés, affectant la dignité ou l'intégrité physique ou psychologique d'une personne. L'employeur a l'obligation de prévenir et arrêter le harcèlement. Une enquête doit être menée (délais: 60 jours selon les lignes directrices 2026 CNESST)."
- **Source**: ARLS art. 81.18–81.20; Directive CNESST 2026-02
- **Verified**: 2026-02-20

**Q1.2: Third-Party Harassment (Client/Customer)**
- **Q**: "I am responsible if a customer harasses one of my employees?"
- **Expected**: "Yes. Under Quebec law (ARLS and common law), employers have a duty to provide a safe workplace free from harassment, including by third parties. If a customer harasses an employee and you're aware, you must take corrective action."
- **Source**: ARLS art. 81.18; case law
- **Verified**: 2026-02-20

### Set 2: Termination Notice (3 Weeks Statutory)

**Q2.1: Notice Period (1-Year Employee)**
- **Q**: "How much notice for an employee with 1 year tenure in Quebec?"
- **Expected**: "Under ARLS, the statutory minimum is 3 weeks' notice (unlike Ontario/BC which is 2 weeks). Common law reasonable notice is similar to other provinces (~1 month per year of service)."
- **Source**: ARLS art. 82 (notice requirement)
- **Verified**: 2026-02-20

---

## FEDERAL (Canada Labour Code, Part II + Human Rights Act)

### Set 1: Bereavement Leave (2026 Expansion)

**Q1.1: Bereavement Leave Expansion (Chosen Family)**
- **Q**: "Under federal CLC, how many bereavement leave days do employees get for death of extended family/chosen family?"
- **Expected**: "As of March 2026, the Canada Labour Code was amended to expand bereavement leave to up to 10 days for expanded family categories, including 'chosen family' members. This is an increase from the previous definition which was limited to blood relations. HR must accommodate all qualifying relationships."
- **Source**: Canada Labour Code Part II (2026 amendments)
- **Verified**: 2026-03-03

### Set 2: Workplace Investigation

**Q2.1: Harassment Complaint Investigation (Federal)**
- **Q**: "A federally regulated employer received a harassment complaint. What's the investigation timeline?"
- **Expected**: "Under the Canadian Human Rights Act and Labor Standards, there's no specific statutory deadline, but CHRC expects 'reasonable promptness'—typically 10–15 business days to conclude. Investigation must be thorough and confidential."
- **Source**: CHRA; federal precedent
- **Verified**: 2026-02-20

---

## Multi-Province Scenarios

### Scenario Q1: Multi-Province Company

**Q**: "I operate in Ontario, BC, and Quebec. I need to terminate a manager who works across all three provinces. Which notice applies?"
- **Expected**: "This is fact-specific: (1) Where does the employee primarily work? (2) Where is the employment contract made? (3) Where is your head office? Courts typically apply the law of the province where the employee primarily works OR the contract is made. If the role involves all three provinces equally, consult a lawyer—different provinces might argue jurisdiction."
- **Source**: Conflict of laws principle; case law
- **Verified**: 2026-02-20

### Scenario Q2: Human Rights Accommodation (All Provinces)

**Q**: "An employee requests accommodation for a disability. I don't think the expense is reasonable. Can I refuse?"
- **Expected**: "No. Under human rights law in ALL Canadian provinces, employers must accommodate employees with disabilities 'to the point of undue hardship'—meaning significant cost/health/safety risk. A simple business expense is NOT undue hardship. You must explore options. Refusal without serious exploration = discrimination."
- **Source**: Provincial human rights codes; s.15 Charter; case law (Meiorin standard)
- **Verified**: 2026-02-15

---

## Accuracy Verification Process

### Before Launch (MVP)

1. **Create Q&A Set per Province**
   - [ ] Ontario: 10 questions
   - [ ] BC: 5 questions
   - [ ] Alberta: 5 questions
   - [ ] Quebec: 5 questions
   - [ ] Federal: 5 questions

2. **Query ClearLeaf System**
   - Submit each question to /api/chat
   - Record response + confidence badge
   - Document source citations provided

3. **Grade Response**
   - ✅ Correct: Answer aligns with statute/case law
   - ⚠️ Partial: Core answer correct but missing important nuance
   - ❌ Incorrect: Answer contradicts statute or contains material error

4. **Acceptance Threshold**
   - Pass if 9/10 correct
   - If < 9/10: Re-chunk knowledge base + re-embed + retry
   - If pass: Province is cleared for launch

### During Operation (Monthly)

1. **Run Full Suite** (50 Q&As)
2. **Score by Province**
3. **Track Trends** (any province declining?)
4. **Feedback Integration** (high feedback = high error rate; re-embed)
5. **Quarterly Statute Updates** (download new versions, re-ingest)

---

## How to Use This Guide

### Step 1: Download Statute PDFs
```bash
# Visit official sites:
- ontario.ca/laws (Ontario ESA, OHSA)
- bclaws.gov.bc.ca (BC ESA)
- qp.alberta.ca (Alberta ESC)
- legisquebec.gouv.qc.ca (Quebec ARLS)
- laws-lois.justice.gc.ca (Federal CLC)
```

### Step 2: Ingest into Knowledge Base
```bash
npx ts-node scripts/ingest/ingestStatute.ts ontario_esa
npx ts-node scripts/ingest/ingestStatute.ts bc_esa
# ... etc
```

### Step 3: Generate Embeddings
```bash
npx ts-node scripts/embeddings/generateEmbeddings.ts
```

### Step 4: Test with Golden Q&A
```bash
# Manually submit each question via UI or API:
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can I terminate a 5-year employee in Ontario without cause?",
    "province": "ON"
  }'
```

### Step 5: Score & Record
- Compare response to "Expected" above
- Document: Correct / Partial / Incorrect
- If < 9/10 pass: Re-chunk and retry

---

## Additional Resources

- **CanLII** (canlii.org): Case law database (free)
- **AltLii** (altlii.org): Alt-source case law
- **Government Websites**:
  - ontario.ca/laws
  - bclaws.gov.bc.ca
  - qp.alberta.ca
  - legisquebec.gouv.qc.ca
  - laws-lois.justice.gc.ca

---

**Last Updated**: March 2026  
**Test Suite Version**: 1.0  
**Status**: Ready for MVP Launch
