// Mock data for demo mode - enriched scenarios by province

export const MOCK_NEWS_DATA = [
  {
    id: 1,
    source: "Ontario Ministry of Labour",
    sourceShort: "ON Labour",
    headline: "Working for Workers Act, 2025: New AI Hiring Disclosure Requirements in Effect",
    summary:
      "Ontario employers must now disclose use of AI tools in the hiring process within job postings, effective January 1, 2026. Non-compliance triggers ESA enforcement.",
    date: "Mar 5, 2026",
    provinces: ["ON"],
    topic: "Hiring",
    color: "#2d6a4f",
  },
  {
    id: 2,
    source: "ESDC Canada",
    sourceShort: "Federal",
    headline:
      "Canada Labour Code Amendments: Federally Regulated Employer Bereavement Leave Expansion",
    summary:
      "Federal employers must now provide up to 10 days of bereavement leave for expanded family categories including chosen family, effective March 2026.",
    date: "Mar 3, 2026",
    provinces: ["Federal"],
    topic: "Leaves",
    color: "#1a4480",
  },
  {
    id: 3,
    source: "CNESST Québec",
    sourceShort: "CNESST",
    headline:
      "Mise à jour: Harcèlement psychologique — nouvelles lignes directrices d'enquête 2026",
    summary:
      "La CNESST publie des lignes directrices révisées pour les enquêtes sur le harcèlement psychologique, réduisant les délais de réponse requis de 90 à 60 jours.",
    date: "Mar 1, 2026",
    provinces: ["QC"],
    topic: "Harassment",
    color: "#7b3f6e",
  },
  {
    id: 4,
    source: "BC Employment Standards",
    sourceShort: "BC ESB",
    headline:
      "BC Court of Appeal: Reasonable Notice Period Expanded for Remote Workers",
    summary:
      "The BC Court of Appeal ruled that remote workers may be entitled to longer reasonable notice periods due to reduced mobility and market access considerations.",
    date: "Feb 28, 2026",
    provinces: ["BC"],
    topic: "Termination",
    color: "#9b4400",
  },
  {
    id: 5,
    source: "CPHR Canada",
    sourceShort: "CPHR",
    headline:
      "2026 National HR Compensation Report: Canadian Wages Up 4.2% Year-Over-Year",
    summary:
      "CPHR Canada's annual compensation survey reveals average Canadian HR professional salaries increased 4.2%, with Alberta and BC leading growth driven by resource sector demand.",
    date: "Feb 26, 2026",
    provinces: ["ON", "BC", "AB"],
    topic: "Compensation",
    color: "#1a4480",
  },
  {
    id: 6,
    source: "Alberta Labour",
    sourceShort: "AB Labour",
    headline: "Alberta Bill 7: Changes to Group Termination Notice Requirements",
    summary:
      "Alberta's new group termination provisions require employers to provide 4 weeks advance notice to the Director of Employment Standards when terminating 50 or more employees.",
    date: "Feb 24, 2026",
    provinces: ["AB"],
    topic: "Termination",
    color: "#5c3200",
  },
  {
    id: 7,
    source: "Manitoba Labour",
    sourceShort: "MB Labour",
    headline: "Manitoba: Maximum Probation Period Extended to 6 Months",
    summary:
      "Employers in Manitoba can now extend the initial probation period for new hires up to 6 months (previously 3 months) for skilled positions requiring training.",
    date: "Feb 22, 2026",
    provinces: ["MB"],
    topic: "Hiring",
    color: "#6b4c3a",
  },
  {
    id: 8,
    source: "Saskatchewan Labour",
    sourceShort: "SK Labour",
    headline: "Saskatchewan Employment Standards: Remote Work Policy Guidelines",
    summary:
      "New guidance released for employers on documenting remote work arrangements, including equipment responsibility, compensation adjustments, and overtime tracking.",
    date: "Feb 20, 2026",
    provinces: ["SK"],
    topic: "Accommodation",
    color: "#4a6b5e",
  },
];

