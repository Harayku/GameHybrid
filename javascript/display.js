const players = [
    { name: "Player1", ore: 0 },
    { name: "Player2", ore: 0 },
    { name: "Player3", ore: 0 },
    { name: "Player4", ore: 0 }
];

const playersList = document.getElementById('players-list');
function renderPlayers() {
    playersList.innerHTML = players.map(p =>
        `<div><strong>${p.name}</strong>: ${p.ore}</div>`
    ).join('');
}
renderPlayers();

const channel = new BroadcastChannel('admin_display_channel');
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