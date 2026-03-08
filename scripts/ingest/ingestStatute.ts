import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

/**
 * PDF Ingestion Pipeline for ClearLeaf
 * Converts statute PDFs into chunked knowledge base entries with embeddings
 *
 * Usage:
 *   npx ts-node scripts/ingest/ingestStatute.ts ontario ESA
 *
 * This script:
 * 1. Reads a PDF file
 * 2. Extracts text with section metadata
 * 3. Chunks text (800 chars, 150 char overlap)
 * 4. Creates PostgreSQL INSERT statements
 * 5. Outputs SQL file ready for Supabase
 */

interface ChunkMetadata {
  province: string;
  sourceTitle: string;
  section?: string;
  article?: string;
  topicTags: string[];
  chunkIndex: number;
}

interface KnowledgeChunk {
  content: string;
  metadata: ChunkMetadata;
}

interface PDFIngestConfig {
  province: string;
  sourceType: "employment_standards" | "human_rights" | "health_safety" | "labour_code";
  sourceTitle: string;
  pdfPath: string;
  topicTags: string[];
  lastVerified: string;
}

/**
 * Extract text from PDF with basic section detection
 */
async function extractPDFText(pdfPath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    console.error(`Error reading PDF ${pdfPath}:`, error);
    throw error;
  }
}

/**
 * Split text into overlapping chunks for RAG retrieval
 * Chunk size: 800 characters
 * Overlap: 150 characters
 */
function chunkText(
  text: string,
  chunkSize: number = 800,
  overlap: number = 150
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.substring(startIndex, endIndex).trim();

    if (chunk.length > 100) {
      // Only add chunks with meaningful content
      chunks.push(chunk);
    }

    startIndex = endIndex - overlap;
    if (startIndex >= text.length) break;
  }

  return chunks;
}

/**
 * Parse section headers from statute text
 * Looks for patterns like "Section 57", "Article 81.18", "Schedule A"
 */
function extractSectionInfo(chunk: string): { section?: string; article?: string } {
  const sectionMatch = chunk.match(/Section\s+(\d+[\w.]*)/);
  const articleMatch = chunk.match(/Article\s+(\d+[\w.]*)/);
  const scheduleMatch = chunk.match(/Schedule\s+([A-Z])/);

  return {
    section: sectionMatch ? `${sectionMatch[0]}` : undefined,
    article: articleMatch ? `${articleMatch[0]}` : scheduleMatch ? `Schedule ${scheduleMatch[1]}` : undefined,
  };
}

/**
 * Generate SQL INSERT statement for a chunk
 * Note: embedding will be NULL here; filled by embeddings pipeline
 */
