import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024)
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await pdfParse(buffer);

  // Scanned PDFs return almost no text despite having file size
  const isScanned = result.text.trim().length < 200 && file.size > 50_000;

  return NextResponse.json({
    text: result.text,
    pageCount: result.numpages,
    isScanned,
  });
}
