const shopItems = [
    { name: "Agap", desc: "Move Forward (1 - 3 depends on your choice) tiles instantly.", cost: 1, img: "../Assets/Agap1.png" },
    { name: "Bilis", desc: "Steal 4 points equivalent ore of your pick opponent.", cost: 2, img: "../Assets/BIlis1.png" },
    { name: "Hina", desc: "Cast on another player; they must skip their next turn.", cost: 1, img: "../Assets/Hina1.png" },
    { name: "Pagod", desc: "Reverse the player's movement order on their next turn. The player then drops ore based on the number they rolled.",
         cost: 2, img: "../Assets/Pagod1.png" }
];

function getRandomItems(arr, n, exclude = []) {
    const filtered = arr.filter(item => !exclude.includes(item.name));
    const shuffled = filtered.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

const openShopBtn = document.getElementById('open-shop');
const shopModal = document.getElementById('shop-modal');
const shopCards = document.getElementById('shop-cards');
const closeShopBtn = document.getElementById('close-shop');

let currentShopCards = [];

function renderShopCards() {
    shopCards.innerHTML = currentShopCards.map((item, idx) => `
        <div class="shop-card" style="background:#f8f9fa;padding:20px 15px;border-radius:8px;min-width:140px;box-shadow:0 2px 8px #0002;display:flex;flex-direction:column;align-items:center;">
            <img src="${item.img}" alt="${item.name}" class="shop-card-img" data-idx="${idx}" style="width:200px;height:200px;object-fit:contain;margin-bottom:10px;">
            <h3 style="margin:0 0 10px 0;">${item.name}</h3>
            <div style="font-size:0.95em;margin-bottom:10px;">${item.desc}</div>
            <div style="font-weight:bold;">Price: ${item.cost} ore</div>
            <button class="reroll-card" data-idx="${idx}" style="margin-top:10px;">Re-roll</button>
        </div>
    `).join('');
    // Add event listeners for re-roll buttons
    shopCards.querySelectorAll('.reroll-card').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(btn.getAttribute('data-idx'));
            // Animate the image
            const img = shopCards.querySelector(`.shop-card-img[data-idx="${idx}"]`);
            img.classList.add('shop-spin');
            setTimeout(() => {
                // Exclude currently shown cards except the one being re-rolled
                const excludeNames = currentShopCards.map((c, i) => i !== idx ? c.name : null).filter(Boolean);
                const [newCard] = getRandomItems(shopItems, 1, excludeNames);
                if (newCard) {
                    currentShopCards[idx] = newCard;
                    renderShopCards();
                    // Disable this re-roll button after use
                    shopCards.querySelectorAll('.reroll-card')[idx].disabled = true;
                }
            }, 600); // Match the animation duration
            // Remove animation class after animation ends (for next time)
            img.addEventListener('animationend', () => img.classList.remove('shop-spin'), { once: true });
        };
    });
}
openShopBtn.addEventListener('click', () => {
    currentShopCards = getRandomItems(shopItems, 2);
    renderShopCards();
    shopModal.style.display = "flex";
});

closeShopBtn.addEventListener('click', () => {
    shopModal.style.display = "none";
});

// Optional: Close modal when clicking outside the modal box
shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) shopModal.style.display = "none";
});