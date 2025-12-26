const BUG_REPORT = {
    open: function() {
        document.getElementById('bug-report-modal').style.display = 'flex';
        document.getElementById('bug-description').value = ""; // Clear previous text
    },

    send: function() {
        const desc = document.getElementById('bug-description').value;
        if (!desc.trim()) {
            alert("Please describe the bug first.");
            return;
        }

        // Gather Debug Info
        const uid = currentUser ? currentUser.uid : "Not Logged In";
        const email = currentUser ? currentUser.email : "N/A";
        const time = new Date().toLocaleString();
        
        // Construct Email Body
        const subject = encodeURIComponent("Bug Report: Questopoly Legends");
        const bodyContent = `BUG DESCRIPTION:\n${desc}\n\n----------------\nTECHNICAL INFO:\nUser: ${email}\nUID: ${uid}\nTime: ${time}\nPlatform: ${navigator.userAgent}`;
        const body = encodeURIComponent(bodyContent);

        // Open Email Client
        window.location.href = `mailto:beginmegaquest@gmail.com?subject=${subject}&body=${body}`;
        
        // Close Modal
        document.getElementById('bug-report-modal').style.display = 'none';
    }
};

// Helper to get current user's display name
function getMyDisplayName(callback) {
    if(!currentUser) return callback("Unknown");
    db.ref(`users/${currentUser.uid}/displayName`).once('value').then(snap => {
        const val = snap.val();
        callback(val ? val : currentUser.email.split('@')[0]);
    });
}

// --- LOBBY SYSTEM ---
