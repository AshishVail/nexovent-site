// API Configuration
const GEMINI_API_KEY = "AIzaSyAaKDz3ENsoRscOKwEgngsCMg41q6YbnI4";
const PEXELS_API_KEY = "NpyUyuEMNBYyjPJaqc8tQaaLpDoOyqV69HFRy7hqa4N5NeKrWWaHXP9s";

let currentSettings = {
    style: 'Cinematic Pro',
    ratio: '16:9'
};

// Selection Logic for Buttons
function selectOption(type, value, element) {
    currentSettings[type] = value;
    const selector = type === 'style' ? '.opt-btn' : '.ratio-btn';
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active-chip'));
    element.classList.add('active-chip');
}

// Master Function to Generate Prompt using Gemini API
async function igniteEngine() {
    const userInput = document.getElementById('promptInput').value;
    const btn = document.getElementById('masterBtn');
    const resultBox = document.getElementById('resultDisplay');
    const outputText = document.getElementById('outputText');

    if (!userInput) return alert("Please type something first!");

    // Start Loading State
    btn.disabled = true;
    btn.innerHTML = `<span>ANALYZING...</span> <i class="fa-solid fa-microchip animate-spin"></i>`;

    try {
        // 1. Call Gemini AI to expand the prompt
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
        
        const promptToAI = `Act as a professional prompt engineer for Midjourney and DALL-E. 
        Expand this simple idea: "${userInput}" into a masterpiece prompt. 
        Style: ${currentSettings.style}. Aspect Ratio: ${currentSettings.ratio}.
        Output ONLY the final prompt text without any explanations.`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptToAI }] }]
            })
        });

        const data = await response.json();
        const expandedPrompt = data.candidates[0].content.parts[0].text;

        // 2. Show Result in UI
        resultBox.classList.remove('hidden');
        outputText.innerText = expandedPrompt;

        // 3. Optional: Fetch Reference Image from Pexels
        fetchReferenceImage(userInput);

    } catch (error) {
        console.error("API Error:", error);
        alert("Something went wrong with the AI connection.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>IGNITE ENGINE</span> <i class="fa-solid fa-fire-flame-curved"></i>`;
    }
}

async function fetchReferenceImage(query) {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        const data = await res.json();
        if(data.photos.length > 0) {
            // Aap apne HTML mein ek image tag add karke yahan display kara sakte hain
            console.log("Reference Image:", data.photos[0].src.medium);
        }
    } catch (e) { console.log("Pexels error"); }
}

function copyOutput() {
    const text = document.getElementById('outputText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Masterpiece Prompt Copied!");
    });
}
