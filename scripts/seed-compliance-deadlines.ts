/**
 * Seed script: populates compliance_deadlines with Canadian HR/employment law deadlines.
 * Covers 2026. Run: npx tsx scripts/seed-compliance-deadlines.ts
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

interface Deadline {
  title: string;
  deadline_type: string;
  description: string;
  due_date: string;
  recurrence: string;
  provinces: string[];
  consequence: string;
  action_items: string[];
  authority: string;
  source_url?: string;
}

const DEADLINES: Deadline[] = [
  // ── TAX ────────────────────────────────────────────────────────────────────
  {
    title: "T4 & T4A slips issued to employees",
    deadline_type: "tax",
    description: "Employers must issue T4 slips to all employees and T4A to contractors for the prior calendar year by February 28.",
    due_date: "2026-02-28",
    recurrence: "annual",
    provinces: ["Federal"],
    consequence: "CRA penalty of $25–$75 per slip, up to $7,500 per filing.",
    action_items: ["Compile payroll data for all employees", "Generate T4/T4A slips in payroll system", "Distribute to employees by Feb 28"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/t4-information-slips.html",
  },
  {
    title: "T4 Summary filed with CRA",
    deadline_type: "tax",
    description: "Employers must file the T4 Summary return with CRA for the prior calendar year by February 28.",
    due_date: "2026-02-28",
    recurrence: "annual",
    provinces: ["Federal"],
    consequence: "Late filing penalty: 3% of remittances, minimum $100.",
    action_items: ["Reconcile all T4 slips", "File T4 Summary via CRA My Business Account", "Retain copies for 6 years"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/t4-information-slips.html",
  },
  {
    title: "Ontario Employer Health Tax (EHT) Annual Return",
    deadline_type: "tax",
    description: "Ontario employers with total Ontario payroll under $1.2M must file and pay EHT annual return by March 31.",
    due_date: "2026-03-31",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "Interest at prime + 3% on outstanding balance; penalties for late filing.",
    action_items: ["Calculate total Ontario remuneration", "File EHT annual return via Ontario Business Registry", "Pay any outstanding balance"],
    authority: "Ontario Ministry of Finance",
    source_url: "https://www.ontario.ca/document/employer-health-tax-eht-how-pay",
  },
  {
    title: "BC Employer Health Tax (EHT) Annual Return",
    deadline_type: "tax",
    description: "BC employers with BC payroll over $1,000,000 must file and pay BC EHT by March 31.",
    due_date: "2026-03-31",
    recurrence: "annual",
    provinces: ["BC"],
    consequence: "Penalty of 3% on outstanding balance; interest accrues at prescribed rate.",
    action_items: ["Confirm total BC remuneration for prior year", "File via eTaxBC online portal", "Pay balance owing"],
    authority: "BC Ministry of Finance",
    source_url: "https://www2.gov.bc.ca/gov/content/taxes/employer-health-tax",
  },
  {
    title: "Alberta WCB Payroll Declaration",
    deadline_type: "tax",
    description: "Alberta employers must report actual payroll to WCB-Alberta by February 28 to reconcile premium payments.",
    due_date: "2026-02-28",
    recurrence: "annual",
    provinces: ["AB"],
    consequence: "Estimated assessment levied plus 15% surcharge on underpayment.",
    action_items: ["Compile total Alberta payroll for prior year", "Submit via MyWCB employer portal", "Pay any outstanding premiums"],
    authority: "WCB Alberta",
    source_url: "https://www.wcb.ab.ca/employers/managing-your-account/annual-payroll-reporting.html",
  },
  {
    title: "Corporate Tax Return (December Year-End)",
    deadline_type: "tax",
    description: "Canadian-controlled private corporations with December 31 year-end must file T2 return by June 30.",
    due_date: "2026-06-30",
    recurrence: "annual",
    provinces: ["Federal"],
    consequence: "5% penalty on unpaid taxes plus 1% per month for up to 12 months.",
    action_items: ["Finalize financial statements", "Complete T2 return with accountant", "File via CRA My Business Account or EFILE"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-payments.html",
  },

  // ── REMITTANCE (Federal — monthly) ─────────────────────────────────────────
  {
    title: "Federal Payroll Remittance — April 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for March 2026 by April 15.",
    due_date: "2026-04-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late; director personal liability applies.",
    action_items: ["Reconcile March payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — May 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for April 2026 by May 15.",
    due_date: "2026-05-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late; director personal liability applies.",
    action_items: ["Reconcile April payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — June 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for May 2026 by June 15.",
    due_date: "2026-06-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile May payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — July 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for June 2026 by July 15.",
    due_date: "2026-07-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile June payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — August 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for July 2026 by August 17 (15th falls on weekend).",
    due_date: "2026-08-17",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile July payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — September 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for August 2026 by September 15.",
    due_date: "2026-09-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile August payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — October 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for September 2026 by October 15.",
    due_date: "2026-10-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile September payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — November 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for October 2026 by November 16 (15th falls on Sunday).",
    due_date: "2026-11-16",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile October payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },
  {
    title: "Federal Payroll Remittance — December 2026",
    deadline_type: "remittance",
    description: "Regular remitters must remit CPP, EI, and income tax deductions for November 2026 by December 15.",
    due_date: "2026-12-15",
    recurrence: "monthly",
    provinces: ["Federal"],
    consequence: "Penalty of 3%–10% of remittance depending on days late.",
    action_items: ["Reconcile November payroll source deductions", "Remit via CRA My Business Account or bank online"],
    authority: "Canada Revenue Agency",
    source_url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/remitting-source-deductions.html",
  },

  // ── HR POLICY ──────────────────────────────────────────────────────────────
  {
    title: "Ontario Workplace Harassment Policy Annual Review",
    deadline_type: "hr_policy",
    description: "OHSA s.32.0.6 requires employers to review their written workplace harassment and violence policies at least annually.",
    due_date: "2026-06-30",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "Inspector may issue compliance order; fines up to $500,000 for corporations under OHSA.",
    action_items: ["Convene joint health and safety committee review", "Update policy language for any legislative changes", "Re-post updated policy in workplace", "Redistribute to all workers including remote"],
    authority: "Ontario Ministry of Labour — OHSA s.32.0.6",
    source_url: "https://www.ontario.ca/laws/statute/90o01",
  },
  {
    title: "Federal Workplace Violence & Harassment Prevention Plan Review",
    deadline_type: "hr_policy",
    description: "Canada Labour Code Part II (Bill C-65 / WPHVP Regulations) requires federally regulated employers to review their prevention plan and workplace assessment annually.",
    due_date: "2026-03-31",
    recurrence: "annual",
    provinces: ["Federal"],
    consequence: "Labour Program may issue compliance order; potential prosecution under Canada Labour Code.",
    action_items: ["Conduct joint workplace assessment with health and safety representative", "Review and update prevention plan", "Deliver mandatory training to employees", "Document and retain records for 10 years"],
    authority: "Employment and Social Development Canada — CLC Part II",
    source_url: "https://www.canada.ca/en/employment-social-development/programs/workplace-harassment.html",
  },
  {
    title: "BC OHS Program Annual Review",
    deadline_type: "hr_policy",
    description: "BC employers with 20 or more workers must maintain and annually review a written occupational health and safety program under the Workers Compensation Act.",
    due_date: "2026-06-30",
    recurrence: "annual",
    provinces: ["BC"],
    consequence: "WorkSafeBC may issue stop-work order and fines; director liability possible.",
    action_items: ["Review prior year incident statistics and near-misses", "Update hazard identification and control measures", "Conduct worker consultation meeting", "Submit updated program to WorkSafeBC if requested"],
    authority: "WorkSafeBC — Workers Compensation Act s.118",
    source_url: "https://www.worksafebc.com/en/law-policy/occupational-health-safety/searchable-ohs-regulation",
  },
  {
    title: "Alberta OHS Program Annual Review",
    deadline_type: "hr_policy",
    description: "Alberta employers must review their occupational health and safety program annually and document the review with worker participation.",
    due_date: "2026-09-30",
    recurrence: "annual",
    provinces: ["AB"],
    consequence: "OHS officer may issue compliance order; fines up to $500,000 per offence.",
    action_items: ["Schedule OHS committee annual review meeting", "Review and update OHS manual and hazard assessments", "Update emergency response plan", "Document worker participation and sign-off"],
    authority: "Alberta OHS — Occupational Health and Safety Act",
    source_url: "https://ohs-pubstore.labour.alberta.ca",
  },
  {
    title: "Ontario AODA Accessibility Compliance Report",
    deadline_type: "hr_policy",
    description: "Ontario private-sector organizations with 20 or more employees must file an AODA compliance report every 3 years (next filing December 31, 2026).",
    due_date: "2026-12-31",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "Administrative penalty up to $100,000 per day for corporations.",
    action_items: ["Audit compliance with Integrated Accessibility Standards Regulation", "Train staff on accessible customer service", "Complete and file report via AccessOntario portal"],
    authority: "Ontario Ministry for Seniors and Accessibility — AODA",
    source_url: "https://www.ontario.ca/page/completing-your-accessibility-compliance-report",
  },
  {
    title: "Federal Pay Equity Plan Publication",
    deadline_type: "hr_policy",
    description: "Federally regulated employers with 10 or more employees must publish their pay equity plan and post it in the workplace.",
    due_date: "2026-09-03",
    recurrence: "one_time",
    provinces: ["Federal"],
    consequence: "Penalties up to $50,000 per day of non-compliance issued by Pay Equity Commissioner.",
    action_items: ["Form pay equity committee (if 100+ employees)", "Identify male and female predominant job classes", "Calculate pay equity gaps", "Post finalized plan in workplace and on company intranet"],
    authority: "Pay Equity Commissioner of Canada — Pay Equity Act (2021)",
    source_url: "https://www.canada.ca/en/pay-equity-commissioner.html",
  },
  {
    title: "BC Pay Transparency Report — 1,000+ Employees",
    deadline_type: "hr_policy",
    description: "BC employers with 1,000 or more employees must publish an annual pay transparency report by November 1.",
    due_date: "2026-11-01",
    recurrence: "annual",
    provinces: ["BC"],
    consequence: "Director of Employment Standards may require compliance; reputational and regulatory risk.",
    action_items: ["Conduct gender-based pay analysis across all job categories", "Prepare report per BC Pay Transparency Act template", "Post publicly on company website and submit to government"],
    authority: "BC Office of the Human Rights Commissioner — Pay Transparency Act",
    source_url: "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/pay-transparency",
  },

  // ── STATUTORY ──────────────────────────────────────────────────────────────
  {
    title: "Ontario ESA Poster — Annual Distribution Check",
    deadline_type: "statutory",
    description: "Ontario employers must ensure the current ESA poster is displayed in the workplace and provided to new hires. Review annually for any updated versions.",
    due_date: "2026-01-31",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "Order to comply under ESA s.2; potential prosecution and fines.",
    action_items: ["Download latest ESA poster from Ontario Ministry of Labour website", "Post visibly in all workplace locations", "Send digital copy to remote and hybrid workers", "Provide to all new hires at onboarding"],
    authority: "Ontario Ministry of Labour — ESA s.2",
    source_url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0",
  },
  {
    title: "Ontario Vacation Pay Calculation — Calendar Year Review",
    deadline_type: "statutory",
    description: "Ontario ESA s.33 requires employers to calculate and pay vacation pay to employees who have completed 12 months of employment. Annual review ensures compliance for all eligible staff.",
    due_date: "2026-03-31",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "ESA violations: order to pay outstanding vacation pay plus 10% interest; potential prosecution.",
    action_items: ["Identify all employees completing 12-month anniversaries in Q1", "Calculate accrued vacation pay (min. 4% of gross wages for <5 years)", "Issue vacation pay or schedule vacation time", "Update payroll records"],
    authority: "Ontario Ministry of Labour — ESA s.33–41",
    source_url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/vacation",
  },
  {
    title: "Ontario Minimum Wage Rate Update",
    deadline_type: "statutory",
    description: "Ontario minimum wage increases annually on October 1. Employers must update payroll to reflect new rates.",
    due_date: "2026-10-01",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "ESA violations: order to pay outstanding wages; potential prosecution; reputational risk.",
    action_items: ["Check new rate on Ontario Ministry of Labour website each September", "Update payroll system and rate cards", "Notify affected hourly employees in writing before October 1"],
    authority: "Ontario Ministry of Labour — ESA s.23",
    source_url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
  },
  {
    title: "BC Minimum Wage Rate Update",
    deadline_type: "statutory",
    description: "BC minimum wage is reviewed annually on June 1. Employers must update payroll if the rate changes.",
    due_date: "2026-06-01",
    recurrence: "annual",
    provinces: ["BC"],
    consequence: "ESA violations: order to pay wages owing; potential prosecution by Director of Employment Standards.",
    action_items: ["Monitor BC Employment Standards Branch announcements in spring", "Update payroll system effective June 1", "Notify affected employees of new rate"],
    authority: "BC Employment Standards Branch — ESA s.16",
    source_url: "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/forms-resources/minimum-wage",
  },
  {
    title: "Alberta Minimum Wage Rate Review",
    deadline_type: "statutory",
    description: "Alberta minimum wage is reviewed periodically. Employers should verify the current rate each October.",
    due_date: "2026-10-01",
    recurrence: "annual",
    provinces: ["AB"],
    consequence: "Employment Standards Code violations: order to pay outstanding wages; administrative penalties.",
    action_items: ["Check Alberta Employment Standards website for any rate changes", "Update payroll system and rate schedules", "Notify affected employees"],
    authority: "Alberta Employment Standards — Employment Standards Code s.3",
    source_url: "https://www.alberta.ca/minimum-wage.aspx",
  },
  {
    title: "Manitoba Minimum Wage Rate Update",
    deadline_type: "statutory",
    description: "Manitoba minimum wage is reviewed annually on October 1.",
    due_date: "2026-10-01",
    recurrence: "annual",
    provinces: ["MB"],
    consequence: "Employment Standards Code violations: order to pay wages owing; fines.",
    action_items: ["Check Manitoba Employment Standards website in September", "Update payroll system effective October 1", "Notify affected employees"],
    authority: "Manitoba Employment Standards — Employment Standards Code",
    source_url: "https://www.gov.mb.ca/labour/standards/doc,minimumwage,factsheet.html",
  },
  {
    title: "Federal Minimum Wage Rate Update",
    deadline_type: "statutory",
    description: "Federal minimum wage (for federally regulated employees) is adjusted annually on April 1.",
    due_date: "2026-04-01",
    recurrence: "annual",
    provinces: ["Federal"],
    consequence: "Canada Labour Code violations: order to pay wages owing; inspections.",
    action_items: ["Check ESDC website for updated federal minimum wage", "Update payroll system for federally regulated employees", "Communicate new rate to affected employees"],
    authority: "Employment and Social Development Canada — Canada Labour Code s.178",
    source_url: "https://www.canada.ca/en/employment-social-development/programs/employment-standards/federal-minimum-wage.html",
  },

  // ── WSIB / WCB ─────────────────────────────────────────────────────────────
  {
    title: "WSIB Ontario — Reconciliation of Insurable Earnings",
    deadline_type: "wsib",
    description: "Ontario employers must reconcile actual insurable earnings against prior year estimates with WSIB by March 31.",
    due_date: "2026-03-31",
    recurrence: "annual",
    provinces: ["ON"],
    consequence: "Penalty premium surcharge on underpayment; interest on outstanding balance.",
    action_items: ["Pull final payroll data for all Ontario workers", "Log into WSIB Online Services", "Submit reconciliation and pay any balance owing"],
    authority: "Workplace Safety and Insurance Board (WSIB) Ontario",
    source_url: "https://www.wsib.ca/en/businesses/premiums-and-payments",
  },
  {
    title: "WSIB Ontario — Q2 Interim Premium Installment",
    deadline_type: "wsib",
    description: "Ontario employers with annual premiums over $1,000 must pay quarterly interim installments. Q2 due June 30.",
    due_date: "2026-06-30",
    recurrence: "quarterly",
    provinces: ["ON"],
    consequence: "Interest on overdue installments; potential account suspension.",
    action_items: ["Calculate Q2 insurable earnings", "Pay WSIB interim premium via Online Services portal"],
    authority: "WSIB Ontario",
    source_url: "https://www.wsib.ca/en/businesses/premiums-and-payments",
  },
  {
    title: "WSIB Ontario — Q3 Interim Premium Installment",
    deadline_type: "wsib",
    description: "Ontario employers with annual premiums over $1,000 must pay quarterly interim installments. Q3 due September 30.",
    due_date: "2026-09-30",
    recurrence: "quarterly",
    provinces: ["ON"],
    consequence: "Interest on overdue installments; potential account suspension.",
    action_items: ["Calculate Q3 insurable earnings", "Pay WSIB interim premium via Online Services portal"],
    authority: "WSIB Ontario",
    source_url: "https://www.wsib.ca/en/businesses/premiums-and-payments",
  },
  {
    title: "WorkSafeBC — Payroll Declaration",
    deadline_type: "wsib",
    description: "BC employers must file actual payroll declaration with WorkSafeBC by March 2 to reconcile prior year premium payments.",
    due_date: "2026-03-02",
    recurrence: "annual",
    provinces: ["BC"],
    consequence: "Estimated assessment levied plus 15% surcharge on underpayment; interest accrues.",
    action_items: ["Confirm total BC payroll for prior year by industry class", "Submit payroll declaration via WorkSafeBC Employer Reporting", "Pay any outstanding premium balance"],
    authority: "WorkSafeBC — Workers Compensation Act",
    source_url: "https://www.worksafebc.com/en/insurance/employer-reporting",
  },
  {
    title: "WorkSafeBC — Q2 Premium Installment",
    deadline_type: "wsib",
    description: "BC employers required to pay quarterly installments must remit Q2 WorkSafeBC premiums by June 30.",
    due_date: "2026-06-30",
    recurrence: "quarterly",
    provinces: ["BC"],
    consequence: "Interest charges on late payments; account placed on review.",
    action_items: ["Calculate Q2 BC payroll in insurable earnings", "Pay via WorkSafeBC online portal"],
    authority: "WorkSafeBC",
    source_url: "https://www.worksafebc.com/en/insurance/employer-reporting",
  },
  {
    title: "WCB Alberta — Annual Payroll Declaration",
    deadline_type: "wsib",
    description: "Alberta employers must report actual payroll to WCB-Alberta annually for premium reconciliation.",
    due_date: "2026-02-28",
    recurrence: "annual",
    provinces: ["AB"],
    consequence: "Estimated assessment levied; 15% surcharge; loss of clearance certificate.",
    action_items: ["Compile total Alberta payroll by industry classification", "File via MyWCB employer portal", "Pay any balance and request clearance letter"],
    authority: "WCB Alberta — Workers' Compensation Act",
    source_url: "https://www.wcb.ab.ca/employers/managing-your-account/annual-payroll-reporting.html",
  },
  {
    title: "Manitoba WCB — Annual Payroll Report",
    deadline_type: "wsib",
    description: "Manitoba employers must report actual wages to WCB Manitoba by February 28 for premium reconciliation.",
    due_date: "2026-02-28",
    recurrence: "annual",
    provinces: ["MB"],
    consequence: "Estimated assessment and surcharge; potential clearance issues.",
    action_items: ["Report actual wages via WCB Manitoba online portal", "Reconcile any overpayment or underpayment", "Obtain clearance certificate"],
    authority: "WCB Manitoba — Workers Compensation Act",
    source_url: "https://www.wcb.mb.ca/employers",
  },
];

async function seed() {
  console.log(`Seeding ${DEADLINES.length} compliance deadlines...\n`);
  let inserted = 0;
  let skipped = 0;

  for (const d of DEADLINES) {
    // Check if already exists (by title + due_date)
    const exists = await sql`
      SELECT id FROM compliance_deadlines
      WHERE title = ${d.title} AND due_date = ${d.due_date}
    `;
    if (exists.rows.length > 0) {
      console.log(`  SKIP: ${d.title} (${d.due_date})`);
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO compliance_deadlines
        (title, deadline_type, description, due_date, recurrence, provinces,
         consequence, action_items, authority, source_url)
      VALUES (
        ${d.title},
        ${d.deadline_type},
        ${d.description},
        ${d.due_date},
        ${d.recurrence},
        ${d.provinces as unknown as string},
        ${d.consequence},
        ${d.action_items as unknown as string},
        ${d.authority},
        ${d.source_url ?? null}
      )
    `;
    console.log(`  ✓ ${d.title} (${d.due_date})`);
    inserted++;
  }

  console.log(`\n✓ Done: ${inserted} inserted, ${skipped} skipped.`);
}

seed().catch(console.error);
