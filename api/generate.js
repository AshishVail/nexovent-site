const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ output: "Denied" });

  const { topic, type } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `Act as a YouTube and SEO Expert. Topic: ${topic}. Task: Generate high-quality ${type}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ output: response.text() });
  } catch (error) {
    res.status(500).json({ output: "System Error: " + error.message });
  }
}
