export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ output: "Denied" });
  }

  const { topic, type } = req.body;

  // 1. आपके द्वारा बताए गए सटीक नामों के हिसाब से SambaNova की लिस्ट
  const sambaKeys = [
    process.env.SAMBANOVA_API_KEY,   // आपकी पहली की
    process.env.SAMBANOVA_API_KEY_2, // दूसरी
    process.env.SAMBANOVA_API_KEY_3, // तीसरी
    process.env.SAMBANOVA_API_KEY_4, // चौथी
    process.env.SAMBANOVA_API_KEY_5  // पांचवीं
  ].filter(k => k); // अगर कोई खाली है तो उसे हटा देगा

  // 2. Groq की Key (अंतिम बैकअप)
  const groqKey = process.env.GROQ_API_KEY;

  let success = false;
  let output = "";

  // --- स्टेप 1: SambaNova की पांचों कीज़ को बारी-बारी ट्राई करें ---
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
            { role: "system", content: "You are a professional SEO and Hashtag expert for Nexovent.tech. Provide high-quality viral results." },
            { role: "user", content: `Generate ${type} for the topic: ${topic}` }
          ],
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        output = data.choices[0].message.content;
        success = true;
        break; // सफलता मिलते ही लूप बंद करें
      } else {
        console.log(`SambaNova Key ${i + 1} Limit Reached or Error. Trying next...`);
      }
    } catch (err) {
      console.log(`Error connecting to SambaNova Key ${i + 1}.`);
    }
  }

  // --- स्टेप 2: अगर सारी SambaNova कीज़ फेल हो जाएँ, तब Groq का इस्तेमाल करें ---
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
      console.log("Groq back-up also failed.");
    }
  }

  // --- स्टेप 3: रिस्पॉन्स भेजें ---
  if (success) {
    res.status(200).json({ output });
  } else {
    res.status(500).json({ output: "All systems busy. Please try again after 30 seconds." });
  }
}
