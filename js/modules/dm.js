const DM = {
    activeChatUid: null,
    listener: null,

    open: function(uid, name) {
        this.activeChatUid = uid;
        const win = document.getElementById('dm-window');
        document.getElementById('dm-title').innerText = "Chat: " + name;
        document.getElementById('dm-body').innerHTML = '';
        win.style.display = 'flex';
        
        // Generate Chat ID (Alphabetical sort to ensure same ID for both users)
        const chatId = [currentUser.uid, uid].sort().join('_');
        
        if(this.listener) db.ref(this.listener).off();
        
        // Listen for messages
        this.listener = `dms/${chatId}`;
        db.ref(this.listener).limitToLast(50).on('child_added', snap => {
            const msg = snap.val();
            const d = document.createElement('div');
            d.className = 'dm-msg ' + (msg.sender === currentUser.uid ? 'me' : 'them');
            d.innerText = msg.text;
            
            const body = document.getElementById('dm-body');
            body.appendChild(d);
            body.scrollTop = body.scrollHeight;
        });
    },
    
send: function() {
        const input = document.getElementById('dm-input');
        const text = input.value.trim();
        if(!text || !this.activeChatUid) return;
        
        const targetUid = this.activeChatUid;
        
        // CHECK IF BLOCKED
        db.ref(`users/${targetUid}/relationships/${currentUser.uid}/blockDM`).once('value').then(snap => {
            if(snap.val() === true) {
                // Blocked - Show error only to me
                const d = document.createElement('div');
                d.className = 'dm-msg';
                d.style.background = '#ef4444'; 
                d.innerText = "Message not delivered (Blocked).";
                document.getElementById('dm-body').appendChild(d);
                input.value = '';
            } else {
                // 1. Save to Chat History (Standard)
                const chatId = [currentUser.uid, targetUid].sort().join('_');
                db.ref(`dms/${chatId}`).push({
                    sender: currentUser.uid,
                    text: text,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });

                // 2. NEW: Push to Recipient's Inbox (For Notifications)
                // We use getMyDisplayName to ensure the name is accurate
                getMyDisplayName((myName) => {
                    db.ref(`users/${targetUid}/inbox`).push({
                        type: 'dm',
                        senderUid: currentUser.uid,
                        senderName: myName,
                        text: text,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                });

                input.value = '';
            }
        });
    },
    
    close: function() {
        document.getElementById('dm-window').style.display = 'none';
        if(this.listener) db.ref(this.listener).off();
        this.activeChatUid = null;
    }
};


