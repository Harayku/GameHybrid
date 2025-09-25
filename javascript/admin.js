// Create a Broadcast Channel. The name must match the display page.
const channel = new BroadcastChannel('admin_display_channel');

// Change player name logic (unchanged)
const oldPlayerNameInput = document.getElementById('old-player-name');
const newPlayerNameInput = document.getElementById('new-player-name');
const changeNameButton = document.getElementById('change-name-button');

function changePlayerName() {
    const oldName = oldPlayerNameInput.value.trim();
    const newName = newPlayerNameInput.value.trim();
    if (oldName && newName) {
        channel.postMessage({ type: 'changeName', oldName, newName });
        // Update admin panel UI so future calculations use the new name
        document.querySelectorAll('.player-admin').forEach(div => {
            if (div.getAttribute('data-player').toLowerCase() === oldName.toLowerCase()) {
                div.setAttribute('data-player', newName);
                div.querySelector('strong').textContent = newName;
            }
        });
        oldPlayerNameInput.value = '';
        newPlayerNameInput.value = '';
    }
}

// Add event listeners for each player's send button
document.querySelectorAll('.player-admin').forEach(div => {
    const name = div.getAttribute('data-player');
    const operationSelect = div.querySelector('.operation');
    const oreValueInput = div.querySelector('.ore-value');
    const sendButton = div.querySelector('.send-player');

    sendButton.addEventListener('click', () => {
        const name = div.getAttribute('data-player');
        const operation = operationSelect.value;
        const value = parseInt(oreValueInput.value, 10);
        if (!isNaN(value)) {
            channel.postMessage({ name, operation, value });
            oreValueInput.value = '';
        }
    });
});



changeNameButton.addEventListener('click', changePlayerName);