const FRIENDS = {
    showAddModal: function() {
        document.getElementById('add-friend-modal').style.display = 'flex';
    },

    addFriend: function() {
        const email = document.getElementById('friend-email-input').value.trim();
        if(!email) return;
        
        db.ref('users').orderByChild('email').equalTo(email).once('value').then(snap => {
            if(snap.exists()) {
                const targetUid = Object.keys(snap.val())[0];
                if(targetUid === currentUser.uid) { alert("You cannot add yourself."); return; }
                
                db.ref(`users/${currentUser.uid}/friends/${targetUid}`).once('value').then(fSnap => {
                    if(fSnap.exists()) {
                        alert("Already friends!");
                    } else {
                        const myName = currentUser.email.split('@')[0];
                        db.ref(`users/${targetUid}/friend_requests/${currentUser.uid}`).set({
                            name: myName,
                            email: currentUser.email
                        });
                        alert("Friend Request Sent!");
                        document.getElementById('add-friend-modal').style.display = 'none';
                    }
                });
            } else {
                alert("User not found.");
            }
        });
    },

    renderList: function(containerId, isInviteMode = false) {
        const list = document.getElementById(containerId);
        list.innerHTML = 'Loading...';
        
        if(!isInviteMode) this.renderRequests();

        db.ref(`users/${currentUser.uid}/friends`).once('value').then(snap => {
            const friends = snap.val();
            list.innerHTML = '';
            
            if(!friends) { list.innerHTML = '<div style="padding:10px; color:#666;">No friends yet.</div>'; return; }
            
            Object.keys(friends).forEach(uid => {
                db.ref(`users/${uid}`).once('value').then(uSnap => {
                    const uData = uSnap.val();
                    if(!uData) return;
                    
                    // --- PRIVACY CHECK (Online Status) ---
                    // Check if *THEY* have hidden their status from *ME*
                    // Path: users/{THEIR_ID}/relationships/{MY_ID}/hideStatus
                    db.ref(`users/${uid}/relationships/${currentUser.uid}/hideStatus`).once('value').then(permSnap => {
                        const isHidden = permSnap.val() === true;
                        
                        // If hidden, force offline. If not hidden, use real status.
                        const isOnline = !isHidden && (uData.status === 'online');
                        
                        const div = document.createElement('div');
                        div.className = 'friend-item';
                        
                        let avatarStyle = uData.avatar ? `background-image:url('${uData.avatar}')` : `background-color:#444`;
                        const dName = uData.displayName || uData.name || "Unknown";
                        
                        div.innerHTML = `
                            <div class="friend-info">
                                <div class="friend-avatar" style="${avatarStyle}"></div>
                                <div>
                                    <div style="font-weight:bold; color:var(--gold-main)">${dName}</div>
                                    <div style="font-size:0.7rem; color:#aaa;">${isOnline ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>
                            <div class="online-dot ${isOnline ? 'online' : ''}"></div>
                        `;
                        
                        if(isInviteMode) {
                            div.onclick = () => {
                                // Check if they blocked invites
                                db.ref(`users/${uid}/relationships/${currentUser.uid}/blockInvite`).once('value').then(bSnap => {
                                    if(bSnap.val() === true) {
                                        alert("This user is not accepting invites from you.");
                                    } else {
                                        ROOM.sendInvite(uid, dName);
                                        document.getElementById('invite-modal').style.display='none';
                                    }
                                });
                            };
                        } else {
                            // CONTEXT MENU LOGIC
                            const handleMenu = (e) => {
                                e.preventDefault(); 
                                this.openMenu(e, uid, dName);
                            };
                            
                            div.oncontextmenu = handleMenu;
                            
                            // Mobile Long Press
                            let pressTimer;
                            div.ontouchstart = (e) => {
                                pressTimer = setTimeout(() => handleMenu(e.touches[0]), 600);
                            };
                            div.ontouchend = () => clearTimeout(pressTimer);
                            div.ontouchmove = () => clearTimeout(pressTimer);

                            // Left click -> Message
                            div.onclick = () => DM.open(uid, dName);
                        }
                        
                        list.appendChild(div);
                    });
                });
            });
        });
    },

    renderRequests: function() {
        const container = document.getElementById('pending-requests-container');
        const list = document.getElementById('pending-requests-list');
        
        db.ref(`users/${currentUser.uid}/friend_requests`).once('value').then(snap => {
            if(!snap.exists()) {
                container.style.display = 'none';
                return;
            }
            container.style.display = 'block';
            list.innerHTML = '';
            
            const reqs = snap.val();
            Object.keys(reqs).forEach(uid => {
                const req = reqs[uid];
                const div = document.createElement('div');
                div.className = 'request-item';
                div.innerHTML = `
                    <span>${req.name}</span>
                    <div class="req-actions">
                        <button class="req-btn" style="background:#10b981; color:#fff;" onclick="FRIENDS.acceptRequest('${uid}')">✔</button>
                        <button class="req-btn" style="background:#ef4444; color:#fff;" onclick="FRIENDS.denyRequest('${uid}')">✖</button>
                    </div>
                `;
                list.appendChild(div);
            });
        });
    },

    acceptRequest: function(uid) {
        db.ref(`users/${currentUser.uid}/friends/${uid}`).set(true);
        db.ref(`users/${uid}/friends/${currentUser.uid}`).set(true);
        this.denyRequest(uid); 
    },

    denyRequest: function(uid) {
        db.ref(`users/${currentUser.uid}/friend_requests/${uid}`).remove().then(() => {
            this.renderList('profile-friends-list'); 
            this.checkNotifications();
        });
    },

    checkNotifications: function() {
        if(!currentUser) return;
        db.ref(`users/${currentUser.uid}/friend_requests`).on('value', snap => {
            const count = snap.numChildren();
            const profBtns = [document.getElementById('start-profile-btn'), document.getElementById('lobby-profile-btn')];
            profBtns.forEach(btn => {
                if(!btn) return;
                let b = btn.querySelector('.notify-badge');
                if(count > 0) {
                    if(!b) {
                        b = document.createElement('div');
                        b.className = 'notify-badge';
                        btn.appendChild(b);
                    }
                    b.innerText = count;
                    b.style.display = 'flex';
                } else {
                    if(b) b.style.display = 'none';
                }
            });
        });
    },

    openMenu: function(e, uid, name) {
        selectedFriendUid = uid;
        document.getElementById('fs-target-name').innerText = name; 
        
        const menu = document.getElementById('friend-context-menu');
        let x = e.clientX;
        let y = e.clientY;
        if(x + 150 > window.innerWidth) x = window.innerWidth - 160;
        
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.display = 'flex';
        setTimeout(() => document.addEventListener('click', () => menu.style.display='none', {once:true}), 100);
    },
    
    // --- ACTIONS ---
    actionMessage: function() {
        const name = document.getElementById('fs-target-name').innerText;
        DM.open(selectedFriendUid, name);
    },
    
    actionSettings: function() {
        const modal = document.getElementById('friend-settings-modal');
        modal.style.display = 'flex';
        
        // Load current settings from DB
        // Path: users/{MY_ID}/relationships/{FRIEND_ID}
        // This stores "My rules regarding this friend"
        db.ref(`users/${currentUser.uid}/relationships/${selectedFriendUid}`).once('value').then(snap => {
            const data = snap.val() || {};
            document.getElementById('fs-block-dm').checked = data.blockDM || false;
            document.getElementById('fs-hide-status').checked = data.hideStatus || false;
            document.getElementById('fs-block-invite').checked = data.blockInvite || false;
        });
    },
    
    saveSettings: function() {
        const data = {
            blockDM: document.getElementById('fs-block-dm').checked,
            hideStatus: document.getElementById('fs-hide-status').checked,
            blockInvite: document.getElementById('fs-block-invite').checked
        };
        
        // Save to DB
        db.ref(`users/${currentUser.uid}/relationships/${selectedFriendUid}`).update(data).then(() => {
            alert("Settings Updated");
            document.getElementById('friend-settings-modal').style.display = 'none';
        });
    },

    actionRemove: function() {
        if(selectedFriendUid) this.removeFriend(selectedFriendUid);
    },
    
    removeFriend: function(uid) {
        if(confirm("Remove this friend?")) {
            db.ref(`users/${currentUser.uid}/friends/${uid}`).remove();
            db.ref(`users/${uid}/friends/${currentUser.uid}`).remove();
            
            // Optional: Also remove settings logic if you want reset
            db.ref(`users/${currentUser.uid}/relationships/${uid}`).remove();
            db.ref(`users/${uid}/relationships/${currentUser.uid}`).remove();

            setTimeout(() => this.renderList('profile-friends-list'), 500);
        }
    }
};

// --- DIRECT MESSAGING SYSTEM ---
