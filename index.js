/*

implementation plan
stage 1: indexing
1. load the documents - pdf, text
2. chuck the document
3. generate vecotr embeddings for each chunk using OpenAI embeddings API
4. store the embeddings in a vector database - pinecone, weaviate   
stage 2: querying
1. user query
2. generate embeddings for the query using OpenAI embeddings API
3. retrieve top-k similar chunks from vector database
4. use retrieved chunks as context to generate answer using OpenAI GPT-4 API
5. return the answer to the user    

*/
