const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ output: "Error: API Key missing in Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We will try gemini-pro first as it is the most stable for v1 API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `YouTube Expert: Create ${type} for topic: "${topic}". Use viral SEO keywords.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ output: text });
    
  } catch (error) {
    console.error("Primary Model Failed, trying fallback...");
    
    try {
      // Fallback to the other model name just in case
      const genAI = new GoogleGenerativeAI(apiKey);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await fallbackModel.generateContent(`Create ${type} for: ${topic}`);
      const response = await result.response;
      res.status(200).json({ output: response.text() });
    } catch (fallbackError) {
      res.status(500).json({ output: "AI Error: " + fallbackError.message });
    }
  }
}
