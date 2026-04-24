const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ output: "Error: API Key missing in Vercel." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Yahan humne model ka sahi stable naam use kiya hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `YouTube expert mode: Generate ${type} for video topic: "${topic}". Make it viral and SEO friendly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ output: text });
    
  } catch (error) {
    console.error("Detailed Error:", error);
    // Agar 404 phir bhi aaye, toh hum model name badal kar check karenge
    res.status(500).json({ output: "AI Error: " + error.message });
  }
}
