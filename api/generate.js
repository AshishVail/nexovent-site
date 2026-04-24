const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Restrict to POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  
  // 2. Validate API Key existence
  if (!apiKey) {
    return res.status(500).json({ output: "Error: API Key is not configured in Vercel environment variables." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    /**
     * 3. Model Selection
     * Using "gemini-1.5-flash" with a fallback to "gemini-pro"
     * This addresses the '404 Not Found' error seen in previous attempts.
     */
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as a YouTube SEO Expert. 
    Generate highly engaging and viral ${type} for the following video topic: "${topic}". 
    Ensure the content is optimized for the YouTube algorithm and includes trending keywords.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Return successful response
    res.status(200).json({ output: text });
    
  } catch (error) {
    console.error("AI Generation Error:", error);
    
    // Provide a clear error message to the frontend
    res.status(500).json({ 
      output: "AI Service Error: " + error.message,
      details: "Please ensure your Gemini API Key is active and billing is enabled if required."
    });
  }
}
