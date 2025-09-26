const players = [
    { name: "Player1", ore: 0, img: "../Assets/Character 1.png" },
    { name: "Player2", ore: 0, img: "../Assets/Character 2.png" },
    { name: "Player3", ore: 0, img: "../Assets/Character 3.png" },
    { name: "Player4", ore: 0, img: "../Assets/Character 4.png" }
];

const playersList = document.getElementById('players-list');
const channel = new BroadcastChannel('admin_display_channel');

function broadcastOreTotals() {
    channel.postMessage({
        type: 'oreTotals',
        oreTotals: players.map(p => ({ name: p.name, ore: p.ore }))
    });
}

function renderPlayers() {
    playersList.innerHTML = players.map(p =>
        `<div class="player-card">
            <div class="player-img-container">
                <img class="player-img" src="${p.img}" alt="${p.name}">
            </div>
            <div class="player-info-container">
                <div class="player-name">${p.name}</div>
                <div class="player-ore">Ore: ${p.ore}</div>
            </div>
        </div>`
    ).join('');
    broadcastOreTotals(); // <--- Make sure this is here!
}
renderPlayers();

channel.onmessage = (event) => {
    if (event.data.type === 'changeName') {
        const { oldName, newName } = event.data;
        const player = players.find(p => p.name.toLowerCase() === oldName.toLowerCase());
        if (player) {
            player.name = newName;
            renderPlayers();
        }
    } else {
        const { name, operation, value } = event.data;
        const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (player) {
            if (operation === 'add') player.ore += value;
            else if (operation === 'subtract') player.ore -= value;
            renderPlayers();
        }
    }
};