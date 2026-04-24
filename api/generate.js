import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ output: "API Key is missing in Vercel Environment Variables." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a YouTube Expert. Generate a professional ${type} for the topic: ${topic}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ output: response.text() });
  } catch (error) {
    res.status(500).json({ output: "AI Error: " + error.message });
  }
}

