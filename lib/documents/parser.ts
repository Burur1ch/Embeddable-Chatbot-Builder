/**
 * Split text into chunks for embedding
 * Uses a simple paragraph-based chunking strategy
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200,
): Array<{ content: string; chunkIndex: number }> {
  // Split by double newlines first (paragraphs)
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  const chunks: Array<{ content: string; chunkIndex: number }> = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed max size, save current chunk
    if (
      currentChunk.length + paragraph.length + 2 > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex,
      });

      // Add overlap from end of previous chunk
      currentChunk = currentChunk.slice(-overlap);
      chunkIndex++;
    }

    currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex,
    });
  }

  return chunks;
}

export async function extractTextFromTxt(file: File): Promise<string> {
  return new TextDecoder("utf-8").decode(await file.arrayBuffer());
}

export async function extractTextFromPdf(file: File): Promise<string> {
  // Import the parser implementation directly. The package root in pdf-parse
  // 1.1.1 runs its test fixture when loaded as an entrypoint.
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const result = await pdfParse(Buffer.from(await file.arrayBuffer()));
  const text = result.text.trim();

  if (!text) {
    throw new Error("This PDF does not contain extractable text.");
  }

  return text;
}

/**
 * Extract text from markdown files
 */
export async function extractTextFromMarkdown(file: File): Promise<string> {
  return extractTextFromTxt(file);
}

/**
 * Main document extraction function
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const fileType = file.type || file.name.split(".").pop();

  switch (fileType?.toLowerCase()) {
    case "text/plain":
    case "txt":
      return extractTextFromTxt(file);
    case "text/markdown":
    case "md":
      return extractTextFromMarkdown(file);
    case "application/pdf":
    case "pdf":
      return extractTextFromPdf(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
