const PROFILE = {
    open: function() {
        // 1. Check if user is logged in
        if(!currentUser) {
            alert("Please log in to view your profile.");
            document.getElementById('auth-screen').style.display = 'flex';
            return;
        }

        // 2. Open the modal
        document.getElementById('profile-modal').style.display = 'flex';
        
        // 3. Fetch data from Firebase
        db.ref(`users/${currentUser.uid}`).once('value').then(snap => {
            const data = snap.val() || {};
            
            // Set Account ID (Top Label)
            const nameLabel = document.getElementById('prof-username');
            if(nameLabel) nameLabel.innerText = "ID: " + currentUser.uid.substring(0, 8) + "...";

            // Populate Inputs
            const nameInput = document.getElementById('prof-display-name');
            if(nameInput) nameInput.value = data.displayName || data.name || "Hero";
            
            // --- NEW: SET EMAIL FIELD ---
            const emailInput = document.getElementById('prof-email-display');
            if(emailInput) emailInput.value = currentUser.email;
            // ----------------------------
            
            const avatarInput = document.getElementById('prof-avatar-input');
            if(avatarInput) avatarInput.value = data.avatar || "";
            
            const aboutInput = document.getElementById('prof-about');
            if(aboutInput) aboutInput.value = data.about || "";

            // Update Avatar Preview
            const avatarDisplay = document.getElementById('prof-avatar-display');
            if(avatarDisplay) {
                avatarDisplay.style.backgroundImage = data.avatar ? `url('${data.avatar}')` : 'none';
                avatarDisplay.style.backgroundColor = data.avatar ? 'transparent' : '#000';
            }
            
            // Load Friends
            FRIENDS.renderList('profile-friends-list');
        });
    },
    
    // ... rest of PROFILE object (save, changePassword) remains the same ...
    save: function() {
        if(!currentUser) return;
        
        // Get values from inputs
        const avatar = document.getElementById('prof-avatar-input').value.trim();
        const about = document.getElementById('prof-about').value.trim();
        const dName = document.getElementById('prof-display-name').value.trim();
        
        // Prepare update object
        const updates = {
            avatar: avatar,
            about: about,
            displayName: dName 
        };
        
        // Update Database
        db.ref(`users/${currentUser.uid}`).update(updates).then(() => {
            alert("Profile Saved!");
            
            // Update visual elements immediately
            document.getElementById('prof-avatar-display').style.backgroundImage = avatar ? `url('${avatar}')` : 'none';
            
            // Update Floating Buttons
            const floatBtn = document.getElementById('start-profile-btn');
            const lobbyBtn = document.getElementById('lobby-profile-btn');
            if(floatBtn && avatar) floatBtn.style.backgroundImage = `url('${avatar}')`;
            if(lobbyBtn && avatar) lobbyBtn.style.backgroundImage = `url('${avatar}')`;

            // If we are currently in a Multiplayer Game Lobby, update our slot there too
            if(isMultiplayer && gameId && myPlayerId !== null) {
                const nameUpdate = dName || currentUser.email.split('@')[0];
                db.ref(`games/${gameId}/slots/${myPlayerId}`).update({ 
                    name: nameUpdate,
                    color: avatar ? 'transparent' : selColor 
                });
            }
        });
    },

    changePassword: function() {
        const email = currentUser.email;
        if(confirm(`Send password reset email to ${email}?`)) {
            auth.sendPasswordResetEmail(email)
                .then(() => alert(`Reset email sent! Check your inbox.`))
                .catch(e => alert(e.message));
        }
    }
};

// --- FRIENDS SYSTEM ---
let selectedFriendUid = null;

