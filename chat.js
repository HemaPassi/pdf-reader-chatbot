import readline from 'node:readline/promises'
import Groq from "groq-sdk";

import { vectorStore } from './prepare.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generate(userMessage) {
   // const rl = readline.createInterface({input: process.stdin, output:process.stdout})
   
    
while(true) {
 //   const question = await rl.question("You: ")
     const question = userMessage
   
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
 //console.log(`Assistent : ${chatCompletion.choices[0]?.message?.content}`);
  return chatCompletion.choices[0]?.message?.content;
}
//rl.close()
}

// chat()


// export async function generate(userMessage, threadId) {
//   const baseMessage = [
//     {
//       role: "system",
//       content: `You are Dan, smart assistant. If you know the answer to a question, answer it directly in plain English. If answer require real-time, local or up-to-date information, or if you don't know the answer then use the availble tools to find it.
//         You have access to following tools:
//         webSearch({query}) : {query: string} use this to seach the internet for latest information.
//         decide when to use your own knowledge and when to use the tool.
//         Do not mention the tool unless needed.

//         Eamples:
//         what is the current president of USA? -> use the search tool to find details
//         who won the world cup 2022? -> use webSearch({query: "who won the world cup 2022?"})

//         current date and time: ${new Date().toUTCString()}`,
//     },
//   ];

//   const messages = cache.get("threadId") ?? baseMessage;

//   messages.push({
//     role: "user",
//     content: userMessage,
//   });
//   const MAX_RETRIES = 5;
//   let attempts = 0;

//   while (true) {
//     if (attempts >= MAX_RETRIES) {
//       throw new Error("Max retries exceeded");
//     }

//     attempts++;
//     const response = await getGroqChatCompletion(messages);

//     const toolCalls = response.choices[0].message.tool_calls;
//     if (!toolCalls) {
//       //console.log(`Assistant : ${response.choices[0].message.content}`);
//       cache.set("threadId", messages);
//       return response.choices[0].message.content;
//       //break;
//     }

//     for (const tool of toolCalls) {
//       const functionName = tool.function.name;
//       const functionParams = tool.function.arguments;

//       if (functionName === "webSearch") {
//         const res = await webSearch(JSON.parse(functionParams));
//         messages.push({
//           tool_call_id: tool.id,
//           role: "tool",
//           name: functionName,
//           content: res,
//         });
//       }
//     }
//   }
//   // }
// }