export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Denied" });
  }

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
        // यहाँ हमने नया और अपडेटेड मॉडल नाम डाला है
        model: "llama-3.3-70b-versatile", 
        messages: [
          { 
            role: "system", 
            content: "You are a YouTube SEO expert for Nexovent.tech. Provide high-quality viral content results in English." 
          },
          { 
            role: "user", 
            content: `Generate ${type} for the topic: ${topic}` 
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ output: "Groq API Error: Please check your model settings." });
    }
  } catch (error) {
    res.status(500).json({ output: "Server Error: " + error.message });
  }
}
