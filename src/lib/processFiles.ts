import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { Pinecone } from "@pinecone-database/pinecone";
export async function docsToVector(
  loader: PDFLoader | TextLoader | CSVLoader | DocxLoader,
  userId: string,
  openAiApiKey: string,
  pineconeApiKey: string
) {
  try {
    const docs = await loader.load();
    const documentId = crypto.randomUUID();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);
    const docsWithMetadata = splitDocs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        documentId,
      },
    }));
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAiApiKey,
      model: "text-embedding-ada-002",
    });
    const pineconeClient = new Pinecone({
      apiKey: pineconeApiKey,
    });

    const existingIndexName = (
      await pineconeClient.listIndexes()
    )?.indexes?.find((index) => index.name === userId);

    if (!existingIndexName) {
      await pineconeClient.createIndex({
        name: userId,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
    }
    const index = pineconeClient.index(userId);

    await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
      pineconeIndex: index,
    });
    return {
      status: 200,
      message: "Successfully uploaded document",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
