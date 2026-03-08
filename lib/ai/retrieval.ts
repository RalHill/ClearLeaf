import { createSupabaseServerClient } from "../supabase/server";
import { generateEmbedding } from "./embeddings";

export async function retrieveRelevantChunks(
  query: string,
  province: string,
  matchCount: number = 6
) {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);

    // Call the pgvector matching function
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: embedding,
      filter_province: province,
      match_count: matchCount,
      match_threshold: 0.45,
    });

    if (error) {
      console.error("Retrieval error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to retrieve chunks:", error);
    return [];
  }
}

export function formatChunksAsContext(chunks: any[]): string {
  if (chunks.length === 0) {
    return "(No relevant statute text found in knowledge base)";
  }

  return chunks
    .map((chunk) => {
      return `[${chunk.source_title} - ${chunk.section_title || ""}]
${chunk.content}
Source: ${chunk.source_title}, Section: ${chunk.article_number || "N/A"}`;
    })
    .join("\n\n---\n\n");
}
