export default async function handler(req, res) {
  // Ensuring only POST requests are allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  
  // Fetching the API key from Vercel Environment Variables
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

  try {
    // Using Mistral-7B as it works better on free tier accounts
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2", 
        messages: [
          { 
            role: "system", 
            content: "You are a professional YouTube SEO and AI Prompt Expert. Provide concise and high-quality results." 
          },
          { 
            role: "user", 
            content: `Task: Generate ${type} for Topic: ${topic}.` 
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      // Detailed error if the API doesn't return text
      res.status(500).json({ output: "AI Error: Response was empty. Check API credits." });
    }

  } catch (error) {
    res.status(500).json({ output: "Server Error: Unable to connect to AI." });
  }
}
