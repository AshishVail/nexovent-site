export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { topic, type } = req.body;

  // 1. Groq Setup
  const groqCall = async () => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an SEO expert for Nexovent.tech. Provide results in English." },
          { role: "user", content: `Generate ${type} for: ${topic}` }
        ],
        temperature: 0.7
      })
    });
    return response;
  };

  // 2. SambaNova Setup
  const sambaCall = async () => {
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct", // आप यहाँ 70B भी इस्तेमाल कर सकते हैं
        messages: [
          { role: "system", content: "You are an SEO expert for Nexovent.tech. Provide results in English." },
          { role: "user", content: `Generate ${type} for: ${topic}` }
        ],
        temperature: 0.7
      })
    });
    return response;
  };

  try {
    // पहले Groq को ट्राई करो
    let response = await groqCall();

    // अगर Groq की लिमिट खत्म (429) या कोई एरर आए, तो SambaNova पर जाओ
    if (response.status === 429 || !response.ok) {
      console.log("Groq Limit Reached or Error, switching to SambaNova...");
      response = await sambaCall();
    }

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ output: "All APIs failed. Please try again later." });
    }

  } catch (error) {
    res.status(500).json({ output: "Server Error: " + error.message });
  }
}
