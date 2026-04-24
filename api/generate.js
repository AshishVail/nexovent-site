export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ output: "API Key is missing in Vercel settings." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a detailed ${type} for a YouTube video about: ${topic}. Make it viral and engaging.` }] }]
      })
    });

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    
    res.status(200).json({ output: resultText });
  } catch (error) {
    res.status(500).json({ output: "Server Error: " + error.message });
  }
}
