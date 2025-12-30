// --- GENERIC ERROR UI HELPERS ---
const ERROR_UI = {
    show: function (msg, title = "ERROR", isError = true) {
        const titleEl = document.getElementById('error-title');
        const msgEl = document.getElementById('error-msg');
        const modal = document.getElementById('error-modal');
        const contentEl = modal ? modal.querySelector('.modal-content') : null;

        if (titleEl) {
            titleEl.innerText = title;
            titleEl.style.color = isError ? '#ef4444' : '#10b981'; // Red or Green
        }

        if (msgEl) {
            msgEl.innerText = msg;
            // User requested White for Good Notes, Red for Errors.
            // Existing default CSS: #ddd.
            msgEl.style.color = isError ? '#ef4444' : '#ffffff';
        }

        if (contentEl) {
            contentEl.style.borderColor = isError ? '#ef4444' : '#10b981';
        }

        if (modal) modal.style.display = 'flex';
        else alert(msg); // Fallback if modal missing
    }
};

// --- GENERIC CONFIRM UI HELPERS ---
const CONFIRM_UI = {
    show: function (msg, onYes) {
        document.getElementById('confirm-msg').innerText = msg;
        const modal = document.getElementById('confirm-modal');
        modal.style.display = 'flex';

        const yesBtn = document.getElementById('confirm-yes-btn');
        if (!yesBtn) {
            console.error("CONFIRM_UI: Yes button not found!");
            return;
        }

        // Unbind previous by overwriting
        // Simple assignment is sufficient since we aren't using addEventListener('click') accumulation
        yesBtn.onclick = null;

        yesBtn.onclick = function () {
            console.log("CONFIRM_UI: Yes Clicked");
            modal.style.display = 'none';
            if (onYes) {
                try {
                    onYes();
                } catch (e) {
                    console.error("CONFIRM_UI Callback Error:", e);
                    ERROR_UI.show(e.message, "ACTION FAILED");
                }
            }
        };
    }
};

const BUG_REPORT = {
    open: function () {
        document.getElementById('bug-report-modal').style.display = 'flex';
        document.getElementById('bug-input').value = "";
    },

    submit: function () {
        // Safe check for DB/Auth
        if (typeof firebase === 'undefined' || typeof db === 'undefined' || typeof auth === 'undefined') {
            ERROR_UI.show("Database Connection Failed.\nvariables missing.", "SYSTEM ERROR", true);
            return;
        }

        const msg = document.getElementById('bug-input').value.trim();
        if (!msg) return;

        if (!auth.currentUser) {
            ERROR_UI.show("You must be logged in to report a bug.", "LOGIN REQUIRED", true);
            return;
        }

        const report = {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            status: 'New' // New, WIP, Done
        };

        db.ref('bug_reports').push(report)
            .then(() => {
                // Success: Use Modal instead of Alert
                ERROR_UI.show("Bug Report Sent! THANK YOU for helping improve Questopoly.", "SUCCESS", false);
                document.getElementById('bug-report-modal').style.display = 'none';
            })
            .catch(err => {
                console.error("Bug Report Error:", err);
                // DETAILED ERROR MESSAGE FOR DEBUGGING
                ERROR_UI.show("Failed to send report:\n" + (err.code || "Unknown") + "\n" + err.message, "SEND FAILED", true);
            });
    }
};

