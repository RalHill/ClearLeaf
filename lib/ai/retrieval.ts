import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";

export interface RetrievedChunk {
  id: bigint;
  content: string;
  section_title: string | null;
  article_number: string | null;
  source_title: string;
  province: string;
  topic_tags: string[] | null;
  similarity: number;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
  confidence: "high" | "medium" | "low";
  warning?: string;
  matchedCount: number;
}

/**
 * Full-text search for knowledge chunks (no embeddings needed)
 * Falls back gracefully when knowledge base is empty
 */
export async function retrieveRelevantChunks(
  query: string,
  province: string,
  matchCount: number = 6
) {
  try {
    // Use full-text search (tsquery) instead of vector embeddings
    // This works without OpenAI embeddings
    const result = await sql`
      SELECT 
        id,
        content,
        section_title,
        article_number,
        source_title,
        province,
        topic_tags,
        ts_rank(to_tsvector('english', content), plainto_tsquery('english', ${query})) as similarity
      FROM knowledge_chunks
      WHERE province = ${province} 
        AND to_tsvector('english', content) @@ plainto_tsquery('english', ${query})
      ORDER BY similarity DESC, ts_rank_cd(to_tsvector('english', content), plainto_tsquery('english', ${query})) DESC
      LIMIT ${matchCount}
    `;

    return (result.rows ?? []) as RetrievedChunk[];
  } catch (error) {
    console.error("Failed to retrieve chunks via full-text search:", error);
    // Fallback: return all chunks for the province if search fails
    try {
      const fallbackResult = await sql`
        SELECT 
          id,
          content,
          section_title,
          article_number,
          source_title,
          province,
          topic_tags,
          0.3 as similarity
        FROM knowledge_chunks
        WHERE province = ${province}
        LIMIT ${matchCount}
      `;
      return (fallbackResult.rows ?? []) as RetrievedChunk[];
    } catch (fallbackError) {
      console.error("Fallback retrieval also failed:", fallbackError);
      return [];
    }
  }
}

/**
 * Retrieve with quality checks and confidence assessment
 * Handles empty results gracefully with fallback messaging
 */
export async function retrieveWithFallback(
  query: string,
  province: string,
  minSimilarity: number = 0.3
): Promise<RetrievalResult> {
  const chunks = await retrieveRelevantChunks(query, province, 8);

  if (chunks.length === 0) {
    return {
      chunks: [],
      confidence: "low",
      warning:
        "No relevant statute found in knowledge base for this province/topic",
      matchedCount: 0,
    };
  }

  // Calculate average similarity score
  const avgSimilarity =
    chunks.reduce((sum, c) => sum + (c.similarity || 0), 0) / chunks.length;

  // Determine confidence based on match count and similarity
  let confidence: "high" | "medium" | "low" = "medium";
  let warning: string | undefined;

  if (chunks.length >= 4 && avgSimilarity > 0.5) {
    confidence = "high";
  } else if (chunks.length >= 2 && avgSimilarity > 0.3) {
    confidence = "medium";
  } else {
    confidence = "low";
    warning =
      "Low relevance match - results may not be directly applicable. Verify with legal counsel.";
  }

  return {
    chunks,
    confidence,
    warning,
    matchedCount: chunks.length,
  };
}

export function formatChunksAsContext(
  chunks: RetrievedChunk[]
): string {
  if (chunks.length === 0) {
    return "(No relevant statute text found in knowledge base)";
  }

  return chunks
    .map((chunk) => {
      const section = chunk.article_number || "General";
      return `[${chunk.source_title} - Section ${section}]
${chunk.content}`;
    })
    .join("\n\n---\n\n");
}
