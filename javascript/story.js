let currentPanel = 0;
const panels = document.querySelectorAll('.panel');
const totalPanels = panels.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');

function updateCarousel() {
    panels.forEach((panel, index) => {
        panel.classList.remove('active', 'prev');
        if (index === currentPanel) {
            panel.classList.add('active');
        } else if (index < currentPanel) {
            panel.classList.add('prev');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPanel);
    });

    prevBtn.disabled = currentPanel === 0;
    nextBtn.disabled = currentPanel === totalPanels - 1;
}

function goToPanel(index) {
    if (index >= 0 && index < totalPanels) {
        currentPanel = index;
        updateCarousel();
    }
}

prevBtn.addEventListener('click', () => {
    goToPanel(currentPanel - 1);
});

nextBtn.addEventListener('click', () => {
    goToPanel(currentPanel + 1);
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToPanel(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goToPanel(currentPanel - 1);
    } else if (e.key === 'ArrowRight') {
        goToPanel(currentPanel + 1);
    }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        goToPanel(currentPanel + 1);
    }
    if (touchEndX > touchStartX + 50) {
        goToPanel(currentPanel - 1);
    }
}

updateCarousel();