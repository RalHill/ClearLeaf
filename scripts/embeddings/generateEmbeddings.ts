import { createSupabaseServerClient } from "../../lib/supabase/server";
import { generateEmbedding } from "../../lib/ai/embeddings";

/**
 * Embeddings Pipeline for ClearLeaf
 * Generates vector embeddings for all knowledge chunks
 *
 * This script:
 * 1. Queries all chunks without embeddings
 * 2. Generates embeddings using OpenAI text-embedding-3-small
 * 3. Updates chunks with embedding vectors
 * 4. Reports progress and handles retries
 *
 * Usage:
 *   npx ts-node scripts/embeddings/generateEmbeddings.ts
 *   npx ts-node scripts/embeddings/generateEmbeddings.ts --province ON
 *   npx ts-node scripts/embeddings/generateEmbeddings.ts --batch-size 100
 */

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

/**
 * Batch chunks to avoid rate limiting
 * OpenAI embeddings API: 3,500 requests per minute
 * Recommend: Process 100 chunks per batch with 100ms delay
 */
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

        // Progress indicator
        if ((i + results.length) % 10 === 0) {
          console.log(`  ✓ ${i + results.length} chunks embedded`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to embed chunk ${chunk.id}:`, error);
        // Continue processing other chunks
      }
    }

    // Delay between batches to avoid rate limiting
    if (i + batchSize < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Update Supabase with embedding vectors
 * Uses ON CONFLICT DO UPDATE for idempotency
 */
async function updateChunksWithEmbeddings(
  results: EmbeddingResult[]
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // Batch updates (Supabase recommends 1,000 per request)
  const batchSize = 100;

  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, Math.min(i + batchSize, results.length));

    console.log(`Updating database: ${i + batch.length} of ${results.length}`);

    // Convert embeddings to string format for Supabase
    const updates = batch.map((result) => ({
      id: result.id,
      embedding: JSON.stringify(result.embedding), // Convert array to string
    }));

    // Use raw SQL for batch update (more efficient than individual updates)
    const { error } = await supabase.from("knowledge_chunks").upsert(updates, {
      onConflict: "id",
    });

    if (error) {
      console.error(`Database update failed:`, error);
      throw error;
    }
  }
}

/**
 * Main embeddings generation pipeline
 */
async function generateAllEmbeddings(options: {
  province?: string;
  batchSize?: number;
}): Promise<ProgressReport> {
  const startTime = Date.now();
  const supabase = await createSupabaseServerClient();

  console.log("\n🔍 Generating Knowledge Base Embeddings\n");

  try {
    // Step 1: Query chunks without embeddings
    console.log("Step 1: Fetching chunks without embeddings...");

    let query = supabase
      .from("knowledge_chunks")
      .select("id, content")
      .is("embedding", null);

    if (options.province) {
      query = query.eq("province", options.province);
      console.log(`  - Filtering by province: ${options.province}`);
    }

    const { data: chunks, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (!chunks || chunks.length === 0) {
      console.log("✓ No chunks to embed. All chunks already have embeddings.");
      return {
        totalChunks: 0,
        processedChunks: 0,
        failedChunks: 0,
        tokensUsed: 0,
        estimatedCost: 0,
        duration: Date.now() - startTime,
      };
    }

    console.log(`✓ Found ${chunks.length} chunks to embed\n`);

    // Step 2: Generate embeddings with batching
    console.log("Step 2: Generating embeddings...");
    const batchSize = options.batchSize || 100;
    const results = await processBatch(
      chunks as Array<{ id: number; content: string }>,
      batchSize,
      100 // 100ms delay between batches
    );

    console.log(`\n✓ Generated ${results.length} embeddings\n`);

    // Step 3: Update database
    console.log("Step 3: Updating database with embeddings...");
    await updateChunksWithEmbeddings(results);
    console.log(`✓ Updated ${results.length} chunks in database\n`);

    // Step 4: Report
    const duration = Date.now() - startTime;
    const totalTokens = results.length * 400; // Rough estimate: ~400 tokens per chunk
    const estimatedCost = (totalTokens / 1_000_000) * 0.00002; // OpenAI pricing: $0.00002 per 1K tokens

    console.log("📊 Embeddings Complete!");
    console.log(`  - Chunks: ${results.length}`);
    console.log(`  - Estimated tokens: ${totalTokens.toLocaleString()}`);
    console.log(`  - Estimated cost: $${estimatedCost.toFixed(4)}`);
    console.log(`  - Duration: ${(duration / 1000).toFixed(1)}s\n`);

    return {
      totalChunks: chunks.length,
      processedChunks: results.length,
      failedChunks: chunks.length - results.length,
      tokensUsed: totalTokens,
      estimatedCost,
      duration,
    };
  } catch (error) {
    console.error("\n❌ Embeddings pipeline failed:", error);
    throw error;
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    province: args.includes("--province") ? args[args.indexOf("--province") + 1] : undefined,
    batchSize: args.includes("--batch-size") ? parseInt(args[args.indexOf("--batch-size") + 1]) : 100,
  };

  generateAllEmbeddings(options)
    .then((report) => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { generateAllEmbeddings, processBatch, updateChunksWithEmbeddings, ProgressReport };
