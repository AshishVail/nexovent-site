export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ output: "Method Not Allowed" });
    }

    const { input, model, ratio } = req.body;
    const API_KEY = process.env.GROQ_API_KEY;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Updated model because llama3-8b-8192 is decommissioned
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { 
                        role: "system", 
                        content: "You are a professional AI Prompt Engineer for Nexovent.tech. Your task is to provide ONLY the final, ready-to-use image prompt. DO NOT provide explanations, DO NOT provide multiple options, DO NOT provide steps or structures. Just output the single best prompt that the user can copy and paste directly into an AI generator." 
                    },
                    { 
                        role: "user", 
                        content: `Create a professional ${model} image prompt for the topic: ${input}. The aspect ratio must be ${ratio}. Only give me the prompt text.` 
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            // Sending only the direct AI response
            res.status(200).json({ output: data.choices[0].message.content });
        } else {
            res.status(500).json({ output: "Groq API Error: Check your model or API key." });
        }
    } catch (error) {
        res.status(500).json({ output: "Server Error: " + error.message });
    }
}
