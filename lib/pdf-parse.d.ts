declare module "pdf-parse/lib/pdf-parse.js" {
  type PdfParseResult = {
    text: string;
  };

  type PdfParse = (data: Buffer) => Promise<PdfParseResult>;

  const pdfParse: PdfParse;
  export default pdfParse;
}
