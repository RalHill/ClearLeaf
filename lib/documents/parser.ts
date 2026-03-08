// lib/documents/parser.ts
import { ParsedDocument } from "@/lib/types/compliance";

const MAX_CHARS = 80_000; // ~20K tokens — fits Haiku context window safely

export async function parseDocument(file: File): Promise<ParsedDocument> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  let text = "";
  let isScanned = false;

  if (ext === "pdf") {
    // pdf-parse needs Node.js Buffer — runs server-side via /api/parse-document
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/parse-document", { 
      method: "POST", 
      body: form 
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    text = data.text;
    isScanned = data.isScanned;
  } else if (ext === "docx" || ext === "doc") {
    const mammoth = (await import("mammoth")).default;
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    text = result.value;
  } else if (ext === "txt" || ext === "md") {
    text = await file.text();
  } else {
    throw new Error(`Unsupported file type: .${ext}. Upload PDF, DOCX, or TXT.`);
  }

  if (isScanned) throw new Error(
    "Scanned PDF detected. Export as text-based PDF or .docx and re-upload."
  );

  const truncated = text.length > MAX_CHARS;
  return {
    text: text.slice(0, MAX_CHARS),
    fileName: file.name,
    fileType: ext as ParsedDocument["fileType"],
    charCount: Math.min(text.length, MAX_CHARS),
    truncated,
    isScanned,
  };
}
