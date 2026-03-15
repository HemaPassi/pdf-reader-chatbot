import readline from 'node:readline/promises'
import Groq from "groq-sdk";

import { vectorStore } from './prepare.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
    const rl = readline.createInterface({input: process.stdin, output:process.stdout})
    
while(true) {
    const question = await rl.question("You: ")
   
    if(question == '/bye') {
        break;
    } 
    //retrieval
    const relevantChunks = await vectorStore.similaritySearch(question, 3)
    const context = relevantChunks.map(chunks => chunks.pageContent).join('\n\n')

    const SYSTEN_PROMPT  = "You are an assistand for providing solution. USe the following relevant piece of retrieved context to answer the equestion. If you don't know the anser, say I don't know."

    //console.log('relevantChunks  ', relevantChunks)
    const userQuery = `Question: ${question}
    Relevant Context: ${context}
    Answer: `

    const chatCompletion = await groq.chat.completions.create({
    messages: [
        {
            role:'system',
            content:SYSTEN_PROMPT

        },
      {
        role: "user",
        content: userQuery,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
// Print the completion returned by the LLM.
 console.log(`Assistent : ${chatCompletion.choices[0]?.message?.content}`);
}
rl.close()
}

chat()