const ADMIN_MAILBOX = {
    currentReport: null,
    allReports: [], // Cache for filtering

    open: function () {
        document.getElementById('admin-mailbox-modal').style.display = 'flex';
        this.loadReports();
    },

    loadReports: function () {
        const list = document.getElementById('admin-report-list');
        list.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">Loading...</div>';

        db.ref('bug_reports').orderByChild('timestamp').limitToLast(50).once('value', snapshot => {
            if (!snapshot.exists()) {
                this.allReports = [];
                this.renderList();
                return;
            }

            const reports = [];
            snapshot.forEach(child => {
                reports.push({ key: child.key, ...child.val() });
            });
            // Show newest first
            this.allReports = reports.reverse();
            this.renderList();
        });
    },

    renderList: function () {
        // FILTERING
        const query = document.getElementById('admin-search-input') ? document.getElementById('admin-search-input').value.toLowerCase() : "";
        const list = document.getElementById('admin-report-list');
        list.innerHTML = '';

        const filtered = this.allReports.filter(r => {
            return r.message.toLowerCase().includes(query) ||
                r.email.toLowerCase().includes(query) ||
                r.status.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            list.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No matching reports.</div>';
            return;
        }

        filtered.forEach(r => {
            const item = document.createElement('div');
            item.style.display = 'grid';
            item.style.gridTemplateColumns = '50px 150px 1fr 120px 50px'; // Match Header
            item.style.alignItems = 'center';
            item.style.padding = '10px 20px';
            item.style.borderBottom = '1px solid #333';
            item.style.cursor = 'pointer';
            item.style.fontSize = '0.9rem';
            item.style.color = '#ddd';
            item.style.transition = 'background 0.2s';

            // --- COLOR CODING (Dark Mode Friendly) ---
            if (r.status === 'WIP') {
                item.style.backgroundColor = 'rgba(251, 191, 36, 0.15)'; // Dark Yellow Tint
                item.style.color = '#fbbf24';
            } else if (r.status === 'Done') {
                item.style.backgroundColor = 'rgba(16, 185, 129, 0.15)'; // Dark Green Tint
                item.style.color = '#10b981';
            } else {
                item.style.backgroundColor = 'transparent'; // Normal
            }

            // Hover Effect
            item.onmouseenter = () => {
                item.style.backgroundColor = r.status === 'Done' ? 'rgba(16, 185, 129, 0.25)' :
                    r.status === 'WIP' ? 'rgba(251, 191, 36, 0.25)' : '#222';
            };
            item.onmouseleave = () => {
                item.style.backgroundColor = r.status === 'Done' ? 'rgba(16, 185, 129, 0.15)' :
                    r.status === 'WIP' ? 'rgba(251, 191, 36, 0.15)' : 'transparent';
            };

            // Double Click to Open
            item.ondblclick = () => this.openDetail(r);

            // --- COLUMNS ---
            let icon = '📩';
            if (r.status === 'WIP') icon = '🚧';
            if (r.status === 'Done') icon = '✅';

            const d = new Date(r.timestamp);
            const dateStr = d.toLocaleDateString(); // Compact date

            let preview = r.message.length > 60 ? r.message.substring(0, 60) + '...' : r.message;
            // Escape HTML in preview
            preview = preview.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            const delBtnHTML = `<span style="cursor:pointer; color:#ef4444; font-weight:bold;" title="Delete Forever" onclick="event.stopPropagation(); ADMIN_MAILBOX.deleteReport('${r.key}')">🗑</span>`;

            item.innerHTML = `
                <div>${icon}</div>
                <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-right:10px;">${r.email.split('@')[0]}</div>
                <div style="color:${r.status === 'New' ? '#fff' : 'inherit'}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${preview}</div>
                <div style="font-size:0.8rem; opacity:0.7;">${dateStr}</div>
                <div style="text-align:center;">${delBtnHTML}</div>
            `;
            list.appendChild(item);
        });
    },

    openDetail: function (r) {
        this.currentReport = r;
        document.getElementById('bug-detail-modal').style.display = 'flex';

        document.getElementById('detail-from').innerText = r.email;
        document.getElementById('detail-date').innerText = new Date(r.timestamp).toLocaleString();
        document.getElementById('detail-status').innerText = r.status;
        document.getElementById('detail-msg').innerText = r.message;

        const sEl = document.getElementById('detail-status');
        sEl.style.color = r.status === 'Done' ? '#10b981' : r.status === 'WIP' ? '#fbbf24' : '#fff';

        // --- DATES ---
        const wipDiv = document.getElementById('detail-wip-container');
        const doneDiv = document.getElementById('detail-done-container');

        if (r.wipTimestamp) {
            wipDiv.style.display = 'block';
            document.getElementById('detail-wip-date').innerText = new Date(r.wipTimestamp).toLocaleString();
        } else {
            wipDiv.style.display = 'none';
        }

        if (r.doneTimestamp) {
            doneDiv.style.display = 'block';
            document.getElementById('detail-done-date').innerText = new Date(r.doneTimestamp).toLocaleString();
        } else {
            doneDiv.style.display = 'none';
        }
    },

    copyToClipboard: function () {
        if (!this.currentReport) return;
        const r = this.currentReport;
        const text = `[BUG REPORT]\nFrom: ${r.email}\nDate: ${new Date(r.timestamp).toLocaleString()}\nStatus: ${r.status}\n\n${r.message}`;

        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to Clipboard!");
        }).catch(err => {
            console.error("Copy failed", err);
            alert("Failed to copy automatically. Please select text manually.");
        });
    },

    deleteReport: function (key) {
        // Use ISOLATED Admin Confirm Modal to avoid conflicts
        const modal = document.getElementById('admin-confirm-modal');
        const yesBtn = document.getElementById('admin-confirm-yes-btn');

        if (!modal || !yesBtn) {
            console.error("Critical: Admin Confirm Modal missing!");
            return;
        }

        modal.style.display = 'flex';

        // Direct assignment to isolated button
        yesBtn.onclick = () => {
            modal.style.display = 'none';
            db.ref(`bug_reports/${key}`).remove()
                .then(() => {
                    // Remove from local cache
                    this.allReports = this.allReports.filter(r => r.key !== key);
                    this.renderList();
                })
                .catch(err => ERROR_UI.show(err.message, "DELETE FAILED"));
        };
    },

    updateCurrent: function (status) {
        if (!this.currentReport) return;

        const updates = { status: status };
        const now = firebase.database.ServerValue.TIMESTAMP;

        // Track Timestamps
        if (status === 'WIP') updates.wipTimestamp = now;
        if (status === 'Done') updates.doneTimestamp = now;

        db.ref(`bug_reports/${this.currentReport.key}`).update(updates);

        this.currentReport.status = status;
        // Optimistic Timestamp update for UI (approximate, won't match server exactly until reload but close enough)
        if (status === 'WIP') this.currentReport.wipTimestamp = Date.now();
        if (status === 'Done') this.currentReport.doneTimestamp = Date.now();

        // Update View
        document.getElementById('detail-status').innerText = status;
        document.getElementById('detail-status').style.color = status === 'Done' ? '#10b981' : '#fbbf24';

        // Update Detail Dates
        if (status === 'WIP' || this.currentReport.wipTimestamp) {
            document.getElementById('detail-wip-container').style.display = 'block';
            document.getElementById('detail-wip-date').innerText = new Date(this.currentReport.wipTimestamp || Date.now()).toLocaleString();
        }
        if (status === 'Done' || this.currentReport.doneTimestamp) {
            document.getElementById('detail-done-container').style.display = 'block';
            document.getElementById('detail-done-date').innerText = new Date(this.currentReport.doneTimestamp || Date.now()).toLocaleString();
        }

        // Re-render list to reflect color change
        this.renderList();
    },

    replyCurrent: function () {
        if (!this.currentReport) return;
        document.getElementById('reply-modal').style.display = 'flex';
        document.getElementById('reply-to-text').innerText = "To: " + this.currentReport.email;
        document.getElementById('reply-input').value = "";
        document.getElementById('reply-input').focus();
    },

    sendReply: function () {
        if (!this.currentReport) return;
        const msg = document.getElementById('reply-input').value.trim();
        if (!msg) {
            alert("Please type a message.");
            return;
        }

        // FIND USER ID from Email (This is tricky if we only have email, but assuming the report has uid or we search)
        // Actually, the report object in Firebase usually stores the UID if available.
        // Let's assume we push a GENERAL notification if we can't find direct UID, or we rely on the report.uid if it exists.

        // BETTER: Push to a 'notifications' node that matches the user's filtered list.
        // Assuming your system filters notifications by type or user ID.
        // If the report has a 'uid' field, we use that.

        const sendToInbox = (targetUid) => {
            const ref = db.ref(`users/${targetUid}/inbox`);
            ref.push({
                type: 'admin_reply',
                title: 'Admin Response',
                text: msg,
                originalText: this.currentReport.text || this.currentReport.message || "No text", // NEW: Pass context
                senderName: "Admin",
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                read: false
            }).then(() => {
                ERROR_UI.show("Reply sent successfully!", "SUCCESS", false);
                document.getElementById('reply-modal').style.display = 'none';
                this.updateCurrent('WIP');
            }).catch(err => ERROR_UI.show(err.message, "SEND FAILED"));
        };

        // 1. Try to use UID from report
        if (this.currentReport.uid) {
            sendToInbox(this.currentReport.uid);
        } else {
            // 2. Fallback: Lookup UID by Email
            db.ref('users').orderByChild('email').equalTo(this.currentReport.email)
                .once('value').then(snap => {
                    if (snap.exists()) {
                        const targetUid = Object.keys(snap.val())[0];
                        sendToInbox(targetUid);
                    } else {
                        ERROR_UI.show("User not found by email.", "SEND FAILED");
                    }
                });
        }
    }
};
