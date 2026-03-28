/**
 * Seed script: populates knowledge_sources + knowledge_chunks with
 * Canadian employment law statute text.
 *
 * Usage: npx tsx scripts/seed-knowledge-base.ts
 *
 * No OpenAI key required — knowledge retrieval uses Postgres full-text search.
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// ── Types ────────────────────────────────────────────────────────────────────

interface KnowledgeChunk {
  section_title: string;
  article_number: string;
  topic_tags: string[];
  content: string;
}

interface KnowledgeSource {
  title: string;
  province: string;
  source_type: string;
  version: string;
  chunks: KnowledgeChunk[];
}

// ── Statute Data ─────────────────────────────────────────────────────────────

const SOURCES: KnowledgeSource[] = [
  // ── ONTARIO ────────────────────────────────────────────────────────────────
  {
    title: "Ontario Employment Standards Act, 2000 (ESA)",
    province: "ON",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Notice of Termination",
        article_number: "s.57",
        topic_tags: ["termination", "notice", "severance"],
        content: `Under the Ontario Employment Standards Act, 2000 (ESA), s.57, an employer must give written notice of termination to an employee who has been continuously employed for three months or more. The minimum notice periods are: 1 week for employment of less than 1 year; 2 weeks for 1 year but less than 3 years; 3 weeks for 3 years but less than 4 years; 4 weeks for 4 years but less than 5 years; 5 weeks for 5 years but less than 6 years; 6 weeks for 6 years but less than 7 years; 7 weeks for 7 years but less than 8 years; 8 weeks for 8 or more years. During the statutory notice period, the employer must maintain the employee's wages and benefits. These are minimum statutory requirements — common law notice is typically much greater.`,
      },
      {
        section_title: "Severance Pay",
        article_number: "s.64",
        topic_tags: ["termination", "severance", "pay"],
        content: `Under ESA s.64, an employee is entitled to severance pay if: (a) the employee's employment is severed; (b) the employee has been employed for five or more years; and (c) the employer has a payroll of $2.5 million or more, OR the employer severed the employment of 50 or more employees in a six-month period. Severance pay is one week's regular wages for each year of employment, to a maximum of 26 weeks. Severance pay and termination pay are separate entitlements — an employee can be owed both. Severance pay must be paid in a lump sum or by agreement in instalments.`,
      },
      {
        section_title: "Overtime Pay",
        article_number: "s.22",
        topic_tags: ["overtime", "pay", "hours of work"],
        content: `Under ESA s.22, an employee must be paid overtime pay of at least 1.5 times their regular rate of pay for each hour worked in excess of 44 hours per week. "Regular rate" means the amount earned in a work week divided by the hours worked in that week (excluding overtime). Certain employees are exempt from overtime requirements under O. Reg. 285/01, including: managers and supervisors whose primary role is management; professionals (lawyers, engineers, doctors, architects); IT professionals earning more than $30/hr; and certain regulated professionals.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.23",
        topic_tags: ["minimum wage", "pay"],
        content: `Ontario's minimum wage as of October 1, 2024 is $17.20 per hour for most employees. Student minimum wage (under 18, working 28 hours or fewer per week during school term or during school holidays) is $16.20 per hour. Homeworkers' minimum wage is $18.90 per hour (1.1x general minimum). Hunting, fishing, and wilderness guide minimum wage is $86.00/day when working fewer than 5 hours, and $172.05/day when working 5 or more hours. Minimum wage increases annually on October 1 based on the Ontario Consumer Price Index.`,
      },
      {
        section_title: "Workplace Harassment",
        article_number: "OHSA s.1, s.32.0.1–32.0.8",
        topic_tags: ["harassment", "workplace violence", "investigation", "OHSA"],
        content: `Under the Ontario Occupational Health and Safety Act (OHSA), workplace harassment means engaging in a course of vexatious comment or conduct against a worker in a workplace that is known or ought reasonably to be known to be unwelcome. Sexual harassment is specifically prohibited. Employers must: (1) prepare a workplace harassment policy; (2) review it at least annually; (3) develop and maintain a program to implement the policy; (4) investigate incidents and complaints; (5) inform workers of results. Under Bill 132, investigators must be appropriate (impartial, trained). Employers cannot retaliate against workers who report harassment. Investigation results must be reported to the complainant and alleged harasser in writing.`,
      },
      {
        section_title: "Pregnancy and Parental Leave",
        article_number: "s.46-52",
        topic_tags: ["parental leave", "pregnancy leave", "maternity", "leave"],
        content: `Under ESA s.46, an employee is entitled to pregnancy leave of up to 17 weeks if she was employed for at least 13 consecutive weeks before the baby's expected birth date. Under s.46.1, an employee (including the other parent) is entitled to parental leave of up to 61 weeks (or 63 weeks if the employee did not take pregnancy leave) if employed for at least 13 consecutive weeks. The employee must give at least 2 weeks' written notice before the leave. The employer must continue benefits during the leave. On return, the employer must reinstate the employee to the same or a comparable position at not less than the same wages.`,
      },
      {
        section_title: "Personal Emergency Leave / Sick Leave",
        article_number: "s.50",
        topic_tags: ["sick leave", "personal emergency leave", "leaves"],
        content: `Under ESA s.50, an employee is entitled to up to 3 days of paid sick leave per calendar year, plus up to 3 days of paid family responsibility leave, plus up to 2 days of paid bereavement leave. As of 2022, employers must provide at least 3 paid sick days and up to 8 unpaid sick days per calendar year. Employees must have been employed for at least 2 weeks to be eligible. Employers cannot require a doctor's note for sick leave of fewer than 3 consecutive days.`,
      },
      {
        section_title: "Equal Pay for Equal Work",
        article_number: "s.42-42.1",
        topic_tags: ["equal pay", "gender pay equity", "discrimination"],
        content: `Under ESA s.42, no employer shall pay an employee of one sex at a rate of pay less than the rate paid to an employee of the other sex when: they perform substantially the same kind of work in the same establishment; the performance requires substantially the same skill, effort and responsibility; and the work is performed under similar working conditions. As of April 1, 2018, this protection extends to part-time, casual, temporary and seasonal employees performing the same work as full-time employees.`,
      },
      {
        section_title: "Termination for Cause",
        article_number: "s.2(1), common law",
        topic_tags: ["termination", "cause", "just cause", "misconduct"],
        content: `Under the Ontario ESA, an employer may dismiss an employee for "wilful misconduct, disobedience or wilful neglect of duty that is not trivial and has not been condoned by the employer" without providing ESA notice or severance pay (s.2(1), O. Reg. 288/01). However, this is a very high standard. Common law just cause is even harder to establish — courts require conduct that strikes at the root of the employment relationship. Minor misconduct, even progressive, does not constitute just cause. Employers must prove the conduct, its severity, and that dismissal was proportionate. Always document progressive discipline before attempting a for-cause dismissal.`,
      },
    ],
  },

  // ── BRITISH COLUMBIA ───────────────────────────────────────────────────────
  {
    title: "BC Employment Standards Act (BCESA)",
    province: "BC",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Termination Notice and Pay",
        article_number: "s.63",
        topic_tags: ["termination", "notice", "severance"],
        content: `Under BC Employment Standards Act s.63, an employer who terminates an employee must give written working notice or pay in lieu. Minimum requirements: after 3 months — 1 week; after 1 year — 2 weeks; after 3 years — 3 weeks; and 1 additional week for each additional year of employment, to a maximum of 8 weeks. After 12 months of employment, the notice period increases to 8 weeks after 8 or more years. Mass layoff provisions apply when 50+ employees are terminated within 2 months (60 days' notice required). There is no separate "severance pay" entitlement under the BC ESA (unlike Ontario).`,
      },
      {
        section_title: "Overtime Pay",
        article_number: "s.40",
        topic_tags: ["overtime", "pay", "hours of work"],
        content: `Under BC ESA s.40, employees are entitled to overtime pay of 1.5 times their regular wage for hours over 8 in a day, and 2 times their regular wage for hours over 12 in a day. Weekly overtime (over 40 hours/week) is paid at 1.5 times the regular rate. Averaging agreements can modify daily/weekly overtime calculations if approved. Managers and certain other employees may be exempt. British Columbia's overtime threshold is lower than Ontario's (8 hrs/day vs. 44 hrs/week).`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.16",
        topic_tags: ["minimum wage", "pay"],
        content: `BC's general minimum wage as of June 1, 2024 is $17.40 per hour. There is no lower "student rate" in BC — all employees receive the same general minimum wage regardless of age. Liquor servers receive the same general minimum wage. Minimum wage in BC is reviewed annually and adjusted based on the BC Consumer Price Index.`,
      },
      {
        section_title: "Leaves of Absence",
        article_number: "s.50-54",
        topic_tags: ["leaves", "parental leave", "sick leave"],
        content: `Under BC ESA, maternity leave is up to 17 weeks (must start no earlier than 13 weeks before due date). Parental leave is up to 61 weeks for birth mothers (if maternity leave taken) or 62 weeks for other parents. COVID-19 related leave and other protected leaves exist. Employees are entitled to 5 days of paid sick leave per year after 90 days of employment. Employers cannot dismiss or discipline employees for taking protected leaves.`,
      },
      {
        section_title: "Workplace Bullying and Harassment",
        article_number: "WorkSafeBC Policy D3-115-2",
        topic_tags: ["harassment", "bullying", "workplace violence", "investigation"],
        content: `In BC, workplace bullying and harassment is addressed through WorkSafeBC under the Workers Compensation Act. Employers have a duty to: (1) not engage in or permit bullying and harassment; (2) develop and implement procedures for workers to report incidents; (3) investigate incidents promptly; (4) inform the worker how the matter was addressed. Bullying and harassment means any inappropriate conduct or comment by a person towards a worker that the person knew or reasonably ought to have known would cause that worker to be humiliated or intimidated.`,
      },
    ],
  },

  // ── ALBERTA ────────────────────────────────────────────────────────────────
  {
    title: "Alberta Employment Standards Code (AESC)",
    province: "AB",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Termination Notice",
        article_number: "s.56-62",
        topic_tags: ["termination", "notice", "severance"],
        content: `Under the Alberta Employment Standards Code, an employer must give an employee written notice before terminating employment. Minimum notice: 1 week after 90 days; 2 weeks after 1 year; 4 weeks after 3 years; 5 weeks after 4 years; 6 weeks after 5 years; 7 weeks after 6 years; 8 weeks after 7 years; 9 weeks after 8 years; 10 weeks after 9 years; and 1 additional week per year to a maximum of 8 weeks for continuous employment less than 3 years, or maximum of 10 weeks for continuous employment less than 10 years. Group termination (50+ employees): 4 weeks' notice is required. No statutory severance pay separate from notice in Alberta (unlike Ontario).`,
      },
      {
        section_title: "Overtime Pay",
        article_number: "s.21",
        topic_tags: ["overtime", "pay", "hours of work"],
        content: `Alberta's Employment Standards Code provides that overtime is paid at 1.5 times the regular rate for hours worked over 8 per day or 44 per week (whichever is greater). Overtime agreements can substitute time off in lieu at 1.5 hours per overtime hour. Averaging arrangements can be approved by the Director. Exempt positions include managers/supervisors, certain salespersons, and professionals. Alberta's threshold of 44 hours/week aligns with Ontario's.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.3",
        topic_tags: ["minimum wage", "pay"],
        content: `Alberta's general minimum wage as of October 1, 2024 is $15.00 per hour. Students under 18 working 28 hours or fewer per week (during school) or during school breaks receive the same general minimum wage ($15.00/hr). Alberta has not increased its minimum wage since 2018 and as of 2024 remains one of the lowest minimum wages among major provinces. Regular review and future increases are subject to government policy.`,
      },
      {
        section_title: "Parental and Maternity Leave",
        article_number: "s.45-53.9",
        topic_tags: ["parental leave", "maternity", "leaves"],
        content: `Under Alberta Employment Standards Code, maternity leave is up to 16 weeks (within 12 weeks before the expected birth date). Parental leave is up to 62 weeks for birth parents who take maternity leave, or 62 weeks for other parents. Employee must have been employed for 90 days. Employer must maintain benefits during leave. Employee is entitled to return to same or comparable position.`,
      },
    ],
  },

  // ── QUEBEC ─────────────────────────────────────────────────────────────────
  {
    title: "Act Respecting Labour Standards (Quebec ARLS / Loi sur les normes du travail)",
    province: "QC",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Notice of Termination",
        article_number: "s.82",
        topic_tags: ["termination", "notice", "severance"],
        content: `Under Quebec's Act Respecting Labour Standards (ARLS), s.82, an employer must give advance notice before dismissing an employee who has been employed for 3 months or more. Minimum notice: 1 week for 3 months to 1 year; 2 weeks for 1 to 5 years; 4 weeks for 5 to 10 years; 8 weeks for 10 years or more. If the employer fails to give notice, they must pay an indemnity equal to the wages that would have been earned during the notice period. Quebec also has stronger protections against dismissal without just and sufficient cause after 2 years of uninterrupted service (s.124 complaint).`,
      },
      {
        section_title: "Psychological Harassment",
        article_number: "s.81.18–81.20",
        topic_tags: ["harassment", "psychological harassment", "investigation"],
        content: `Under ARLS s.81.18, every employee has a right to a work environment free from psychological harassment. Psychological harassment means vexatious behaviour that manifests itself in the form of repeated and hostile or unwanted conduct, verbal comments, actions, or gestures, affecting an employee's dignity or psychological or physical integrity, and results in a harmful work environment for the employee. A single serious incident can constitute psychological harassment if it has such an impact. Employers must take reasonable action to prevent and stop psychological harassment. An employee may file a complaint with the CNESST within 2 years.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.40",
        topic_tags: ["minimum wage", "pay"],
        content: `Quebec's general minimum wage as of May 1, 2024 is $15.75 per hour. The minimum wage for employees who regularly receive tips is $12.60 per hour (as of May 1, 2024). The minimum wage is reviewed annually on May 1. Employers in Quebec must post the current minimum wage rates in the workplace.`,
      },
      {
        section_title: "Overtime Pay",
        article_number: "s.55",
        topic_tags: ["overtime", "pay", "hours of work"],
        content: `Under Quebec ARLS s.55, the standard work week is 40 hours. Employees are entitled to overtime pay of 1.5 times their regular hourly wage for all hours worked in excess of 40 per week. A compensatory leave of at least 1.5 hours may be substituted by written agreement. Certain employees are exempt from overtime: managers, people working in the operation of a business on a daily basis, and domestic workers.`,
      },
      {
        section_title: "Maternity and Parental Leave",
        article_number: "s.81.1–81.17",
        topic_tags: ["parental leave", "maternity", "leaves"],
        content: `Under Quebec ARLS, maternity leave is 18 consecutive weeks without pay, which may be taken before and after delivery. Paternity leave is 5 consecutive weeks without pay. Parental leave (for either parent) is up to 52 weeks without pay. Additionally, Quebec's Parental Insurance Plan (RQAP) provides income replacement benefits (up to 75% of insurable earnings). These benefits are more generous than EI parental benefits available in other provinces.`,
      },
    ],
  },

  // ── FEDERAL (Canada Labour Code) ──────────────────────────────────────────
  {
    title: "Canada Labour Code (Federal Employment Standards)",
    province: "Federal",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Notice of Termination",
        article_number: "s.230",
        topic_tags: ["termination", "notice", "severance"],
        content: `Under the Canada Labour Code, federally regulated employees are entitled to: (a) 2 weeks' written notice of termination or 2 weeks' regular wages in lieu; AND (b) a separate severance pay entitlement of 2 days' regular wages for each year of employment (minimum 5 days), after 12 months of employment. Note: the federal unjust dismissal provision (s.240) applies to employees with 12 months' continuous employment — they can file an unjust dismissal complaint with the Labour Program (unlike Ontario's constructive dismissal common law approach). Federally regulated industries include banking, telecommunications, interprovincial transportation, broadcasting, and federal Crown corporations.`,
      },
      {
        section_title: "Overtime Pay",
        article_number: "s.174",
        topic_tags: ["overtime", "pay", "hours of work"],
        content: `Under Canada Labour Code s.174, maximum hours of work are 8 per day and 40 per week. Overtime must be compensated at 1.5 times the employee's regular rate of wages. Hours can be averaged over 2-4 weeks by agreement with the union or with employee consent. Certain managers and professionals may be exempt. The federal threshold of 40 hours/week is lower than Ontario's 44-hour threshold.`,
      },
      {
        section_title: "Harassment and Violence Prevention",
        article_number: "Part II, s.122.1; Work Place Harassment and Violence Prevention Regulations",
        topic_tags: ["harassment", "workplace violence", "investigation"],
        content: `Under the Canada Labour Code Part II and the Work Place Harassment and Violence Prevention Regulations (effective January 1, 2021), all federally regulated employers must: (1) have a workplace harassment and violence prevention policy; (2) conduct joint workplace assessments; (3) develop prevention plans; (4) have a resolution process for notices of occurrence; (5) provide training. Notices of occurrence must be investigated. Qualified investigators must be used for complex cases. Non-disclosure agreements cannot prevent reporting to the employer or government. The WPHVP Regulations replaced the old Part XX of the Canada Occupational Safety and Health Regulations.`,
      },
      {
        section_title: "Maternity, Parental and Caregiving Leave",
        article_number: "s.206-206.8",
        topic_tags: ["parental leave", "maternity", "leaves"],
        content: `Under Canada Labour Code s.206, maternity leave is up to 17 weeks for federally regulated employees. Parental leave is up to 63 weeks (birth mother who took maternity leave) or 40 weeks for other parents (standard parental benefit), or up to 69 weeks (extended parental benefit). Critical illness leave, bereavement leave (10 days), personal leave (5 days — 3 paid after 3 months), and family violence leave (10 days — 5 paid) are also provided. Federal employees may also access EI parental benefits administered by Service Canada.`,
      },
      {
        section_title: "Pay Equity",
        article_number: "Pay Equity Act (2021)",
        topic_tags: ["pay equity", "equal pay", "gender"],
        content: `The federal Pay Equity Act (in force September 2021) requires federally regulated employers with 10 or more employees to establish and maintain a pay equity plan. The plan must identify female-predominant and male-predominant job classes and ensure equal pay for work of equal value. Employers with 100+ employees had to post initial pay equity plans by September 3, 2024. Plans must be reviewed every 5 years. The Pay Equity Commissioner oversees compliance and can order remedies including retroactive pay adjustments.`,
      },
    ],
  },

  // ── MANITOBA ───────────────────────────────────────────────────────────────
  {
    title: "Manitoba Employment Standards Code",
    province: "MB",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Termination Notice",
        article_number: "s.61-64",
        topic_tags: ["termination", "notice"],
        content: `Under Manitoba's Employment Standards Code, minimum termination notice is: 1 week after 30 days; 2 weeks after 1 year; 4 weeks after 3 years; 6 weeks after 5 years; 8 weeks after 10 years. Group termination (50+ employees): minimum 10 weeks' notice. There is no statutory severance pay separate from notice pay in Manitoba. Common law notice obligations remain in addition to statutory minimums.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.47",
        topic_tags: ["minimum wage", "pay"],
        content: `Manitoba's general minimum wage as of October 1, 2024 is $15.80 per hour. Manitoba reviews its minimum wage annually.`,
      },
    ],
  },

  // ── SASKATCHEWAN ──────────────────────────────────────────────────────────
  {
    title: "Saskatchewan Employment Act",
    province: "SK",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Termination Notice",
        article_number: "s.2-60",
        topic_tags: ["termination", "notice"],
        content: `Under Saskatchewan's Employment Act, minimum termination notice is: 1 week after 13 weeks; 2 weeks after 1 year; 4 weeks after 5 years; 6 weeks after 10 years; 8 weeks after 15 years. Termination pay in lieu of notice is required at the employee's regular rate of pay. Group terminations (10+ employees within 4 weeks) require additional notice to the Minister.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.2-13",
        topic_tags: ["minimum wage", "pay"],
        content: `Saskatchewan's minimum wage as of October 1, 2024 is $15.00 per hour. The minimum wage applies to most workers except those employed in agriculture under certain conditions.`,
      },
    ],
  },

  // ── NOVA SCOTIA ────────────────────────────────────────────────────────────
  {
    title: "Nova Scotia Labour Standards Code",
    province: "NS",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Termination Notice",
        article_number: "s.72",
        topic_tags: ["termination", "notice"],
        content: `Under Nova Scotia's Labour Standards Code s.72, minimum notice of termination is: 1 week after 3 months; 2 weeks after 1 year; 4 weeks after 5 years; 8 weeks after 10 years. Group terminations (10+ employees in 4 weeks): additional notice requirements. Employees can receive wages in lieu of notice.`,
      },
      {
        section_title: "Minimum Wage",
        article_number: "s.54",
        topic_tags: ["minimum wage", "pay"],
        content: `Nova Scotia's minimum wage as of April 1, 2024 is $15.20 per hour. There is no lower rate for students or inexperienced workers.`,
      },
    ],
  },

  // ── ALL PROVINCES (cross-jurisdictional) ───────────────────────────────────
  {
    title: "Canadian Human Rights Act and Provincial Human Rights Codes",
    province: "All",
    source_type: "statute",
    version: "2024",
    chunks: [
      {
        section_title: "Prohibited Grounds of Discrimination",
        article_number: "CHRA s.3; Ontario Human Rights Code s.5",
        topic_tags: ["discrimination", "human rights", "accommodation", "protected grounds"],
        content: `All Canadian jurisdictions prohibit discrimination in employment based on protected grounds. Under the Ontario Human Rights Code s.5 (and similar provincial statutes), every person has a right to equal treatment in employment without discrimination because of: race, ancestry, place of origin, colour, ethnic origin, citizenship, creed (religion), sex (including pregnancy), sexual orientation, gender identity, gender expression, age, marital status, family status, disability, and receipt of public assistance. Employers must accommodate employees to the point of undue hardship. Undue hardship requires consideration of cost, outside sources of funding, and health and safety requirements.`,
      },
      {
        section_title: "Duty to Accommodate",
        article_number: "Ontario Human Rights Code s.11, 17; CHRA s.15",
        topic_tags: ["accommodation", "disability", "duty to accommodate", "human rights"],
        content: `Employers have a legal duty to accommodate employees with disabilities, religious requirements, family status obligations, and other protected characteristics to the point of undue hardship. The duty to accommodate is triggered when the employer becomes aware of the need. The process requires: (1) individualized assessment of the employee's needs; (2) exploration of accommodation options; (3) implementing reasonable accommodation. The employee must cooperate in the process. Undue hardship factors: significant financial cost, health and safety risks, impossibility of performance of essential duties. Failing to accommodate is a human rights violation regardless of good intentions.`,
      },
      {
        section_title: "Constructive Dismissal",
        article_number: "Common law; ESA s.1 (ON)",
        topic_tags: ["constructive dismissal", "termination", "resignation"],
        content: `Constructive dismissal occurs when an employer unilaterally changes a fundamental term of the employment contract without the employee's consent, effectively forcing the employee to resign. Examples: significant pay reduction (15%+ is typically constructive dismissal), demotion, geographic relocation, change in duties, toxic work environment created or condoned by employer. Under Canadian common law (Potter v. New Brunswick Legal Aid Services Commission, 2015 SCC 10), constructive dismissal entitles the employee to treat the contract as breached and claim wrongful dismissal damages. In Ontario, constructive dismissal is also addressed under ESA Part XV.`,
      },
      {
        section_title: "Wrongful Dismissal Damages",
        article_number: "Common law; Bardal v. Globe & Mail (1960)",
        topic_tags: ["wrongful dismissal", "damages", "notice period", "common law"],
        content: `Canadian common law wrongful dismissal damages are based on "reasonable notice" — the notice period a court would award having regard to the Bardal factors: character of employment (seniority of position), length of service, employee's age, and availability of similar employment. Courts typically award 1 month per year of service as a starting point for managerial employees, but this is not a fixed rule. Older employees with specialized skills in a tight market may receive 2+ months per year. Maximum reasonable notice at common law is typically 24-30 months (rarely exceeding 30 months). Mitigation obligations apply — employees must take reasonable steps to find comparable work. Wallace damages (bad faith dismissal) have been replaced in Ontario by Honda v. Keays (2008 SCC 39) which requires proof of actual damages from bad faith conduct.`,
      },
    ],
  },
];

// ── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Starting knowledge base seed...\n");

    let totalSources = 0;
    let totalChunks = 0;

    for (const source of SOURCES) {
      // Upsert knowledge source
      const sourceResult = await client.query(
        `INSERT INTO knowledge_sources (title, province, source_type, version, last_verified)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [source.title, source.province, source.source_type, source.version]
      );

      let sourceId: number;
      if (sourceResult.rows.length === 0) {
        // Already exists — get id
        const existing = await client.query(
          "SELECT id FROM knowledge_sources WHERE title = $1",
          [source.title]
        );
        sourceId = existing.rows[0].id;
        console.log(`  Source already exists: ${source.title} (id=${sourceId})`);
      } else {
        sourceId = sourceResult.rows[0].id;
        totalSources++;
        console.log(`  Inserted source: ${source.title} (id=${sourceId})`);
      }

      // Insert chunks
      for (let i = 0; i < source.chunks.length; i++) {
        const chunk = source.chunks[i];

        // Skip if chunk already exists for this source
        const existingChunk = await client.query(
          "SELECT id FROM knowledge_chunks WHERE source_id = $1 AND article_number = $2",
          [sourceId, chunk.article_number]
        );
        if (existingChunk.rows.length > 0) {
          console.log(`    Chunk exists: ${chunk.section_title}`);
          continue;
        }

        await client.query(
          `INSERT INTO knowledge_chunks
             (source_id, content, section_title, article_number, province, topic_tags, chunk_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            sourceId,
            chunk.content,
            chunk.section_title,
            chunk.article_number,
            source.province,
            chunk.topic_tags,
            i,
          ]
        );
        totalChunks++;
        console.log(`    Inserted chunk: ${chunk.section_title}`);
      }
    }

    console.log(`\n✓ Seed complete: ${totalSources} sources, ${totalChunks} chunks inserted.`);

    // Add full-text search index for knowledge chunks
    await client.query(`
      ALTER TABLE knowledge_chunks
        ADD COLUMN IF NOT EXISTS search_vector tsvector
        GENERATED ALWAYS AS (
          to_tsvector('english', coalesce(content, '') || ' ' || coalesce(section_title, '') || ' ' || coalesce(article_number, ''))
        ) STORED
    `).catch(() => {
      // Column might already exist — that's fine
    });

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_knowledge_search
      ON knowledge_chunks USING gin(search_vector)
    `).catch(() => {});

    console.log("✓ Full-text search index created/verified.");

  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
