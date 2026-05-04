export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Denied" });
  }

  const { topic, type } = req.body;

  const sambaKeys = [
    process.env.SAMBANOVA_API_KEY,
    process.env.SAMBANOVA_API_KEY_2,
    process.env.SAMBANOVA_API_KEY_3,
    process.env.SAMBANOVA_API_KEY_4,
    process.env.SAMBANOVA_API_KEY_5
  ].filter(k => k);

  const groqKey = process.env.GROQ_API_KEY;

  let success = false;
  let output = "";

  for (let i = 0; i < sambaKeys.length; i++) {
    try {
      const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sambaKeys[i]}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            { role: "system", content: "You are a professional SEO and Hashtag expert for Nexovent.tech." },
            { role: "user", content: `Generate ${type} for the topic: ${topic}` }
          ],
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        output = data.choices[0].message.content;
        success = true;
        break;
      }
    } catch (err) {
      continue;
    }
  }

  if (!success && groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an SEO expert for Nexovent.tech." },
            { role: "user", content: `Generate ${type} for the topic: ${topic}` }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        output = data.choices[0].message.content;
        success = true;
      }
    } catch (err) {
      // Failed
    }
  }

  if (success) {
    res.status(200).json({ output });
  } else {
    res.status(500).json({ output: "System overloaded. Try again later." });
  }
}
