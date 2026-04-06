import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

async function fix() {
  const content = `Under the Ontario Employment Standards Act, 2000 (ESA), s.57, an employer must give written notice of termination to an employee who has been continuously employed for three months or more. The minimum notice periods are as follows (the lower bound is inclusive — an employee who has completed exactly that number of years falls in that bracket):
- 1 week: employed at least 3 months but less than 1 year
- 2 weeks: employed at least 1 year but less than 3 years
- 3 weeks: employed at least 3 years but less than 4 years
- 4 weeks: employed at least 4 years but less than 5 years
- 5 weeks: employed at least 5 years but less than 6 years
- 6 weeks: employed at least 6 years but less than 7 years
- 7 weeks: employed at least 7 years but less than 8 years
- 8 weeks: employed 8 or more years
Examples: an employee with exactly 3 years of service receives 3 weeks' notice; an employee with exactly 5 years receives 5 weeks. During the statutory notice period, the employer must maintain the employee's wages and benefits. These are minimum statutory requirements — common law reasonable notice is typically much greater (approximately 1 month per year of service for non-managerial employees).`;

  const r = await sql`
    UPDATE knowledge_chunks
    SET content = ${content}
    WHERE province = 'ON' AND article_number = 's.57'
  `;
  console.log(`Updated ${r.rowCount} s.57 chunk(s)`);
}
fix().catch(console.error);
