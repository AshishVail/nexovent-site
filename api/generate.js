const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
4w");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { topic, type } = req.body;
    const prompt = `Create viral ${type} for: ${topic}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ output: response.text() });
  } catch (e) {
    res.status(500).json({ output: "Erro
