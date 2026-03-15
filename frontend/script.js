//import { response } from "../chatbot.js";

const input = document.querySelector("#input");
const askbtn = document.querySelector("#ask");
const chatContainor = document.querySelector("#chat-container");
const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

input.addEventListener("keyup", handleEnter);
askbtn.addEventListener("click", handleAsk);

const loading = document.createElement("div");
loading.className = "loader";
loading.innerHTML = `<div class="spinner-border text-primary pulse" role="status">
<span class="visually-hidden">Thinking...</span>
</div>`;

async function generate(text) {
  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";
  msg.textContent = text;
  chatContainor.appendChild(msg);
  input.value = "";
  chatContainor?.appendChild(loading);

  // call server
  const assostemtRes = await callServer(text);

  console.log("response from server", assostemtRes);

  const assistantMsg = document.createElement("div");
  assistantMsg.className = "max-w-fit";
  assistantMsg.textContent = assostemtRes;

  loading.remove();
  chatContainor?.appendChild(assistantMsg);
}

async function callServer(inputText) {
  const reponse = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ threadId, message: inputText }),
  });
  if (!reponse.ok) {
    throw new Error("Error generatign the response");
  }

  const result = await reponse.json();
  return result.message;
}
async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input?.value.trim();
    if (!text) {
      return;
    }
    await generate(text);
  }
}

async function handleAsk(e) {
  const text = input?.value.trim();
  if (!text) {
    return;
  }
  await generate(text);
}
