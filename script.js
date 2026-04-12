const CONFIG = {
    GEMINI_KEY: "AIzaSyAaKDz3ENsoRscOKwEgngsCMg41q6YbnI4",
    PEXELS_KEY: "NpyUyuEMNBYyjPJaqc8tQaaLpDoOyqV69HFRy7hqa4N5NeKrWWaHXP9s"
};

// prompt generate करने का मुख्य फंक्शन
async function generateProPrompt() {
    const input = document.getElementById('userInput').value;
    const btn = document.getElementById('genBtn');
    
    // Cloudflare Turnstile Check
    const turnstileToken = document.querySelector('[name="cf-turnstile-response"]').value;

    if (!input || !turnstileToken) {
        alert("कृपया अपना आईडिया लिखें और सुरक्षा जांच (Security Check) पूरी करें।");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Processing...";

    const finalPrompt = `Professional AI Prompt for: ${input}. Style: High-quality, Cinematic, 8k.`;

    try {
        // यहाँ आपका Gemini API काम करेगा
        document.getElementById('resultBox').classList.remove('hidden');
        document.getElementById('generatedText').innerText = finalPrompt;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        btn.disabled = false;
        btn.innerText = "Generate Masterpiece";
    }
}

// टेक्स्ट कॉपी करने के लिए
function copyText() {
    const text = document.getElementById('generatedText').innerText;
    navigator.clipboard.writeText(text);
    alert("प्रॉम्ट कॉपी हो गया!");
      }

