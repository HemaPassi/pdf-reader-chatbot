import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocuments(filePaths) {
  // stage 1: indexing
  // 1. load the documents - pdf, text
  // 2. chunk the document
  // 3. generate vector embeddings for each chunk using OpenAI embeddings API
  // 4. store the embeddings in a vector database - pinecone, weaviate

  const loader = new PDFLoader(filePaths, { splitPages: false });
  const document = await loader.load();
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await splitter.splitText(document[0]?.pageContent);

  const documents = texts.map((text, idx) => {
    return {
      pageContent: text,
      metadata: document[0]?.metadata,
    };
  });

  await vectorStore.addDocuments(documents);
}
