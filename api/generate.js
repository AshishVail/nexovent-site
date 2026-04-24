export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Ye Vercel se key uthayega

  // AI ke liye instruction
  const promptText = `As a YouTube SEO expert, generate a very long and detailed ${type} for the video topic: "${topic}". Make it professional and viral.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();
    const aiOutput = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ output: aiOutput });
  } catch (error) {
    res.status(500).json({ error: "AI connection failed" });
  }
}
