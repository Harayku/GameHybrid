const backgroundMusic = document.getElementById('background-music');
const muteBtn = document.getElementById('mute-btn');

// Play music
document.body.addEventListener('click', () => {
    backgroundMusic.play().catch(error => {
        console.log("Audio playback was prevented. User needs to interact with the page.", error);
    });
}, { once: true });

// Mute
muteBtn.addEventListener('click', () => {
    backgroundMusic.muted = !backgroundMusic.muted;
    muteBtn.textContent = backgroundMusic.muted ? 'Unmute' : 'Mute';
});
