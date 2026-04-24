export default async function handler(req, res) {
  const { topic } = req.body;
  const API_KEY = process.env.GROQ_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // लेटेस्ट मॉडल
        messages: [
          { role: "system", content: "You are an expert AI Prompt Engineer." },
          { role: "user", content: `Create a detailed AI prompt for: ${topic}` }
        ]
      })
    });
    const data = await response.json();
    res.status(200).json({ output: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ output: "Error: API not responding." });
  }
}

