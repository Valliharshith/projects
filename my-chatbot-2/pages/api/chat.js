import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    // Example using Groq SDK
    const Groq = require("groq-sdk");
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({ response: response.choices?.[0]?.message?.content || "No reply" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "Error: " + (err.message || "Something went wrong") });
  }
}