export const MOCK_COMPARISONS = {
  "Termination Notice (5 years)": {
    ON: "2 weeks statutory + common law exposure of ~5 months",
    BC: "2 weeks statutory + common law exposure of ~5 months",
    AB: "2 weeks statutory + common law exposure of ~4–5 months",
    QC: "3 weeks statutory (ARLS) + common law exposure varies",
    MB: "2 weeks statutory",
    SK: "4 weeks statutory",
    NS: "2 weeks statutory",
    NB: "2 weeks statutory",
    NL: "2 weeks statutory + common law exposure",
    PE: "2 weeks statutory",
    YT: "2 weeks statutory",
    NT: "2 weeks statutory",
    NU: "2 weeks statutory",
  },
  "Vacation Entitlement (Year 1)": {
    ON: "2 weeks (4% vacation pay)",
    BC: "2 weeks (4% vacation pay)",
    AB: "2 weeks (4% vacation pay)",
    QC: "2 weeks (4% indemnité de vacances)",
    MB: "2 weeks (4% vacation pay)",
    SK: "3 weeks (3/52 vacation pay)",
    NS: "2 weeks",
    NB: "2 weeks",
    NL: "2 weeks",
    PE: "2 weeks",
    YT: "2 weeks",
    NT: "2 weeks",
    NU: "2 weeks",
  },
  "Harassment Investigation": {
    ON: "Mandatory formal investigation required under OHSA Bill 132",
    BC: "Investigation required under WorkSafeBC policy",
    AB: "Investigation required under OHS Act",
    QC: "Investigation required under ARLS within 60 days",
    MB: "Investigation required under Safe Work Manitoba",
    SK: "Investigation required under OHS Regulations",
    NS: "Investigation required under OHS Regulations",
    NB: "Investigation required under OHS Regulations",
    NL: "Investigation required under OHS Regulations",
    PE: "Investigation required under OHS Regulations",
    YT: "Investigation required under OHS Act",
    NT: "Investigation required under OHS Act",
    NU: "Investigation required under OHS Act",
  },
  "Probation Period Maximum": {
    ON: "3 months (ESA minimum entitlements apply after)",
    BC: "3 months",
    AB: "No statutory probation — common law applies",
    QC: "3 months",
    MB: "6 months (skilled positions)",
    SK: "No statutory probation period",
    NS: "3 months (employer practice)",
    NB: "3 months (employer practice)",
    NL: "3 months",
    PE: "3 months (employer practice)",
    YT: "3 months",
    NT: "3 months",
    NU: "3 months",
  },
  "Sick Leave Entitlement": {
    ON: "3 days (paid if 5+ years service)",
    BC: "3 days (paid if 5+ years service)",
    AB: "3 days (unpaid)",
    QC: "Not statutory (employer discretion)",
    MB: "No statutory requirement",
    SK: "No statutory requirement",
    NS: "3 days",
    NB: "3 days",
    NL: "3 days",
    PE: "3 days",
    YT: "3 days",
    NT: "3 days",
    NU: "3 days",
  },
};

export const MOCK_TEMPLATES = [
  {
    name: "Termination Letter (No Cause)",
    province: "ON",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    name: "Termination Letter (No Cause)",
    province: "BC",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    name: "Termination Letter (No Cause)",
    province: "AB",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    name: "Termination for Just Cause Letter",
    province: "ON",
    reviewed: "Feb 2026",
    tag: "Termination",
    locked: false,
  },
  {
    name: "Progressive Discipline — Written Warning",
    province: "All",
    reviewed: "Dec 2025",
    tag: "Discipline",
    locked: false,
  },
  {
    name: "Accommodation Request Acknowledgment",
    province: "All",
    reviewed: "Feb 2026",
    tag: "Accommodation",
    locked: false,
  },
  {
    name: "Harassment Investigation Initiation Letter",
    province: "ON",
    reviewed: "Feb 2026",
    tag: "Harassment",
    locked: false,
  },
  {
    name: "Harassment Investigation Initiation Letter",
    province: "QC",
    reviewed: "Feb 2026",
    tag: "Harassment",
    locked: false,
  },
  {
    name: "Parental Leave Acknowledgment (Québec)",
    province: "QC",
    reviewed: "Jan 2026",
    tag: "Leaves",
    locked: true,
  },
  {
    name: "Return to Work Plan",
    province: "All",
    reviewed: "Dec 2025",
    tag: "Accommodation",
    locked: true,
  },
  {
    name: "Employment Contract — Termination Clause (post-Waksdale)",
    province: "ON",
    reviewed: "Feb 2026",
    tag: "Contract",
    locked: true,
  },
  {
    name: "Severance Payment Agreement",
    province: "ON",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: true,
  },
];

export const MOCK_WALKTHROUGHS = [
  {
    icon: "⚠️",
    title: "Terminating an Employee",
    steps: 8,
    provinces: 13,
    desc: "Without cause or for cause — province-specific checklist",
  },
  {
    icon: "🛡️",
    title: "Harassment Complaint Received",
    steps: 7,
    provinces: 13,
    desc: "Investigation process, timelines, documentation",
  },
  {
    icon: "♿",
    title: "Accommodation Request",
    steps: 6,
    provinces: 13,
    desc: "Duty to accommodate to the point of undue hardship",
  },
  {
    icon: "📋",
    title: "Conducting a Layoff",
    steps: 5,
    provinces: 13,
    desc: "Temporary vs permanent, notice, recall rights",
  },
  {
    icon: "⚖️",
    title: "Human Rights Complaint Filed",
    steps: 7,
    provinces: 13,
    desc: "Internal process, tribunal timelines, documentation",
  },
];

// Rich mock responses for different keywords
export const MOCK_RESPONSES: Record<
  string,
  { answer: string; source: string; confidence: "high" | "medium" | "low" }
