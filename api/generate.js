export default async function handler(req, res) {
  // 1. Check if method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Only POST allowed" });
  }

  const { topic, type } = req.body;
  const API_KEY = process.env.GROQ_API_KEY;

  // 2. Check if API KEY exists in Vercel
  if (!API_KEY) {
    return res.status(500).json({ output: "System Error: GROQ_API_KEY is missing in Vercel Settings." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Model name corrected
        messages: [
          { role: "system", content: "You are a professional YouTube SEO expert." },
          { role: "user", content: `Generate ${type} for: ${topic}` }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ output: "Groq API Error: " + data.error.message });
    }

    if (data.choices && data.choices[0]) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ output: "Empty response from AI. Try a different topic." });
    }
  } catch (error) {
    res.status(500).json({ output: "Server Crash: " + error.message });
  }
}
