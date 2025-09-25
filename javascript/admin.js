// Create a Broadcast Channel. The name must match the display page.
const channel = new BroadcastChannel('admin_display_channel');

// Add event listeners for each player's send button
document.querySelectorAll('.player-admin').forEach(div => {
    const name = div.getAttribute('data-player');
    const operationSelect = div.querySelector('.operation');
    const oreValueInput = div.querySelector('.ore-value');
    const sendButton = div.querySelector('.send-player');

    sendButton.addEventListener('click', () => {
        const operation = operationSelect.value;
        const value = parseInt(oreValueInput.value, 10);
        if (!isNaN(value)) {
            channel.postMessage({ name, operation, value });
            oreValueInput.value = '';
        }
    });
});

// Change player name logic (unchanged)
const oldPlayerNameInput = document.getElementById('old-player-name');
const newPlayerNameInput = document.getElementById('new-player-name');
const changeNameButton = document.getElementById('change-name-button');

function changePlayerName() {
    const oldName = oldPlayerNameInput.value.trim();
    const newName = newPlayerNameInput.value.trim();
    if (oldName && newName) {
        channel.postMessage({ type: 'changeName', oldName, newName });
        oldPlayerNameInput.value = '';
        newPlayerNameInput.value = '';
    }
}

changeNameButton.addEventListener('click', changePlayerName);