const AUTH = {
    init: function() {
        if(!auth) return;
        auth.onAuthStateChanged(user => {
            currentUser = user;
            if(user) {
                if (typeof NOTIFICATIONS !== 'undefined') {
                    NOTIFICATIONS.init();
                    const bell = document.getElementById('global-notify-btn');
                    if(bell) bell.style.display = 'flex'; 
                }

                const userRef = db.ref(`users/${user.uid}`);
                const amOnline = db.ref('.info/connected');
                
                amOnline.on('value', (snapshot) => {
                    if (snapshot.val() == false) return;
                    userRef.onDisconnect().update({ status: 'offline' }).then(() => {
                        userRef.update({ 
                            status: 'online',
                            name: user.email.split('@')[0], 
                            email: user.email
                        });
                    });
                });

                const profBtn = document.getElementById('start-profile-btn');
                if(profBtn) {
                     profBtn.style.display = 'block'; 
                     userRef.child('avatar').once('value').then(s => {
                         if(s.val()) {
                             const url = `url('${s.val()}')`;
                             profBtn.style.backgroundImage = url;
                             const lobbyBtn = document.getElementById('lobby-profile-btn');
                             if(lobbyBtn) lobbyBtn.style.backgroundImage = url;
                         }
                     });
                }
                
                document.getElementById('auth-screen').style.display = 'none';
                if(window.triggerGameMenu) window.triggerGameMenu();

            } else {
                document.getElementById('auth-screen').style.display = 'flex';
                document.getElementById('logo-screen').style.display = 'none';
                document.getElementById('splash-screen').style.display = 'none';
                const bell = document.getElementById('global-notify-btn');
                if(bell) bell.style.display = 'none';
            }
			STORE.checkOnLogin(); 
        });
    },
    login: function() {
        const e = document.getElementById('auth-email').value;
        const p = document.getElementById('auth-pass').value;
        auth.signInWithEmailAndPassword(e, p).catch(err => document.getElementById('auth-msg').innerText = err.message);
    },
    
    // --- UPDATED REGISTER FUNCTION ---
    register: function() {
        const e = document.getElementById('auth-email').value;
        const p = document.getElementById('auth-pass').value;
        
        auth.createUserWithEmailAndPassword(e, p).then(cred => {
            // 1. Check for Pre-Approved Premium (VIP List)
            const sanitizedEmail = e.replace(/\./g, ','); // Firebase keys can't have dots
            
            db.ref(`preapproved_premium/${sanitizedEmail}`).once('value').then(snap => {
                if (snap.exists()) {
                    // Grant Premium immediately
                    db.ref(`users/${cred.user.uid}/isPremium`).set(true);
                    // Remove from VIP list to clean up
                    db.ref(`preapproved_premium/${sanitizedEmail}`).remove();
                }
            });

            cred.user.sendEmailVerification();
            alert("Account created! Please check your email to verify, then log in.");
            auth.signOut(); 
            location.reload();
        }).catch(err => document.getElementById('auth-msg').innerText = err.message);
    },
    // --------------------------------
    
    recover: function() {
        const e = document.getElementById('auth-email').value;
        if(!e) { alert("Enter email first."); return; }
        auth.sendPasswordResetEmail(e).then(()=>alert("Reset email sent.")).catch(err=>alert(err.message));
    },
    logout: function() { auth.signOut().then(() => location.reload()); }
};

