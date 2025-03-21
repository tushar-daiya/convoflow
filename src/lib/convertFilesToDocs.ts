import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
export async function convertFilesToDocs(
  file: Blob,
  mimeType: string
): Promise<PDFLoader | TextLoader | CSVLoader | DocxLoader> {
  let loader;
  if (mimeType === "application/pdf") {
    loader = new PDFLoader(file);
  } else if (mimeType === "text/plain") {
    loader = new TextLoader(file);
  } else if (mimeType === "text/csv") {
    loader = new CSVLoader(file);
  } else if (
    mimeType === "docx" ||
    mimeType ==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    loader = new DocxLoader(file);
  } else {
    throw new Error("Unsupported file type");
  }
  return loader;
}
