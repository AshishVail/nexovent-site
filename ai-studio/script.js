let currentSettings = {
    style: 'Cinematic Photorealistic',
    ratio: '16:9'
};

function selectOption(type, value, element) {
    currentSettings[type] = value;
    
    // Remove active class from siblings
    const selector = type === 'style' ? '.opt-btn' : '.ratio-btn';
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove('active-chip'));
    
    // Add to clicked
    element.classList.add('active-chip');
}

async function igniteEngine() {
    const input = document.getElementById('promptInput').value;
    const btn = document.getElementById('masterBtn');
    const resultBox = document.getElementById('resultDisplay');
    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]').value;

    if (!input) return alert("Please enter your idea first!");
    if (!turnstileResponse) return alert("Please complete the security check!");

    btn.disabled = true;
    btn.innerHTML = `<span>PROCESSING...</span> <i class="fa-solid fa-circle-notch animate-spin"></i>`;

    // Modern Prompt Engineering Logic
    const finalPrompt = `[Masterpiece] ${input}, ${currentSettings.style} style, ultra-detailed, 8k resolution, highly realistic, shot on 35mm lens, depth of field, sharp focus, vibrant colors, lighting by Unreal Engine 5, aspect ratio --ar ${currentSettings.ratio}`;

    // Simulate AI Processing
    setTimeout(() => {
        resultBox.classList.remove('hidden');
        document.getElementById('outputText').innerText = finalPrompt;
        btn.disabled = false;
        btn.innerHTML = `<span>IGNITE ENGINE</span> <i class="fa-solid fa-fire-flame-curved"></i>`;
        
        // Auto-scroll to result
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function copyOutput() {
    const text = document.getElementById('outputText').innerText;
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard!");
}
