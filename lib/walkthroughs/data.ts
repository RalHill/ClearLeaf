export interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
}

export interface WalkthroughStep {
  title: string;
  description: string;
  checklist: ChecklistItem[];
  tip: string;
  citation: string;
  askPrompt: string; // Pre-filled question for the chat assistant
}

export interface Walkthrough {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  locked: boolean;
  steps: WalkthroughStep[];
}

export const WALKTHROUGHS: Walkthrough[] = [
  // ── 1. TERMINATION ─────────────────────────────────────────────────────────
  {
    slug: "termination",
    icon: "⚠️",
    title: "Terminating an Employee",
    desc: "Without cause or for cause — province-specific checklist",
    locked: false,
    steps: [
      {
        title: "Determine Grounds: Without Cause vs. For Cause",
        description:
          "Before anything else, determine whether you are terminating with just cause (misconduct) or without cause (business decision, performance managed out, restructuring). This single decision affects every subsequent step — notice periods, severance entitlement, and litigation risk all differ significantly.",
        checklist: [
          { id: "1a", text: "Identify whether this is a without-cause or for-cause dismissal", required: true },
          { id: "1b", text: "If for cause: confirm you have documented, proven misconduct that strikes at the root of the employment relationship", required: true },
          { id: "1c", text: "If for cause: confirm progressive discipline was applied (unless the misconduct is so severe it justifies immediate dismissal)", required: true },
          { id: "1d", text: "Review employment contract for any termination clause or just-cause definition", required: true },
          { id: "1e", text: "Confirm you are NOT in a protected period (e.g., employee is on medical leave, pregnancy leave, WSIB claim)", required: true },
        ],
        tip: "For-cause dismissal is extremely difficult to prove in Canada. Courts apply a very high standard — a single incident of poor performance almost never qualifies. When in doubt, proceed without cause with proper notice and severance.",
        citation: "McKinley v. BC Tel, 2001 SCC 38; Dowling v. Ontario (Workplace Safety), 2004 ONCA",
        askPrompt: "What is the legal standard for just cause dismissal in Ontario?",
      },
      {
        title: "Calculate Statutory Notice and Severance Entitlements",
        description:
          "Every province has minimum notice periods under employment standards legislation. These are the absolute floor — not negotiable, not waivable. Failing to meet them creates an automatic ESA claim. Calculate both the statutory ESA minimum AND the potential common law exposure.",
        checklist: [
          { id: "2a", text: "Calculate years of completed service (from start date to last day worked)", required: true },
          { id: "2b", text: "Look up the statutory minimum notice for your province and years of service", required: true },
          { id: "2c", text: "Calculate ESA severance pay entitlement (Ontario: if 5+ years service AND $2.5M+ payroll)", required: true },
          { id: "2d", text: "Calculate common law reasonable notice exposure (Bardal factors: age, position, years of service, re-employability)", required: true },
          { id: "2e", text: "Review if employee is above a pay threshold that may qualify for different protections (federal CLC, Quebec s.124 complaint)", required: false },
          { id: "2f", text: "Check if a group termination is occurring (50+ employees in Ontario within 4 weeks triggers mass termination provisions)", required: false },
        ],
        tip: "Common law notice typically far exceeds statutory minimums. A 5-year managerial employee might receive 1 week statutory notice but 5–8 months common law notice. Always budget for the common law exposure when structuring the package.",
        citation: "Ontario ESA 2000, s.57–64; Bardal v. Globe & Mail Ltd. (1960), 24 DLR (2d) 140",
        askPrompt: "What is the statutory notice and severance pay for a 5-year Ontario employee?",
      },
      {
        title: "Prepare the Termination Package",
        description:
          "Structure the separation offer before the meeting. The package should include a separation agreement, ROE instructions, benefits continuation information, and a clear payment schedule. Never hand over the package mid-meeting without the employee having time to review it.",
        checklist: [
          { id: "3a", text: "Draft separation agreement with full release language (lawyer-reviewed)", required: true },
          { id: "3b", text: "Include payment schedule: lump sum or salary continuance? (Note: salary continuance triggers mitigation obligations)", required: true },
          { id: "3c", text: "Calculate continuation of benefits coverage period (Ontario: must continue through statutory notice period)", required: true },
          { id: "3d", text: "Prepare ROE (Record of Employment) — must be filed within 5 calendar days of interruption of earnings", required: true },
          { id: "3e", text: "Prepare final pay calculations: accrued vacation, banked overtime, expense reimbursements", required: true },
          { id: "3f", text: "Draft reference letter (if appropriate) or reference policy statement", required: false },
          { id: "3g", text: "Prepare COBRA/benefits transition information if on employer benefits", required: false },
        ],
        tip: "Courts have held that a release signed under duress or without adequate time to consider is unenforceable. Give the employee at least 2–5 business days to review the agreement and consult a lawyer. Many employers offer an additional $500–$1,000 ILA (Independent Legal Advice) allowance.",
        citation: "Ontario ESA 2000, s.60(1)(a); Rubin v. Home Depot Canada Inc., 2012 ONCA",
        askPrompt: "What must be included in a separation agreement to make it enforceable in Ontario?",
      },
      {
        title: "Conduct the Termination Meeting",
        description:
          "The termination meeting should be brief (15–20 minutes), compassionate, and decisive. Have a witness present (typically HR). Deliver the decision clearly in the first 30 seconds — do not build up to it. Have the termination letter and package ready to hand over.",
        checklist: [
          { id: "4a", text: "Schedule meeting at end of day, early in week (not Friday — employee needs immediate access to supports)", required: true },
          { id: "4b", text: "Have a second person present (HR representative or manager as witness)", required: true },
          { id: "4c", text: "Prepare a written termination letter (date, final day of employment, notice/severance amounts, reference to package)", required: true },
          { id: "4d", text: "Deliver decision clearly in first sentence: 'We are ending your employment as of today.'", required: true },
          { id: "4e", text: "Provide the written package immediately — do not send by email later", required: true },
          { id: "4f", text: "Arrange immediate return of company property (laptop, keys, access cards)", required: true },
          { id: "4g", text: "Disable systems access at the time of or immediately after the meeting", required: true },
          { id: "4h", text: "Document the meeting in writing immediately after: time, attendees, what was said", required: true },
        ],
        tip: "Never say the words 'resignation', 'mutual agreement', or 'we're letting you go' — be explicit that this is a termination by the employer. Ambiguity about who initiated the departure can create legal complications. Also avoid any statements that could constitute admissions (e.g., 'we should have done this months ago').",
        citation: "Wallace v. United Grain Growers Ltd., [1997] 3 SCR 701; Honda Canada Inc. v. Keays, 2008 SCC 39",
        askPrompt: "What should and shouldn't an employer say during a termination meeting in Canada?",
      },
      {
        title: "Handle Immediate Post-Termination Administration",
        description:
          "The 48–72 hours after a termination are critical for administrative compliance. Multiple legal deadlines run concurrently. Failing to file the ROE on time, continuing to withhold payroll deductions, or missing WSIB notice requirements creates additional liability.",
        checklist: [
          { id: "5a", text: "File Record of Employment (ROE) via Service Canada within 5 calendar days", required: true },
          { id: "5b", text: "Issue final paycheque including all accrued vacation pay (Ontario: next scheduled pay period or within 7 days)", required: true },
          { id: "5c", text: "Continue benefits coverage through statutory notice period", required: true },
          { id: "5d", text: "Notify payroll to stop payroll deductions (CPP, EI) as of termination date", required: true },
          { id: "5e", text: "Notify IT to disable all access: email, VPN, cloud systems, building security", required: true },
          { id: "5f", text: "Notify reception, colleagues as needed (use neutral, privacy-preserving language)", required: true },
          { id: "5g", text: "Confirm receipt and return of separation agreement by agreed deadline", required: true },
        ],
        tip: "In Ontario, if an employer fails to provide the ROE within the required timeframe, Service Canada can assess a penalty. Keep a checklist and confirm each item is complete within 48 hours.",
        citation: "Ontario ESA 2000, s.11 (vacation pay); Employment Insurance Act, s.19 (ROE requirements)",
        askPrompt: "What are the post-termination obligations for an Ontario employer within the first 5 days?",
      },
      {
        title: "Address Potential Claims and Litigation Risk",
        description:
          "Even well-executed terminations carry litigation risk in Canada. Understand the most common claims, their timelines, and how to reduce exposure. Document everything — the quality of your paper trail determines the outcome of most employment disputes.",
        checklist: [
          { id: "6a", text: "Confirm no human rights-protected characteristic could be connected to the termination decision (disability, pregnancy, age, etc.)", required: true },
          { id: "6b", text: "Retain all documentation for minimum 3 years (7 years recommended for senior employees)", required: true },
          { id: "6c", text: "Brief the responding manager on what to say if the employee contacts them", required: true },
          { id: "6d", text: "Note ESA claim limitation: 2 years from termination to file with Ministry of Labour", required: false },
          { id: "6e", text: "Note wrongful dismissal claim limitation: 2 years from termination (Ontario Limitations Act)", required: false },
          { id: "6f", text: "Brief employment legal counsel if employee is senior (VP+), has known legal representation, or if cause was alleged", required: false },
        ],
        tip: "If the employee files an Ontario ESA complaint with the Ministry of Labour, the Ministry has the authority to order up to 2 years of wages plus vacation pay, reinstatement, and other remedies. ESA claims are investigated administratively — the employer must cooperate fully and respond within set timeframes.",
        citation: "Ontario Human Rights Code, s.5; Ontario Limitations Act, 2002, s.4; Ontario ESA 2000, Part XX",
        askPrompt: "What is the limitation period for wrongful dismissal claims in Ontario?",
      },
      {
        title: "Post-Separation: Reference, LinkedIn, and Internal Communication",
        description:
          "How you handle the period after termination — references, messaging to the team, and the employee's online presence — matters legally and reputationally. Defamatory references, breach of confidentiality, and failure to return pension entitlements are all post-separation risks.",
        checklist: [
          { id: "7a", text: "Agree internally on reference policy: who can give references, what can be said", required: true },
          { id: "7b", text: "Draft a brief, neutral team announcement that does not reveal termination details", required: true },
          { id: "7c", text: "Confirm company LinkedIn page access removed, CRM access removed, client list secured", required: true },
          { id: "7d", text: "Review employment agreement for non-solicitation and non-disclosure obligations", required: true },
          { id: "7e", text: "Confirm pension/RRSP/group benefits entitlements are communicated in writing", required: false },
          { id: "7f", text: "If employee used a company car, phone, or housing: confirm return process and timing", required: false },
        ],
        tip: "If you provide a reference, stick to verifiable facts: start date, end date, title, and if asked, that the person is eligible for rehire (yes/no). Never discuss the reason for termination with a prospective employer — this creates defamation risk. A reference check call should be short and factual.",
        citation: "Defamation Act (Ontario); Personal Information Protection and Electronic Documents Act (PIPEDA), s.7",
        askPrompt: "What can an employer legally say in an employment reference check in Canada?",
      },
      {
        title: "Generate Your Termination Checklist",
        description:
          "Review all completed items and generate your province-specific termination checklist. This document should be retained in the employee's personnel file alongside all termination documentation.",
        checklist: [
          { id: "8a", text: "All previous steps completed and documented", required: true },
          { id: "8b", text: "Termination letter filed in personnel records", required: true },
          { id: "8c", text: "Separation agreement (signed or declined) filed", required: true },
          { id: "8d", text: "ROE filed with Service Canada", required: true },
          { id: "8e", text: "Final pay issued and payroll record updated", required: true },
        ],
        tip: "Retain this completed checklist with your termination file. If this dismissal is ever challenged, a documented, systematic process is your best evidence of good faith.",
        citation: "Ontario ESA 2000; Ontario Human Rights Code; Canada Labour Code (if federally regulated)",
        askPrompt: "What documentation should I retain after terminating an employee in Canada?",
      },
    ],
  },

  // ── 2. HARASSMENT COMPLAINT ────────────────────────────────────────────────
  {
    slug: "harassment",
    icon: "🛡️",
    title: "Harassment Complaint Received",
    desc: "Investigation process, timelines, documentation",
    locked: false,
    steps: [
      {
        title: "Receive and Acknowledge the Complaint",
        description:
          "When a harassment complaint is received — verbally, in writing, or through a third party — your legal clock starts immediately. You have a statutory duty to respond. Failure to acknowledge and investigate can itself constitute a violation of the Occupational Health and Safety Act (Ontario) or equivalent provincial legislation.",
        checklist: [
          { id: "1a", text: "Acknowledge receipt of the complaint in writing within 24–48 hours", required: true },
          { id: "1b", text: "Confirm the complainant's identity and whether they want to remain confidential", required: true },
          { id: "1c", text: "Document the date, time, and manner the complaint was received", required: true },
          { id: "1d", text: "Do NOT take any action against the respondent until investigation is complete", required: true },
          { id: "1e", text: "Do NOT promise the complainant any particular outcome", required: true },
          { id: "1f", text: "Assess whether any immediate safety measures are needed (e.g., separation of parties)", required: true },
        ],
        tip: "Under Ontario OHSA, employers must investigate workplace harassment complaints 'as soon as practicable.' There is no fixed statutory deadline, but courts and the MOL have interpreted this as within days, not weeks. Delays create independent liability.",
        citation: "Ontario OHSA, s.32.0.1; O. Reg. 1051/20 (Workplace Harassment)",
        askPrompt: "What are my obligations when I receive a workplace harassment complaint in Ontario?",
      },
      {
        title: "Determine Investigation Approach",
        description:
          "Not every complaint requires a full formal investigation. Assess the nature and severity of the allegation to determine the appropriate response: informal resolution, internal investigation, or external independent investigator.",
        checklist: [
          { id: "2a", text: "Assess severity: is this minor interpersonal conflict or serious misconduct (assault, sexual harassment, threats)?", required: true },
          { id: "2b", text: "Assess complexity: are there power imbalances? Multiple complainants? The respondent is in HR leadership?", required: true },
          { id: "2c", text: "Assess objectivity: can a qualified internal person investigate without conflict of interest?", required: true },
          { id: "2d", text: "If external investigator required: engage qualified employment lawyer or workplace investigator", required: false },
          { id: "2e", text: "Brief legal counsel if the allegation involves senior leadership, criminal conduct, or expected litigation", required: false },
          { id: "2f", text: "Document the investigation decision and rationale", required: true },
        ],
        tip: "Ontario OHSA requires that investigators be 'appropriate' — this means impartial and sufficiently trained. Using the respondent's manager as the investigator, or using HR when HR reported to the respondent, will undermine the investigation's credibility and potentially the outcome.",
        citation: "Ontario OHSA, s.32.0.3(1)(3); Ministry of Labour guidance on workplace harassment investigations",
        askPrompt: "When is an external investigator required for a harassment complaint in Ontario?",
      },
      {
        title: "Notify the Respondent and Begin Investigation",
        description:
          "The respondent (alleged harasser) has a right to know the allegations against them and to respond. Fairness requires that you provide reasonable notice of the allegations — not necessarily the complainant's identity if anonymity was requested — and an opportunity to respond.",
        checklist: [
          { id: "3a", text: "Notify the respondent in writing that a harassment complaint has been received", required: true },
          { id: "3b", text: "Provide a summary of the allegations (without necessarily naming the complainant if confidentiality was requested)", required: true },
          { id: "3c", text: "Advise the respondent not to contact or retaliate against the complainant", required: true },
          { id: "3d", text: "Advise both parties of the confidentiality obligations during the investigation", required: true },
          { id: "3e", text: "Place respondent on paid administrative leave if continued contact creates risk (document reasoning)", required: false },
          { id: "3f", text: "Identify witnesses to be interviewed", required: true },
        ],
        tip: "Placing a respondent on paid administrative leave pending investigation is standard practice for serious allegations. It is not a disciplinary measure and should be framed as a neutral step to facilitate a fair investigation. Unpaid suspension before investigation findings = wrongful dismissal risk.",
        citation: "Potter v. New Brunswick Legal Aid Services Commission, 2015 SCC 10",
        askPrompt: "Can I place an employee on administrative leave during a harassment investigation?",
      },
      {
        title: "Conduct Interviews and Gather Evidence",
        description:
          "Workplace investigations require structured, documented interviews. Interview the complainant first, then witnesses, then the respondent. Take detailed notes or record with consent. Gather all relevant documentary evidence: emails, messages, performance records, access logs.",
        checklist: [
          { id: "4a", text: "Interview complainant: get a detailed account, timeline, witnesses, and any documentation they have", required: true },
          { id: "4b", text: "Interview all witnesses identified: ask open-ended, non-leading questions", required: true },
          { id: "4c", text: "Interview respondent: provide full allegations, allow full response, allow them to identify their witnesses", required: true },
          { id: "4d", text: "Gather documentary evidence: emails, messages, surveillance footage, access logs", required: true },
          { id: "4e", text: "Preserve all evidence — instruct IT to preserve email/chat records immediately", required: true },
          { id: "4f", text: "Keep interview notes in locked storage — these are confidential investigation documents", required: true },
          { id: "4g", text: "Follow up with any additional witnesses identified by the respondent", required: true },
        ],
        tip: "Each interviewee should be told: (1) the purpose of the interview, (2) what confidentiality means (you can keep your answers private but the investigation itself may result in a report), and (3) that retaliation against others is prohibited. Note who says what — do not commingle notes from different interviews.",
        citation: "Ontario OHSA, s.32.0.3; Boucher v. Wal-Mart Canada Corp., 2014 ONCA 419",
        askPrompt: "How should I structure a harassment investigation interview in Ontario?",
      },
      {
        title: "Reach Findings and Determine Credibility",
        description:
          "After completing all interviews and reviewing all evidence, the investigator must make findings of fact. Credibility assessments are the most important — and most challengeable — part of the investigation. Document your reasoning thoroughly.",
        checklist: [
          { id: "5a", text: "Compare accounts for consistency, specificity, and corroboration", required: true },
          { id: "5b", text: "Assess credibility factors: consistency of the account over time, demeanour, corroborating evidence, motive to fabricate", required: true },
          { id: "5c", text: "Apply the legal definition of workplace harassment to the findings", required: true },
          { id: "5d", text: "Draft investigation report: background, process, findings, credibility assessment, conclusion", required: true },
          { id: "5e", text: "Have report reviewed by legal counsel before sharing with parties", required: false },
          { id: "5f", text: "Determine whether harassment has been substantiated, unsubstantiated, or inconclusive", required: true },
        ],
        tip: "You do not need proof beyond a reasonable doubt (criminal standard) or proof on a balance of probabilities that is absolute certainty. The civil standard (balance of probabilities: more likely than not) applies. However, the more serious the allegation, the more cogent the evidence required.",
        citation: "Ontario Human Rights Code; F.H. v. McDougall, 2008 SCC 53 (standard of proof)",
        askPrompt: "What standard of proof applies in a workplace harassment investigation in Canada?",
      },
      {
        title: "Communicate Findings and Take Corrective Action",
        description:
          "Both the complainant and respondent must be informed of the investigation results — not the full report, but the conclusions and what action is being taken. This is required under OHSA. The employer must then take corrective action proportionate to the findings.",
        checklist: [
          { id: "6a", text: "Inform complainant in writing of investigation results and corrective actions (general terms, not specific discipline)", required: true },
          { id: "6b", text: "Inform respondent in writing of findings and any disciplinary action being taken", required: true },
          { id: "6c", text: "If harassment substantiated: impose proportionate discipline (written warning → suspension → termination)", required: true },
          { id: "6d", text: "If harassment substantiated: consider whether termination for cause is warranted (for severe or repeated incidents)", required: false },
          { id: "6e", text: "If unsubstantiated: confirm to both parties with no adverse action against either", required: true },
          { id: "6f", text: "Consider systemic remedies: policy updates, training, workplace restoration measures", required: false },
          { id: "6g", text: "Confirm non-retaliation: remind both parties that retaliation for participating in the process is prohibited and grounds for discipline", required: true },
        ],
        tip: "Communicating findings does not mean sharing the investigation report. Both parties should receive a letter that says: (a) the investigation is complete, (b) the determination (substantiated/unsubstantiated), and (c) what corrective action has been or will be taken. The full report is confidential.",
        citation: "Ontario OHSA, s.32.0.6; O. Reg. 1051/20, s.10",
        askPrompt: "What must I tell the complainant and respondent after completing a harassment investigation?",
      },
      {
        title: "Document, Retain Records, and Monitor",
        description:
          "Workplace harassment investigations create documents that are potentially disclosable in litigation. Proper record-keeping and follow-through monitoring are essential. The investigation file should be maintained separately from personnel files.",
        checklist: [
          { id: "7a", text: "File complete investigation record: complaint, all interview notes, evidence, report, communication letters, disciplinary records", required: true },
          { id: "7b", text: "Retain investigation file for minimum 7 years (human rights complaint window is extended)", required: true },
          { id: "7c", text: "Schedule a follow-up check-in with complainant at 30 and 90 days post-investigation", required: true },
          { id: "7d", text: "Monitor workplace dynamics — watch for any signs of retaliation or continued harassment", required: true },
          { id: "7e", text: "Review and update workplace harassment policy if investigation identified systemic issues", required: false },
          { id: "7f", text: "Consider whether mandatory training is appropriate for the work unit", required: false },
        ],
        tip: "If the harassment also gives rise to a human rights complaint (Ontario Human Rights Tribunal, BCHRT, CHRC), the investigation file may be producible. Maintain it with that possibility in mind. Ontario Human Rights complaints must be filed within 1 year of the last incident.",
        citation: "Ontario Human Rights Code, s.34 (1-year filing window); OHSA, s.32.0.6",
        askPrompt: "How long should I retain workplace harassment investigation records in Ontario?",
      },
    ],
  },

  // ── 3. ACCOMMODATION REQUEST ────────────────────────────────────────────────
  {
    slug: "accommodation",
    icon: "♿",
    title: "Accommodation Request",
    desc: "Duty to accommodate to the point of undue hardship",
    locked: true,
    steps: [
      {
        title: "Receive and Acknowledge the Accommodation Request",
        description:
          "An accommodation request triggers your legal duty to accommodate under the applicable human rights code. The duty is triggered as soon as the employer becomes aware of the need — it does not require a formal written request.",
        checklist: [
          { id: "1a", text: "Acknowledge the request in writing within 48 hours", required: true },
          { id: "1b", text: "Identify the protected ground(s) triggering the duty: disability, religion, family status, etc.", required: true },
          { id: "1c", text: "Do NOT ask for a diagnosis — you are entitled to functional limitations, not the medical condition itself", required: true },
          { id: "1d", text: "Advise the employee they have a duty to cooperate in the process and provide necessary medical information", required: true },
          { id: "1e", text: "Assign an HR lead to coordinate the accommodation process", required: true },
        ],
        tip: "You cannot require the employee to use their own doctor for medical assessments, but you can require them to attend an Independent Medical Examination (IME) if the information provided is insufficient. Refusal to cooperate can release the employer from the duty.",
        citation: "Ontario Human Rights Code, s.5, 11, 17; Hydro-Québec v. Syndicat des employé-e-s de techniques professionnelles, 2008 SCC 43",
        askPrompt: "What medical information can an employer request for an accommodation request in Ontario?",
      },
      {
        title: "Gather Functional Medical Information",
        description:
          "The employer is entitled to know the employee's functional limitations — what they can and cannot do — not their diagnosis. A functional abilities form (FAF) completed by the treating physician is the standard approach.",
        checklist: [
          { id: "2a", text: "Provide employee with a Functional Abilities Form (FAF) or equivalent for their physician to complete", required: true },
          { id: "2b", text: "FAF should capture: current limitations, expected duration, ability to work, restrictions, prognosis", required: true },
          { id: "2c", text: "Set a reasonable deadline for return of medical information (10–15 business days)", required: true },
          { id: "2d", text: "If information is incomplete or insufficient, request clarification in writing", required: true },
          { id: "2e", text: "If employee refuses to provide any medical information: document and take legal advice before proceeding", required: false },
        ],
        tip: "A Functional Abilities Form asks: 'Can this person sit for extended periods? Lift up to X kg? Work at a computer for Y hours?' — not 'What is their diagnosis?' Keeping medical files separate from personnel files is a legal requirement under PIPEDA.",
        citation: "PIPEDA, s.5; Ontario Human Rights Code, Policy on Disability and the Duty to Accommodate",
        askPrompt: "What is a Functional Abilities Form and when must I use one in Ontario?",
      },
      {
        title: "Identify and Assess Accommodation Options",
        description:
          "Once you have functional information, conduct a genuine search for accommodation options. The duty requires you to explore all reasonable alternatives before concluding that accommodation is impossible. Document every option considered.",
        checklist: [
          { id: "3a", text: "Review the employee's current role and identify which duties they can and cannot perform", required: true },
          { id: "3b", text: "Explore modified duties, modified hours, remote work, or task reassignment within current role", required: true },
          { id: "3c", text: "Explore alternative positions within the organization (lateral transfers, different departments)", required: true },
          { id: "3d", text: "Consult with the union (if applicable) regarding accommodation options under the collective agreement", required: false },
          { id: "3e", text: "Calculate financial cost of each option (equipment, modifications, third-party support)", required: true },
          { id: "3f", text: "Document all options explored and the reason each was accepted or rejected", required: true },
        ],
        tip: "The duty to accommodate is not satisfied by offering the accommodation that is cheapest or most convenient for the employer. You must offer the accommodation that best meets the employee's needs, subject to undue hardship. The employee gets to choose among equivalent options.",
        citation: "Central Okanagan School District No. 23 v. Renaud, [1992] 2 SCR 970",
        askPrompt: "How far does the duty to accommodate extend before it becomes undue hardship in Ontario?",
      },
      {
        title: "Implement the Accommodation Plan",
        description:
          "Once an accommodation option is agreed upon, document it clearly in a written accommodation plan. The plan should be specific, time-bound, and include review dates.",
        checklist: [
          { id: "4a", text: "Draft written accommodation plan: specific accommodations, start date, duration, review dates", required: true },
          { id: "4b", text: "Confirm sign-off from employee, HR, and direct manager", required: true },
          { id: "4c", text: "Brief the direct manager on the accommodation without disclosing the underlying medical condition", required: true },
          { id: "4d", text: "Arrange any physical modifications, equipment, or schedule changes required", required: true },
          { id: "4e", text: "Set a 30-day check-in date to assess whether accommodation is working", required: true },
        ],
        tip: "Accommodation is an ongoing process — it is not a one-time decision. As the employee's condition changes, the accommodation must be reassessed. The employer has a continuing obligation to update the accommodation as needed.",
        citation: "Ontario Human Rights Code, s.11, 17",
        askPrompt: "What should be included in a written accommodation plan in Ontario?",
      },
      {
        title: "Assess Undue Hardship (If Accommodation Not Possible)",
        description:
          "Only three factors constitute 'undue hardship' in Ontario: cost, outside sources of funding, and health and safety requirements. Inconvenience, employee morale, and business preference do not qualify. The standard is very high — employers rarely meet it.",
        checklist: [
          { id: "5a", text: "Calculate actual financial cost of the accommodation (not estimated impact)", required: true },
          { id: "5b", text: "Identify all government funding, insurance, and outside sources that could offset cost", required: true },
          { id: "5c", text: "If health and safety is the concern: identify the specific safety risk and evidence-based assessment of its magnitude", required: true },
          { id: "5d", text: "Document all findings with supporting evidence before concluding undue hardship exists", required: true },
          { id: "5e", text: "Have legal counsel review any undue hardship determination before communicating to the employee", required: true },
        ],
        tip: "Ontario courts have rejected undue hardship claims where employers said accommodation would be 'disruptive', 'inconvenient for other staff', or 'inconsistent with company culture'. These are not recognized hardship factors. If you believe you have a genuine undue hardship case, build a thorough documented financial analysis.",
        citation: "Ontario Human Rights Code, s.17; Ontario Human Rights Commission v. Simpsons-Sears Ltd., [1985] 2 SCR 536",
        askPrompt: "What is the legal test for undue hardship in an Ontario accommodation case?",
      },
      {
        title: "Document and Monitor the Accommodation",
        description:
          "Accommodation is a living process. Document every interaction, keep the accommodation plan updated, and schedule formal reviews. The employee has ongoing obligations to cooperate and keep the employer informed of changes.",
        checklist: [
          { id: "6a", text: "Retain all accommodation correspondence and medical information in a locked, separate file", required: true },
          { id: "6b", text: "Schedule formal accommodation reviews at 90 days, 6 months, and annually", required: true },
          { id: "6c", text: "Update accommodation plan if the employee's condition or functional limitations change", required: true },
          { id: "6d", text: "If employee fails to cooperate with the process: document and consult legal counsel", required: false },
          { id: "6e", text: "If accommodated employee is unable to return to meaningful work despite exhausting options: consult legal counsel before any employment decision", required: false },
        ],
        tip: "An employee who fails to cooperate in the accommodation process — refuses to provide medical information, declines reasonable accommodations offered — may lose their human rights protection. Document every instance of non-cooperation carefully.",
        citation: "Ontario Human Rights Commission, Policy and Guidelines on Disability and the Duty to Accommodate",
        askPrompt: "What are the employee's obligations in the accommodation process in Ontario?",
      },
    ],
  },

  // ── 4. LAYOFF ────────────────────────────────────────────────────────────────
  {
    slug: "layoff",
    icon: "📋",
    title: "Conducting a Layoff",
    desc: "Temporary vs permanent, notice, recall rights",
    locked: true,
    steps: [
      {
        title: "Determine Layoff Type: Temporary vs. Permanent",
        description:
          "The distinction between a temporary layoff and a permanent termination has enormous legal consequences in Canada. A temporary layoff preserves the employment relationship and recall rights. In many provinces, if a layoff exceeds statutory maximums without recall, it automatically converts to a termination with full severance obligations.",
        checklist: [
          { id: "1a", text: "Determine whether this is a temporary or permanent workforce reduction", required: true },
          { id: "1b", text: "Check employment contract and collective agreement for layoff provisions (some contracts prohibit temporary layoffs)", required: true },
          { id: "1c", text: "In Ontario: temporary layoff permitted up to 13 weeks in a consecutive 20-week period (with benefits continuation) or up to 35 weeks if benefits are maintained", required: true },
          { id: "1d", text: "Identify recall period and obligations", required: true },
          { id: "1e", text: "Assess constructive dismissal risk if employee considers the layoff a termination (especially non-unionized employees)", required: true },
        ],
        tip: "For non-unionized employees in Ontario, a temporary layoff may constitute constructive dismissal at common law if the employment contract does not explicitly permit layoffs. Courts have held that absent an express contractual right, any layoff — even a short one — can be treated as constructive dismissal by the employee.",
        citation: "Ontario ESA 2000, s.56(2); Elsegood v. Cambridge Spring Service (2001) Ltd., 2011 ONCA 831",
        askPrompt: "Can a non-unionized employee treat a temporary layoff as constructive dismissal in Ontario?",
      },
      {
        title: "Give Proper Layoff Notice",
        description:
          "Notice requirements apply to both temporary layoffs and permanent terminations. Failing to give proper notice triggers ESA liability. For group terminations (50+ employees), additional Director of Employment Standards notice is required.",
        checklist: [
          { id: "2a", text: "Calculate statutory notice required based on years of service", required: true },
          { id: "2b", text: "Determine if group termination provisions apply: 50+ employees in 4 weeks = additional 8 weeks mass termination notice in Ontario", required: true },
          { id: "2c", text: "Prepare written layoff notice for each employee", required: true },
          { id: "2d", text: "If group layoff: submit Form 1 (Notice of Group Termination) to the Director of Employment Standards", required: false },
          { id: "2e", text: "Maintain benefits during statutory notice period", required: true },
          { id: "2f", text: "Pay out accrued vacation pay (if permanent termination)", required: true },
        ],
        tip: "In Ontario, the group termination notice must be filed with the Director of Employment Standards before the date of the first termination in the group. Failure to file does not eliminate the employees' entitlements — it creates additional employer liability.",
        citation: "Ontario ESA 2000, s.58; O. Reg. 288/01 (mass termination)",
        askPrompt: "What are the mass termination notice requirements in Ontario?",
      },
      {
        title: "Administer the Layoff Fairly and Document Selection Criteria",
        description:
          "The selection of employees for layoff must be based on legitimate, documented criteria. If the selection process can be perceived as targeting protected groups (older workers, pregnant employees, workers on WSIB claims), you face human rights liability.",
        checklist: [
          { id: "3a", text: "Document the objective selection criteria used: seniority, skill set, role criticality", required: true },
          { id: "3b", text: "Review the layoff list for any disproportionate impact on protected groups", required: true },
          { id: "3c", text: "Ensure no employee on protected leave (pregnancy, parental, WSIB, sick leave) is selected for layoff in relation to that leave", required: true },
          { id: "3d", text: "Provide written notice to each employee with their layoff date and recall rights", required: true },
          { id: "3e", text: "Conduct individual meetings to communicate layoff decision with dignity", required: true },
        ],
        tip: "If your layoff results in 80% of a protected group (e.g., all women over 50 lose their jobs while men retain theirs), that adverse impact requires justification even if individual selection decisions seemed neutral. Review the list through a human rights lens before executing.",
        citation: "Ontario Human Rights Code, s.5; Ontario ESA, s.74 (reprisals prohibited)",
        askPrompt: "How do I protect against human rights claims when selecting employees for layoff in Ontario?",
      },
      {
        title: "Manage Recall Rights",
        description:
          "Employees laid off under the ESA retain recall rights during the layoff period. Failing to offer recall to eligible employees can trigger ESA and wrongful dismissal claims. Document all recall offers and responses carefully.",
        checklist: [
          { id: "4a", text: "Maintain a recall list with employee names, layoff dates, and recall priority order", required: true },
          { id: "4b", text: "When work becomes available, offer recall in order of seniority or agreed priority", required: true },
          { id: "4c", text: "Provide written recall notice to each employee with a reasonable response deadline (minimum 7 days)", required: true },
          { id: "4d", text: "If employee refuses reasonable recall to their former position or a comparable one: document in writing; their recall rights may be forfeited", required: true },
          { id: "4e", text: "If the layoff will become permanent: issue proper termination notice and severance in advance of the ESA temporary layoff deadline", required: true },
        ],
        tip: "If you hire a new employee to fill a role previously held by a laid-off employee without offering recall, you may be liable for wrongful dismissal damages. Always check the recall list before hiring externally.",
        citation: "Ontario ESA 2000, s.56(1)(b), s.64(1)(d)",
        askPrompt: "What are my recall obligations after a temporary layoff in Ontario?",
      },
      {
        title: "Handle Benefits, ROE, and Final Administration",
        description:
          "A layoff triggers the same administrative obligations as a termination in some cases. ROE must be filed, benefits continuation must be addressed, and final pay must be issued for permanent separations.",
        checklist: [
          { id: "5a", text: "File ROE within 5 calendar days of layoff (code A for shortage of work)", required: true },
          { id: "5b", text: "If temporary layoff: advise employees whether benefits will continue and for how long", required: true },
          { id: "5c", text: "If permanent layoff: issue final pay including all accrued vacation", required: true },
          { id: "5d", text: "Brief employees on EI eligibility and how to apply", required: false },
          { id: "5e", text: "Disable system access on the last day for departing employees", required: true },
          { id: "5f", text: "Arrange return of company equipment for departing employees", required: true },
        ],
        tip: "For a temporary layoff, the ROE should show Code A (shortage of work) or Code D (illness/injury for medical leaves). Filing the wrong code can affect the employee's EI claim and create complaints to Service Canada.",
        citation: "Employment Insurance Act; Service Canada ROE Guide",
        askPrompt: "How do I complete an ROE for a temporary layoff in Canada?",
      },
    ],
  },

  // ── 5. HUMAN RIGHTS COMPLAINT ───────────────────────────────────────────────
  {
    slug: "human-rights",
    icon: "⚖️",
    title: "Human Rights Complaint Filed",
    desc: "Internal process, tribunal timelines, documentation",
    locked: true,
    steps: [
      {
        title: "Receive and Triage the Complaint",
        description:
          "A human rights complaint can be filed internally (with HR) or externally (with the applicable tribunal). Understand which body has jurisdiction and what your immediate obligations are. Do not retaliate — doing so is a separate prohibited ground that can significantly increase your exposure.",
        checklist: [
          { id: "1a", text: "Identify the tribunal with jurisdiction: Ontario Human Rights Tribunal, BCHRT, AHRC, CHRC, or provincial equivalent", required: true },
          { id: "1b", text: "Confirm the protected ground alleged: disability, race, sex, age, religion, family status, etc.", required: true },
          { id: "1c", text: "Engage employment legal counsel immediately upon receipt of formal complaint", required: true },
          { id: "1d", text: "Issue an internal memo prohibiting any retaliation against the complainant or witnesses", required: true },
          { id: "1e", text: "Do not terminate, discipline, or change the working conditions of the complainant pending the complaint", required: true },
          { id: "1f", text: "Preserve all relevant documents immediately — issue a litigation hold to IT, HR, and relevant managers", required: true },
        ],
        tip: "Ontario Human Rights Tribunal applications must be filed within 1 year of the last incident. However, the tribunal can extend time for good reasons. Do not assume a complaint filed close to the deadline is time-barred — it requires legal analysis.",
        citation: "Ontario Human Rights Code, s.34(1); HRTO Rules of Procedure",
        askPrompt: "What is the timeline and process for an Ontario Human Rights Tribunal complaint?",
      },
      {
        title: "Respond to the Tribunal Application",
        description:
          "Once a formal HRTO Application is served, you have a strict deadline to file a Response. Missing this deadline results in a default — the Tribunal proceeds without your evidence.",
        checklist: [
          { id: "2a", text: "Note the Response deadline: HRTO requires Response within 35 days of receipt of Application", required: true },
          { id: "2b", text: "Engage legal counsel to prepare the Response (Form 2 for HRTO)", required: true },
          { id: "2c", text: "Response must address: jurisdiction, alleged facts, your version of events, all potential witnesses", required: true },
          { id: "2d", text: "Begin collecting all relevant documents for disclosure", required: true },
          { id: "2e", text: "Brief all internal witnesses and confirm availability", required: true },
        ],
        tip: "The Response is your first and most important document. Inconsistencies between the Response and later evidence are used to undermine credibility. Invest significant time in getting the facts right before filing.",
        citation: "HRTO Rules of Procedure, Rule 14 (Response); Ontario Human Rights Code, s.34",
        askPrompt: "What must be included in a Response to an Ontario Human Rights Tribunal application?",
      },
      {
        title: "Participate in Mediation",
        description:
          "The HRTO offers mediation before scheduling a hearing. Mediation is confidential and without prejudice. Most HRTO applications settle at mediation. The mediator does not decide the case — they facilitate negotiation.",
        checklist: [
          { id: "3a", text: "Assess whether settlement is appropriate given merits of the claim", required: true },
          { id: "3b", text: "Prepare a settlement range: minimum acceptable terms, optimal terms, non-negotiables", required: true },
          { id: "3c", text: "Brief your representative (legal counsel or senior HR) on settlement authority", required: true },
          { id: "3d", text: "Draft a settlement agreement template in advance (confidentiality, scope of release, payment terms)", required: false },
          { id: "3e", text: "Attend mediation with full settlement authority — not being able to settle due to missing approvals damages credibility", required: true },
        ],
        tip: "HRTO mediators are experienced at reality-testing both parties. The typical settlement involves a monetary payment plus non-monetary remedies (letter of reference, acknowledgement, policy changes). Mediation agreements are binding — ensure your legal counsel drafts final terms.",
        citation: "HRTO Rules of Procedure, Rule 21 (Mediation); Ontario Human Rights Code, s.45.3",
        askPrompt: "What remedies can the Ontario Human Rights Tribunal order if a complaint is upheld?",
      },
      {
        title: "Prepare for the Hearing",
        description:
          "If mediation fails, the case proceeds to a formal hearing before an HRTO adjudicator. Preparation is intensive: witness statements, document disclosure, legal arguments. The complainant bears the initial burden of establishing a prima facie case of discrimination.",
        checklist: [
          { id: "4a", text: "Compile complete documentary disclosure: personnel file, communications, policies, all related records", required: true },
          { id: "4b", text: "Prepare witness statements or summaries for all internal witnesses", required: true },
          { id: "4c", text: "Identify and brief all witnesses; confirm availability for hearing dates", required: true },
          { id: "4d", text: "Engage legal counsel for hearing representation", required: true },
          { id: "4e", text: "Prepare legal submissions: was there a prima facie case? Was the reason for the action bona fide? Does the BFOR defence apply?", required: true },
        ],
        tip: "Once the complainant establishes a prima facie case of discrimination (the protected characteristic was a factor in the adverse treatment), the burden shifts to the employer to justify its conduct. Prepare a thorough, documented, non-discriminatory explanation for every action challenged.",
        citation: "Ontario Human Rights Code, s.47; Moore v. British Columbia (Education), 2012 SCC 61",
        askPrompt: "What is the burden of proof at an Ontario Human Rights Tribunal hearing?",
      },
      {
        title: "Implement Remedial Orders and Policy Changes",
        description:
          "If the complaint is upheld — or settled — the employer must implement the agreed or ordered remedies. These typically include monetary compensation, reinstatement, policy changes, training, and public interest remedies. Non-compliance with HRTO orders is a serious offence.",
        checklist: [
          { id: "5a", text: "Calculate and pay all monetary remedies on time (lost wages, general damages for injury to dignity)", required: true },
          { id: "5b", text: "Implement any required policy changes immediately", required: true },
          { id: "5c", text: "Arrange any required training (workplace human rights training, harassment prevention)", required: true },
          { id: "5d", text: "If reinstatement ordered: work with legal counsel on re-integration plan", required: false },
          { id: "5e", text: "File any required compliance reports with the Tribunal on time", required: true },
        ],
        tip: "HRTO general damages for injury to dignity, feelings and self-respect have increased significantly in recent years. Awards of $15,000–$50,000 for injury to dignity are common; in egregious cases (ongoing harassment, targeted racism), awards above $100,000 have been made.",
        citation: "Ontario Human Rights Code, s.45.2; Fair v. Hamilton-Wentworth District School Board, 2013 HRTO 440",
        askPrompt: "What damages can the Ontario Human Rights Tribunal award for a successful discrimination claim?",
      },
      {
        title: "Conduct Post-Complaint Policy and Culture Review",
        description:
          "A human rights complaint — whether founded or not — signals a gap in workplace policy, culture, or management. A post-complaint review reduces recurrence and demonstrates good faith to the Tribunal and future complainants.",
        checklist: [
          { id: "6a", text: "Review and update workplace human rights policy and anti-harassment policy", required: true },
          { id: "6b", text: "Conduct human rights and inclusion training for management", required: false },
          { id: "6c", text: "Assess whether accommodation processes are documented and followed consistently", required: true },
          { id: "6d", text: "Brief senior leadership on complaint outcomes and systemic lessons learned (without identifying individuals)", required: false },
          { id: "6e", text: "Consider whether an external human rights audit is warranted (for organizations with systemic risk)", required: false },
        ],
        tip: "Tribunals and courts look favorably on employers who proactively improve their policies and culture after a complaint. In contrast, employers who dismiss systemic issues and experience repeat complaints often face significantly higher damages for 'systemic discrimination'.",
        citation: "Ontario Human Rights Code, s.45.2(1)(b) (public interest remedies); HRTO jurisprudence",
        askPrompt: "What policy changes should an employer make after a human rights complaint in Ontario?",
      },
      {
        title: "Document Everything and Review Legal Hold",
        description:
          "Once the complaint is resolved, close out your legal hold, archive the file, and confirm all remedies are completed. Maintain the complaint file for a minimum of 7 years.",
        checklist: [
          { id: "7a", text: "Confirm all monetary remedies paid and documented", required: true },
          { id: "7b", text: "Confirm all policy and training remedies completed", required: true },
          { id: "7c", text: "Lift litigation hold and confirm document preservation obligations are met", required: true },
          { id: "7d", text: "Archive complete complaint file (applications, responses, correspondence, settlement/order) for 7 years", required: true },
          { id: "7e", text: "Confirm no retaliation has occurred against any participant in the complaint process", required: true },
        ],
        tip: "If your settlement included a confidentiality clause, ensure all parties (HR, management, legal counsel) understand what can and cannot be disclosed. Breach of a confidentiality clause in an HRTO settlement agreement can result in further proceedings.",
        citation: "Ontario Human Rights Code; HRTO Rules of Procedure, Rule 35 (Enforcement)",
        askPrompt: "How do I enforce a settlement agreement at the Ontario Human Rights Tribunal?",
      },
    ],
  },
];
