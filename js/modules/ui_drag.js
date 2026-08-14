// UI Drag and Drop Mechanics with 5-Second Padlock Feature

document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-ui');
    
    // Create CSS for padlocks dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .drag-padlock {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 0 5px #000;
        }
        .draggable-ui {
            position: fixed; /* Enforce fixed positioning for drag */
        }
    `;
    document.head.appendChild(style);

    draggables.forEach(el => {
        let hoverTimer = null;
        let padlock = null;
        let isLocked = true;
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Hover logic for padlock
        el.addEventListener('mouseenter', () => {
            if (!padlock) {
                // Timer to create padlock after 5 seconds
                hoverTimer = setTimeout(() => {
                    createPadlock(el);
                }, 5000);
            } else {
                padlock.style.opacity = '1';
            }
        });

        el.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            if (padlock) {
                padlock.style.opacity = '0';
            }
        });

        function createPadlock(parent) {
            padlock = document.createElement('div');
            padlock.className = 'drag-padlock';
            padlock.innerText = isLocked ? '🔒' : '🔓';
            padlock.style.opacity = '1';
            
            // Toggle lock state
            padlock.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // prevent drag trigger
            });
            padlock.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // prevent drag trigger
            }, { passive: false });
            
            padlock.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent drag trigger
                isLocked = !isLocked;
                padlock.innerText = isLocked ? '🔒' : '🔓';
                if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_click');
            });
            
            parent.appendChild(padlock);
        }

        // --- Drag Mechanics ---

        function dragStart(e) {
            if (isLocked) return;
            
            // Ignore if clicking on an interactive element inside the container
            if (e.target.closest('button, input, textarea, a, .clickable, .util-btn, .skill-slot, .close-x, .choice-btn, select, [onclick]')) {
                return; 
            }

            // Differentiate between touch and mouse
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            // Only start dragging if click was directly on this element or a non-interactive child
            isDragging = true;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            
            // Apply inline percentages
            if (el.style.transform) {
                const rect = el.getBoundingClientRect();
                
                // Clear any anchored CSS like top/bottom/left/right defaults 
                el.style.top = (rect.top / window.innerHeight) * 100 + '%';
                el.style.left = (rect.left / window.innerWidth) * 100 + '%';
                el.style.bottom = 'auto';
                el.style.right = 'auto';
                el.style.transform = 'none';
                
                // Reset offsets since we hardcoded top/left now
                xOffset = 0;
                yOffset = 0;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
            
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, el);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // Attach events
        el.addEventListener("touchstart", dragStart, { passive: false });
        el.addEventListener("touchend", dragEnd, { passive: false });
        el.addEventListener("touchmove", drag, { passive: false });

        el.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);
    });
});
