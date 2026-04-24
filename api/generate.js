const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Check if the Method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Only POST requests allowed" });
  }

  const { topic, type } = req.body;

  // 2. Check if API Key exists in Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ output: "Error: GEMINI_API_KEY is missing in Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert YouTube strategist. Generate a high-quality ${type} for a video about: ${topic}. Make it professional and viral-ready.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ output: text });
  } catch (error) {
    console.error("AI Error:", error);
    // यह लाइन आपको बताएगी कि असली एरर क्या है (जैसे: Invalid Key या Billing Issue)
    res.status(500).json({ output: "AI Error: " + error.message });
  }
}
