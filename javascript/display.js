const players = [
    { name: "Player1", ore: 0, img: "../Assets/Characters/Character1.gif" },
    { name: "Player2", ore: 0, img: "../Assets/Characters/Character2.gif" },
    { name: "Player3", ore: 0, img: "../Assets/Characters/Character3.gif" },
    { name: "Player4", ore: 0, img: "../Assets/Characters/Character4.gif" }
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
    broadcastOreTotals();
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
            if (operation === 'add') {
                player.ore += value
            } else if (operation === 'subtract') {
                player.ore -= value;
                if(player.ore < 0) {
                    player.ore = 0;
                    
                }
            }
        }
        renderPlayers();
    }
};