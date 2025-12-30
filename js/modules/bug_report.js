// BUG_REPORT object moved to 'admin.js'.
// This file now only retains shared helpers if needed.

// Helper to get current user's display name
function getMyDisplayName(callback) {
    if (!currentUser) return callback("Unknown");
    db.ref(`users/${currentUser.uid}/displayName`).once('value').then(snap => {
        const val = snap.val();
        callback(val ? val : currentUser.email.split('@')[0]);
    });
}

// --- LOBBY SYSTEM ---
