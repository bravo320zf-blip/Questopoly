const STORE = {
    buttonRendered: false,

open: function() {
        if (!currentUser) {
            alert("Please log in to access the store.");
            return;
        }
        
        document.getElementById('store-modal').style.display = 'flex';
        
        // --- TESTY CHECK ---
        const devBtn = document.getElementById('btn-debug-sim-purchase');
        if (isStoreTestMode) {
            if(devBtn) devBtn.style.display = 'flex';
        } else {
            if(devBtn) devBtn.style.display = 'none';
        }
        // ------------------------
        
        db.ref(`users/${currentUser.uid}/isPremium`).once('value').then(snap => {
            if (snap.val() === true) {
                this.applyPremiumVisuals();
            } else {
                this.renderPayPalButton();
            }
        });
    },

    // NEW: Centralized Success Logic
    processSuccessfulPurchase: function() {
        const uid = firebase.auth().currentUser.uid;
        console.log("Processing Purchase for: " + uid);
        
        db.ref('users/' + uid).update({ 
            isPremium: true 
        }).then(() => {
            alert("Payment Successful! Ads removed. The game will now restart.");
            window.location.reload(); 
        }).catch(err => {
            console.error("Database update failed", err);
            alert("Database update failed: " + err.message);
        });
    },

renderPayPalButton: function() {
        if (this.buttonRendered) return;
        const container = document.getElementById('paypal-button-container');
        if (!container) return;

        // NEW: Clear the container first to prevent duplicate buttons if the flag glitches
        container.innerHTML = ""; 

        try {
            paypal.Buttons({
                // ... rest of your paypal code
            }).render('#paypal-button-container');
            
            this.buttonRendered = true;
        } catch (e) {
            console.error("PayPal SDK Error", e);
        }
    },

    restorePurchase: function(event) {
        if (!currentUser) return;
        const btn = event ? event.target : null;
        const originalText = btn ? btn.innerText : '';
        if(btn) btn.innerText = "Checking...";
        
        db.ref(`users/${currentUser.uid}/isPremium`).once('value').then(snap => {
            if (snap.val() === true) {
                alert("Premium Verified! Ads removed.");
                this.applyPremiumFeatures(); 
                this.applyPremiumVisuals();
            } else {
                alert("No premium purchase found.");
            }
            if(btn) btn.innerText = originalText;
        });
    },

    applyPremiumFeatures: function() {
        document.body.classList.add('premium-user');
        setTimeout(() => { onWindowResize(); }, 100);
    },

    applyPremiumVisuals: function() {
        const container = document.getElementById('remove-ads-container');
        if(container) container.classList.add('disabled');
        
        const btn = document.getElementById('btn-buy-ads');
        if(btn) btn.innerText = "OWNED";

        // Hide buttons if owned
        const ppContainer = document.getElementById('paypal-button-container');
        if(ppContainer) ppContainer.style.display = 'none';
        
        const devBtn = document.getElementById('btn-debug-sim-purchase');
        if(devBtn) devBtn.style.display = 'none';
    },
    
    checkOnLogin: function() {
        if (!currentUser) return;
        db.ref(`users/${currentUser.uid}/isPremium`).once('value').then(snap => {
            if (snap.val() === true) {
                this.applyPremiumFeatures();
            } else {
                document.body.classList.remove('premium-user');
                onWindowResize();
            }
        });
    }
};

// --- PROFILE SYSTEM ---
