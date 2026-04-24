export default async function handler(req, res) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;
  
  // Fetching the API Key securely from Vercel Environment Variables
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3-8b-chat-hf", 
        messages: [
          { 
            role: "system", 
            content: "You are a professional AI Prompt Engineer and YouTube Growth Expert for Nexovent.tech." 
          },
          { 
            role: "user", 
            content: `Generate a high-performance ${type} for the following topic: ${topic}. Ensure the output is viral-ready and professional.` 
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      // Sending the AI generated content back to your website frontend
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ output: "AI Error: The API returned an empty response." });
    }

  } catch (error) {
    // Error handling for connection or server issues
    res.status(500).json({ output: "Server Error: " + error.message });
  }
}
