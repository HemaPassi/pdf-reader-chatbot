import cors from "cors";

import express from "express";
import { generate } from "./chat.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Chatbot- giving answer from PDF!");
});

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;
  // validate above inputs
  if (!message || !threadId) {
    return res.status(400).json({ error: "Message and threadId are required" });
  }

  const result = await generate(message);

  res.json({ message: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
