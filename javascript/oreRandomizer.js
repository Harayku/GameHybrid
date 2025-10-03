const ORE_IMAGES = [
    "../Assets/Ores/dyamante.png",
    "../Assets/Ores/esmeralda.png",
    "../Assets/Ores/ginto.png",
    "../Assets/Ores/bakal.png",
    "../Assets/Ores/tanso.png",
    "../Assets/Ores/uling.png"
];

// Theme per ore same index with ORE_IMAGES
const ORE_THEME = [
    { bg: "#00e1ff" }, // dyamante
    { bg: "#00ff2a" }, // esmeralda
    { bg: "#fbff00" }, // ginto
    { bg: "#a0a0a0" }, // bakal
    { bg: "#d6640c" }, // tanso
    { bg: "#0b0b0c" }, // uling
];

const frame = document.getElementById("oreFrame");
const imgEl = document.getElementById("oreImg");

let currentIndex = 0;
let spinning = false;

// Preload to keep the fast phase smooth
function preloadImages(sources) {
    return Promise.all(
        sources.map(src => new Promise(resolve => {
            const i = new Image();
            i.onload = i.onerror = resolve; // keep going even if a URL fails
            i.src = src;
        }))
    );
}

function mod(a, b) { return ((a % b) + b) % b; }

function hexToRgba(hex, alpha) {
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTheme(idx) {
    const t = ORE_THEME[idx % ORE_THEME.length];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--bg', t.bg);
}

// Decelerating spinner to a random target index, with live color theming
function spin() {
    if (spinning || ORE_IMAGES.length === 0) return;
    spinning = true;
    frame.classList.add("spinning");

    // Choose a truly random final result
    const targetIndex = Math.floor(Math.random() * ORE_IMAGES.length);

    // Ensure at least several full rotations before easing to the target
    const minCycles = 1; // complete cycles
    let stepsRemaining = minCycles * ORE_IMAGES.length + mod(targetIndex - currentIndex, ORE_IMAGES.length);

    // Start brisk, then ease out
    let delay = 10; // ms between ticks (fast phase)
    const tick = () => {
        currentIndex = (currentIndex + 1) % ORE_IMAGES.length;
        imgEl.src = ORE_IMAGES[currentIndex] || PLACEHOLDER;

        // Update theme to match the currently shown ore while spinning
        applyTheme(currentIndex);

        stepsRemaining--;

        if (stepsRemaining <= 0) {
            // Finalize on target (keep the final theme)
            applyTheme(targetIndex);
            spinning = false;
            frame.classList.remove("spinning");
            return;
        }

        // Deceleration curve: increase delay more as we approach the end
        if (stepsRemaining < ORE_IMAGES.length * 2) {
            delay += 26; // final crawl
        } else if (stepsRemaining < ORE_IMAGES.length * 4) {
            delay += 13; // mid slow
        } else {
            delay += 10;  // gentle slowdown during fast phase
        }

        setTimeout(tick, delay);
    };

    setTimeout(tick, delay);
}

// Initial setup
(async () => {
    imgEl.src = ORE_IMAGES[0] || PLACEHOLDER;
    applyTheme(0); // set initial theme to first ore
    await preloadImages(ORE_IMAGES);
    // Click/tap to spin
    frame.addEventListener("click", spin, { passive: true });
})();