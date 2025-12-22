const LOBBY = {
enter: function() {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('lobby-screen').style.display = 'flex';
        
        // --- UPDATE: HIDE HUD ---
        document.getElementById('top-right-hud').style.display = 'none';
        // ------------------------

        this.refreshList();
        this.initGlobalChat();
    },
exit: function() {
        document.getElementById('lobby-screen').style.display = 'none';
        document.getElementById('splash-screen').style.display = 'flex';
        
        // --- UPDATE: SHOW HUD ---
        document.getElementById('top-right-hud').style.display = 'flex';
        // ------------------------

        if(this.chatListener) db.ref('chat/global').off();
    },
    initGlobalChat: function() {
        const chatBox = document.getElementById('global-chat-box');
        if (this.chatListener) db.ref('chat/global').off(); 
        
        chatBox.innerHTML = '';
        this.chatListener = db.ref('chat/global').limitToLast(50).on('child_added', snap => {
            const msg = snap.val();
            const d = document.createElement('div'); d.className='chat-msg';
            d.innerHTML = `<span class="name">[${msg.name}]:</span> ${msg.text}`;
            chatBox.appendChild(d);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    },
    sendChat: function() {
        const input = document.getElementById('global-chat-input');
        const text = input.value.trim();
        if(text && currentUser) {
            db.ref('chat/global').push({
                name: currentUser.email.split('@')[0],
                text: text,
                time: firebase.database.ServerValue.TIMESTAMP
            });
            input.value = '';
        }
    },
// Inside LOBBY object
refreshList: function() {
        if(!db) return;
        const list = document.getElementById('lobby-list');
        const searchVal = document.getElementById('lobby-search').value.toLowerCase();
        // Check state of the new checkbox
        const showInProgress = document.getElementById('chk-show-progress').checked;
        
        list.innerHTML = '<div style="padding:20px; text-align:center;">Loading...</div>';
        
        db.ref('games').once('value').then(snap => {
            list.innerHTML = '';
            const games = snap.val();
            
            if(!games) { 
                list.innerHTML = '<div style="padding:20px; text-align:center;">No games found.</div>'; 
                return; 
            }
            
            const now = Date.now();
            const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

            Object.keys(games).forEach(k => {
                const g = games[k];
                
                // Cleanup Logic
                if (!g.createdAt || (now - g.createdAt > EIGHT_HOURS_MS)) {
                    db.ref(`games/${k}`).remove();
                    return; 
                }

                // Filter Search
                if(searchVal && !g.hostName.toLowerCase().includes(searchVal)) return;

                // --- NEW VISIBILITY LOGIC ---
                // Show if Waiting OR (ShowInProgress is true AND status is playing)
                if(g.status === 'waiting' || (showInProgress && g.status === 'playing')) {

                    const playerCount = g.players ? Object.keys(g.players).length : 1;
                    const locked = g.password ? '🔒 ' : '';
                    const isMine = (g.host === currentUser.uid);
                    const isPlaying = (g.status === 'playing');

                    const div = document.createElement('div');
                    
                    // Add 'in-progress' class if playing
                    div.className = 'lobby-item' + (isPlaying ? ' in-progress' : '');
                    
                    let deleteBtn = '';
                    if (isAdminMode || isMine) {
                        deleteBtn = `<button style="background:transparent; border:none; color:#ef4444; font-weight:bold; cursor:pointer; margin-left:10px; font-size:1.2rem;" onclick="event.stopPropagation(); LOBBY.deleteGame('${k}', ${isMine})" title="Delete Game">×</button>`;
                    }

                    // Dynamic Text
                    let statusText = isPlaying ? `<span style="color:#aaa; font-style:italic; font-size:0.8rem; margin-left:10px;">GAME IN PROGRESS</span>` : `<span>${playerCount}/4</span>`;

                    div.innerHTML = `
                        <div style="flex-grow:1; display:flex; justify-content:space-between; align-items:center;">
                            <span>${locked}${g.hostName}'s Game</span>
                            ${statusText}
                        </div>
                        ${deleteBtn}
                    `;
                    
                    // Only allow clicking join if NOT playing
                    if (!isPlaying) {
                        div.onclick = () => LOBBY.attemptJoin(k, g.password);
                    }

                    list.appendChild(div);
                }
            });
            
            if (list.innerHTML === '') {
                list.innerHTML = '<div style="padding:20px; text-align:center;">No games match filter.</div>';
            }
        });
    },
    
    deleteGame: function(gid, isMine) {
        const msg = isMine ? "Delete your game room?" : "Delete this game room? (Admin Action)";
        if(confirm(msg)) {
            db.ref(`games/${gid}`).remove().then(() => this.refreshList());
        }
    },

    attemptJoin: function(gid, hasPass) {
        pendingJoinId = gid;
        if(hasPass) {
            document.getElementById('password-modal').style.display = 'flex';
        } else {
            this.joinGame(gid);
        }
    },
    submitPassword: function() {
        const pass = document.getElementById('join-pass').value;
        db.ref(`games/${pendingJoinId}/password`).once('value').then(snap => {
            if(snap.val() === pass) {
                document.getElementById('password-modal').style.display = 'none';
                this.joinGame(pendingJoinId);
            } else {
                alert("Incorrect Password");
            }
        });
    },
    
    // --- UPDATED JOIN LOGIC ---
joinGame: function(gid) {
        if(!db) return;
        
        // 1. Get Current User directly from Auth to be safe
        const user = firebase.auth().currentUser;
        if(!user) { 
            alert("You must be logged in to join."); 
            return; 
        }

        gameId = gid;
        isMultiplayer = true;
        const myUid = user.uid;
        // Fallback name if display name isn't fetched yet
        const myName = user.email ? user.email.split('@')[0] : "Player"; 

        const gameRef = db.ref(`games/${gid}`);

        // 2. Fetch Game Data Once
        gameRef.once('value').then(snap => {
            const g = snap.val();
            
            if(!g) { alert("Game not found."); return; }
            if(g.status !== 'waiting') { alert("Game has already started."); return; }

            // 3. Logic: Find Slot
            let targetSlot = -1;
            
            // A. Check if I am ALREADY in this game (Re-joining)
            for(let i=0; i<4; i++) {
                // Check safely if slot exists and matches UID
                if(g.slots && g.slots[i] && g.slots[i].uid === myUid) {
                    myPlayerId = i;
                    ROOM.enter(g);
                    return; // Enter immediately
                }
            }
            
            // B. Check for Specific Invite (Invited slots reserve spot for UID)
            for(let i=0; i<4; i++) {
                if(g.slots && g.slots[i] && g.slots[i].type === 'invited' && g.slots[i].uid === myUid) {
                    targetSlot = i; 
                    break;
                }
            }
            
            // C. If no invite found, find first OPEN slot
            if(targetSlot === -1) {
                for(let i=0; i<4; i++) {
                    // Slot is open if:
                    // 1. It doesn't exist in DB yet (!g.slots or !g.slots[i])
                    // 2. OR it exists and type is explicitly 'open'
                    if(!g.slots || !g.slots[i] || g.slots[i].type === 'open') {
                        targetSlot = i; 
                        break;
                    }
                }
            }

            // 4. Update Database if slot found
            if(targetSlot !== -1) {
                myPlayerId = targetSlot;

                const updates = {};
                
                // Update Slot Visuals
                updates[`slots/${targetSlot}`] = {
                    type: 'human',
                    uid: myUid,
                    name: myName, // Will update to display name below
                    ready: false,
                    color: PLAYER_COLORS[targetSlot]
                };
                
                // Update Game Logic Player Data (Legacy support)
                updates[`players/${targetSlot}`] = {
                    id: targetSlot,
                    uid: myUid
                };

                // Perform Update
                gameRef.update(updates).then(() => {
                    // Success!
                    
                    // Attempt to fetch real Display Name and update record
                    getMyDisplayName((dName) => {
                        if(dName && dName !== "Unknown") {
                            db.ref(`games/${gid}/slots/${targetSlot}/name`).set(dName);
                        }
                    });

                    // Enter Room (Fetch fresh data to ensure UI sync)
                    gameRef.once('value').then(newSnap => {
                        ROOM.enter(newSnap.val());
                    });

                }).catch(err => {
                    console.error(err);
                    alert("Failed to join game: " + err.message);
                });

            } else {
                alert("Game is full.");
            }
        });
    }
};

// --- HELPER FOR CREATE MODAL ---
function showCreateModal() {
    const pass = prompt("Enter a password (leave blank for public):");
    createGameLogic(pass);
}

function createGameLogic() {
    if(!db) return;
    
    getMyDisplayName((myName) => {
        const ref = db.ref('games').push();
        gameId = ref.key;
        myPlayerId = 0; // Host
        isMultiplayer = true;

        const slots = {
            0: { type: 'human', uid: currentUser.uid, name: myName, ready: false, color: PLAYER_COLORS[0] },
            1: { type: 'open' },
            2: { type: 'open' },
            3: { type: 'open' }
        };

        ref.set({
            host: currentUser.uid,
            hostName: myName,
            createdAt: firebase.database.ServerValue.TIMESTAMP, // <--- NEW: Timestamp
            password: "",
            status: 'waiting',
            turnIndex: 0,
            slots: slots,
            players: { 0: { id:0, uid: currentUser.uid } }
        }).then(() => {
            ref.once('value').then(snap => ROOM.enter(snap.val()));
        });
    });
}


// --- ROOM SYSTEM (StarCraft Lobby) ---
