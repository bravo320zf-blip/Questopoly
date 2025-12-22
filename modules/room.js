const ROOM = {
    activeInviteSlot: null, 

		enter: function(gameData) {
        document.getElementById('lobby-screen').style.display = 'none';
        document.getElementById('gameroom-screen').style.display = 'flex';
        currentRoomData = gameData;
        
        // Listen to Room Updates
        db.ref(`games/${gameId}`).on('value', snap => {
            currentRoomData = snap.val();
            
            // 1. Game Deleted Check (Host left)
            if(!currentRoomData) { 
                if(myPlayerId !== 0) alert("The Host has closed the lobby.");
                this.leaveUI(); 
                return; 
            } 
            
            // 2. Kicked Check (NEW LOGIC)
            // If I am not the host, check if my slot is still mine
            if (myPlayerId !== 0 && currentRoomData.slots) {
                const mySlot = currentRoomData.slots[myPlayerId];
                
                // If slot is null, or type is 'open', or the UID doesn't match my UID
                if (!mySlot || mySlot.type === 'open' || (mySlot.uid && mySlot.uid !== currentUser.uid)) {
                    // Stop listening immediately so the alert doesn't fire multiple times
                    db.ref(`games/${gameId}`).off(); 
                    
                    alert("You have been kicked from the lobby.");
                    this.leaveUI();
                    return;
                }
            }

            // 3. Game Started Check
            if(currentRoomData.status === 'playing') {
                document.getElementById('gameroom-screen').style.display = 'none';
                db.ref(`games/${gameId}`).off(); 
                startGame(); 
                return;
            }
            
            this.renderSlots();
        });
        
        // Listen to Chat
        const chatBox = document.getElementById('room-chat-box');
        chatBox.innerHTML = '';
        db.ref(`games/${gameId}/chat`).limitToLast(50).on('child_added', snap => {
            const msg = snap.val();
            const d = document.createElement('div'); d.className='chat-msg';
            const col = PLAYER_COLORS[msg.slot] || '#fff';
            d.innerHTML = `<span class="name" style="color:${col}">[${msg.name}]:</span> ${msg.text}`;
            chatBox.appendChild(d);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    },

renderSlots: function() {
        if (!currentRoomData || !currentRoomData.slots) return;

        const isHost = (myPlayerId === 0);
        const startBtn = document.getElementById('btn-room-start');
        
        let humanReadyCount = 0;
        let humanCount = 0;
        let aiCount = 0;
        let openCount = 0;

        // 1. Host Settings
        const settingsArea = document.getElementById('host-settings-area');
        if(isHost) {
            settingsArea.style.display = 'block';
            const passInput = settingsArea.querySelector('input');
            if (document.activeElement !== passInput) passInput.value = currentRoomData.password || "";
        } else {
            settingsArea.style.display = 'none';
        }

        // 2. Render Slots
        for(let i=0; i<4; i++) {
            const slotEl = document.getElementById(`slot-${i}`);
            const data = currentRoomData.slots[i];
            
            slotEl.innerHTML = '';
            slotEl.className = 'player-slot';
            
            // --- HUMAN ---
            if (data.type === 'human') {
                humanCount++;
                let isMe = (i === myPlayerId);
                
                if(data.ready) {
                    slotEl.classList.add('ready');
                    humanReadyCount++;
                }

                let desc = "Selecting Character...";
                if(data.charData) {
                     desc = `<span style="color:${data.color}">Lvl 1 ${data.charData.race.name} ${data.charData.class.name}</span>`;
                }

                let actionBtn = '';
                if(isMe) {
                    if(data.ready) {
                        actionBtn = `<button class="slot-action-btn edit" onclick="ROOM.editCharacter()">Edit Character</button>`;
                    } else {
                        actionBtn = `<button class="slot-action-btn" onclick="ROOM.editCharacter()">Create Character</button>`;
                    }
                } else if (isHost && i !== 0) {
                    actionBtn = `<button style="background:#ef4444; color:#fff; border:none; cursor:pointer; padding:5px 10px; border-radius:4px;" onclick="ROOM.kick(${i})">KICK</button>`;
                }

                slotEl.innerHTML = `
                    <div class="slot-left-group">
                        <div class="slot-avatar" style="background-color:${data.color}; ${data.ready ? 'border-color:var(--accent-green);' : ''}"></div>
                        <div class="slot-info">
                            <div class="slot-name">${data.name}</div>
                            <div class="slot-meta">${desc}</div>
                        </div>
                    </div>
                    <div>${actionBtn}</div>
                `;

            } 
            // --- OPEN ---
            else if (data.type === 'open') {
                openCount++;
                slotEl.classList.add('open');
                if (isHost) {
                    slotEl.innerHTML = `
                        <div style="color:#666; font-style:italic;">Empty Seat</div>
                        <select class="slot-select" onchange="ROOM.handleSlotSelect(${i}, this.value)">
                            <option value="open" selected>Open</option>
                            <option value="ai">Add AI Bot</option>
                            <option value="invite">Invite Friend</option>
                            <option value="closed">Close Slot</option>
                        </select>
                    `;
                } else {
                    slotEl.innerHTML = `<div style="color:#666; width:100%; text-align:center;">Waiting for player...</div>`;
                }
            } 
            // --- AI (WITH COLOR PICKER) ---
            else if (data.type === 'ai') {
                 aiCount++;
                 
                 // --- COLOR PICKER LOGIC ---
                 let colorSelector = "";
                 if(isHost) {
                     let opts = "";
                     PLAYER_COLORS.forEach(c => {
                         // Check if this color is taken by any OTHER slot
                         let taken = false;
                         for(let k=0; k<4; k++) {
                             if(k !== i && currentRoomData.slots[k] && currentRoomData.slots[k].color === c) {
                                 taken = true;
                                 break;
                             }
                         }
                         
                         const label = COLOR_NAMES[c] || c;
                         const disabled = taken ? "disabled" : "";
                         const selected = (c === data.color) ? "selected" : "";
                         const style = `background-color:${c}; color:${c==='#FFFFFF'?'#000':'#fff'};`;
                         
                         opts += `<option value="${c}" style="${style}" ${selected} ${disabled}>${label}${taken ? ' (Taken)' : ''}</option>`;
                     });

                     colorSelector = `
                        <select class="slot-select" style="margin-right:10px; border-color:${data.color}; color:${data.color}; font-weight:bold;" onchange="ROOM.changeAiColor(${i}, this.value)">
                            ${opts}
                        </select>
                     `;
                 }
                 // --------------------------

                 slotEl.innerHTML = `
                    <div class="slot-left-group">
                        <div class="slot-avatar" style="background-color:${data.color}; display:flex; align-items:center; justify-content:center; font-size:2rem;">🤖</div>
                        <div class="slot-info">
                            <div class="slot-name" style="color:${data.color};">${data.name}</div>
                            <div class="slot-meta">Easy Difficulty</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center;">
                        ${colorSelector}
                        ${isHost ? `<button style="background:#ef4444; color:#fff; border:none; cursor:pointer; padding:5px 10px; border-radius:4px;" onclick="ROOM.setSlot(${i}, 'open')">Remove</button>` : ''}
                    </div>
                `;
            } 
            // --- INVITED / CLOSED ---
            else {
                let statusText = (data.type === 'closed') ? "Closed" : `Invited: ${data.name}`;
                slotEl.innerHTML = `<div style="color:#666;">${statusText}</div>`;
                if(isHost) slotEl.innerHTML += `<button style="background:#444; color:#fff; border:none; cursor:pointer; padding:5px;" onclick="ROOM.setSlot(${i}, 'open')">Open</button>`;
            }
        }

        // 3. Start Button Logic
        const allSlotsFilled = (openCount === 0);
        const allHumansReady = (humanReadyCount === humanCount);
        const pendingInvites = Object.values(currentRoomData.slots).some(s => s.type === 'invited');
        const totalActive = humanCount + aiCount;

        if (isHost) {
            if (allSlotsFilled && allHumansReady && !pendingInvites && totalActive > 1) {
                startBtn.disabled = false;
                startBtn.innerText = "START GAME";
                startBtn.style.background = "var(--gold-main)";
                startBtn.style.color = "#000";
            } else {
                startBtn.disabled = true;
                startBtn.style.background = "#333";
                startBtn.style.color = "#888";
                
                if (totalActive < 2) startBtn.innerText = "NEED 2+ PLAYERS";
                else if (openCount > 0) startBtn.innerText = "FILL ALL SLOTS";
                else if (pendingInvites) startBtn.innerText = "WAITING FOR INVITE";
                else if (!allHumansReady) startBtn.innerText = "PLAYERS NOT READY";
            }
        } else {
            startBtn.style.display = 'none';
        }
    },

    handleSlotSelect: function(slotIdx, value) {
        if(value === 'invite') {
            this.activeInviteSlot = slotIdx;
            document.getElementById('invite-modal').style.display = 'flex';
            FRIENDS.renderList('invite-list', true); 
        } else {
            this.setSlot(slotIdx, value);
        }
    },

// INSIDE ROOM CONSTANT
setSlot: function(slotIdx, type) {
    let update = { type: type };
    
    // Clean up old player data if removing/opening
    if (type === 'open' || type === 'closed') {
         db.ref(`games/${gameId}/players/${slotIdx}`).remove();
    }
    
    // AI Logic: Generate Stats/Race/Class NOW and save to DB
    if(type === 'ai') {
        // --- FIX: CHECK USED COLORS ACCURATELY ---
        const usedColors = [];
        // Check currentRoomData to see what humans/other AIs have taken
        if(currentRoomData && currentRoomData.slots) {
            for(let i=0; i<4; i++) {
                // Only count color if the slot is NOT the one we are currently changing
                // and if the slot is actually occupied (human, ai, or ready)
                if(i !== slotIdx && currentRoomData.slots[i] && currentRoomData.slots[i].type !== 'open') {
                    if(currentRoomData.slots[i].color) {
                        usedColors.push(currentRoomData.slots[i].color);
                    }
                }
            }
        }
        
        const availableColors = PLAYER_COLORS.filter(c => !usedColors.includes(c));
        // Fallback to grey if all taken, though unlikely with 6 colors and 4 players
        const aiColor = availableColors.length > 0 ? availableColors[0] : '#888';
        
        const aiName = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];

        // GENERATE FIXED AI DATA
        const r = RACES[Math.floor(Math.random()*RACES.length)];
        const c = CLASSES[Math.floor(Math.random()*CLASSES.length)];
        
        // Save this to the slot so all clients see the same bot
        update = { 
            type: 'ai', 
            name: aiName, 
            color: aiColor, 
            ready: true,
            charData: {
                race: r,
                class: c,
                active: c.actives[0], // Default first skill
                passive: c.passives[0]
            }
        };
        
        // Initialize Player Object in DB
        db.ref(`games/${gameId}/players/${slotIdx}`).set({ 
            id: slotIdx, 
            uid: 'AI_'+slotIdx,
            gold: 1000 // Ensure starting gold is synced
        }); 
    } 

    db.ref(`games/${gameId}/slots/${slotIdx}`).set(update);
},

changeAiColor: function(slotIdx, newColor) {
        if (!isMultiplayer || myPlayerId !== 0) return; // Only Host
        
        // 1. Update Slot Visuals
        db.ref(`games/${gameId}/slots/${slotIdx}`).update({ color: newColor });
        
        // 2. Update Player Logic Object
        // (This ensures the game uses the new color when it starts)
        db.ref(`games/${gameId}/players/${slotIdx}`).update({ color: newColor });
    },

    sendInvite: function(uid, name) {
        const slotIdx = this.activeInviteSlot;
        if(slotIdx !== undefined && slotIdx !== null) {
             db.ref(`games/${gameId}/slots/${slotIdx}`).set({
                 type: 'invited',
                 uid: uid,
                 name: name,
                 ready: false,
                 color: '#444'
             });
             this.sendChat(`Invited ${name} to Slot ${slotIdx + 1}`);
        }
    },

    setPassword: function(pass) {
        if(myPlayerId === 0) {
            db.ref(`games/${gameId}`).update({ password: pass });
        }
    },

    kick: function(slotIdx) {
        this.setSlot(slotIdx, 'open');
    },

    editCharacter: function() {
        document.getElementById('gameroom-screen').style.display = 'none';
        enterCreation(true);
        const btn = document.getElementById('btn-start-game');
        btn.innerText = "Ready";
        btn.onclick = () => this.saveCharacter();
    },

saveCharacter: function() {
        const name = document.getElementById('char-name-input').value || "Hero";
        
        // --- FIX: SAVE 2nd SKILL ---
        const charData = { 
            race: selRace, 
            class: selClass, 
            active: selActiveId, 
            active2: selActiveId2, // <--- ADDED THIS
            passive: selPassiveId 
        };
        // ---------------------------
        
        db.ref(`games/${gameId}/slots/${myPlayerId}`).update({
            name: name,
            color: selColor,
            charData: charData,
            ready: true
        });
        
        const pData = {
            id: myPlayerId, name: name, race: selRace, class: selClass,
            activeSkillId: selActiveId, passiveSkillId: selPassiveId, color: selColor,
            ready: true
        };
        db.ref(`games/${gameId}/players/${myPlayerId}`).update(pData);

        document.getElementById('create-screen').style.display = 'none';
        document.getElementById('gameroom-screen').style.display = 'flex';
    },

    sendChat: function() {
        const input = document.getElementById('room-chat-input');
        const text = input.value.trim();
        if(text) {
            const name = (currentRoomData.slots[myPlayerId]) ? currentRoomData.slots[myPlayerId].name : "Unknown";
            db.ref(`games/${gameId}/chat`).push({
                name: name,
                slot: myPlayerId,
                text: text
            });
            input.value = '';
        }
    },

    startGame: function() {
        db.ref(`games/${gameId}`).update({ status: 'playing' });
    },

    leave: function() {
        if(myPlayerId === 0) {
            if(confirm("You are the host. Leaving will close the game room for everyone. Continue?")) {
                db.ref(`games/${gameId}`).remove();
                this.leaveUI(); 
            }
        } else {
            this.setSlot(myPlayerId, 'open');
            this.leaveUI();
        }
    },

    leaveUI: function() {
        document.getElementById('gameroom-screen').style.display = 'none';
        if(db) db.ref(`games/${gameId}`).off(); 
        currentRoomData = null;
        gameId = null;
        LOBBY.enter();
    },

    copyLink: function() {
        const url = window.location.origin + window.location.pathname + '?join=' + gameId;
        navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
    }
};
   
// --- REGION 1: GLOBALS & INIT ---
