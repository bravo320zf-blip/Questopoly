class DiceRoller {
    constructor() {
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.activeDice = [];
        this.overlayContainer = null;
        this.isInitialized = false;

        // Shadow Material
        this.shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        });

        // Materials (Lazy loaded)
        this.materials = {};
    }

    init() {
        if (this.isInitialized) return true;

        try {
            // Setup THREE.js for Dice
            this.scene = new THREE.Scene();
            // Transparent background but we can't set it on scene directly easily without renderer alpha

            // Create Overlay Container
            this.overlayContainer = document.createElement('div');
            this.overlayContainer.id = 'dice-overlay';
            this.overlayContainer.style.position = 'absolute';
            this.overlayContainer.style.top = '0';
            this.overlayContainer.style.left = '0';
            this.overlayContainer.style.width = '100%';
            this.overlayContainer.style.height = '100%';
            this.overlayContainer.style.pointerEvents = 'none'; // Click through
            this.overlayContainer.style.zIndex = '30000';
            document.body.appendChild(this.overlayContainer);

            let width = window.innerWidth;
            let height = window.innerHeight;

            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            this.camera.position.set(0, 20, 25);
            this.camera.lookAt(0, 0, 0);

            // ATTEMPT RENDERER CREATION
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0); // Transparent
            this.overlayContainer.appendChild(this.renderer.domElement);

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
            dirLight.position.set(5, 20, 10);
            this.scene.add(dirLight);

            // Generate Textures
            this.createMaterials();

            // Animation Loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);

            // Resize Listener
            window.addEventListener('resize', () => {
                if (!this.camera || !this.renderer) return;
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            });

            this.isInitialized = true;
            return true;
        } catch (e) {
            console.error("DiceRoller: WebGL Init Failed (likely context limit). Using fallback.", e);
            this.isInitialized = false;
            this.renderer = null;
            // Clean up DOM if needed
            if (this.overlayContainer) this.overlayContainer.remove();
            return false;
        }
    }

    createMaterials() {
        // We need 3 dice types: STR (Red/Sword), DEX (Green/Bow), INT (Blue/Fire)
        // PLUS: Movement (White/Pips)
        // D6: 3 Success Faces, 3 Fail Faces.
        // Let's assume Faces 1, 2, 3 are Success. 4, 5, 6 are Blank.

        // Using CanvasTexture for procedural icons

        this.materials['str'] = this.createDiceMaterial('#991b1b', '⚔️', false);
        this.materials['dex'] = this.createDiceMaterial('#065f46', '🏹', false);
        this.materials['int'] = this.createDiceMaterial('#1e3a8a', '🔥', false);
        this.materials['blank'] = this.createDiceMaterial('#333333', '', false);

        // Movement Dice (White, Pips 1-6)
        this.materials['move'] = this.createMovementDiceMaterials();
    }

    createMovementDiceMaterials() {
        const mats = [];
        for (let i = 1; i <= 6; i++) {
            mats.push(new THREE.MeshStandardMaterial({
                map: this.createFaceTexture('#ffffff', null, i, true), // White, Pips
                transparent: true // For rounded corners alpha
            }));
        }
        return mats;
    }

    createDiceMaterial(color, text, isPip) {
        // Returns an array of 6 materials for a Cube
        const mats = [];

        // Face 1-3 (Success)
        mats.push(new THREE.MeshStandardMaterial({ map: this.createFaceTexture(color, text, 0, false), transparent: true }));
        mats.push(new THREE.MeshStandardMaterial({ map: this.createFaceTexture(color, text, 0, false), transparent: true }));
        mats.push(new THREE.MeshStandardMaterial({ map: this.createFaceTexture(color, text, 0, false), transparent: true }));

        // Face 4-6 (Fail/Blank)
        const blankTex = this.createFaceTexture('#1f2937', '', 0, false); // Dark Grey
        mats.push(new THREE.MeshStandardMaterial({ map: blankTex, transparent: true }));
        mats.push(new THREE.MeshStandardMaterial({ map: blankTex, transparent: true }));
        mats.push(new THREE.MeshStandardMaterial({ map: blankTex, transparent: true }));

        return mats;
    }

    createFaceTexture(bgColor, text, pipCount, isWhiteDice) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // CLEAR (Transparent corners)
        ctx.clearRect(0, 0, 128, 128);

        // ROUNDED RECT
        const rad = 20; // Corner radius
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.moveTo(rad, 0);
        ctx.lineTo(128 - rad, 0);
        ctx.quadraticCurveTo(128, 0, 128, rad);
        ctx.lineTo(128, 128 - rad);
        ctx.quadraticCurveTo(128, 128, 128 - rad, 128);
        ctx.lineTo(rad, 128);
        ctx.quadraticCurveTo(0, 128, 0, 128 - rad);
        ctx.lineTo(0, rad);
        ctx.quadraticCurveTo(0, 0, rad, 0);
        ctx.closePath();
        ctx.fill();

        // Border (Inside)
        ctx.strokeStyle = isWhiteDice ? '#000000' : '#fbbf24'; // Black or Gold
        ctx.lineWidth = 4;
        ctx.stroke();

        // PIPS (Movement)
        if (pipCount > 0) {
            ctx.fillStyle = '#000000';
            const s = 14; // Pip size
            const c = 64;
            const l = 32;
            const r = 96;

            // Standard Pip Layout
            if (pipCount % 2 === 1) { ctx.beginPath(); ctx.arc(c, c, s, 0, Math.PI * 2); ctx.fill(); } // Center
            if (pipCount > 1) {
                ctx.beginPath(); ctx.arc(l, l, s, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(r, r, s, 0, Math.PI * 2); ctx.fill();
            }
            if (pipCount > 3) {
                ctx.beginPath(); ctx.arc(l, r, s, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(r, l, s, 0, Math.PI * 2); ctx.fill();
            }
            if (pipCount === 6) {
                ctx.beginPath(); ctx.arc(l, c, s, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(r, c, s, 0, Math.PI * 2); ctx.fill();
            }
        }

        // SYMBOL (Battle)
        if (text) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 70px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 64, 68);
        }

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Rolls dice for the given counts.
     * @param {number} strCount 
     * @param {number} dexCount 
     * @param {number} intCount 
     * @param {number} moveCount - Optional: Number of movement dice
     */
    async roll(strCount, dexCount, intCount, moveCount = 0) {
        if (!window.TWEEN) console.error("TWEEN.js missing!");


        // Try Init
        const success = this.init();
        if (!success) {
            return this.rollFallback(strCount, dexCount, intCount, moveCount);
        }

        this.clear(); // Clear old dice
        // Force Reflow/Resize just in case
        if (this.renderer) this.renderer.setSize(window.innerWidth, window.innerHeight);

        // PLAY SOUND
        if (this.playRollSound) this.playRollSound();

        const results = { str: 0, dex: 0, int: 0, move: 0 };
        const diceObjects = [];
        const occupiedTargets = [];

        const DICE_SIZE = 1.3;
        const geom = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);

        const spawnType = (type, count, matKey) => {
            for (let i = 0; i < count; i++) {
                let moveVal = 0;
                let matToUse = null;
                let isSuccess = false;

                if (type === 'move') {
                    moveVal = Math.floor(Math.random() * 6) + 1;
                    results.move += moveVal;
                    // Use ALL 6 materials for proper D6 dice
                    matToUse = this.materials['move'];
                } else {
                    isSuccess = Math.random() >= 0.5;
                    if (isSuccess) results[type]++;
                    matToUse = this.materials[matKey];
                }

                const mesh = new THREE.Mesh(geom, matToUse);
                // Start Visible (Y=10) to ensure they are in frustum
                mesh.position.set((Math.random() - 0.5) * 6, 10, 5);
                mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

                this.scene.add(mesh);

                let landing = { x: (Math.random() - 0.5) * 12, y: 1.0, z: -2 + Math.random() * 6 };
                if (this.findLandingSpot) {
                    landing = this.findLandingSpot(occupiedTargets);
                }
                occupiedTargets.push(landing);

                diceObjects.push({ mesh, type, isSuccess, moveVal, landingPos: landing });
            }
        };

        spawnType('str', strCount, 'str');
        spawnType('dex', dexCount, 'dex');
        spawnType('int', intCount, 'int');
        spawnType('move', moveCount, 'move');



        // ANIMATE DROP phase
        const landPromises = diceObjects.map(d => this.animateDieDrop(d));
        await Promise.all(landPromises);

        // Wait a beat to read
        await new Promise(r => setTimeout(r, 1500));

        // VACUUM / CLEAR phase
        const vacPromises = diceObjects.map(d => this.animateDieVacuum(d));
        await Promise.all(vacPromises);

        this.clear();
        return results;
    }

    async rollFallback(strCount, dexCount, intCount, moveCount) {
        console.warn("DiceRoller: Rolling with fallback RNG (No 3D)");
        if (typeof addLog === 'function') addLog("Dice Visuals Failed. Using 2D.", "log-fail");
        const results = { str: 0, dex: 0, int: 0, move: 0 };

        for (let i = 0; i < strCount; i++) if (Math.random() >= 0.5) results.str++;
        for (let i = 0; i < dexCount; i++) if (Math.random() >= 0.5) results.dex++;
        for (let i = 0; i < intCount; i++) if (Math.random() >= 0.5) results.int++;
        for (let i = 0; i < moveCount; i++) results.move += Math.floor(Math.random() * 6) + 1;

        // Fake Delay
        await new Promise(r => setTimeout(r, 600));
        return results;
    }

    findLandingSpot(occupied) {
        // Tries to find a random spot on table (X: -6 to 6, Z: -2 to 4)
        // that is at least ~1.6 units away from others.
        const minDist = 1.6;
        for (let tries = 0; tries < 20; tries++) {
            const tx = (Math.random() - 0.5) * 12;
            const tz = -2 + (Math.random() * 6);

            let clash = false;
            for (let p of occupied) {
                const dx = p.x - tx;
                const dz = p.z - tz;
                if ((dx * dx + dz * dz) < (minDist * minDist)) {
                    clash = true;
                    break;
                }
            }

            if (!clash) return { x: tx, y: 1.0, z: tz };
        }
        // Fallback: Just random
        return { x: (Math.random() - 0.5) * 12, y: 1.0, z: -2 + Math.random() * 6 };
    }

    playRollSound() {
        const url = 'https://raw.githubusercontent.com/jobalator/Dungeon-Crawler/master/assets/sounds/dice_roll.mp3';
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => { });
    }

    animateDieDrop(diceObj) {
        return new Promise(resolve => {
            const mesh = diceObj.mesh;
            const target = diceObj.landingPos || { x: 0, y: 1.0, z: 0 };

            // ROTATION logic 
            const targetRot = { x: 0, y: Math.random() * Math.PI * 4, z: 0 };

            if (diceObj.type === 'move') {
                // Determine rotation for PIPS based on moveVal (1-6)
                switch (diceObj.moveVal) {
                    case 1: targetRot.z = Math.PI / 2; break;
                    case 2: targetRot.z = -Math.PI / 2; break;
                    case 3: targetRot.x = 0; break;
                    case 4: targetRot.x = Math.PI; break;
                    case 5: targetRot.x = -Math.PI / 2; break;
                    case 6: targetRot.x = Math.PI / 2; break;
                }
                targetRot.x += Math.round(Math.random() * 4) * Math.PI * 2;
                targetRot.z += Math.round(Math.random() * 4) * Math.PI * 2;
                targetRot.y += Math.random() * Math.PI * 2;

            } else {
                if (diceObj.isSuccess) {
                    targetRot.x = Math.round(Math.random() * 2) * Math.PI * 2;
                    targetRot.z = Math.round(Math.random() * 2) * Math.PI * 2;
                } else {
                    targetRot.x = Math.PI + (Math.round(Math.random() * 2) * Math.PI * 2);
                }
            }

            // TWEEN POS
            new TWEEN.Tween(mesh.position)
                .to({ x: target.x, y: target.y, z: target.z }, 1000)
                .easing(TWEEN.Easing.Back.Out)
                .start();

            // TWEEN ROT
            new TWEEN.Tween(mesh.rotation)
                .to({ x: targetRot.x, y: targetRot.y, z: targetRot.z }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(resolve)
                .start();

            // Create Shadow
            const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
            const shadowMesh = new THREE.Mesh(shadowGeo, this.shadowMaterial);
            shadowMesh.rotation.x = -Math.PI / 2;
            shadowMesh.position.y = 0.05;
            // Set initial XZ to avoid flash
            shadowMesh.position.x = mesh.position.x;
            shadowMesh.position.z = mesh.position.z;
            this.scene.add(shadowMesh);

            // Link Shadow
            diceObj.shadow = shadowMesh;

        });
    }

    animateDieVacuum(diceObj) {
        return new Promise(resolve => {
            // Movement dice just fade out
            if (diceObj.type === 'move') {
                new TWEEN.Tween(diceObj.mesh.scale)
                    .to({ x: 0, y: 0, z: 0 }, 500)
                    .onComplete(resolve)
                    .start();
                return;
            }

            if (!diceObj.isSuccess) {
                // Fails just fade/shrink out
                new TWEEN.Tween(diceObj.mesh.scale)
                    .to({ x: 0, y: 0, z: 0 }, 500)
                    .onComplete(resolve)
                    .start();
                return;
            }

            // Successes fly to Bottom Screen Left/Center/Right
            let targetPos = { x: 0, y: -15, z: 20 }; // default "towards camera bottom"

            // Adjust X spread to match UI roughly
            if (diceObj.type === 'str') targetPos.x = -8;
            if (diceObj.type === 'dex') targetPos.x = 0;
            if (diceObj.type === 'int') targetPos.x = 8;

            new TWEEN.Tween(diceObj.mesh.position)
                .to(targetPos, 600)
                .easing(TWEEN.Easing.Back.In)
                .start();

            new TWEEN.Tween(diceObj.mesh.scale)
                .to({ x: 0.1, y: 0.1, z: 0.1 }, 600)
                .onComplete(resolve)
                .start();
        });
    }

    animate() {
        if (!this.isInitialized || !this.renderer) return;

        // Continue the animation loop
        requestAnimationFrame(this.animate);

        // Update tweens for dice animations
        if (window.TWEEN) window.TWEEN.update();

        // Render the scene
        try {
            // Shadow Follow Logic
            if (this.activeDice) {
                this.activeDice.forEach(d => {
                    if (d.shadow && d.mesh) {
                        d.shadow.position.x = d.mesh.position.x;
                        d.shadow.position.z = d.mesh.position.z;

                        // Fake Occlusion/Scale
                        const dist = d.mesh.position.y;
                        const scale = Math.max(0.0, 1.2 - (dist * 0.05));
                        d.shadow.scale.set(scale, scale, 1);
                        d.shadow.material.opacity = Math.max(0, 0.5 - (dist * 0.02));
                    }
                });
            }

            this.renderer.render(this.scene, this.camera);
        } catch (e) {
            console.warn("DiceRoller: Render failed (context lost?)", e);
        }
    }

    clear() {
        if (!this.scene) return;
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        // Restore lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);
    }
}

// Global Instance
window.DICE_ROLLER = new DiceRoller();
