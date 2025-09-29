const shopItems = [
    { name: "Agap", desc: "Move Forward (1 - 3 depends on your choice) tiles instantly.", cost: 1, img: "../Assets/PotionCards/Agap1.png" },
    { name: "Bilis", desc: "Steal 4 points equivalent ore of your pick opponent.", cost: 2, img: "../Assets/PotionCards/Bilis1.png" },
    { name: "Hina", desc: "Cast on another player; they must skip their next turn.", cost: 1, img: "../Assets/PotionCards/Hina1.png" },
    { name: "Pagod", desc: "Reverse the player's movement order on their next turn. The player then drops ore based on the number they rolled.",
         cost: 2, img: "../Assets/PotionCards/Pagod1.png" }
];

function getRandomItems(arr, n, exclude = []) {
    const filtered = arr.filter(item => !exclude.includes(item.name));
    const shuffled = filtered.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

const openShopBtn = document.getElementById('open-shop');
const shopModal = document.getElementById('shop-modal');
const shopCards = document.getElementById('shop-cards');

let currentShopCards = [];

function renderShopCards() {
    shopCards.innerHTML = currentShopCards.map((item, idx) => `
        <div class="shop-card">
            <img class="shop-card-img"  src="${item.img}" alt="${item.name}" data-idx="${idx}">
            <h1>${item.name}</h1>
            <div class="shop-card-desc">${item.desc}</div>
            <div class="shop-card-price">Price: ${item.cost} ore</div>
            <button class="reroll-card" data-idx="${idx}">Re-roll</button>
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

//Close modal when clicking outside the modal box
shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) shopModal.style.display = "none";
});