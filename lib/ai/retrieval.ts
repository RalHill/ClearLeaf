import "@/lib/db/ensure-postgres-url";
import { sql } from "@vercel/postgres";
import { generateEmbedding } from "./embeddings";

export async function retrieveRelevantChunks(
  query: string,
  province: string,
  matchCount: number = 6
) {
  try {
    const embedding = await generateEmbedding(query);
    const vectorLiteral = `[${embedding.join(",")}]`;

    const result = await sql`
      SELECT * FROM match_knowledge_chunks(
        ${vectorLiteral}::vector,
        ${province},
        0.45,
        ${matchCount}
      )
    `;

    return (result.rows ?? []) as Array<{
      id: bigint;
      content: string;
      section_title: string | null;
      article_number: string | null;
      source_title: string;
      province: string;
      topic_tags: string[] | null;
      similarity: number;
    }>;
  } catch (error) {
    console.error("Failed to retrieve chunks:", error);
    return [];
  }
}

export function formatChunksAsContext(
  chunks: Array<{
    content: string;
    section_title?: string | null;
    article_number?: string | null;
    source_title: string;
  }>
): string {
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
