// --- GAME FLOW CONTROL ---
const GAME_FLOW = {
    requestQuit: function (logout) {
        // Close settings
        document.getElementById('settings-modal').style.display = 'none';

        // Show confirmation
        const modal = document.getElementById('confirm-modal');
        const btnYes = document.getElementById('btn-confirm-yes');
        const msg = document.getElementById('confirm-msg');

        msg.innerText = logout ? "Quit game and Log Out?" : "Quit to Main Menu?";

        // Set the Yes button action
        btnYes.onclick = () => this.performQuit(logout);

        modal.style.display = 'flex';
    },

    performQuit: function (logout) {
        document.getElementById('confirm-modal').style.display = 'none';

        // 1. Reset Game State
        gameState = 'SETUP';
        players.forEach(p => { if (p.mesh) scene.remove(p.mesh); });
        players = [];
        activeEvent = null;

        // 2. Hide Game UI
        document.getElementById('gameroom-screen').style.display = 'none';
        document.getElementById('create-screen').style.display = 'none';
        document.getElementById('game-over-modal').style.display = 'none';

        // 3. Clean Listeners
        if (isMultiplayer && gameId && db) {
            db.ref(`games/${gameId}`).off();
            db.ref(`games/${gameId}/turnIndex`).off();
            db.ref(`games/${gameId}/currentMove`).off();
            db.ref(`games/${gameId}/board`).off();
            db.ref(`games/${gameId}/players`).off();
            if (myPlayerId !== 0) {
                db.ref(`games/${gameId}/slots/${myPlayerId}`).set({ type: 'open' });
            }
        }

        listenersActive = false;

        // 4. Handle Logout or Return
        if (logout) {
            // --- UPDATE: HIDE HUD ON LOGOUT ---
            document.getElementById('top-right-hud').style.display = 'none';
            AUTH.logout();
        } else {
            document.getElementById('splash-screen').style.display = 'flex';
            document.getElementById('splash-screen').style.opacity = '1';

            // --- UPDATE: SHOW HUD ON RETURN ---
            document.getElementById('top-right-hud').style.display = 'flex';
            // ----------------------------------

            resetCamera();
            addLog("Returned to Main Menu.");
        }
    }
};

// --- AUTH SYSTEM ---
