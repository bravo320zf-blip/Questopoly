// --- GAME FLOW CONTROL ---
const GAME_FLOW = {
    requestQuit: function (logout) {
        // Close settings
        document.getElementById('settings-modal').style.display = 'none';

        // Show confirmation
        const modal = document.getElementById('confirm-modal');
        const btnYes = document.getElementById('confirm-yes-btn'); // FIXED ID match
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
// (Auth is in auth.js, but we link helpers here)

// --- NOTIFICATIONS SYSTEM ---
const NOTIFICATIONS = {
    systemMsg: null, // Stores current fetched system message
    inboxData: {},

    init: function () {
        if (!currentUser) return;

        const bellBtn = document.getElementById('global-notify-btn');
        if (bellBtn) bellBtn.style.display = 'block';

        // 1. Listen for User Inbox (Existing)
        db.ref(`users/${currentUser.uid}/inbox`).on('child_added', snap => {
            const note = snap.val();
            // Check if we are in a game room to whisper
            const roomScreen = document.getElementById('gameroom-screen');
            const inGameRoom = (roomScreen && roomScreen.style.display === 'flex');

            if (inGameRoom && note.type === 'dm') {
                this.injectWhisperToRoom(note);
                // Auto-delete whisphers from inbox so they don't pile up as unread
                db.ref(`users/${currentUser.uid}/inbox/${snap.key}`).remove();
            } else {
                this.updateBadge(); // Only update badge if not whispered
                if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_click');
            }
        });

        db.ref(`users/${currentUser.uid}/inbox`).on('child_removed', () => this.updateBadge());
        db.ref(`users/${currentUser.uid}/inbox`).on('value', snap => {
            this.inboxData = snap.val() || {};
            this.updateBadge();
        });

        // 2. NEW: Listen for Global System Updates
        db.ref('system/update').on('value', snap => {
            this.systemMsg = snap.val(); // { text: "...", timestamp: 12345678 }
            this.updateBadge();
        });
    },

    updateBadge: function () {
        // Count Inbox Items
        let count = 0;
        if (this.inboxData) count = Object.keys(this.inboxData).length;

        // Check System Message "Read" Status
        let hasUnreadSystem = false;
        if (this.systemMsg && this.systemMsg.text) {
            const lastRead = localStorage.getItem('sys_update_read_time');
            // If we haven't read it, or the current message is newer than what we read
            if (!lastRead || this.systemMsg.timestamp > parseInt(lastRead)) {
                hasUnreadSystem = true;
                count++;
            }
        }

        const badge = document.getElementById('notify-badge-count');
        if (badge) {
            if (count > 0) {
                // Show Red Exclamation Point if it's just the system update, else number
                badge.innerText = (hasUnreadSystem && count === 1) ? "!" : count;
                badge.style.display = 'flex';
                // Simple pulse effect
                badge.style.transform = 'scale(1.3)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            } else {
                badge.style.display = 'none';
            }
        }
    },

    injectWhisperToRoom: function (note) {
        const chatBox = document.getElementById('room-chat-box');
        if (chatBox) {
            const d = document.createElement('div');
            d.className = 'chat-msg whisper';
            // Styling for whisper (purple/italic) should be in CSS, or we inline it here
            d.style.color = '#d8b4fe';
            d.style.fontStyle = 'italic';
            d.innerHTML = `<span class="whisper-name">W: ${note.senderName}:</span> <span class="whisper-text">${note.text}</span>`;
            chatBox.appendChild(d);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    },

    openModal: function () {
        const modal = document.getElementById('notification-modal');
        const list = document.getElementById('notification-list');
        if (!modal || !list) return;

        modal.style.display = 'flex';
        list.innerHTML = '<div style="padding:20px; text-align:center;">Loading...</div>';

        // --- RENDER SYSTEM MESSAGE PINNED AT TOP ---
        const renderSystemMsg = () => {
            if (this.systemMsg && this.systemMsg.text) {
                // Mark as read immediately when opened
                localStorage.setItem('sys_update_read_time', this.systemMsg.timestamp);

                // Recalculate badge (remove the red dot)
                this.updateBadge();

                const dateStr = new Date(this.systemMsg.timestamp).toLocaleDateString();
                const div = document.createElement('div');
                div.className = 'system-update-msg';
                div.style.background = 'linear-gradient(45deg, #3730a3, #1e1b4b)';
                div.style.border = '1px solid #6366f1';
                div.style.padding = '10px';
                div.style.borderRadius = '5px';
                div.style.marginBottom = '10px';

                div.innerHTML = `
                    <div style="font-weight:900; color:#818cf8; font-size:0.7rem; margin-bottom:5px;">DEV UPDATE</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold; color:#fff;">LATEST NEWS</span>
                        <span style="font-size:0.7rem; color:#aaa;">${dateStr}</span>
                    </div>
                    <div style="color:#ddd; font-size:0.9rem;">${this.systemMsg.text}</div>
                `;
                // Use prepend to ensure it's always top
                list.prepend(div);
            }
        };

        db.ref(`users/${currentUser.uid}/inbox`).once('value').then(snap => {
            list.innerHTML = ''; // Clear loading text
            this.inboxData = snap.val() || {};

            // Render System Msg First
            renderSystemMsg();

            if (!snap.exists() && (!this.systemMsg || !this.systemMsg.text)) {
                list.innerHTML += '<div style="color:#aaa; text-align:center; padding:20px;">No new notifications.</div>';
                return;
            }

            // Render Inbox Items (Reverse Chronological)
            const sortedKeys = Object.keys(this.inboxData).sort((a, b) => {
                return this.inboxData[b].timestamp - this.inboxData[a].timestamp;
            });

            sortedKeys.forEach(key => {
                const n = this.inboxData[key];
                const div = document.createElement('div');
                // Use generic styling
                div.className = 'choice-btn';
                div.style.display = 'block';
                div.style.textAlign = 'left';
                div.style.marginBottom = '10px';
                div.style.background = '#222';
                div.title = "Double-click to read more..."; // Hint

                let icon = '📩';
                if (n.type === 'admin_reply') icon = '🛡';
                else if (n.type === 'dm') icon = '💬';

                div.innerHTML = `
                    <div class="notify-header" style="display:flex; justify-content:space-between; color:var(--gold-main); font-weight:bold;">
                        <span>${icon} From: ${n.senderName || 'System'}</span>
                        <span style="cursor:pointer; color:#ef4444; font-weight:900;" onclick="event.stopPropagation(); NOTIFICATIONS.delete('${key}')">×</span>
                    </div>
                    <div class="notify-body" style="color:#ccc; margin:5px 0;">"${n.text}"</div>
                `;

                // Add Reply Button for DMs
                if (n.type === 'dm') {
                    div.innerHTML += `
                    <div class="notify-actions" style="margin-top:5px; text-align:right;">
                        <button class="req-btn" style="background:#555; color:#fff; border:none; padding:3px 10px; cursor:pointer;" onclick="DM.open('${n.senderUid}', '${n.senderName}')">Reply</button>
                    </div>`;
                }

                // NEW: Double Click Handler
                div.ondblclick = () => { this.openDetail(n); };

                list.appendChild(div);
            });
        });
    },

    openDetail: function (note) {
        const modal = document.getElementById('notification-detail-modal');
        if (!modal) return;

        modal.style.display = 'flex';

        document.getElementById('nd-subject').innerText = note.title || "Message Detail";
        document.getElementById('nd-from').innerText = note.senderName || "Unknown";
        document.getElementById('nd-date').innerText = note.timestamp ? new Date(note.timestamp).toLocaleString() : '';
        document.getElementById('nd-body').innerText = note.text || "";

        const origContainer = document.getElementById('nd-original-container');
        if (note.originalText) {
            origContainer.style.display = 'block';
            document.getElementById('nd-original-text').innerText = note.originalText;
        } else {
            origContainer.style.display = 'none';
        }
    },

    delete: function (key) {
        if (!currentUser) return;
        db.ref(`users/${currentUser.uid}/inbox/${key}`).remove().then(() => {
            this.openModal(); // Refresh list
        });
    },

    clearAll: function () {
        if (confirm("Clear all personal notifications? (System Update will remain)")) {
            db.ref(`users/${currentUser.uid}/inbox`).remove().then(() => {
                this.openModal();
            });
        }
    }
};
