export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ output: "Denied" });

  const { topic, type } = req.body;
  const API_KEY = process.env.GROQ_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3-8b-8192", 
        messages: [
          { role: "system", content: "You are a professional YouTube SEO expert for Nexovent.tech" },
          { role: "user", content: `Provide high-quality ${type} for: ${topic}` }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ output: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ output: "System error, please try again!" });
  }
}
