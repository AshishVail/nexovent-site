const CONFIG = {
    GEMINI_KEY: "AIzaSyAaKDz3ENsoRscOKwEgngsCMg41q6YbnI4",
    PEXELS_KEY: "NpyUyuEMNBYyjPJaqc8tQaaLpDoOyqV69HFRy7hqa4N5NeKrWWaHXP9s"
};

let activeStyle = "Cinematic";

function setStyle(s, b) {
    activeStyle = s;
    document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active-btn'));
    b.classList.add('active-btn');
}

async function updateBackground(query) {
    try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
            headers: { Authorization: CONFIG.PEXELS_KEY }
        });
        const data = await res.json();
        if (data.photos[0]) {
            document.body.style.backgroundImage = `linear-gradient(rgba(5,7,10,0.8), rgba(5,7,10,0.95)), url('${data.photos[0].src.large2x}')`;
        }
    } catch (e) { console.log("BG Load Error"); }
}

async function generateProPrompt() {
    const input = document.getElementById('userInput').value;
    const turnstileToken = document.querySelector('[name="cf-turnstile-response"]').value;

    if (!input || !turnstileToken) return alert("Please fill input and verify security.");

    const btn = document.getElementById('genBtn');
    btn.innerText = "Analyzing...";
    btn.disabled = true;
    updateBackground(input);

    const prompt = `Professional AI image prompt for: "${input}". Style: ${activeStyle}. Highly detailed, 8k resolution.`;

    try {
        // यहाँ आपकी Gemini API को कॉल किया जाएगा
        document.getElementById('resultBox').classList.remove('hidden');
        document.getElementById('generatedText').innerText = prompt;
        saveHistory(prompt);
    } catch (e) { alert("API Error!"); }
    finally { btn.innerText = "Generate Masterpiece"; btn.disabled = false; }
}

function saveHistory(txt) {
    const cont = document.getElementById('historyContainer');
    const d = document.createElement('div');
    d.className = "p-3 bg-white/5 rounded-xl text-[10px] text-gray-400 truncate cursor-pointer";
    d.innerText = txt;
    d.onclick = () => { document.getElementById('generatedText').innerText = txt; };
    cont.prepend(d);
}

function copyText() {
    navigator.clipboard.writeText(document.getElementById('generatedText').innerText);
    alert("Copied!");
}