> = {
  termination: {
    answer:
      "In Ontario, you can terminate an employee without cause. However, you must provide statutory notice under the ESA or pay in lieu. For 6+ years of service, the minimum notice is 6 weeks. The real exposure is common law reasonable notice, which typically runs 1 month per year of service. To minimize legal risk: (1) provide written notice immediately, (2) offer severance if appropriate, (3) document the termination, and (4) ensure all final pay is accurate including any accrued entitlements.",
    source:
      "Ontario Employment Standards Act, s.57 (notice); Keays v. Honda of Canada, 2008 SCC 39",
    confidence: "high",
  },
  harassment: {
    answer:
      "Harassment and discrimination are distinct. Harassment is unwelcome conduct based on a protected ground (race, sex, disability, etc.) that creates a hostile work environment. Discrimination is treating someone adversely because of a protected ground. Both are prohibited under human rights law. Your obligations: (1) establish a harassment policy, (2) investigate complaints promptly (within 60 days in QC, immediately in ON), (3) document findings, (4) take corrective action, and (5) prevent retaliation. Failure to investigate exposes you to human rights tribunal complaints.",
    source:
      "Ontario Human Rights Code, s.5; OHSA, s.50 (violence and harassment)",
    confidence: "high",
  },
  "parental leave": {
    answer:
      "Parental leave eligibility varies by province. In Ontario: (1) 12 months of continuous employment required, (2) 1,250 hours worked in past 12 months, (3) up to 63 weeks unpaid leave available. In BC: similar thresholds but 62 weeks unpaid leave. In Quebec: up to 71 weeks combined parental/maternity leave. Key: the employee must provide notice typically 2 weeks before the leave starts. Benefits such as health insurance must continue during leave. Upon return, the employee must be reinstated to the same or equivalent position.",
    source: "Ontario ESA, s.35–40; BC ESA, s.63–70",
    confidence: "high",
  },
  accommodation: {
    answer:
      "The duty to accommodate is a legal obligation in all Canadian jurisdictions. When an employee requests accommodation (e.g., for disability, religion, or family status), you must: (1) investigate and understand the need, (2) explore options that meet the need, (3) implement the best option that doesn't cause undue hardship, (4) document the process. Undue hardship is determined by cost, health/safety, and operational requirements. The burden is on the employer to prove undue hardship. Failure to accommodate can result in human rights complaints and significant liability.",
    source: "Canadian Human Rights Act, s.7; Meiorin v. Doig Lake First Nation",
    confidence: "high",
  },
  severance: {
    answer:
      "Severance and notice are separate entitlements in most provinces. In Ontario: severance pay under the ESA applies if the employee earned over $35,000/year AND your payroll exceeded $2.5M. The amount is 1 week per year of service, capped at 26 weeks. This is in addition to notice. Common law severance (through court awards for wrongful dismissal) is unpredictable and typically 1 month per year of service. To avoid litigation, offering 2–3 months salary as a negotiated severance is common practice.",
    source: "Ontario ESA, s.64 (severance pay)",
    confidence: "medium",
  },
  "non-compete": {
    answer:
      "Non-compete agreements are enforceable in most Canadian provinces, but only if they meet a reasonableness test. To be enforceable, a non-compete must be: (1) reasonable in duration (1–2 years typically acceptable), (2) reasonable in geographic scope (limited to business territory), and (3) reasonable in scope of activity (limited to employer's legitimate interests). Alberta and Quebec courts are stricter on non-competes. Overly broad agreements are unenforceable. Even reasonable non-competes may be challenged, so clarity and proper drafting are essential.",
    source:
      "Common law; Lysko v. Braley, 2006 AB 206; R. Boulanger v. Dunham-Bush Canada",
    confidence: "medium",
  },
  "pay equity": {
    answer:
      "Ontario has a pay equity law that requires employers with 10+ employees to ensure equal pay for equal work, regardless of gender. In federal jurisdiction, the Canadian Human Rights Act prohibits pay discrimination. Quebec has similar requirements. To comply: (1) conduct a pay equity audit, (2) identify job classes, (3) compare compensation across genders, (4) correct gaps by increasing pay (not reducing), and (5) maintain documentation. Failure to comply exposes you to complaints and pay-out orders. Private sector employers must also maintain records of compensation for 3 years.",
    source: "Ontario Pay Equity Act; Canadian Human Rights Act, s.11",
    confidence: "high",
  },
  "record keeping": {
    answer:
      "Employment record-keeping requirements vary by jurisdiction but generally require: (1) 3 years of records in Ontario, 2 years in BC, (2) hours worked, wages, deductions, benefits, (3) vacation tracking, (4) statutory deductions, (5) tax documents. Records must be accessible and can be electronic or paper. The Ministry of Labour can inspect records on request. Failure to maintain records can result in fines and makes it harder to defend against employee claims. Pro tip: use payroll software that auto-archives records.",
    source:
      "Ontario ESA, s.15 (record-keeping); BC ESA, s.84 (record retention)",
    confidence: "high",
  },
  hiring: {
    answer:
      "During hiring, avoid any questions related to protected grounds: age, race, religion, disability, family/marital status, sexual orientation, or national origin. You can ask about: (1) relevant work experience, (2) skills and education, (3) availability, (4) transportation to the workplace. You cannot ask about criminal records except in limited circumstances. Ontario's 2025 Working for Workers Act now requires AI disclosure in job postings. If you use AI in hiring, you must disclose it. Always document interview notes and hiring decisions for compliance.",
    source:
      "Ontario Human Rights Code, s.5; Working for Workers Act, 2025",
    confidence: "high",
  },
};
