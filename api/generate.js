export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Using this specific model as it has high availability for free tier
        model: "togethercomputer/llama-2-7b-chat", 
        messages: [
          { role: "system", content: "You are a professional assistant." },
          { role: "user", content: `Write a ${type} for: ${topic}` }
        ],
        max_tokens: 512
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ output: "AI is warming up. Please refresh in 1 minute." });
    }

  } catch (error) {
    res.status(500).json({ output: "Connection Error. Please try again." });
  }
}
