const waveformSelect = document.getElementById("waveformSelect");
const toneSlider = document.getElementById("toneSlider");
const speedSlider = document.getElementById("speedSlider");
const octaveSlider = document.getElementById("octaveSlider");
const noteButtonsContainer = document.getElementById("noteButtons");
document.querySelectorAll(".noteButton").forEach(button => {
    button.addEventListener("click", () => {
        const note = button.getAttribute("data-note");
        playNote(note);
    });
});
document.getElementById("play").addEventListener("click", function () {
    const tones = parseInt(toneSlider.value);
    const octaves = parseFloat(octaveSlider.value);
    for (let i = 0; i <= tones * octaves; i++) {
        setTimeout(() => {
            playNote(i);
        }, i * speedSlider.value * 1000);
    }
});

toneSlider.addEventListener("change", recalculateKeys);
octaveSlider.addEventListener("change", recalculateKeys);

function recalculateKeys() {
    const tones = parseInt(toneSlider.value);
    const octaves = parseFloat(octaveSlider.value);
    noteButtonsContainer.innerHTML = ""; // Clear previous buttons

    for (let i = 0; i <= tones * octaves; i++) {
        const button = document.createElement("button");
        button.classList.add("noteButton");
        button.setAttribute("data-note", i);
        button.textContent = "?";
        button.title = "Frequency: " + calculateFrequency(i);
        if (i % tones === 0) {
            button.textContent = "C";
            button.classList.add("c");
        }
        noteButtonsContainer.appendChild(button);
    }

    document.querySelectorAll(".noteButton").forEach(button => {
        button.addEventListener("click", () => {
            const note = button.getAttribute("data-note");
            playNote(note);
        });
    });
}

function playNote(note) {
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveformSelect.value;
    oscillator.frequency.setValueAtTime(calculateFrequency(note), audioContext.currentTime);

    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + speedSlider.value);
}

function calculateFrequency(note) {
    let referenceFrequency = 261.63; // Middle C
    return referenceFrequency * Math.pow(2, 1 / toneSlider.value) ** parseInt(note);
}