function generateChunkSQL(
  chunk: KnowledgeChunk,
  sourceId: number
): string {
  const {
    content,
    metadata: { province, sourceTitle, section, article, topicTags, chunkIndex },
  } = chunk;

  const escapedContent = content.replace(/'/g, "''");
  const escapedTitle = sourceTitle.replace(/'/g, "''");
  const tagsArray = topicTags.map((t) => `'${t}'`).join(",");

  return `
INSERT INTO knowledge_chunks (
  source_id,
  content,
  section_title,
  article_number,
  province,
  topic_tags,
  chunk_index
) VALUES (
  ${sourceId},
  '${escapedContent}',
  '${section || ""}',
  '${article || ""}',
  '${province}',
  ARRAY[${tagsArray}],
  ${chunkIndex}
);
  `;
}

/**
 * Generate SQL for knowledge source registration
 */
function generateSourceSQL(config: PDFIngestConfig): { sql: string; sourceId: number } {
  const escapedTitle = config.sourceTitle.replace(/'/g, "''");
  const sourceId = Math.floor(Math.random() * 10000); // Temporary; actual DB auto-generates

  const sql = `
INSERT INTO knowledge_sources (
  title,
  province,
  source_type,
  last_verified,
  version
) VALUES (
  '${escapedTitle}',
  '${config.province}',
  '${config.sourceType}',
  '${config.lastVerified}',
  '1.0'
);
  `;

  return { sql, sourceId };
}

/**
 * Main ingestion function
 */
async function ingestStatute(config: PDFIngestConfig): Promise<void> {
  console.log(`\n📄 Starting ingestion: ${config.sourceTitle} (${config.province})\n`);

  try {
    // Step 1: Extract PDF text
    console.log("✓ Extracting text from PDF...");
    const fullText = await extractPDFText(config.pdfPath);
    console.log(`  - Extracted ${fullText.length} characters`);

    // Step 2: Chunk text
    console.log("✓ Chunking text into RAG segments...");
    const chunks = chunkText(fullText);
    console.log(`  - Created ${chunks.length} chunks (800 chars, 150 overlap)`);

    // Step 3: Create knowledge chunks with metadata
    console.log("✓ Extracting section metadata...");
    const knowledgeChunks: KnowledgeChunk[] = chunks.map((content, index) => {
      const sectionInfo = extractSectionInfo(content);
      return {
        content,
        metadata: {
          province: config.province,
          sourceTitle: config.sourceTitle,
          section: sectionInfo.section,
          article: sectionInfo.article,
          topicTags: config.topicTags,
          chunkIndex: index,
        },
      };
    });

    // Step 4: Generate SQL
    console.log("✓ Generating SQL INSERT statements...");
    const { sql: sourceSql, sourceId } = generateSourceSQL(config);
    const chunkSQLs = knowledgeChunks.map((chunk) => generateChunkSQL(chunk, sourceId));

    // Step 5: Write output file
    const outputPath = path.join(
      process.cwd(),
      `supabase/migrations/ingest_${config.province}_${config.sourceType}.sql`
    );

    const sqlContent = `
-- Auto-generated migration for ${config.sourceTitle}
-- Generated: ${new Date().toISOString()}
-- Province: ${config.province}
-- Chunks: ${knowledgeChunks.length}

BEGIN;

${sourceSql}

${chunkSQLs.join("\n")}

-- TODO: Run embeddings pipeline to populate embedding vectors
-- Command: npx ts-node scripts/embeddings/generateEmbeddings.ts

COMMIT;
    `;

    fs.writeFileSync(outputPath, sqlContent);
    console.log(`✓ SQL file written to: ${outputPath}`);

    // Step 6: Summary
    console.log("\n📊 Ingestion Complete!");
    console.log(`  - Province: ${config.province}`);
    console.log(`  - Source: ${config.sourceTitle}`);
    console.log(`  - Chunks: ${knowledgeChunks.length}`);
    console.log(`  - Topics: ${config.topicTags.join(", ")}`);
    console.log(`\n📝 Next steps:`);
    console.log(`  1. Review SQL: ${outputPath}`);
    console.log(`  2. Run: supabase db push`);
    console.log(`  3. Generate embeddings: npx ts-node scripts/embeddings/generateEmbeddings.ts`);
    console.log(`  4. Test with golden Q&A suite\n`);
  } catch (error) {
    console.error("❌ Ingestion failed:", error);
    process.exit(1);
  }
}

// Example configurations for each statute
const INGEST_CONFIGS: { [key: string]: PDFIngestConfig } = {
  ontario_esa: {
    province: "ON",
    sourceType: "employment_standards",
    sourceTitle: "Ontario Employment Standards Act, 2000",
    pdfPath: "scripts/ingest/pdfs/ontario_esa_2000.pdf",
    topicTags: ["Employment Standards", "Termination", "Wages", "Hours of Work", "Leaves"],
    lastVerified: new Date().toISOString(),
  },
  ontario_ohsa: {
    province: "ON",
    sourceType: "health_safety",
    sourceTitle: "Ontario Occupational Health and Safety Act",
    pdfPath: "scripts/ingest/pdfs/ontario_ohsa.pdf",
    topicTags: ["Health & Safety", "Harassment", "Violence Prevention"],
    lastVerified: new Date().toISOString(),
  },
  bc_esa: {
    province: "BC",
    sourceType: "employment_standards",
    sourceTitle: "BC Employment Standards Act",
    pdfPath: "scripts/ingest/pdfs/bc_employment_standards.pdf",
    topicTags: ["Employment Standards", "Termination", "Wages", "Hours of Work"],
    lastVerified: new Date().toISOString(),
  },
  alberta_esa: {
    province: "AB",
    sourceType: "employment_standards",
    sourceTitle: "Alberta Employment Standards Code",
    pdfPath: "scripts/ingest/pdfs/alberta_employment_standards.pdf",
    topicTags: ["Employment Standards", "Termination", "Wages", "Hours of Work"],
    lastVerified: new Date().toISOString(),
  },
  quebec_lnt: {
    province: "QC",
    sourceType: "labour_code",
    sourceTitle: "Loi sur les normes du travail (Act Respecting Labour Standards)",
    pdfPath: "scripts/ingest/pdfs/quebec_lnt.pdf",
    topicTags: ["Normes du travail", "Harcèlement", "Congés", "Salaires"],
    lastVerified: new Date().toISOString(),
  },
  federal_clc: {
    province: "Federal",
    sourceType: "labour_code",
    sourceTitle: "Canada Labour Code",
    pdfPath: "scripts/ingest/pdfs/canada_labour_code.pdf",
    topicTags: ["Labour Standards", "Employment", "Leaves", "Hours of Work"],
    lastVerified: new Date().toISOString(),
  },
};

// CLI Entry Point
if (require.main === module) {
  const statute = process.argv[2]?.toLowerCase();
  const config = INGEST_CONFIGS[statute];

  if (!config) {
    console.error("\n❌ Usage: npx ts-node scripts/ingest/ingestStatute.ts <statute>");
    console.error("\nAvailable statutes:");
    Object.keys(INGEST_CONFIGS).forEach((key) => {
      console.error(`  - ${key}`);
    });
    process.exit(1);
  }

  ingestStatute(config).catch(console.error);
}

export { ingestStatute, INGEST_CONFIGS, ChunkMetadata, KnowledgeChunk };
