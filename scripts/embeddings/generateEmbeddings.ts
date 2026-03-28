/**
 * Embeddings pipeline — uses Neon via @vercel/postgres (POSTGRES_URL or DATABASE_URL).
 *
 * Usage:
 *   npx tsx scripts/embeddings/generateEmbeddings.ts
 *   npx tsx scripts/embeddings/generateEmbeddings.ts --province ON
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { sql } from "@vercel/postgres";
import { generateEmbedding } from "../../lib/ai/embeddings";

if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

interface EmbeddingResult {
  id: number;
  content: string;
  embedding: number[];
}

interface ProgressReport {
  totalChunks: number;
  processedChunks: number;
  failedChunks: number;
  tokensUsed: number;
  estimatedCost: number;
  duration: number;
}

async function processBatch(
  chunks: Array<{ id: number; content: string }>,
  batchSize: number = 100,
  delayMs: number = 100
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length));
    console.log(`Processing batch: ${i + 1}–${Math.min(i + batchSize, chunks.length)} of ${chunks.length}`);

    for (const chunk of batch) {
      try {
        const embedding = await generateEmbedding(chunk.content);
        results.push({
          id: chunk.id,
          content: chunk.content,
          embedding,
        });
      } catch (error) {
        console.error(`  Failed to embed chunk ${chunk.id}:`, error);
      }
    }

    if (i + batchSize < chunks.length) {
      await new Promise((resolveWait) => setTimeout(resolveWait, delayMs));
    }
  }

  return results;
}

async function updateChunksWithEmbeddings(results: EmbeddingResult[]): Promise<void> {
  const batchSize = 100;

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, Math.min(i + batchSize, results.length));
    console.log(`Updating database: ${i + batch.length} of ${results.length}`);

    for (const result of batch) {
      const vectorLiteral = `[${result.embedding.join(",")}]`;
      await sql`
        UPDATE knowledge_chunks
        SET embedding = ${vectorLiteral}::vector, updated_at = NOW()
        WHERE id = ${result.id}
      `;
    }
  }
}

async function generateAllEmbeddings(options: {
  province?: string;
  batchSize?: number;
}): Promise<ProgressReport> {
  const startTime = Date.now();

  console.log("\nGenerating Knowledge Base Embeddings (Neon)\n");

  try {
    console.log("Step 1: Fetching chunks without embeddings...");

    const chunks = options.province
      ? await sql`
          SELECT id, content FROM knowledge_chunks
          WHERE embedding IS NULL AND province = ${options.province}
        `
      : await sql`
          SELECT id, content FROM knowledge_chunks WHERE embedding IS NULL
        `;

    if (options.province) {
      console.log(`  - Filtering by province: ${options.province}`);
    }

    const rows = chunks.rows as Array<{ id: number; content: string }>;

    if (!rows || rows.length === 0) {
      console.log("No chunks to embed. All chunks already have embeddings.");
      return {
        totalChunks: 0,
        processedChunks: 0,
        failedChunks: 0,
        tokensUsed: 0,
        estimatedCost: 0,
        duration: Date.now() - startTime,
      };
    }

    console.log(`Found ${rows.length} chunks to embed\n`);

    console.log("Step 2: Generating embeddings...");
    const batchSize = options.batchSize || 100;
    const results = await processBatch(rows, batchSize, 100);

    console.log(`\nGenerated ${results.length} embeddings\n`);

    console.log("Step 3: Updating database with embeddings...");
    await updateChunksWithEmbeddings(results);
    console.log(`Updated ${results.length} chunks in database\n`);

    const duration = Date.now() - startTime;
    const totalTokens = results.length * 400;
    const estimatedCost = (totalTokens / 1_000_000) * 0.00002;

    console.log("Embeddings complete!");
    console.log(`  - Chunks: ${results.length}`);
    console.log(`  - Estimated tokens: ${totalTokens.toLocaleString()}`);
    console.log(`  - Estimated cost: $${estimatedCost.toFixed(4)}`);
    console.log(`  - Duration: ${(duration / 1000).toFixed(1)}s\n`);

    return {
      totalChunks: rows.length,
      processedChunks: results.length,
      failedChunks: rows.length - results.length,
      tokensUsed: totalTokens,
      estimatedCost,
      duration,
    };
  } catch (error) {
    console.error("\nEmbeddings pipeline failed:", error);
    throw error;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    province: args.includes("--province") ? args[args.indexOf("--province") + 1] : undefined,
    batchSize: args.includes("--batch-size") ? parseInt(args[args.indexOf("--batch-size") + 1], 10) : 100,
  };

  generateAllEmbeddings(options)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { generateAllEmbeddings, processBatch, updateChunksWithEmbeddings, ProgressReport };
