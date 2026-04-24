const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;

  // 2. Access the API Key from Vercel Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ output: "Error: GEMINI_API_KEY is missing in Vercel settings." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. Using the correct model name to fix the 404 error
    // Note: 'gemini-1.5-flash' is the stable recommended model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert YouTube Content Creator and SEO specialist. 
    Task: Generate a high-quality ${type} for a video about: "${topic}". 
    The output should be professional, engaging, and optimized for the YouTube algorithm to go viral.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send the successful response back to your HTML page
    res.status(200).json({ output: text });
    
  } catch (error) {
    console.error("AI Generation Error:", error);
    
    // This will help you see the specific error message in your result box if it fails again
    res.status(500).json({ output: "AI Error: " + error.message });
  }
}
