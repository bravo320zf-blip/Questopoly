

var activeBattle = null; // Global Battle State

const RACES = [
    { id: 'human', name: 'Human', stats: { str: 2, dex: 2, int: 2 } },
    { id: 'elf', name: 'Elf', stats: { str: 1, dex: 3, int: 2 } },
    { id: 'dwarf', name: 'Dwarf', stats: { str: 3, dex: 1, int: 2 } },
    { id: 'orc', name: 'Orc', stats: { str: 4, dex: 1, int: 1 } },
    { id: 'gnome', name: 'Gnome', stats: { str: 1, dex: 2, int: 3 } },
    { id: 'tiefling', name: 'Tiefling', stats: { str: 1, dex: 1, int: 4 } },
    { id: 'dragonborn', name: 'Dragonborn', stats: { str: 3, dex: 2, int: 1 } },
    { id: 'halfling', name: 'Halfling', stats: { str: 1, dex: 4, int: 1 } }
];

const CLASSES = [
    {
        id: 'fighter', name: 'Fighter', color: 0x8B0000,
        actives: ['power_strike', 'intimidate', 'second_wind', 'shield_bash', 'rally', 'siege_breaker'],
        passives: ['veteran', 'iron_skin', 'executioner', 'conqueror', 'heavy_armor', 'vanguard']
    },

    {
        id: 'wizard', name: 'Wizard', color: 0x4B0082,
        actives: ['fireball', 'transmute_gold', 'blink', 'time_warp', 'polymorph', 'arcane_eye'],
        passives: ['scholar', 'court_mage', 'alchemist_pas', 'mana_shield', 'leyline', 'elemental_attune']
    },

    {
        id: 'rogue', name: 'Rogue', color: 0x2F4F4F,
        actives: ['pickpocket', 'sprint_act', 'smoke_bomb_act', 'sabotage', 'gamble_act', 'shadow_strike'],
        passives: ['shadow_step', 'greedy', 'fence', 'skeleton_key', 'cutpurse', 'ambush_pas']
    },

    {
        id: 'cleric', name: 'Cleric', color: 0xFFD700,
        actives: ['heal_spell', 'smite', 'bless', 'divine_intervention', 'sanctuary', 'exorcism'],
        passives: ['devotion', 'medic', 'holy_aura', 'spirit_tithe', 'pacifist', 'resurrection']
    }
];

const CHAR_PORTRAITS = {
    human_fighter: "https://static.wixstatic.com/media/b16479_6c68b5d591924b6e824a5b853c70d7d0~mv2.png",
    human_wizard: "https://static.wixstatic.com/media/b16479_cffdfdf625ac4c5ab291cc32f6cc357d~mv2.png",
    human_rogue: "https://static.wixstatic.com/media/b16479_c0b84bd00b724d378b7fc569ea230d43~mv2.png",
    human_cleric: "https://static.wixstatic.com/media/b16479_d7afa7e4487c4e2ba43881974f9cf775~mv2.png",
    elf_fighter: "https://static.wixstatic.com/media/b16479_db3af4282e0941f981e73e24a24559f8~mv2.png",
    elf_wizard: "https://static.wixstatic.com/media/b16479_3ea1a5f47f424585a52e87211f16612a~mv2.png",
    elf_rogue: "https://static.wixstatic.com/media/b16479_e509aa4340f34fcf8e1d6cf62c655693~mv2.png",
    elf_cleric: "https://static.wixstatic.com/media/b16479_7f8723d83fa743758ce087365dee5617~mv2.png",
    dwarf_fighter: "https://static.wixstatic.com/media/b16479_40e15debdf924a75bb2d640477a745a6~mv2.png",
    dwarf_wizard: "https://static.wixstatic.com/media/b16479_5c37ef08a101468f92c1357a0ed88576~mv2.png",
    dwarf_rogue: "https://static.wixstatic.com/media/b16479_815ea25b0e9c41d999f6af0377ff4a66~mv2.png",
    dwarf_cleric: "https://static.wixstatic.com/media/b16479_25f160f5cbc94698957d3c95e06102df~mv2.png",
    orc_fighter: "https://static.wixstatic.com/media/b16479_733a0e4ffb554734a58229af907bb5e5~mv2.jpg",
    orc_wizard: "https://static.wixstatic.com/media/b16479_a99213a85fa74dc7925dc1fb2d26987f~mv2.jpg",
    orc_rogue: "https://static.wixstatic.com/media/b16479_a0df2ed1b7b3412ba4694f474bf0846b~mv2.jpg",
    orc_cleric: "https://static.wixstatic.com/media/b16479_881698035b3b41c6932393d2b0975359~mv2.jpg",
    gnome_fighter: "https://static.wixstatic.com/media/b16479_0e7f8d065338451480850369e92bce41~mv2.png",
    gnome_wizard: "https://static.wixstatic.com/media/b16479_916b53d2d0294949beb03bbed23e6317~mv2.png",
    gnome_rogue: "https://static.wixstatic.com/media/b16479_0a695ef596f840358c65566dcd49e979~mv2.png",
    gnome_cleric: "https://static.wixstatic.com/media/b16479_9e5334a4db594b85b1954c004a4915b3~mv2.png",
    tiefling_fighter: "https://static.wixstatic.com/media/b16479_a5e3e133b61f463a8bcc0ce93b582d25~mv2.jpg",
    tiefling_wizard: "https://static.wixstatic.com/media/b16479_afd36e1dcbc2485cac93ae49155eae58~mv2.jpg",
    tiefling_rogue: "https://static.wixstatic.com/media/b16479_9168e6f8da2e48659f4ced1d8c7aad8c~mv2.jpg",
    tiefling_cleric: "https://static.wixstatic.com/media/b16479_689c4a94dbb6418681634d65878c8022~mv2.jpg",
    dragonborn_fighter: "https://static.wixstatic.com/media/b16479_ccc16b7e35234f169078b1f8d068860e~mv2.png",
    dragonborn_wizard: "https://static.wixstatic.com/media/b16479_04ad01ebf8c546b7a1f380fc391adef1~mv2.png",
    dragonborn_rogue: "https://static.wixstatic.com/media/b16479_57df45b4ea004cd1a8a2cfa668afdd1b~mv2.png",
    dragonborn_cleric: "https://static.wixstatic.com/media/b16479_979846221ad146cd835eb0e9ed900e44~mv2.png",
    halfling_fighter: "https://static.wixstatic.com/media/b16479_254630ae9fce40db98042af86fc124ff~mv2.png",
    halfling_wizard: "https://static.wixstatic.com/media/b16479_cc426dbb6b4c42e4825bc9b704c665ae~mv2.png",
    halfling_rogue: "https://static.wixstatic.com/media/b16479_aa0a778aaeca41fe9477cc9fee43483b~mv2.png",
    halfling_cleric: "https://static.wixstatic.com/media/b16479_aead60c1d1014bacb235b5a583925891~mv2.png"
};


//----Dungeon Stuff------


function getDungeonDifficulty() {
    let maxStat = 0;
    players.forEach(p => {
        const highest = Math.max(p.stats.str, p.stats.dex, p.stats.int);
        if (highest > maxStat) maxStat = highest;
    });

    if (maxStat >= 12) return { tier: "HARD", tnBase: 6, req: 2 };
    if (maxStat >= 9) return { tier: "MEDIUM", tnBase: 5, req: 1 };
    return { tier: "EASY", tnBase: 4, req: 1 };
}

function spawnDungeonVisuals(entranceTileName) {
    // 1. Initialize Group (Only once)
    if (!dungeonGroup) {
        dungeonGroup = new THREE.Group();
        scene.add(dungeonGroup);
    }

    // 2. Prevent Duplicate Spawns
    if (activeDungeons[entranceTileName]) return;

    const config = DUNGEON_DATA[entranceTileName];
    if (!config) return;

    // 3. Locate Start Point
    const startTile = tiles.find(t => t.userData.info.name === entranceTileName);
    if (!startTile) {
        console.error("Dungeon Spawn Error: Tile not found " + entranceTileName);
        return;
    }

    const TILE_SIZE = 3.5;
    const SPACING = 4.0;

    // 4. Determine Direction
    const center = new THREE.Vector3(0, 0, 0);
    let mainDir = new THREE.Vector3().subVectors(startTile.position, center).normalize();
    if (Math.abs(mainDir.x) > Math.abs(mainDir.z)) mainDir.set(Math.sign(mainDir.x), 0, 0);
    else mainDir.set(0, 0, Math.sign(mainDir.z));
    const sideDir = new THREE.Vector3(-mainDir.z, 0, mainDir.x);

    // 5. Initialize Instance State
    const newDungeon = {
        type: entranceTileName,
        tiles: [],
        bossMesh: null,
        group: new THREE.Group() // Sub-group for this specific dungeon
    };

    const loader = new THREE.TextureLoader();
    const floorTex = loader.load(config.floorImg);

    let currentPos = startTile.position.clone().add(mainDir.clone().multiplyScalar(4.5));
    const occupied = new Set();
    const toKey = (v) => `${Math.round(v.x)},${Math.round(v.z)}`;
    occupied.add(toKey(currentPos));
    const centerSum = currentPos.clone();

    // 6. Generate Tiles
    for (let i = 1; i <= config.length; i++) {
        const geo = new THREE.BoxGeometry(TILE_SIZE, 0.5, TILE_SIZE);

        let mat;
        if (config.spawnStyle === 'float_up') mat = new THREE.MeshBasicMaterial({ map: floorTex });
        else {
            const matParams = { map: floorTex, color: 0xffffff, roughness: 0.7 };
            if (config.spawnStyle === 'rise_lava') { matParams.emissive = 0x330000; matParams.emissiveIntensity = 0.2; }
            mat = new THREE.MeshStandardMaterial(matParams);
        }

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(currentPos);
        mesh.visible = false;

        mesh.userData = { isDungeon: true, dungeonType: entranceTileName, index: i, finalY: 0, spawnStyle: config.spawnStyle };

        if (config.spawnStyle === 'fall_sky') mesh.position.y = 50;
        else if (config.spawnStyle === 'rise_lava') mesh.position.y = -10;
        else if (config.spawnStyle === 'float_up') mesh.position.y = -20;
        else mesh.position.y = -5;

        newDungeon.group.add(mesh);
        newDungeon.tiles.push(mesh);

        // Path Logic
        if (i < config.length) {
            const possibleMoves = [];
            const fwdPos = currentPos.clone().add(mainDir.clone().multiplyScalar(SPACING));
            const leftPos = currentPos.clone().add(sideDir.clone().multiplyScalar(SPACING));
            const rightPos = currentPos.clone().add(sideDir.clone().multiplyScalar(-SPACING));

            if (!occupied.has(toKey(fwdPos))) possibleMoves.push({ pos: fwdPos, dir: mainDir, weight: 0.7 });
            if (!occupied.has(toKey(leftPos))) possibleMoves.push({ pos: leftPos, dir: sideDir, weight: 0.15 });
            if (!occupied.has(toKey(rightPos))) possibleMoves.push({ pos: rightPos, dir: sideDir, weight: 0.15 });

            let validMove = null;
            if (possibleMoves.length === 0) validMove = { pos: fwdPos };
            else {
                const roll = Math.random();
                let cumulative = 0;
                for (let m of possibleMoves) {
                    cumulative += m.weight;
                    if (roll <= cumulative) { validMove = m; break; }
                }
                if (!validMove) validMove = possibleMoves[0];
            }
            currentPos = validMove.pos;
            occupied.add(toKey(currentPos));
            centerSum.add(currentPos);

            if (typeof worldTrees !== 'undefined') {
                worldTrees.forEach(tree => {
                    if (tree.userData.isFalling) return;
                    const dx = tree.position.x - currentPos.x;
                    const dz = tree.position.z - currentPos.z;
                    if (Math.sqrt(dx * dx + dz * dz) < 3.0) animateTreeFall(tree);
                });
            }
        }
    }

    // 7. Boss & Scenery
    const dungeonCenter = centerSum.multiplyScalar(1 / config.length);
    newDungeon.bossMesh = createBossMesh(config.bossName, config.bossColor);
    newDungeon.bossMesh.position.set(dungeonCenter.x, 25, dungeonCenter.z);
    newDungeon.bossMesh.visible = false;
    newDungeon.bossMesh.traverse((child) => {
        if (child.isMesh) { child.material.transparent = true; child.material.opacity = 1; }
    });

    newDungeon.group.add(newDungeon.bossMesh);

    if (typeof spawnDungeonScenery === 'function') {
        spawnDungeonScenery(config, newDungeon.tiles, newDungeon.group);
    }

    // Add this specific dungeon group to the main container
    dungeonGroup.add(newDungeon.group);

    // Store in Global Map
    activeDungeons[entranceTileName] = newDungeon;

    runDungeonCinematic(newDungeon, config);
}

let isCinematic = false; // Global flag to block controls
const modalQueue = []; // Global queue for stacked modals

function spawnDungeonScenery(config, dungeonTiles, group) {
    // Clear old data
    activeSceneryParticles = [];
    dungeonSceneryMesh = [];

    const candidates = [];
    const occupied = new Set();

    // 1. Mark Dungeon Path as Occupied
    dungeonTiles.forEach(t => {
        occupied.add(`${Math.round(t.position.x)},${Math.round(t.position.z)}`);
    });

    // 2. Find Empty Neighbors (Scenery Spots)
    const offsets = [
        { x: 4, z: 0 }, { x: -4, z: 0 }, { x: 0, z: 4 }, { x: 0, z: -4 },
        { x: 3, z: 3 }, { x: -3, z: 3 }, { x: 3, z: -3 }, { x: -3, z: -3 } // Diagonals too
    ];

    dungeonTiles.forEach(t => {
        offsets.forEach(off => {
            const pos = t.position.clone().add(new THREE.Vector3(off.x, 0, off.z));
            const key = `${Math.round(pos.x)},${Math.round(pos.z)}`;

            // Check Collision with Dungeon Path
            if (occupied.has(key)) return;

            // Check Collision with Main Board (Radius ~22)
            if (pos.length() < 25) return;

            // Random Density Check (Don't fill every single spot)
            if (Math.random() > 0.4) return;

            occupied.add(key); // Mark used so we don't stack scenery
            candidates.push(pos);
        });
    });

    // 3. Generate Themed Meshes
    candidates.forEach(pos => {
        let mesh = null;

        // --- VAMPIRE MANOR (Trees & Graves) ---
        if (config.bossName === "Count Crimson") {
            if (Math.random() > 0.6) {
                // Creepy Tree
                mesh = new THREE.Group();
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
                trunk.position.y = 1.5;
                // Dead branches
                const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
                b1.position.set(0, 2, 0); b1.rotation.z = 0.8;
                const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
                b2.position.set(0, 1.5, 0); b2.rotation.z = -0.8;
                mesh.add(trunk, b1, b2);
            } else {
                // Gravestone
                mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.3), new THREE.MeshStandardMaterial({ color: 0x555555 }));
                mesh.position.y = 0.75;
                mesh.rotation.y = (Math.random() - 0.5) * 0.5; // Crooked
            }
        }

        // --- DEMON GATE (Volcanos & Lava) ---
        else if (config.bossName === "Balrog Prime") {
            if (Math.random() > 0.7) {
                // Volcano
                mesh = new THREE.Group();
                const cone = new THREE.Mesh(new THREE.ConeGeometry(2, 3, 8, 1, true), new THREE.MeshStandardMaterial({ color: 0x331111 }));
                cone.position.y = 1.5;
                const lava = new THREE.Mesh(new THREE.CircleGeometry(0.8), new THREE.MeshBasicMaterial({ color: 0xff4500 }));
                lava.rotation.x = -Math.PI / 2; lava.position.y = 2.5;
                mesh.add(cone, lava);

                // Add Smoke Emitter Reference
                activeSceneryParticles.push({ type: 'smoke', pos: pos.clone().add(new THREE.Vector3(0, 3, 0)) });
            } else {
                // Lava Pool
                mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 7), new THREE.MeshBasicMaterial({ color: 0xcf1020 }));
                mesh.position.y = 0.05;
            }
        }

        // --- WYVERN PEAK (Ice & Mountains) ---
        else if (config.bossName === "Storm Monarch") {
            if (Math.random() > 0.5) {
                // Ice Mountain
                mesh = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 4), new THREE.MeshStandardMaterial({ color: 0xe0f7fa, roughness: 0.2 }));
                mesh.position.y = 2;
            } else {
                // Snow Tree
                mesh = new THREE.Group();
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
                trunk.position.y = 0.5;
                const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                leaves.position.y = 2;
                mesh.add(trunk, leaves);
            }
        }

        // --- VOID EDGE (Floating Stairs / Debris) ---
        // Void uses a different logic (fog handled separately), these are the physical debris
        else if (config.bossName === "Void Leviathan") {
            if (Math.random() > 0.5) {
                // Floating Stair / Platform
                mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 1), new THREE.MeshStandardMaterial({ color: 0x4c1d95, transparent: true, opacity: 0.8 }));
                mesh.position.y = 1 + Math.random() * 3;
                mesh.rotation.z = (Math.random() - 0.5);
                mesh.rotation.y = Math.random() * Math.PI;
            }
        }

        if (mesh) {
            // Randomize Position slightly
            mesh.position.x += (pos.x + (Math.random() - 0.5));
            mesh.position.z += (pos.z + (Math.random() - 0.5));

            // Setup for Pop-In Animation
            mesh.scale.set(0, 0, 0);
            mesh.userData.targetScale = 1;

            group.add(mesh);
            dungeonSceneryMesh.push(mesh);
        }
    });

    // --- 4. SPECIAL FEATURES (Mansion & Void Fog) ---

    // A. MANSION (Vampire Only) - At the end
    if (config.bossName === "Count Crimson") {
        const lastTile = dungeonTiles[dungeonTiles.length - 1];
        // Calculate position "Behind" the last tile (further away from board center)
        const dir = lastTile.position.clone().normalize();
        const mansionPos = lastTile.position.clone().add(dir.multiplyScalar(6));
        mansionPos.y = 0.25; // Sit on top of the 0.5 thick tile (finalY=0)

        const mansion = createMansionMesh();
        mansion.position.copy(mansionPos);

        // Orient towards the dungeon path - but keep it upright
        mansion.rotation.y = Math.atan2(lastTile.position.x - mansion.position.x, lastTile.position.z - mansion.position.z);

        mansion.scale.set(0, 0, 0);
        mansion.userData.targetScale = 1.5;

        group.add(mansion);
        dungeonSceneryMesh.push(mansion);
    }

    // B. VOID FOG (Void Only) - Cloud around tiles
    if (config.bossName === "Void Leviathan") {
        createVoidFog(dungeonTiles, group);
    }
}

function createMansionMesh() {
    const g = new THREE.Group();
    // Main Hall
    const main = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    main.position.y = 1.5;
    // Tower
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.5, 6, 1.5), new THREE.MeshStandardMaterial({ color: 0x2a2a2a }));
    tower.position.set(-2, 3, 0);
    // Roofs
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(3, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0x4a0404 }));
    roof1.position.set(0, 3.75, 0); roof1.rotation.y = Math.PI / 4;
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2, 4), new THREE.MeshStandardMaterial({ color: 0x4a0404 }));
    roof2.position.set(-2, 7, 0); roof2.rotation.y = Math.PI / 4;

    g.add(main, tower, roof1, roof2);

    // Windows (Glowing yellow)
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const w1 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1), winMat);
    w1.position.set(0.5, 1.5, 1.55);
    const w2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1), winMat);
    w2.position.set(-0.5, 1.5, 1.55);
    const w3 = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.8), winMat);
    w3.position.set(-2, 5, 0.76);

    g.add(w1, w2, w3);
    return g;
}

function createVoidFog(tiles, group) {
    const count = 300;
    const geom = new THREE.BufferGeometry();
    const positions = [];

    // Calculate center of dungeon for rough placement
    let cx = 0, cz = 0;
    tiles.forEach(t => { cx += t.position.x; cz += t.position.z; });
    cx /= tiles.length; cz /= tiles.length;

    for (let i = 0; i < count; i++) {
        // Random placement around the dungeon path average
        const r = Math.random() * 25;
        const ang = Math.random() * Math.PI * 2;
        positions.push(cx + Math.cos(ang) * r, Math.random() * 5 + 1, cz + Math.sin(ang) * r);

        // Save for animation
        activeSceneryParticles.push({
            type: 'void',
            index: i,
            baseY: Math.random() * 5,
            speed: Math.random() * 0.02
        });
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
        color: 0x000000,
        size: 2,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const sys = new THREE.Points(geom, mat);
    sys.userData.isVoidFog = true; // For identification
    group.add(sys);
    dungeonSceneryMesh.push(sys); // To animate pop-in opacity
}

function runDungeonCinematic(dungeonInstance, config) {
    isCinematic = true;
    document.body.classList.add('cinematic-lock');
    const oldTarget = cameraTarget;
    isZoomed = true;

    // 1. Zoom to THIS dungeon's entrance
    const startTile = dungeonInstance.tiles[0];

    new TWEEN.Tween(camera.position)
        .to({ x: startTile.position.x, y: 35, z: startTile.position.z + 25 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => playSpawnSequence())
        .start();

    const playSpawnSequence = () => {
        let delay = 0;
        const stepTime = 100;

        dungeonInstance.tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.visible = true;
                new TWEEN.Tween(tile.position)
                    .to({ y: tile.userData.finalY }, 600)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start();

                if (config.spawnStyle === 'rise_lava') VFX.trigger('burst_up', tile.position, null, 0xff4500);
                else if (config.spawnStyle === 'fade_mist') VFX.trigger('smoke', tile.position, null, 0x990000);

                if (index % 3 === 0) {
                    new TWEEN.Tween(camera.position)
                        .to({ x: tile.position.x, z: tile.position.z + 20 }, 800)
                        .start();
                }
            }, delay);
            delay += stepTime;
        });

        // Pop-In Scenery
        setTimeout(() => {
            if (dungeonInstance.group) {
                dungeonInstance.group.children.forEach(mesh => {
                    // Check if it's scenery (not a tile or boss)
                    if (!mesh.userData.isDungeon && !mesh.userData.isBoss) {
                        mesh.visible = true;
                        // Simple scale pop
                        const targetS = mesh.userData.targetScale || 1;
                        mesh.scale.set(0, 0, 0);
                        new TWEEN.Tween(mesh.scale).to({ x: targetS, y: targetS, z: targetS }, 800).start();
                    }
                });
            }
        }, delay);

        setTimeout(() => bossSkyIntro(), delay + 1000);
    };

    const bossSkyIntro = () => {
        const boss = dungeonInstance.bossMesh;
        boss.visible = true;
        boss.scale.set(0.1, 0.1, 0.1);

        new TWEEN.Tween(camera.position)
            .to({ x: boss.position.x, y: 40, z: boss.position.z + 40 }, 1500)
            .onUpdate(() => camera.lookAt(boss.position))
            .start();

        new TWEEN.Tween(boss.scale)
            .to({ x: 3.0, y: 3.0, z: 3.0 }, 2000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onComplete(() => {
                VFX.trigger('shockwave', boss.position, null, config.bossColor);
                AUDIO.playSound('sfx_fail');

                setTimeout(() => {
                    boss.traverse((child) => { if (child.isMesh) new TWEEN.Tween(child.material).to({ opacity: 0 }, 1200).start(); });
                    setTimeout(() => finishCinematic(), 1200);
                }, 1500);
            })
            .start();
    };

    const finishCinematic = () => {
        dungeonInstance.bossMesh.visible = false;

        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 80, z: 20 }, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => camera.lookAt(0, 0, 0))
            .onComplete(() => {
                isCinematic = false;
                document.body.classList.remove('cinematic-lock');
                const p = players[turnIndex];
                if (p) { cameraTarget = p.mesh; isZoomed = true; zoomToPiece(p); }
                addLog(`The ${config.bossName} awaits!`, "log-epic");
            })
            .start();
    };
}

function finishCinematic(oldTarget) {
    // Zoom out to see everything
    const centerPos = { x: 0, y: 80, z: 20 }; // High up

    new TWEEN.Tween(camera.position)
        .to(centerPos, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => {
            // Restore Control
            isCinematic = false;
            document.body.classList.remove('cinematic-lock');

            // Return to player
            const p = players[turnIndex];
            if (p) {
                cameraTarget = p.mesh;
                isZoomed = true;
                zoomToPiece(p);
            }

            addLog("The Dungeon awaits...", "log-epic");
        })
        .start();
}

function createThematicWalls(group, pos, dir, config, parentTile) {
    // Calculate perpendicular vector for sides (Relative to tile)
    // Since we attach to parentTile, coords are local (0,0,0 is center of tile)

    const wallGeo = new THREE.BoxGeometry(0.5, 3, 3.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: config.wallColor, roughness: 0.9 });

    // Left Wall
    const w1 = new THREE.Mesh(wallGeo, wallMat);
    w1.position.set(1.8, 1.5, 0); // Local offset right

    // Right Wall
    const w2 = new THREE.Mesh(wallGeo, wallMat);
    w2.position.set(-1.8, 1.5, 0); // Local offset left

    // Random rotation for "ruined" look
    w1.rotation.y = (Math.random() - 0.5) * 0.2;
    w2.rotation.y = (Math.random() - 0.5) * 0.2;

    // Decor: Floating Crystals or Torches based on theme
    if (config.bossName === "Void Leviathan") {
        const cryst = new THREE.Mesh(new THREE.OctahedronGeometry(0.3), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        cryst.position.set(0, 3, 0);
        parentTile.add(cryst);
    }
    else if (config.bossName === "Balrog Prime") {
        const fire = new THREE.PointLight(0xff4500, 1, 5);
        fire.position.set(0, 2, 0);
        parentTile.add(fire);
    }

    parentTile.add(w1);
    parentTile.add(w2);
}

function createBossMesh(bossType, color) {
    const group = new THREE.Group();

    // --- SHARED MATERIALS ---
    const matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    const matBone = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, roughness: 0.9 });
    const matGlow = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 });
    const matSkinBase = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });

    // --- 1. VOID LEVIATHAN (Eldritch Horror) ---
    if (bossType === "Void Leviathan") {
        // Core (Pulsating Brain)
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 2), new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0 }));
        group.add(core);

        // Orbiting Rings (Gyroscopic)
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2 + (i * 0.3), 0.05, 8, 32), matGlow);
            ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            // Add custom animation data for the animate loop to find later
            ring.userData = { rotateSpeed: 0.02 + (i * 0.01) };
            group.add(ring);
        }

        // Tentacles (Segmented)
        for (let i = 0; i < 8; i++) {
            const tentacleGroup = new THREE.Group();
            const angle = (Math.PI * 2 / 8) * i;

            // Segments
            for (let j = 0; j < 5; j++) {
                const size = 0.3 - (j * 0.05);
                const seg = new THREE.Mesh(new THREE.DodecahedronGeometry(size), matDarkMetal);
                seg.position.set(0, -0.5 - (j * 0.4), 0.5 + (j * 0.2)); // Curve outward
                tentacleGroup.add(seg);
            }

            tentacleGroup.rotation.y = angle;
            tentacleGroup.rotation.x = 0.5; // Flare out
            group.add(tentacleGroup);
        }

        // Floating Eyes
        const eyeGeo = new THREE.SphereGeometry(0.15);
        for (let i = 0; i < 6; i++) {
            const eye = new THREE.Mesh(eyeGeo, matGlow);
            eye.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5);
            group.add(eye);
        }
    }

    // --- 2. BALROG PRIME (Fire Demon) ---
    else if (bossType === "Balrog Prime") {
        const matMagma = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff4500, emissiveIntensity: 0.5, roughness: 1 });

        // Torso (Bulky)
        const chest = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 1), matMagma);
        chest.position.y = 1.0;
        group.add(chest);

        // Abs
        const abs = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.8), matMagma);
        abs.position.y = -0.2;
        group.add(abs);

        // Head (Bull-like)
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.9), matMagma);
        head.position.y = 2.0;
        group.add(head);

        // Massive Horns
        const hornGeo = new THREE.ConeGeometry(0.15, 1.5, 8);
        const hornL = new THREE.Mesh(hornGeo, matBone);
        hornL.position.set(-0.6, 2.6, 0.2);
        hornL.rotation.z = 0.5;
        hornL.rotation.x = -0.2;

        const hornR = new THREE.Mesh(hornGeo, matBone);
        hornR.position.set(0.6, 2.6, 0.2);
        hornR.rotation.z = -0.5;
        hornR.rotation.x = -0.2;
        group.add(hornL, hornR);

        // Wings (Geometric)
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.lineTo(2, 2);
        wingShape.lineTo(4, 1);
        wingShape.lineTo(2, -2);
        wingShape.lineTo(0, -1);
        const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.1, bevelEnabled: false });
        const matWings = new THREE.MeshStandardMaterial({ color: 0x330000, transparent: true, opacity: 0.9 });

        const wLeft = new THREE.Mesh(wingGeo, matWings);
        wLeft.position.set(-0.5, 1.0, -0.5);
        wLeft.rotation.y = -0.5;
        wLeft.scale.set(-1, 1, 1); // Mirror

        const wRight = new THREE.Mesh(wingGeo, matWings);
        wRight.position.set(0.5, 1.0, -0.5);
        wRight.rotation.y = 0.5;

        group.add(wLeft, wRight);

        // Flaming Whip (Coiled around)
        const coilGeo = new THREE.TorusGeometry(1.5, 0.1, 8, 32);
        const whip = new THREE.Mesh(coilGeo, matGlow);
        whip.rotation.x = Math.PI / 2;
        whip.rotation.y = 0.5;
        group.add(whip);
    }

    // --- 3. COUNTESS CRIMSON (Vampire Lord) ---
    else if (bossType === "Count Crimson") {
        const matDress = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 }); // Deep red
        const matPale = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

        // Dress (Bottom)
        const skirt = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.5, 16, 1, true), matDress);
        skirt.position.y = 0;
        group.add(skirt);

        // Torso
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x000000 })); // Corset
        torso.position.y = 1.8;
        group.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), matPale);
        head.position.y = 2.6;
        group.add(head);

        // High Collar
        const collarGeo = new THREE.CylinderGeometry(0.6, 0.4, 0.8, 8, 1, true);
        const collar = new THREE.Mesh(collarGeo, matDress);
        collar.position.y = 2.6;
        collar.position.z = -0.1;
        collar.scale.z = 0.5; // Flatten
        collar.rotation.x = 0.2;
        group.add(collar);

        // Hair (Long Black)
        const hair = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        hair.position.set(0, 2.6, -0.2);
        group.add(hair);

        // Floating Blood Orbs
        for (let i = 0; i < 4; i++) {
            const orb = new THREE.Mesh(new THREE.SphereGeometry(0.2), matGlow);
            orb.position.set(Math.cos(i * 1.5) * 1.5, 2 + Math.sin(i) * 0.5, Math.sin(i * 1.5) * 1.5);
            group.add(orb);
        }
    }

    // --- 4. STORM MONARCH (Crystal Dragon) ---
    else if (bossType === "Storm Monarch") {
        const matCrystal = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.8,
            metalness: 0.5,
            emissive: 0x0044aa
        });

        // Body (Floating shards)
        const shardGeo = new THREE.OctahedronGeometry(0.6, 0);

        // Spine segments
        for (let i = 0; i < 5; i++) {
            const spine = new THREE.Mesh(shardGeo, matCrystal);
            spine.position.y = 2.0 - (i * 0.6);
            spine.position.z = (i * 0.3); // Curve back
            spine.scale.setScalar(1.2 - (i * 0.2)); // Taper
            spine.rotation.x = Math.random();
            group.add(spine);
        }

        // Head
        const head = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 4), matCrystal);
        head.position.set(0, 2.5, 0.5);
        head.rotation.x = -1.2; // Point forward
        group.add(head);

        // Wings (Floating lightning bolts)
        for (let side of [-1, 1]) {
            const wingGroup = new THREE.Group();
            for (let k = 0; k < 3; k++) {
                const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), matGlow);
                bolt.position.set(side * (1 + k * 0.5), 0, -k * 0.5);
                bolt.rotation.z = side * (1.2 + k * 0.2);
                bolt.rotation.x = 0.5;
                wingGroup.add(bolt);
            }
            wingGroup.position.y = 1.5;
            group.add(wingGroup);
        }

        // Crackling Energy Core
        const core = new THREE.PointLight(0x00ffff, 2, 8);
        core.position.y = 1.5;
        group.add(core);
    }
    // --- FALLBACK ---
    else {
        const fallback = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: color }));
        group.add(fallback);
    }

    // --- FINISHING TOUCHES ---

    // Add Dynamic Light Source to ALL bosses
    const light = new THREE.PointLight(color, 1.5, 10);
    light.position.y = 1.5;
    group.add(light);

    // Initial Scale Up
    group.scale.set(1.5, 1.5, 1.5);

    // Metadata
    group.userData = { isBoss: true, type: bossType };
    return group;
}

// ==========================================
//   POLYMORPH / SHEEP MECHANICS
// ==========================================

function createSheepMesh() {
    const g = new THREE.Group();
    const woolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), woolMat);
    body.position.y = 0.6;
    body.castShadow = true;
    g.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.4), skinMat);
    head.position.set(0, 0.9, 0.4);
    g.add(head);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5);
    const fl = new THREE.Mesh(legGeo, skinMat); fl.position.set(-0.25, 0.25, 0.25);
    const fr = new THREE.Mesh(legGeo, skinMat); fr.position.set(0.25, 0.25, 0.25);
    const bl = new THREE.Mesh(legGeo, skinMat); bl.position.set(-0.25, 0.25, -0.25);
    const br = new THREE.Mesh(legGeo, skinMat); br.position.set(0.25, 0.25, -0.25);
    g.add(fl, fr, bl, br);

    g.position.y = 0;
    return g;
}

function makeSheep(p) {
    // Safety: If already a sheep, stop.
    if (p.mesh && p.mesh.userData && p.mesh.userData.isSheep) return;

    p.isPolymorphed = true;

    // 1. Save Original Mesh (Crucial for revert)
    if (!p.mesh.userData.isSheep) {
        p.originalMesh = p.mesh;
    }

    // 2. Create Sheep Visuals
    const sheep = createSheepMesh();
    sheep.userData.isSheep = true;

    // Match position/rotation
    sheep.position.copy(p.mesh.position);
    sheep.rotation.copy(p.mesh.rotation);

    // 3. Swap in Scene
    scene.remove(p.mesh);
    scene.add(sheep);

    p.mesh = sheep;

    // 4. Update Camera Target if needed
    if (isZoomed && cameraTarget === p.originalMesh) {
        cameraTarget = sheep;
    }

    if (p.id === myPlayerId || isZoomed) AUDIO.playSound('sfx_transition');

    // --- FIX: IMMEDIATE STAT UPDATE ---
    recalcStats(p);
    updateHUD();
}

function cureSheep(p) {
    // If not polymorphic locally, do nothing
    if (!p.isPolymorphed) return;

    // 1. Remove the Sheep Mesh
    if (p.mesh && p.mesh !== p.originalMesh) {
        scene.remove(p.mesh);
    }

    // 2. Restore Original Mesh
    if (p.originalMesh) {
        p.mesh = p.originalMesh;
        scene.add(p.mesh);
        if (tiles[p.pos]) {
            p.mesh.position.copy(tiles[p.pos].position);
            p.mesh.position.y = 0;
        }
    } else {
        // Fallback reconstruction if original mesh was lost
        const newGroup = createPlayerMesh(p.race, p.class, p.color);
        if (tiles[p.pos]) newGroup.position.copy(tiles[p.pos].position);
        scene.add(newGroup);
        p.mesh = newGroup;
    }

    // 3. Reset Local Flag
    p.isPolymorphed = false;
    addLog(`${p.name} returns to normal form.`, "log-success");

    // 4. SYNC TO DB (Clear Flag)
    if (isMultiplayer && db && gameId) {
        // Only the owner of the turn (who calls endTurn -> cureSheep) or Host can clear it
        if (p.id === myPlayerId || myPlayerId === 0) {
            db.ref(`games/${gameId}/players/${p.id}`).update({ isPolymorphed: false });
        }
    }

    // --- FIX: RESTORE STATS ---
    recalcStats(p);
    updateHUD();
}



// --- VISUAL FX ENGINE ---
const VFX = {
    audioMap: {
        burst_up: 'https://static.wixstatic.com/mp3/b16479_716ab5cae758429ab7934fb34a5af25b.mp3',
        fireball: 'https://static.wixstatic.com/mp3/b16479_25a95001f779487f8f2642c61567791e.mp3',
        lightning: 'https://static.wixstatic.com/mp3/b16479_4f1d45f090934d53ae5b954042a3b096.mp3',
        spiral_up: 'https://static.wixstatic.com/mp3/b16479_8389128a7bca475c9a3819e863daf5ba.mp3',
        implode: 'https://static.wixstatic.com/mp3/b16479_9623c35f05c0470eade0e66ae0de62f1.mp3',
        projectile_coin: 'https://static.wixstatic.com/mp3/b16479_9b93cbf306ce4f348428b60b3ac521b1.wav',
        pillar: 'https://static.wixstatic.com/mp3/b16479_bfe1b99e8e5f4ce1885c9944dcaf6894.mp3',
        shockwave: 'https://static.wixstatic.com/mp3/b16479_2e33d6685faf47269d73af40f44ed61e.mp3',
        smoke: 'https://static.wixstatic.com/mp3/b16479_9623c35f05c0470eade0e66ae0de62f1.mp3',
        firewave_burst: 'https://static.wixstatic.com/mp3/b16479_2e33d6685faf47269d73af40f44ed61e.mp3',
        buff: 'https://static.wixstatic.com/mp3/b16479_8389128a7bca475c9a3819e863daf5ba.mp3' // Reuse spiral_up sound for buff
    },

    playAudio: function (key) {
        const url = this.audioMap[key];
        if (url) {
            const audio = new Audio(url);
            audio.volume = 0.6;
            audio.play().catch(e => { });
        }
    },

    trigger: function (type, startPos, endPos, color, isRemote = false) {
        // 1. Play Sound
        this.playAudio(type);

        // 2. Ensure Vectors
        const s = startPos ? new THREE.Vector3(startPos.x, startPos.y, startPos.z) : new THREE.Vector3();
        const e = endPos ? new THREE.Vector3(endPos.x, endPos.y, endPos.z) : new THREE.Vector3();

        // 3. Sync to DB (Multiplayer)
        if (isMultiplayer && !isRemote && gameId && db) {
            db.ref(`games/${gameId}/vfxLog`).push({
                type: type,
                start: { x: s.x, y: s.y, z: s.z },
                end: { x: e.x, y: e.y, z: e.z },
                color: color || null,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

        // 4. Play Animation
        switch (type) {
            case 'lightning': this.lightningBolt(e); break;
            // Fireball now sets trackCamera: true
            case 'fireball': this.projectile(s, e, 0xff4500, 'magical', true); break;
            case 'projectile_coin': this.projectile(e, s, 0xffd700, 'sparkle', false); break;
            case 'burst_up': this.burstUp(s, color || 0xff0000); break;
            case 'spiral_up': this.spiralUp(s, color || 0x00ff00); break;
            case 'shockwave': this.shockwave(s, color || 0x000000); break;
            case 'implode': this.implode(s, color || 0x00ffff); break;
            case 'pillar': this.pillarLight(s, color || 0xffd700); break;
            case 'smoke': this.cloud(s, 0x555555); break;
            case 'firewave_burst': this.firewaveBurst(s); break;
            case 'meteor_fall': this.meteorFall(e, color || 0xff0000); break;
            case 'buff': this.spiralUp(s, color || 0xff0000); break;  // Buff uses spiral up effect
        }
    },

    // --- UPDATED PROJECTILE WITH CAMERA TRACKING ---
    projectile: function (start, end, color, onHitType, trackCamera = false) {
        // Create the Orb
        const orb = new THREE.Mesh(
            new THREE.SphereGeometry(0.6),
            new THREE.MeshStandardMaterial({ color: color, emissive: 0xffaa00, emissiveIntensity: 2 })
        );
        orb.position.copy(start);
        orb.position.y = 2; // Start slightly higher

        // Add a trail
        const trailGeo = new THREE.ConeGeometry(0.4, 1.5, 8);
        trailGeo.rotateX(Math.PI / 2);
        const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 }));
        trail.position.z = -0.8;
        orb.add(trail);

        scene.add(orb);
        orb.lookAt(end);

        // CAMERA HACK: Switch target to the fireball
        let previousTarget = cameraTarget;
        if (trackCamera) {
            cameraTarget = orb;
            isZoomed = true;
        }

        // Calculate Duration based on distance (so it doesn't fly too fast)
        const dist = start.distanceTo(end);
        const duration = Math.min(1500, Math.max(600, dist * 30));

        new TWEEN.Tween(orb.position)
            .to({ x: end.x, y: end.y + 0.5, z: end.z }, duration) // Arc end point slightly up
            .easing(TWEEN.Easing.Quadratic.In) // Accelerate into target
            .onUpdate(() => {
                if (trackCamera) {
                    // Keep camera strictly focused
                    camera.lookAt(orb.position);
                }
            })
            .onComplete(() => {
                scene.remove(orb);

                // Trigger Impact Effect
                if (onHitType === 'magical') this.magicalExplosion(end, color);
                else if (onHitType === 'explode') this.explode(end, color);
                else if (onHitType === 'sparkle') this.sparkle(end, color);

                // CAMERA RESET
                if (trackCamera) {
                    // Snap back to the active player or original target
                    const p = players[turnIndex];
                    cameraTarget = (p && p.mesh) ? p.mesh : previousTarget;
                }
            })
            .start();
    },

    // --- CUSTOM ANCIENT VFX ---
    firewaveBurst: function (pos) {
        // 1. Camera Zoom Out Effect
        const originalZoom = camera.zoom;
        new TWEEN.Tween(camera)
            .to({ zoom: 0.5 }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .yoyo(true)
            .repeat(1)
            .onUpdate(() => camera.updateProjectionMatrix())
            .start();

        // 2. Expanding Ring of Fire
        const ringGeo = new THREE.RingGeometry(0.5, 1, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff4500, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.position.y += 0.5;
        ring.rotation.x = -Math.PI / 2;
        scene.add(ring);

        new TWEEN.Tween(ring.scale)
            .to({ x: 50, y: 50 }, 2000) // Huge expansion covering board
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

        new TWEEN.Tween(ring.material)
            .to({ opacity: 0 }, 2000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => scene.remove(ring))
            .start();

        // 3. Screen Shake
        const controls = { x: camera.position.x, Shake: 0 };
        const shakeTween = new TWEEN.Tween(controls)
            .to({ Shake: 10 }, 500)
            .onUpdate(() => {
                camera.position.x += (Math.random() - 0.5) * 0.5;
                camera.position.z += (Math.random() - 0.5) * 0.5;
            })
            .yoyo(true)
            .repeat(1)
            .start();
    },

    // --- METEOR STRIKE VFX ---
    meteorFall: function (pos, color) {
        // 1. Giant Sphere Fall
        const meteor = new THREE.Mesh(
            new THREE.DodecahedronGeometry(1.5, 0),
            new THREE.MeshStandardMaterial({ color: 0x331111, emissive: 0xff4500, emissiveIntensity: 2, roughness: 0.8 })
        );
        const startY = 30;
        meteor.position.set(pos.x, startY, pos.z);
        scene.add(meteor);

        // Trail
        const trail = new THREE.Mesh(
            new THREE.ConeGeometry(1, 8, 16),
            new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.6 })
        );
        trail.geometry.translate(0, 4, 0);
        trail.rotation.x = Math.PI;
        meteor.add(trail);

        new TWEEN.Tween(meteor.position)
            .to({ y: 0.5 }, 800)
            .easing(TWEEN.Easing.Cubic.In)
            .onUpdate(() => {
                meteor.rotation.x += 0.1;
                meteor.rotation.y += 0.2;
            })
            .onComplete(() => {
                scene.remove(meteor);
                this.magicalExplosion(pos, 0xff4500); // reuse explosion
                this.trigger('shockwave', pos, null, 0xff4500);
            })
            .start();
    },

    // --- NEW COOL EXPLOSION ---
    magicalExplosion: function (pos, color) {
        // 1. Flash of Light
        const light = new THREE.PointLight(color, 10, 15);
        light.position.set(pos.x, 2, pos.z);
        scene.add(light);
        new TWEEN.Tween(light).to({ intensity: 0 }, 600).onComplete(() => scene.remove(light)).start();

        // 2. Expanding Shockwave Ring
        const ringGeo = new THREE.TorusGeometry(0.1, 0.2, 8, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(pos.x, 0.5, pos.z);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        new TWEEN.Tween(ring.scale).to({ x: 15, y: 15 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(ring.material).to({ opacity: 0 }, 600).onComplete(() => scene.remove(ring)).start();

        // 3. Debris Particles
        this.spawnParticles(pos, color, 30, 2); // Increased count and speed
        this.spawnParticles(pos, 0xffaa00, 15, 1.5); // Secondary fire color

        // 4. Screen Shake (Simulated by small camera jitter if zoomed)
        if (isZoomed) {
            new TWEEN.Tween(camera.position)
                .to({ x: camera.position.x + 0.5 }, 50).yoyo(true).repeat(3).start();
        }
    },

    // --- EXISTING FX (Preserved) ---
    lightningBolt: function (pos) {
        const h = 40;
        const geo = new THREE.CylinderGeometry(0.5, 0.5, h, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
        const bolt = new THREE.Mesh(geo, mat);
        bolt.position.set(pos.x, h / 2, pos.z);
        scene.add(bolt);
        const light = new THREE.PointLight(0xaaddff, 5, 20);
        light.position.set(pos.x, 2, pos.z);
        scene.add(light);
        new TWEEN.Tween(mat).to({ opacity: 0 }, 600).onComplete(() => { scene.remove(bolt); scene.remove(light); }).start();
        new TWEEN.Tween(bolt.scale).to({ x: 4, z: 4 }, 600).start();
        this.explode(pos, 0xffff00);
    },

    burstUp: function (pos, color) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 5, 8), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 }));
        cone.position.set(pos.x, 0, pos.z);
        scene.add(cone);
        new TWEEN.Tween(cone.position).to({ y: 4 }, 400).onComplete(() => scene.remove(cone)).start();
        new TWEEN.Tween(cone.material).to({ opacity: 0 }, 400).start();
        this.sparkle(pos, color);
    },

    shockwave: function (pos, color) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 1, 32), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(pos.x, 0.2, pos.z);
        scene.add(ring);
        new TWEEN.Tween(ring.scale).to({ x: 6, y: 6 }, 600).onComplete(() => scene.remove(ring)).start();
        new TWEEN.Tween(ring.material).to({ opacity: 0 }, 600).start();
    },

    implode: function (pos, color) {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(4), new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true }));
        sphere.position.copy(pos);
        scene.add(sphere);
        new TWEEN.Tween(sphere.scale).to({ x: 0.01, y: 0.01, z: 0.01 }, 400).onComplete(() => scene.remove(sphere)).start();
    },

    spiralUp: function (pos, color) {
        const count = 30;
        const geom = new THREE.BufferGeometry();
        const positions = [];
        for (let i = 0; i < count; i++) positions.push(pos.x, pos.y, pos.z);
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const pts = new THREE.Points(geom, new THREE.PointsMaterial({ color: color, size: 0.4 }));
        scene.add(pts);
        let f = 0;
        const anim = () => {
            f += 0.15;
            const arr = pts.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                const angle = f + (i * 0.5);
                arr[i * 3] = pos.x + Math.cos(angle) * 1.5;
                arr[i * 3 + 1] += 0.1;
                arr[i * 3 + 2] = pos.z + Math.sin(angle) * 1.5;
            }
            pts.geometry.attributes.position.needsUpdate = true;
            if (f < 8) requestAnimationFrame(anim); else scene.remove(pts);
        };
        anim();
    },

    explode: function (pos, color) { this.spawnParticles(pos, color, 20, 1); },
    sparkle: function (pos, color) { this.spawnParticles(pos, color, 10, 0.2); },
    cloud: function (pos, color) { this.spawnParticles(pos, color, 30, 0.5, true); },

    spawnParticles: function (pos, color, count, speed, isCloud = false) {
        const geom = new THREE.BufferGeometry();
        const positions = [];
        const vels = [];
        for (let i = 0; i < count; i++) {
            positions.push(pos.x, pos.y + 1, pos.z);
            vels.push((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed + (isCloud ? 0.1 : 0.5), (Math.random() - 0.5) * speed);
        }
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: color, size: 0.5, transparent: true });
        const sys = new THREE.Points(geom, mat);
        scene.add(sys);
        let life = 1.0;
        const tick = () => {
            life -= 0.03;
            const arr = sys.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                arr[i * 3] += vels[i * 3];
                arr[i * 3 + 1] += vels[i * 3 + 1];
                arr[i * 3 + 2] += vels[i * 3 + 2];
            }
            sys.geometry.attributes.position.needsUpdate = true;
            mat.opacity = life;
            if (life > 0) requestAnimationFrame(tick); else scene.remove(sys);
        };
        tick();
    },

    pillarLight: function (pos, color) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 20, 16), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
        cyl.position.set(pos.x, 10, pos.z);
        scene.add(cyl);
        new TWEEN.Tween(cyl.scale).to({ x: 0, z: 0 }, 800).onComplete(() => scene.remove(cyl)).start();
        new TWEEN.Tween(cyl.material).to({ opacity: 0 }, 800).start();
    }
};

// Helper function for Mana Surge mechanic
function applyManaSurge(baseDamage, player) {
    const manaSurgeChance = player.stats.manaSurge || 0;
    const roll = Math.random() * 100;

    if (roll < manaSurgeChance) {
        const finalDamage = baseDamage * 3;
        logBattleAction(`⚡ <span style="color:#a855f7">MANA SURGE!</span> Triple Damage! (${finalDamage} instead of ${baseDamage})`);
        return finalDamage;
    }
    return baseDamage;
}

// Helper for Shadow  Strike (used by both AI and Human players)
function executeShadowStrike(p, target) {
    VFX.trigger('implode', p.mesh.position, null, 0x000000);
    const amt = Math.min(100, target.gold);
    target.gold -= amt;
    p.gold += amt;
    target.shadowStrikeDebuff = true;
    addLog(`${p.name} Shadow Strikes ${target.name}! Stole ${amt}G.`, "log-epic");
    if (isMultiplayer && db && gameId) {
        db.ref(`games/${gameId}/players/${p.id}/pos`).set(target.pos);
        db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: target.pos, timestamp: firebase.database.ServerValue.TIMESTAMP });
    } else {
        p.pos = target.pos;
        gameState = 'MOVING';
        animateTeleport(p, tiles[target.pos], () => { resolveLanding(p); });
    }
    p.classSkillDepleted = true;
    updateHUD();
}

const ABILITY_LIBRARY = {
    // ================= FIGHTER SKILLS =================
    power_strike: {
        name: "Power Strike",
        desc: "Overworld: +5 STR (1 Turn) | Battle: +3 Automatic STR Successes.",
        fn: (p) => {
            VFX.trigger('buff', p.mesh.position, null, 0xff0000); // Visuals + Sound (buff case triggers spiralUp + audio)
            p.tempBonuses.str += 5; // Overworld: +5 STR Stat
            addLog("Power Strike! +5 STR this turn.", "log-success");
            return true;
        },
        dungeonFn: (battle) => {
            if (!battle.player.tempBonuses.autoSuccesses) battle.player.tempBonuses.autoSuccesses = { str: 0, dex: 0, int: 0 };
            battle.player.tempBonuses.autoSuccesses.str += 3;
            playBattleAnim('buff', 'player');
            logBattleAction(`Power Strike! Gained +3 STR Successes.`);
            updateBattleUI();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_3599509de5064815a86ecbae3f9979da~mv2.jpeg"
    },
    intimidate: {
        name: "Intimidate",
        desc: "Overworld: Steal 50G from random player | Battle: Enemies roll -1 Die next turn.",
        fn: (p) => {
            const targets = players.filter(t => t.id !== p.id && !t.isDead);
            if (targets.length > 0) {
                const t = targets[Math.floor(Math.random() * targets.length)];
                VFX.trigger('shockwave', p.mesh.position, null, 0x000000);
                addLog(`${p.name} intimidates ${t.name}!`, "log-accent");
                pay(t, 50, p); return true;
            } return false;
        },
        dungeonFn: (battle) => {
            battle.opponents.forEach(op => {
                if (!op.debuffs) op.debuffs = {};
                op.debuffs.dicePenalty = 1;
            });
            logBattleAction(`Intimidated! Enemies weaker next turn.`);
            showFloatingText("FEAR", "block-popup", true);
            updateBattleUI();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_29cbfcb090ef4fc782dcf43faa34fcc4~mv2.jpeg"
    },
    second_wind: {
        name: "Second Wind",
        desc: "Overworld: Gain 150G | Battle: Heal 15 HP immediately.",
        fn: (p) => {
            VFX.trigger('spiral_up', p.mesh.position, null, 0x00ff00);
            p.gold += 150;
            addLog("Second Wind: +150G", "log-gold");
            return true;
        },
        dungeonFn: (battle) => {
            const heal = 15;
            battle.pHp = Math.min(battle.pMaxHp, battle.pHp + heal);
            playBattleAnim('heal', 'player');
            logBattleAction(`Second Wind! Healed ${heal} HP.`);
            showFloatingText(`+${heal}`, "heal-popup", "player");
            updateBattleUI();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_3a036a923c5945778d3b8393634892b1~mv2.jpeg"
    },
    shield_bash: {
        name: "Shield Bash",
        desc: "Overworld: Stun Rnd Player | Battle: 3 DMG + Gain 2 'Wild' Successes.",
        fn: (p) => {
            const targets = players.filter(t => t.id !== p.id && !t.isDead);
            if (targets.length) {
                const t = targets[Math.floor(Math.random() * targets.length)];
                t.isSkipping = true;
                VFX.trigger('implode', t.mesh.position, null, 0x888888);
                addLog(`Shield Bash stunned ${t.name}!`, "log-epic");
                return true;
            } return false;
        },
        dungeonFn: (battle) => {
            const target = battle.opponents[battle.targetIndex];
            if (!target || target.dead) return false;
            target.hp -= 3;
            if (!battle.player.tempBonuses.genericSuccess) battle.player.tempBonuses.genericSuccess = 0;
            battle.player.tempBonuses.genericSuccess += 2;
            playBattleAnim('buff', 'player');
            logBattleAction(`Shield Bash! +2 Successes to your choice.`);
            updateBattleUI();
            // Basic Win Check
            if (target.hp <= 0) {
                target.hp = 0;
                logBattleAction(`${target.name} was defeated by Shield Bash!`);
                // Note: Full victory check should be in updateBattleUI or called explicitly
            }
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_d1f5ad06cfd64c688e68edd726ff65ae~mv2.jpg"
    },
    rally: {
        name: "Rally",
        desc: "Overworld & Battle: +2 Dice to ALL stats this turn.",
        fn: (p) => {
            p.tempBonuses.str += 2; p.tempBonuses.dex += 2; p.tempBonuses.int += 2;
            VFX.trigger('pillar', p.mesh.position, null, 0xffd700);
            addLog("Rally: All stats boosted!", "log-success");
            return true;
        },
        dungeonFn: (battle) => {
            if (!battle.player.tempBonuses.dice) battle.player.tempBonuses.dice = { str: 0, dex: 0, int: 0 };
            battle.player.tempBonuses.dice.str += 2;
            battle.player.tempBonuses.dice.dex += 2;
            battle.player.tempBonuses.dice.int += 2;
            playBattleAnim('buff', 'player');
            logBattleAction("Rally! +2 Dice to ALL stats.");
            updateBattleUI();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_362057d2967143caacaea96b6def582f~mv2.jpg"
    },
    siege_breaker: {
        name: "Siege Breaker",
        desc: "Overworld Only: Capture ANY land you land on (Ignore Guard).",
        fn: (p) => {
            // Passive/Active trigger logic handled in resolveLanding usually, but if Active:
            addLog("Siege Breaker active for next land!", "log-rare");
            p.nextLandAutoCapture = true;
            return true;
        },
        dungeonFn: null, // Not a battle skill
        img: "https://static.wixstatic.com/media/b16479_6274cb33103f496d958019147a605599~mv2.jpeg"
    },

    // ================= WIZARD SKILLS =================
    fireball: {
        name: "Fireball",
        desc: "Overworld: Destroy Land (100G) | Battle: 8 DMG Target + 4 Splash.",
        fn: (p) => {
            if (p.gold < 100) return false;

            // Find valid targets (Owned by others)
            const ts = tiles.filter(t => t.userData.owner !== null && String(t.userData.owner) !== String(p.id));

            if (ts.length) {
                p.gold -= 100;
                const t = ts[Math.floor(Math.random() * ts.length)];

                // 1. Visual Projectile
                VFX.trigger('fireball', p.mesh.position, t.position);

                // 2. Logic Delay (Wait for impact)
                setTimeout(() => {
                    let guards = t.userData.guardCount || 0;

                    // --- CALC NEW STATE ---
                    if (guards > 0) {
                        t.userData.guardCount--;
                        globalLog(`Fireball hit ${t.userData.info.name} !A Guard was killed.`, "log-warning");
                    } else {
                        if (t.userData.buildingLevel > 1) {
                            t.userData.buildingLevel = 1;
                            globalLog(`Fireball scorched ${t.userData.info.name} !Downgraded to Camp.`, "log-epic");
                        } else {
                            t.userData.owner = null;
                            t.userData.buildingLevel = 0;
                            t.userData.guardCount = 0;
                            globalLog(`Fireball incinerated ${t.userData.info.name} !`, "log-epic");
                        }
                    }

                    // --- APPLY CHANGES ---
                    if (isMultiplayer) {
                        db.ref(`games/${gameId}/board/${t.userData.id}`).update({
                            owner: t.userData.owner,
                            level: t.userData.buildingLevel,
                            guardCount: t.userData.guardCount || 0
                        });
                        syncPlayerState();
                    } else {
                        const ownerObj = players.find(pl => pl.id === t.userData.owner);
                        applyCaptureVisuals(t, ownerObj, t.userData.buildingLevel);
                        updateHUD();
                    }

                    // --- SPLASH DAMAGE ---
                    const victims = players.filter(v => v.pos === t.userData.id && !v.isDead && v.id !== p.id && !v.isEventEntity);
                    victims.forEach(v => {
                        v.gold = Math.max(0, v.gold - 100);
                        addLog(`${v.name} caught in the blast! Lost 100G.`, "log-fail");
                        if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/players/${v.id}/gold`).set(v.gold);
                    });

                }, 1200);

                return true;
            }
            addLog("No enemy properties to target!", "log-fail");
            return false;
        },
        dungeonFn: (battle) => {
            // Fireball: Direct Damage (Bypasses Dice Clash)
            playBattleAnim('fireball', 'all-enemies');
            battle.opponents.forEach(op => {
                if (!op.dead) {
                    const isTarget = (op === battle.opponents[battle.targetIndex]);
                    const dmg = isTarget ? 8 : 4;
                    op.hp -= dmg;
                    if (op.hp <= 0) { op.hp = 0; logBattleAction(`${op.name} was incinerated by Fireball!`); }
                }
            });
            logBattleAction(`Fireball! Scorched the battlefield.`);
            showFloatingText("AOE", "damage-popup", false);
            updateBattleUI();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_29ff412f99834658ac8d32d32e16849a~mv2.jpg"
    },
    transmute_gold: {
        name: "Transmute",
        desc: "Overworld: Item -> Treasure (50G) | Battle: 20 Direct DMG (Pay 20G).",
        fn: (p) => {
            // 1. Check Gold
            if (p.gold < 50) {
                addLog("Need 50 Gold to Transmute!", "log-fail");
                return false;
            }

            // 2. Identify valid targets (Inventory items)
            const targets = p.inventory.map((item, index) => ({ item, index }));

            if (targets.length === 0) {
                addLog("Nothing to transmute!", "log-fail");
                return false;
            }

            // 3. Open Picker Modal
            const m = document.getElementById('card-modal');
            document.getElementById('enc-title').innerText = "Transmute (Cost: 50G)";
            document.getElementById('enc-desc').innerText = "Select an item to transform into Treasure:";
            document.getElementById('enc-header').className = 'card-header';

            const l = document.getElementById('choice-list');
            l.innerHTML = '';
            document.getElementById('dice-result').innerHTML = '';
            document.getElementById('market-sell-area').style.display = 'none';

            targets.forEach(t => {
                let b = document.createElement('div');
                b.className = 'choice-btn';
                // Show Rarity Color
                const rarityColor = (t.item.rarity === 'legendary') ? '#ff4500' : (t.item.rarity === 'epic') ? '#a335ee' : (t.item.rarity === 'rare') ? '#0070dd' : '#9d9d9d';
                b.style.borderLeft = `5px solid ${rarityColor}`;
                b.innerText = t.item.name;

                b.onclick = () => {
                    m.classList.remove('active');

                    if (p.gold < 50) { addLog("Not enough gold!", "log-fail"); return; }
                    p.gold -= 50;

                    const itemToRemove = p.inventory[t.index];
                    if (itemToRemove !== t.item) {
                        addLog("Transmute Failed (Index Shift)", "log-fail");
                        return;
                    }

                    p.inventory.splice(t.index, 1);

                    const newItem = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);
                    p.inventory.push(newItem);

                    VFX.trigger('pillar', p.mesh.position, null, 0xffd700);
                    addLog(`Transmuted ${t.item.name} into ${newItem.name}! (-50G)`, "log-gold");
                    AUDIO.playSound('sfx_magic');

                    updateHUD();
                    if (typeof isMultiplayer !== 'undefined' && isMultiplayer) syncPlayerState();
                };
                l.appendChild(b);
            });

            let c = document.createElement('div');
            c.className = 'choice-btn';
            c.innerText = "Cancel";
            c.onclick = () => { m.classList.remove('active'); };
            l.appendChild(c);

            m.classList.add('active');
            return true;
        },
        dungeonFn: (battle) => {
            const target = battle.opponents[battle.targetIndex];
            if (!target || target.dead) return false;

            if (battle.player.gold >= 20) {
                battle.player.gold -= 20;
                target.hp -= 20; // Massive Direct Damage
                playBattleAnim('buff', 'player');
                setTimeout(() => playBattleAnim('hit', 'enemy'), 300);
                logBattleAction(`Transmute! Deals 20 Direct DMG.`);
                updateHUD();
                return true;
            } else {
                logBattleAction(`Not enough Gold (20G).`);
                return false;
            }
        },
        img: "https://static.wixstatic.com/media/b16479_765369c1c1bd4a8abb1b752a2245f56c~mv2.jpg"
    },
    blink: {
        name: "Blink",
        desc: "Overworld: Move 1-6 spaces | Battle: Dodge 100% of next attack.",
        fn: (p) => {
            VFX.trigger('implode', p.mesh.position, null, 0x00ffff);
            const d = Math.floor(Math.random() * 6) + 1;
            addLog(`Blinked ${d} spaces!`, "log-rare");

            if (isMultiplayer && gameId) {
                db.ref(`games/${gameId}/moveHistory`).push({
                    pid: p.id, d1: d, d2: 0, finalSteps: d, startPos: p.pos,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                animateMove(p, d);
            }
            return true;
        },
        dungeonFn: (battle) => {
            battle.playerDodging = true;
            playBattleAnim('vanish', 'player');
            logBattleAction(`Blink! You will take 0 Damage this turn.`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_ead02548bf264a2eb097464789b65b11~mv2.jpg"
    },
    time_warp: {
        name: "Time Warp",
        desc: "Overworld & Battle: Chance for Extra Turn.",
        fn: (p) => {
            VFX.trigger('spiral_up', p.mesh.position, null, 0x800080);
            const r = Math.floor(Math.random() * 6) + 1;
            if (r > 4) { addLog(`Time Warp [${r}]: SUCCESS!`, "log-epic"); p.extraTurn = true; if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_win'); }
            else { addLog(`Time Warp [${r}]: Failed.`, "log-fail"); if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_fail'); }
            return true;
        },
        dungeonFn: (battle) => {
            const r = Math.floor(Math.random() * 6) + 1;
            if (r >= 5) {
                battle.extraTurn = true;
                logBattleAction(`Time Warp SUCCESS! Take another action.`);
                playBattleAnim('spiral_up', 'player');
            } else {
                logBattleAction(`Time Warp Failed (${r}).`);
            }
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_8dc7a78f86354f4b8c7617155971f54d~mv2.jpg"
    },
    polymorph: {
        name: "Polymorph",
        desc: "Overworld: Turn Player into Sheep | Battle: Enemy rolls 0 Dice.",
        fn: (p) => {
            const targets = players.filter(x => x.id !== p.id && !x.isDead && !x.isBoss && !x.isEventEntity);
            if (targets.length > 0) {
                const t = targets[Math.floor(Math.random() * targets.length)];
                // 1. Hijack Camera Focus
                const previousCameraTarget = cameraTarget;
                cameraTarget = t.mesh;
                isZoomed = true;

                // Animate Camera
                const zoomOffset = { x: 0, y: 15, z: 12 };
                new TWEEN.Tween(camera.position)
                    .to({ x: t.mesh.position.x + zoomOffset.x, y: zoomOffset.y, z: t.mesh.position.z + zoomOffset.z }, 800)
                    .easing(TWEEN.Easing.Quadratic.Out).start();

                // 2. Play "Freaked Out" Animation
                new TWEEN.Tween(t.mesh.position).to({ y: 3 }, 400).yoyo(true).repeat(1).start();
                new TWEEN.Tween(t.mesh.rotation).to({ y: t.mesh.rotation.y + (Math.PI * 8) }, 800)
                    .onComplete(() => {
                        VFX.trigger('smoke', t.mesh.position);
                        makeSheep(t);
                        cameraTarget = t.mesh;
                        addLog(`${p.name} turned ${t.name} into a sheep!`, "log-epic");
                        if (isMultiplayer && db && gameId) db.ref(`games/${gameId}/players/${t.id}`).update({ isPolymorphed: true });

                        setTimeout(() => {
                            cameraTarget = (p.mesh) ? p.mesh : previousCameraTarget;
                            const stdOffset = { x: 0, y: 22, z: 18 };
                            new TWEEN.Tween(camera.position)
                                .to({ x: p.mesh.position.x + stdOffset.x, y: stdOffset.y, z: p.mesh.position.z + stdOffset.z }, 1000)
                                .easing(TWEEN.Easing.Quadratic.Out).start();
                        }, 1500);
                    }).start();
                return true;
            }
            addLog("No valid targets.", "log-fail");
            return false;
        },
        dungeonFn: (battle) => {
            battle.opponents.forEach(op => {
                if (!op.debuffs) op.debuffs = {};
                op.debuffs.poly = true;
            });
            logBattleAction(`Polymorph! Enemy is a sheep (Min Dice).`);
            playBattleAnim('puff', 'all-enemies');
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_fbec81995dd34d0ebeb4b837d2e26b8d~mv2.jpg"
    },
    arcane_eye: {
        name: "Arcane Eye",
        desc: "Overworld: Teleport to Chest | Dungeon: Reveal Enemy Choice.",
        fn: (p) => {
            const chest = tiles.find(t => t.userData.info.type === 'chest');
            if (chest) {
                VFX.trigger('implode', p.mesh.position, null, 0x0000ff);
                addLog("Arcane Eye reveals treasure!", "log-rare");
                if (isMultiplayer && db && gameId) {
                    db.ref(`games/${gameId}/players/${p.id}/pos`).set(chest.userData.id);
                    db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: chest.userData.id, timestamp: firebase.database.ServerValue.TIMESTAMP });
                } else {
                    p.pos = chest.userData.id;
                    gameState = 'MOVING';
                    animateTeleport(p, chest, () => { resolveLanding(p); });
                }
                return true;
            } return false;
        },
        dungeonFn: (battle) => {
            battle.revealEnemy = true;
            logBattleAction(`Arcane Eye! You foresee the enemy's move.`);
            playBattleAnim('eye_glow', 'player');
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_2605208fcc3946a5b0373ea5fabeacc4~mv2.jpg"
    },

    // ================= ROGUE SKILLS =================
    pickpocket: {
        name: "Pickpocket",
        desc: "Overworld: Steal Gold (Prop Based) | Battle: Steal 10-60 Gold.",
        fn: (p) => {
            // 1. Find valid targets (Not me, not dead)
            const targets = players.filter(x => x.id !== p.id && !x.isDead);

            if (targets.length > 0) {
                // 2. Sort by Property Count (Descending)
                targets.sort((a, b) => {
                    const countA = tiles.filter(tile => tile.userData.owner === a.id).length;
                    const countB = tiles.filter(tile => tile.userData.owner === b.id).length;
                    return countB - countA; // Highest first
                });

                const t = targets[0]; // The Leader

                // --- FIX: VISUAL DIRECTION ---
                // We pass (Player, Target) so the engine renders it moving Target -> Player
                VFX.trigger('projectile_coin', p.mesh.position, t.mesh.position);
                // -----------------------------

                // Calculate theft
                const propCount = tiles.filter(l => l.userData.owner === t.id).length;
                const amt = Math.min(t.gold, propCount * 10);

                t.gold -= amt;
                p.gold += amt;

                addLog(`Pickpocketed ${amt}G from ${t.name} (Has ${propCount} lands).`, "log-gold");

                // Sync if MP
                if (typeof isMultiplayer !== 'undefined' && isMultiplayer) syncPlayerState();
                return true;
            }
            return false;
        },
        dungeonFn: (battle) => {
            // Pickpocket: Steal Gold (No Combat Advantage)
            const loot = Math.floor(Math.random() * 50) + 10;
            battle.player.gold += loot;
            logBattleAction(`Pickpocket! Stole ${loot}G from the enemy pockets.`);
            showFloatingText(`+${loot}G`, "gold-popup", "player");
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_13ee3ae3151c40f58f7152857c4d97ff~mv2.jpg"
    },
    sprint_act: {
        name: "Sprint",
        desc: "Overworld: Move 3 spaces | Battle: +5 DEX Dice.",
        fn: (p) => {
            VFX.trigger('burst_up', p.mesh.position, null, 0x00ff00);
            if (typeof isMultiplayer !== 'undefined' && isMultiplayer && gameId) {
                db.ref(`games/${gameId}/moveHistory`).push({
                    pid: p.id, d1: 3, d2: 0, finalSteps: 3, startPos: p.pos,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                animateMove(p, 3);
            }
            return true;
        },
        dungeonFn: (battle) => {
            if (!battle.player.tempBonuses.dice) battle.player.tempBonuses.dice = { str: 0, dex: 0, int: 0 };
            battle.player.tempBonuses.dice.dex += 5;
            playBattleAnim('buff', 'player');
            logBattleAction(`Sprint! Gained +5 DEX Dice this turn.`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_2a97d38d75f14a7c96eb980178f1bdf6~mv2.jpg"
    },
    smoke_bomb_act: {
        name: "Smoke Bomb",
        desc: "Overworld: Teleport to Random Space | Battle: Enemy -3 Dice.",
        fn: (p) => {
            VFX.trigger('smoke', p.mesh.position);
            const r = Math.floor(Math.random() * 40);
            addLog("Vanished in smoke!", "log-rare");
            if (isMultiplayer && db && gameId) {
                db.ref(`games/${gameId}/players/${p.id}/pos`).set(r);
                db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: r, timestamp: firebase.database.ServerValue.TIMESTAMP });
            } else {
                p.pos = r;
                animateTeleport(p, tiles[r], () => { resolveLanding(p) });
            }
            return true;
        },
        dungeonFn: (battle) => {
            battle.opponents.forEach(op => {
                if (!op.debuffs) op.debuffs = {};
                op.debuffs.dicePenalty = (op.debuffs.dicePenalty || 0) + 3;
            });
            playBattleAnim('smoke', 'all-enemies');
            logBattleAction(`Smoke Bomb! Enemy vision obscured (-3 Dice).`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_52fd1419066648ea9c70d6529472aef3~mv2.jpg"
    },
    sabotage: {
        name: "Sabotage",
        desc: "Overworld: Downgrade Tavern | Battle: Traps (-2 Enemy Successes).",
        fn: (p) => {
            const targets = tiles.filter(t => t.userData.buildingLevel === 2 && t.userData.owner !== null && String(t.userData.owner) !== String(p.id));
            if (targets.length === 0) {
                addLog("No Taverns found to sabotage.", "log-fail");
                return false;
            }
            const m = document.getElementById('card-modal');
            document.getElementById('enc-title').innerText = "Sabotage Target";
            document.getElementById('enc-desc').innerText = "Select a Tavern to burn down:";
            document.getElementById('enc-header').className = 'card-header skirmish';
            const l = document.getElementById('choice-list');
            l.innerHTML = '';
            document.getElementById('dice-result').innerHTML = '';
            document.getElementById('market-sell-area').style.display = 'none';

            targets.forEach(t => {
                const owner = players.find(pl => String(pl.id) === String(t.userData.owner));
                const ownerName = owner ? owner.name : "Unknown";
                const propName = t.userData.info.name;
                const value = t.userData.info.cost || 0;
                let b = document.createElement('div');
                b.className = 'choice-btn';
                b.style.display = "flex";
                b.style.justifyContent = "space-between";
                b.innerHTML = `<span>${propName} <small style="color:#aaa">(${ownerName})</small></span><span style="color:var(--gold-main)">${value}G</span>`;
                b.onclick = () => {
                    m.classList.remove('active');
                    VFX.trigger('fireball', p.mesh.position, t.position);
                    setTimeout(() => {
                        t.userData.buildingLevel = 1;
                        t.userData.guardCount = 0;
                        addLog(`Sabotaged ${propName}! Downgraded to Camp.`, "log-epic");
                        if (owner) applyCaptureVisuals(t, owner, 1);
                        if (typeof isMultiplayer !== 'undefined' && isMultiplayer) {
                            db.ref(`games/${gameId}/board/${t.userData.id}`).update({ level: 1, guardCount: 0 });
                            syncPlayerState();
                        }
                        p.classSkillDepleted = true;
                        updateHUD();
                    }, 1200);
                };
                l.appendChild(b);
            });
            let c = document.createElement('div');
            c.className = 'choice-btn';
            c.innerText = "Cancel";
            c.style.textAlign = "center";
            c.onclick = () => { m.classList.remove('active'); };
            l.appendChild(c);
            m.classList.add('active');
            return false;
        },
        dungeonFn: (battle) => {
            battle.opponents.forEach(op => {
                if (!op.debuffs) op.debuffs = {};
                op.debuffs.sabotage = 2; // Logic to remove 2 successes
            });
            logBattleAction(`Sabotage! Traps set (-2 Enemy Successes).`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_0de936527a24420a856fad92eab0835f~mv2.jpg"
    },
    gamble_act: {
        name: "Gamble",
        desc: "Overworld: 50% chance to win 200G (-50G) | Battle: Roll Luck (Buff or Nothing).",
        fn: (p) => { if (p.gold < 50) return false; p.gold -= 50; VFX.trigger('projectile_coin', p.mesh.position, p.mesh.position); if (Math.random() > 0.5) { p.gold += 200; addLog("Gamble won: +200G!", "log-gold"); } else { addLog("Gamble lost.", "log-fail"); } updateHUD(); return true; },
        dungeonFn: (battle) => {
            const r = Math.floor(Math.random() * 6) + 1;
            if (r >= 5) {
                if (!battle.player.tempBonuses.autoSuccesses) battle.player.tempBonuses.autoSuccesses = { str: 0, dex: 0, int: 0 };
                battle.player.tempBonuses.autoSuccesses.dex += 3;
                logBattleAction(`Gamble WON! +3 DEX Successes.`);
                playBattleAnim('buff', 'player');
            } else if (r <= 2) {
                logBattleAction(`Gamble LOST. Nothing happened.`);
            } else {
                logBattleAction(`Gamble... broke even.`);
            }
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_613c6b72c1984c8d93398e7f00ae2ee0~mv2.jpeg"
    },
    shadow_strike: {
        name: "Shadow Strike",
        desc: "Overworld: Teleport + Steal 100G | Battle: Deal x2 Damage this turn.",
        fn: (p) => {
            const enemies = players.filter(x => x.id !== p.id && !x.isDead && !x.isEventEntity);
            if (enemies.length === 0) return false;

            // AI: Auto-pick target, Human: Show picker
            if (p.isAi) {
                const target = enemies[Math.floor(Math.random() * enemies.length)];
                executeShadowStrike(p, target);
            } else {
                showPlayerPicker("Shadow Strike Target", enemies, (target) => {
                    executeShadowStrike(p, target);
                });
            }
            return false;
        },
        dungeonFn: (battle) => {
            battle.player.buffs.doubleDamage = true;
            playBattleAnim('vanish', 'player');
            logBattleAction(`Shadow Strike! Next attack deals Double Damage.`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_0b4efd14bb7c4103bbe7d434d6de7ff2~mv2.jpg"
    },

    // ================= CLERIC SKILLS =================
    heal_spell: {
        name: "Heal",
        desc: "Overworld: Clear Negative Status | Battle: Heal 15 HP.",
        fn: (p) => { VFX.trigger('spiral_up', p.mesh.position, null, 0x00ff00); if (p.isSkipping) { p.isSkipping = false; addLog("Healed status!", "log-success"); return true; } addLog("No status to heal.", "log-fail"); return false; },
        dungeonFn: (battle) => {
            const heal = 15;
            battle.pHp = Math.min(battle.pMaxHp, battle.pHp + heal);
            logBattleAction(`Heal! Restored ${heal} HP.`);
            playBattleAnim('buff', 'player');
            showFloatingText(`+${heal}`, "heal-popup", "player");
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_6fbb98ea84a9479b98dd0441fd7152b6~mv2.jpg",
    },
    smite: {
        name: "Smite",
        desc: "Overworld: Instant Capture/Upgrade Land | Battle: 5 DMG + Blind Enemy (-2 Dice).",
        fn: (p) => {
            const t = tiles[p.pos];
            if (t.userData.info.cost > 0) {
                VFX.trigger('lightning', null, t.position);
                let lvl = 1;
                let logMsg = "Smite: Land Conquered!";
                if (t.userData.owner === p.id && t.userData.buildingLevel === 1) {
                    lvl = 2;
                    logMsg = "Smite: Upgraded to Tavern!";
                }
                setTimeout(() => {
                    capture(t, p, lvl);
                    addLog(logMsg, "log-epic");
                }, 800);
                return true;
            }
            return false;
        },
        dungeonFn: (battle) => {
            const target = battle.opponents[battle.targetIndex];
            if (!target || target.dead) return false;
            target.hp -= 5;
            battle.opponents.forEach(op => {
                if (!op.debuffs) op.debuffs = {};
                op.debuffs.dicePenalty = (op.debuffs.dicePenalty || 0) + 2;
            });
            logBattleAction(`Smite! Dealt 5 DMG + Blinded Enemy.`);
            showFloatingText(`5`, "damage-popup", "monster");
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_de48e0494048408dbd67d6c2008aee28~mv2.jpg"
    },
    bless: {
        name: "Bless",
        desc: "Overworld: +5 INT Stat | Battle: +1 Auto Success to All Stats.",
        fn: (p) => {
            VFX.trigger('pillar', p.mesh.position, null, 0xffffff);
            p.tempBonuses.int += 5;
            addLog("Blessed!", "log-success");
            return true;
        },
        dungeonFn: (battle) => {
            if (!battle.player.tempBonuses.autoSuccesses) battle.player.tempBonuses.autoSuccesses = { str: 0, dex: 0, int: 0 };
            battle.player.tempBonuses.autoSuccesses.str += 1;
            battle.player.tempBonuses.autoSuccesses.dex += 1;
            battle.player.tempBonuses.autoSuccesses.int += 1;
            playBattleAnim('buff', 'player');
            logBattleAction(`Bless! +1 Auto Success to All Stats.`);
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_f3d43368e934422fbaa0f1d3c93a8e29~mv2.jpg"
    },
    divine_intervention: {
        name: "Intervention",
        desc: "Overworld: Roll 6 for 500G | Battle: 50% Chance for 50 DMG (Holy Beam).",
        fn: (p) => { VFX.trigger('pillar', p.mesh.position, null, 0xffffff); if (Math.floor(Math.random() * 6) + 1 === 6) { VFX.trigger('pillar', p.mesh.position, null, 0xffd700); p.gold += 500; addLog("Divine Gift: +500G!", "log-epic"); updateHUD(); return true; } addLog("Prayers unanswered.", "log-fail"); return true; },
        dungeonFn: (battle) => {
            const r = Math.random();
            if (r > 0.5) {
                const target = battle.opponents[battle.targetIndex];
                if (target && !target.dead) {
                    target.hp -= 50;
                    logBattleAction(`Divine Intervention! HOLY BEAM (50 DMG)!`);
                    playBattleAnim('pillar', 'monster');
                    showFloatingText(`50`, "damage-popup", "monster");
                }
            } else {
                logBattleAction(`Divine Intervention... went unheard.`);
            }
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_17b9cb42fac041e6ab622b3a45d6b3f0~mv2.jpg"
    },
    sanctuary: {
        name: "Sanctuary",
        desc: "Overworld: Place/Teleport Shrine | Battle: Immune to Damage this turn.",
        fn: (p) => {
            // --- 1. TELEPORT TO SHRINE (If active) ---
            if (p.sanctuaryPos !== undefined && p.sanctuaryPos !== null) {
                VFX.trigger('implode', p.mesh.position, null, 0xffff00);
                const target = tiles[p.sanctuaryPos];
                addLog("Returned to Sanctuary.", "log-success");

                if (isMultiplayer && db && gameId) {
                    db.ref(`games/${gameId}/players/${p.id}/pos`).set(p.sanctuaryPos);
                    db.ref(`games/${gameId}/teleportLog`).push({
                        pid: p.id,
                        targetPos: p.sanctuaryPos,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                    if (p.sanctuaryMesh) { scene.remove(p.sanctuaryMesh); p.sanctuaryMesh = null; }
                    p.sanctuaryPos = null;
                } else {
                    p.pos = p.sanctuaryPos;
                    gameState = 'MOVING';
                    animateTeleport(p, target, () => {
                        resolveLanding(p);
                        if (p.sanctuaryMesh) { scene.remove(p.sanctuaryMesh); p.sanctuaryMesh = null; }
                        p.sanctuaryPos = null;
                    });
                }
                updateHUD();
                return true;
            }
            // --- 2. PLACE SHRINE (If none exists) ---
            else {
                VFX.trigger('pillar', p.mesh.position, null, 0xffff00);
                p.sanctuaryPos = p.pos;
                p.sanctuaryMesh = createShrineMesh();
                p.sanctuaryMesh.position.copy(tiles[p.pos].position);
                scene.add(p.sanctuaryMesh);
                addLog("Sanctuary established!", "log-epic");

                if (isMultiplayer && db && gameId) {
                    db.ref(`games/${gameId}/players/${p.id}/sanctuaryPos`).set(p.sanctuaryPos);
                }
                return false;
            }
        },
        dungeonFn: (battle) => {
            battle.player.buffs.damageImmune = true;
            playBattleAnim('buff', 'player');
            logBattleAction(`Sanctuary! Immune to Damage this turn.`);
            showFloatingText(`IMMUNE`, "block-popup", "player");
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_f33f291487d64a468e9a05b3811a0a3d~mv2.jpg"
    },
    exorcism: {
        name: "Exorcism",
        desc: "Overworld: Destroy Enemy Gear | Battle: 30 DMG (Undead) / 10 DMG (Other).",
        fn: (p) => {
            const enemies = players.filter(x => x.id !== p.id && !x.isDead && !x.isEventEntity);
            if (enemies.length === 0) return false;
            showPlayerPicker("Exorcism Target", enemies, (target) => {
                VFX.trigger('shockwave', target.mesh.position, null, 0x00ffff);
                const slots = ['head', 'body', 'main', 'off'].filter(s => target.equipment[s]);
                if (slots.length > 0) {
                    const slot = slots[Math.floor(Math.random() * slots.length)];
                    const item = target.equipment[slot];
                    target.equipment[slot] = null;
                    addLog(`Exorcised ${item.name} from ${target.name}!`, "log-epic");
                } else {
                    target.gold = Math.max(0, target.gold - 20);
                    addLog(`${target.name} has no gear. Lost 20G.`, "log-fail");
                }
                updateHUD();
            });
            return true;
        },
        dungeonFn: (battle) => {
            const target = battle.opponents[battle.targetIndex];
            if (!target || target.dead) return false;
            let dmg = 10;
            if (target.name.toLowerCase().includes('undead') || target.name.toLowerCase().includes('vampire') || target.name.toLowerCase().includes('ghost') || target.name.toLowerCase().includes('skele')) {
                dmg = 30;
            }
            target.hp -= dmg;
            logBattleAction(`Exorcism! Dealt ${dmg} DMG.`);
            playBattleAnim('shockwave', 'monster');
            showFloatingText(`${dmg}`, "damage-popup", "monster");
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_fa1402ef5d59495c93b503d0284a6ee8~mv2.jpg"
    },

    // --- PASSIVES (Same) ---
    veteran: { name: "Veteran", desc: "Permanent +1 STR. 20% Discount at Merchants.", type: 'passive', effect: (s) => { s.str += 1; }, img: "https://static.wixstatic.com/media/b16479_9418e25969754a69a13b825cc2e70bbf~mv2.jpeg" },
    iron_skin: { name: "Iron Skin", desc: "Reduce all gold penalties by 20G.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_c3d88e0d6986494d914fd12047d258ca~mv2.jpeg" },
    executioner: { name: "Executioner", desc: "Rolling a 6 in combat counts as 2 Successes.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_cee24d678cfa47568f5f632c40743626~mv2.jpeg" },
    conqueror: { name: "Conqueror", desc: "Gain 20G every time you capture a location.", type: 'passive', onCapture: (p) => { p.gold += 20; addLog("Conqueror: +20G", "log-gold"); }, img: "https://static.wixstatic.com/media/b16479_9df1c28aa03e4660ab1943532691d406~mv2.jpg" },
    heavy_armor: { name: "Heavy Armor", desc: "You cannot be moved by enemy spells (Swap/Teleport).", type: 'passive', img: "https://static.wixstatic.com/media/b16479_8fd52084407e44d7b5d966aa2791e22e~mv2.jpg" },
    vanguard: {
        name: "Vanguard",
        desc: "Start the game with a Rare Sword.",
        type: 'passive',
        img: "https://static.wixstatic.com/media/b16479_de9b64e80d6745c2924fb58325d158e7~mv2.jpg",
        onStart: (p) => {
            const sword = {
                id: `vanguard_sword_${p.id}`,
                name: "Vanguard's Blade",
                slot: "main",
                type: 'equip',
                rarity: 'rare',
                cost: 500,
                img: ITEM_IMAGE_POOLS["Vanguard Blade"] ? ITEM_IMAGE_POOLS["Vanguard Blade"][0] : "https://static.wixstatic.com/media/b16479_d3d946b739b6400286978a0d39388900~mv2.png",
                bonus: { str: 2 },
                ability: null
            };
            // Auto-equip if slot empty (should be true at start)
            p.equipment.main = sword;
            addLog("Vanguard: Equipped Rare Sword", "log-success");
        }
    },
    scholar: {
        name: "Scholar",
        desc: "Permanent +1 INT. Pick a 2nd Active Skill (Slot 6).", // UPDATED
        type: 'passive',
        effect: (s) => { s.int += 1; },
        img: "https://static.wixstatic.com/media/b16479_dde7a886c214487e9142449b77ae86f0~mv2.jpg"
    },
    court_mage: { name: "Court Mage", desc: "Immune to Tax. Gain 10G when others pay Tax.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_60838e488fae4e7e896c8cfe64f5bc03~mv2.jpg" },
    alchemist_pas: { name: "Alchemist", desc: "Pouch of Gold creates extra treasure.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_e0bd1a01c0b344f086778fea802be2ca~mv2.jpg" },
    mana_shield: { name: "Mana Shield", desc: "If you would go bankrupt, lose 1 Item instead.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_bf689c6c7bd640c9910b56a8c1d7eeba~mv2.jpg" },
    leyline: { name: "Leyline Walker", desc: "Start at Mana Well. Gain 200G passing it.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_2fabcde5520b41899bf6b28a8824d4f3~mv2.jpg" },
    elemental_attune: { name: "Attunement", desc: "+1 INT for every 500G you hold.", type: 'passive', effect: (s, p) => { const bonus = Math.floor(p.gold / 500); if (bonus > 0) s.int += bonus; }, img: "https://static.wixstatic.com/media/b16479_54c9849377094313a2bc102fe77c038b~mv2.jpg" },
    shadow_step: {
        name: "Shadow Step",
        desc: "Permanent +1 DEX and +1 Movement to rolls.",
        type: 'passive',
        // We only add DEX here. RecalcStats will handle the Movement part.
        effect: (s) => { s.dex += 1; },
        img: "https://static.wixstatic.com/media/b16479_923e7271de194ba69a6d2243650e2c41~mv2.jpg"
    },
    greedy: {
        name: "Greed",
        desc: "Start with +200G and a random Treasure Card.",
        type: 'passive',
        img: "https://static.wixstatic.com/media/b16479_9555d2fe87f74320a96619cdb7f057a4~mv2.jpg",
        onStart: (p) => {
            p.gold += 200;
            const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
            const item = createItemInstance(card);
            p.inventory.push(item);
            addLog("Greed: +200G & Treasure!", "log-gold");
        }
    },
    fence: { name: "Fence", desc: "Sell items for 80% value.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_7f7f664290b14d51a9aa304396c46d67~mv2.jpg" },
    skeleton_key: { name: "Skeleton Key", desc: "Immune to Dungeon. (Trap: Steal 50G).", type: 'passive', onEnemyLanding: (v, o) => { if (v.gold >= 50) { v.gold -= 50; o.gold += 50; addLog("Skeleton Key Trap: +50G", "log-accent"); } }, img: "https://static.wixstatic.com/media/b16479_6c10e5ce01164b79bb957d07613143ae~mv2.jpg" },
    cutpurse: { name: "Cutpurse", desc: "Steal 5G passing. Steal 20G landing.", type: 'passive', img: "https://static.wixstatic.com/media/b16479_ebce90cafeb5404b96e00cb557ce20b1~mv2.jpg", onLanding: (p) => { /* Logic in resolveLanding */ } },
    ambush_pas: {
        name: "Ambush",
        desc: "Siege attacks require 1 less Success.",
        type: 'passive',
        img: "https://static.wixstatic.com/media/b16479_6274cb33103f496d958019147a605599~mv2.jpeg"
    },
    devotion: {
        name: "Devotion",
        desc: "Permanent +1 INT. Start at Shrine. +200G passing Shrine.", // UPDATED
        type: 'passive',
        effect: (s) => { s.int += 1; },
        img: "https://static.wixstatic.com/media/b16479_4ad91e74342448b08fd19799f492d69b~mv2.jpg"
    },
    medic: {
        name: "Medic",
        desc: "Land on Player: Give 100G to gain +1 Perm Stat.", // UPDATED (Removed Perm STR effect)
        type: 'passive',
        // Note: Logic handled in resolveLanding
        img: "https://static.wixstatic.com/media/b16479_e222db131e6e4e2180c5bd4dcd0dd6f4~mv2.jpg"
    },
    holy_aura: { name: "Holy Aura", desc: "Gain 20G when landing on another hero.", type: 'passive', onLanding: (p) => { const hit = players.some(x => x.id !== p.id && x.pos === p.pos); if (hit) p.gold += 20; }, img: "https://static.wixstatic.com/media/b16479_967b2ee34245413a8b04aa43b0fe04b8~mv2.jpg" },
    spirit_tithe: { name: "Spirit Tithe", desc: "Gain 5G on enemy land, 10G on own land.", type: 'passive', onLanding: (p) => { const t = tiles[p.pos]; if (t.userData.owner === p.id) p.gold += 10; else if (t.userData.owner !== null) p.gold += 5; }, img: "https://static.wixstatic.com/media/b16479_73cb0754c25246689fbe4db244b98da1~mv2.jpg" },
    pacifist: { name: "Pacifist", desc: "Fleeing gives +30G and +1 All Stats (Temp).", type: 'passive', img: "https://static.wixstatic.com/media/b16479_203666cbf52f4677ad7eb5a9ab696105~mv2.jpg" },
    resurrection: { name: "Resurrection", desc: "Survive Bankruptcy once (+500G, -1 Stats).", type: 'passive', img: "https://static.wixstatic.com/media/b16479_0da06ce557fe4487a6d48a0a174bee56~mv2.jpg" },

    // --- UPDATED: TELEPORT (Inn) ---
    teleport: {
        name: "Teleport", desc: "Warp to Inn.",
        fn: (p) => {
            VFX.trigger('implode', p.mesh.position, null, 0x00ffff);
            if (isMultiplayer && db && gameId) {
                db.ref(`games/${gameId}/players/${p.id}/pos`).set(0);
                db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: 0, timestamp: firebase.database.ServerValue.TIMESTAMP });
            } else {
                p.pos = 0; animateTeleport(p, tiles[0], () => { resolveLanding(p) });
            }
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_e2653f032408459ea8d64eb87faf86fb~mv2.jpeg"
    },

    // --- GENERIC ITEMS ---
    dash: { name: "Dash", desc: "Move 3 spaces.", fn: (p) => { VFX.trigger('burst_up', p.mesh.position, null, 0x00ff00); animateMove(p, 3); return true; }, img: "https://static.wixstatic.com/media/b16479_41cfe447b8eb4376a3b8d87b7adc1fbe~mv2.jpeg" },
    heal: { name: "Heal Potion", desc: "Cure status.", fn: (p) => { VFX.trigger('spiral_up', p.mesh.position, null, 0x00ff00); p.isSkipping = false; addLog("Healed!", "log-success"); return true; }, img: "https://static.wixstatic.com/media/b16479_6fbb98ea84a9479b98dd0441fd7152b6~mv2.jpg" },
    transmute: {
        name: "Transmute",
        desc: "Destroy Item -> Gain Random Treasure.",
        fn: (p) => {
            // 1. Identify valid targets (Exclude the Transmute Scroll itself if possible, but hard to know ID. Just list all valid equipment/scrolls).
            // We return false effectively cancelling the "auto-consume" of the scroll by equipItem, 
            // so we must manually remove the scroll upon success to prevent infinite use.

            const targets = p.inventory.map((item, index) => ({ item, index })).filter(x => x.item.name !== "Transmute Scroll");

            if (targets.length === 0) {
                addLog("Nothing to transmute!", "log-fail");
                return false;
            }

            // 2. Open Picker Modal
            const m = document.getElementById('card-modal');
            document.getElementById('enc-title').innerText = "Transmute";
            document.getElementById('enc-desc').innerText = "Select an item to transform into Treasure:";
            document.getElementById('enc-header').className = 'card-header'; // default header

            const l = document.getElementById('choice-list');
            l.innerHTML = '';
            document.getElementById('dice-result').innerHTML = '';
            document.getElementById('market-sell-area').style.display = 'none';

            targets.forEach(t => {
                let b = document.createElement('div');
                b.className = 'choice-btn';
                // Show Rarity Color
                const rarityColor = (t.item.rarity === 'legendary') ? '#ff4500' : (t.item.rarity === 'epic') ? '#a335ee' : (t.item.rarity === 'rare') ? '#0070dd' : '#9d9d9d';
                b.style.borderLeft = `5px solid ${rarityColor}`;
                b.innerText = t.item.name;

                b.onclick = () => {
                    m.classList.remove('active');

                    // A. Remove Selected Item
                    // Note: We used map/filter so 't.index' is the original index. 
                    // However, if we remove the scroll first, indices change. 
                    // SAFEST ORDER: Remove Item -> Find Scroll -> Remove Scroll

                    const itemToRemove = p.inventory[t.index];
                    if (itemToRemove !== t.item) {
                        // Index mismatch safety? (Unlikely in single thread but possible if async events happen)
                        addLog("Transmute Failed (Index Mismatch)", "log-fail");
                        return;
                    }

                    p.inventory.splice(t.index, 1);

                    // B. Remove the Transmute Scroll (The one that triggered this)
                    // We look for a Transmute Scroll in the *remaining* inventory
                    const scrollIdx = p.inventory.findIndex(x => x.name === "Transmute Scroll");
                    if (scrollIdx !== -1) {
                        p.inventory.splice(scrollIdx, 1);
                    } else {
                        // This handles cases where Transmute might be a Skill (not scroll) or already consumed?
                        // If it is a scroll, it SHOULD be there because we returned false.
                    }

                    // C. Reward New Item
                    const newItem = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);
                    p.inventory.push(newItem);

                    VFX.trigger('pillar', p.mesh.position, null, 0xffd700);
                    addLog(`Transmuted ${t.item.name} into ${newItem.name}!`, "log-gold");
                    AUDIO.playSound('sfx_magic');

                    updateHUD();
                    if (typeof isMultiplayer !== 'undefined' && isMultiplayer) syncPlayerState();
                };
                l.appendChild(b);
            });

            // Cancel Button
            let c = document.createElement('div');
            c.className = 'choice-btn';
            c.innerText = "Cancel";
            c.onclick = () => { m.classList.remove('active'); };
            l.appendChild(c);

            m.classList.add('active');

            return false; // Prevent default consumption
        },
        img: "https://static.wixstatic.com/media/b16479_6c7a5d29595e42cdbc625397ad4a9a7d~mv2.jpeg"
    },
    // ================= ANCIENT SUPER ABILITIES (10% Chance on Legendary) =================
    ancient_firewave: {
        name: "FireWave",
        desc: "Cost 1000G. Destroy EVERY Camp and Tavern on the board.",
        fn: (p) => {
            if (p.gold < 1000) return false;
            p.gold -= 1000;

            // Visuals
            // Visuals
            addLog("ANCIENT POWER: FIREWAVE!", "log-ancient");
            VFX.trigger('firewave_burst', p.mesh.position, null, 0xff4500);

            // Logic: Destroy All Buildings
            let count = 0;
            tiles.forEach(t => {
                if (t.userData.owner !== null && t.userData.buildingLevel > 0) {
                    t.userData.owner = null;
                    t.userData.buildingLevel = 0;
                    t.userData.guardCount = 0;

                    // Visual Reset (rough impl)
                    if (t.userData.buildingMesh) { scene.remove(t.userData.buildingMesh); t.userData.buildingMesh = null; }
                    count++;
                }
            });

            addLog(`FireWave incinerated ${count} structures!`, "log-ancient");

            if (isMultiplayer) syncPlayerState(); // Ideally sync board too
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_bac4112b33664a289644bb57f29f8a5b~mv2.jpg"
    },
    ancient_diver: {
        name: "Dungeon Diver",
        desc: "Cost 500G. Instant teleport to any Dungeon Entrance.",
        fn: (p) => {
            if (p.gold < 500) return false;
            // Find Dungeons
            const dungeons = tiles.filter(t => t.userData.info.isDungeonEntrance);
            if (dungeons.length === 0) { addLog("No Dungeons found!", "log-fail"); return false; }

            // Show Picker logic omitted for brevity, picking random for now or first
            p.gold -= 500;
            const target = dungeons[Math.floor(Math.random() * dungeons.length)];

            VFX.trigger('implode', p.mesh.position, null, 0x5500ff);

            if (isMultiplayer && db && gameId) {
                db.ref(`games/${gameId}/players/${p.id}/pos`).set(target.userData.id);
            } else {
                p.pos = target.userData.id;
                animateTeleport(p, target, () => resolveLanding(p));
            }
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_9c87cff04b3d459e904a5b03ca6e733e~mv2.jpg"
    },
    ancient_timewarp: {
        name: "Time Warp",
        desc: "Cost 500G. Take 2 extra turns immediately.",
        fn: (p) => {
            if (p.gold < 500) return false;
            p.gold -= 500;
            p.extraTurns = (p.extraTurns || 0) + 2;
            addLog("TIME WARP! +2 Turns.", "log-ancient");
            VFX.trigger('spiral_up', p.mesh.position, null, 0x00ffff);
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_9a04957bc4144afa98d8d7b389edee33~mv2.jpg"
    },
    ancient_soulswap: {
        name: "Soul Swap",
        desc: "Cost 1000G. Swap Gold count with target player.",
        fn: (p) => {
            if (p.gold < 1000) return false;
            const targets = players.filter(x => x.id !== p.id && !x.isDead);
            if (targets.length === 0) return false;

            // Picker logic simplified: Swap with richest
            targets.sort((a, b) => b.gold - a.gold);
            const t = targets[0];

            if (t.gold <= p.gold) { addLog("Target too poor to swap.", "log-fail"); return false; }

            p.gold -= 1000;
            const temp = p.gold;
            p.gold = t.gold;
            t.gold = temp;

            addLog(`Soul Swap! Swapped gold with ${t.name}.`, "log-ancient");
            if (isMultiplayer) syncPlayerState();
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_4f81cbbd3253457ab682f5e238e9608d~mv2.jpg"
    },
    ancient_landclaim: {
        name: "Land Claim",
        desc: "Cost 800G. Steal current tile & Upgrade to Tavern.",
        fn: (p) => {
            if (p.gold < 800) return false;
            const t = tiles[p.pos];
            if (t.userData.info.cost > 0) {
                p.gold -= 800;
                capture(t, p, 2); // Level 2 = Tavern
                addLog("Land Claimed and Upgraded!", "log-ancient");
                updateHUD();
                return true;
            }
            return false;
        },
        img: "https://static.wixstatic.com/media/b16479_4c3713253ebf4e56b1c5ea0db416e47d~mv2.jpg"
    },
    ancient_tax: {
        name: "Tax Collector",
        desc: "Steal 10% Gold from ALL players. Move 1d6 until Recharge (Tax Tile).",
        fn: (p) => {
            // New Logic: No Gold Cost, Applies Movement Debuff
            p.taxDebuff = true;

            let totalStolen = 0;
            players.forEach(pl => {
                if (pl.id !== p.id && !pl.isDead) {
                    const tax = Math.floor(pl.gold * 0.10);
                    pl.gold -= tax;
                    totalStolen += tax;
                }
            });
            p.gold += totalStolen;
            addLog(`Tax Collector: Stole ${totalStolen}G total! Movement Slowed!`, "log-ancient");
            if (isMultiplayer) syncPlayerState();
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_9fed4bf34f6d409d915728796a06926e~mv2.jpg"
    },
    ancient_meteor: {
        name: "Meteor Strike",
        desc: "Cost 600G. Target loses 2 Random Items & Skips Turn.",
        fn: (p) => {
            if (p.gold < 600) return false;
            const targets = players.filter(x => x.id !== p.id && !x.isDead);
            if (targets.length === 0) return false;

            const t = targets[0]; // Logic simplified to first valid target or picker
            p.gold -= 600;

            // Remove 2 items
            let removed = 0;
            const slots = EQUIP_ORDER.filter(s => t.equipment[s]);
            for (let i = 0; i < 2; i++) {
                if (slots.length > 0) {
                    const s = slots.splice(Math.floor(Math.random() * slots.length), 1)[0];
                    t.equipment[s] = null;
                    removed++;
                }
            }

            t.isSkipping = true;
            addLog(`Meteor Strike on ${t.name}! Items destroyed: ${removed}.`, "log-ancient");
            VFX.trigger('fireball', p.mesh.position, t.mesh.position);

            if (isMultiplayer) syncPlayerState();
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_c812e709bb2d4b008fbd7417b56c8d70~mv2.jpg"
    },
    ancient_voidstep: {
        name: "Void Step",
        desc: "Cost 400G. Teleport to ANY space on the board.",
        fn: (p) => {
            if (p.gold < 400) return false;
            // Assuming we use a modal or simple random? 
            // For now, random logic (User request implied 'Any', likely requires picker)
            // Fallback: Random for prototype
            p.gold -= 400;
            const r = Math.floor(Math.random() * 40);

            if (isMultiplayer && db && gameId) {
                db.ref(`games/${gameId}/players/${p.id}/pos`).set(r);
            } else {
                p.pos = r;
                animateTeleport(p, tiles[r], () => resolveLanding(p));
            }
            addLog("Void Step: Warping...", "log-ancient");
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_544d343948ed45879b703acdbcfd4b62~mv2.jpg"
    },
    ancient_midas: {
        name: "Midas Touch",
        desc: "Gain 2000G, but Skip your Next Turn.",
        fn: (p) => {
            p.gold += 2000;
            p.isSkipping = true;
            addLog("Midas Touch: +2000G (Frozen next turn).", "log-ancient");
            VFX.trigger('pillar', p.mesh.position, null, 0xffd700);
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_80da3163593245c0961abaa0f7fe76c5~mv2.jpg"
    },
    ancient_divineshield: {
        name: "Divine Shield",
        desc: "Cost 300G. Immune to all effects for 3 rounds.",
        fn: (p) => {
            if (p.gold < 300) return false;
            p.gold -= 300;
            p.immunity = 3; // Engine needs to support this check
            addLog("Divine Shield Active (3 Turns).", "log-ancient");
            VFX.trigger('pillar', p.mesh.position, null, 0xffffff);
            updateHUD();
            return true;
        },
        img: "https://static.wixstatic.com/media/b16479_75752aecbee444ada136a1d9c923b8f8~mv2.jpg"
    }
};

// --- ABILITY NAMING & IMAGE CONFIG ---

// Maps Ability IDs to descriptive prefixes/adjectives
const ABILITY_PREFIXES = {
    // Fighter
    power_strike: "Titan's", intimidate: "Tyrant's", second_wind: "Renewing", shield_bash: "Bashing", rally: "Captain's", siege_breaker: "Breaching",
    veteran: "Veteran's", iron_skin: "Iron", executioner: "Executioner's", conqueror: "Conqueror's", heavy_armor: "Fortified", vanguard: "Vanguard",
    // Wizard
    fireball: "Infernal", transmute_gold: "Gilded", blink: "Warping", time_warp: "Chronos", polymorph: "Polymorphing", arcane_eye: "Seer's",
    scholar: "Scholar's", court_mage: "Noble's", alchemist_pas: "Alchemist's", mana_shield: "Shielding", leyline: "Leyline", elemental_attune: "Prismatic",
    // Rogue
    pickpocket: "Thief's", sprint_act: "Sprinter's", smoke_bomb_act: "Vanishing", sabotage: "Saboteur's", gamble_act: "Gambler's", shadow_strike: "Shadow",
    shadow_step: "Ghostly", greedy: "Greedy", fence: "Smuggler's", skeleton_key: "Burglar's", cutpurse: "Bandit's", ambush_pas: "Stalker's",
    // Cleric
    heal_spell: "Mending", smite: "Crusader's", bless: "Blessed", divine_intervention: "Divine", sanctuary: "Saint's", exorcism: "Banishing",
    devotion: "Devoted", medic: "Healer's", holy_aura: "Radiant", spirit_tithe: "Tithing", pacifist: "Peacekeeper's", resurrection: "Phoenix",
    // Generic
    dash: "Swift", teleport: "Warp", heal: "Restoring", transmute: "Golden",
    midas: "Midas", well_made: "Masterwork", freeze: "Frozen", scavenge: "Scavenger's", haggler: "Merchant's",
    gold_rush: "Prospector's", escape_artist: "Elusive", divine_shield: "Guardian's", landlord: "Baron's",
    vampirism: "Vampiric", gamblers_luck: "Lucky", ambush_master: "Assassin's", might: "Ogre's", focus: "Sage's",
    agility: "Cat's", bounty: "Hunter's", lucky: "Fortunate", anchor: "Steady"
};

// --- ITEM IMAGE POOLS ---
// Add as many URLs as you want for each category. 
// The game will pick one randomly when the item is generated.
const ITEM_IMAGE_POOLS = {
    // === EQUIPMENT ===
    "Sword": [
        "https://static.wixstatic.com/media/b16479_b4a21594af4e4193b6c317d64bbb66e7~mv2.png", "https://static.wixstatic.com/media/b16479_0bc9d0d7f2ca41d9a01c583c066f8a7f~mv2.png", "https://static.wixstatic.com/media/b16479_798726f409f94ed2a945d75c2ee0b9d6~mv2.png", "https://static.wixstatic.com/media/b16479_9045b0125f78454f9256986832670bbb~mv2.png", "https://static.wixstatic.com/media/b16479_3fe0c98939b54aea88de6744c221fcb8~mv2.png", "https://static.wixstatic.com/media/b16479_9385a8b28de143c799dc933769602547~mv2.png", "https://static.wixstatic.com/media/b16479_ea05d90d3a7a4e529575f71e9897195e~mv2.png", "https://static.wixstatic.com/media/b16479_731edc4143e049f7ac295207fd62d8ad~mv2.png", "https://static.wixstatic.com/media/b16479_856ff4e996d9432589503bdcd74aa029~mv2.png", "https://static.wixstatic.com/media/b16479_69a123d82e81487d89005a197a42e3d5~mv2.png", "https://static.wixstatic.com/media/b16479_a47926b150044ab7bf4c60a048ab2d29~mv2.png", "https://static.wixstatic.com/media/b16479_3ef9327bbd504fce9b5518747e31fbff~mv2.png", "https://static.wixstatic.com/media/b16479_4532d20d87614b3ea2e122f034dfb8bc~mv2.png", "https://static.wixstatic.com/media/b16479_e1892c1590ef49498897fa78fc8ef2df~mv2.png", "https://static.wixstatic.com/media/b16479_4758dc0bdca04d2d97ac60c7a781c589~mv2.png"
    ],
    "Axe": [
        "https://static.wixstatic.com/media/b16479_81988a9f29d0416c94fb11d8883edd49~mv2.png", "https://static.wixstatic.com/media/b16479_5c48354a0b544c4090fadd5ff2276ad8~mv2.png", "https://static.wixstatic.com/media/b16479_83aebd9f69244800b5b27d8dfd0ce50d~mv2.png", "https://static.wixstatic.com/media/b16479_e7fa46ac7163400ca18581e788ac01ee~mv2.png", "https://static.wixstatic.com/media/b16479_c6d00234cdcd45d1ac5c6912f1e56e8e~mv2.png", "https://static.wixstatic.com/media/b16479_674635048c4440a8b831c5b0c7ea5aaf~mv2.png", "https://static.wixstatic.com/media/b16479_68c9ceedcc114ea2981c69fc8335fd72~mv2.png", "https://static.wixstatic.com/media/b16479_a30b130af9bd4483a084990e4fa07268~mv2.png", "https://static.wixstatic.com/media/b16479_d78df7d407c54f4ebcb0b3cc6e5eac03~mv2.png", "https://static.wixstatic.com/media/b16479_4a36ed73536b4683b315080c90bb098a~mv2.png", "https://static.wixstatic.com/media/b16479_73acf1dcecd847eeb94c837bdfbef9bd~mv2.png"
    ],
    "Hammer": [
        "https://static.wixstatic.com/media/b16479_e16af69c72364203a172005ed37849e8~mv2.png", "https://static.wixstatic.com/media/b16479_db3f11a9b7f346b49895109bf448d731~mv2.png", "https://static.wixstatic.com/media/b16479_010135b49a2d4a5dac3759e02f1001d1~mv2.png", "https://static.wixstatic.com/media/b16479_d6ce6fc12da248c2a80febdf88c7c9ab~mv2.png", "https://static.wixstatic.com/media/b16479_58b7297549eb43d2848eb0d13f9b1c47~mv2.png", "https://static.wixstatic.com/media/b16479_aca038df21454a489fbcb1ef3208a25e~mv2.png", "https://static.wixstatic.com/media/b16479_001521f1f6aa4691843f888292636131~mv2.png", "https://static.wixstatic.com/media/b16479_2bddedbb1f044844a4124f36963fc32d~mv2.png", "https://static.wixstatic.com/media/b16479_51b47a8068b94b5f9b178a15791d630a~mv2.png", "https://static.wixstatic.com/media/b16479_230e470cd7b5444e92681a5ab8403997~mv2.png", "https://static.wixstatic.com/media/b16479_986bf380e3934165a7c240e4d068504f~mv2.png", "https://static.wixstatic.com/media/b16479_c44c7b2e9a71480bbfafbeec699b0aac~mv2.png"
    ],
    "Spear": [
        "https://static.wixstatic.com/media/b16479_52f8aa3723a94604810e6b31717022e4~mv2.png", "https://static.wixstatic.com/media/b16479_cc937da8d3734fb2b6de55dcb0f01f5d~mv2.png", "https://static.wixstatic.com/media/b16479_50270327e1734e18817848bb4c8d9798~mv2.png", "https://static.wixstatic.com/media/b16479_70942de2af0f40e1840213f43fd08260~mv2.png", "https://static.wixstatic.com/media/b16479_7d2c52d41edb48daa36d97f24af6c963~mv2.png", "https://static.wixstatic.com/media/b16479_b30e1e5627744709aa14a5671b54a8e2~mv2.png", "https://static.wixstatic.com/media/b16479_33f686fd2b184a05885040c2801da42d~mv2.png", "https://static.wixstatic.com/media/b16479_cee766083c7744ab92d6acab28fa5c3f~mv2.png", "https://static.wixstatic.com/media/b16479_682183d30ba94784ab7aa79141f51441~mv2.png", "https://static.wixstatic.com/media/b16479_00d9868633a34093affc950500f29400~mv2.png", "https://static.wixstatic.com/media/b16479_155c22b61e93433fae514cb9347591fd~mv2.png"
    ],
    "Shield": [
        "https://static.wixstatic.com/media/b16479_a03f80fa92274fdd9ee00b29fc700192~mv2.png", "https://static.wixstatic.com/media/b16479_7eda0173ff724ff0ba0de0b9d0be0573~mv2.png", "https://static.wixstatic.com/media/b16479_a9e25b5147e445b0b8cd803d15643387~mv2.png", "https://static.wixstatic.com/media/b16479_103ab43c8eb4460fa6e77a14d342a438~mv2.png", "https://static.wixstatic.com/media/b16479_99f00a87956c49129d7260efc32fe234~mv2.png", "https://static.wixstatic.com/media/b16479_ae9b56e03010468eb4f2826b042aed28~mv2.png", "https://static.wixstatic.com/media/b16479_afd89deac7664ad19d199ba217c1f060~mv2.png", "https://static.wixstatic.com/media/b16479_15ed80d0e6b745f691e4db13e3299f23~mv2.png", "https://static.wixstatic.com/media/b16479_0b5d32f4e26246eeaa15d6818c4fca88~mv2.png", "https://static.wixstatic.com/media/b16479_874eb8e380b84da08d80c50bc59daa9b~mv2.png", "https://static.wixstatic.com/media/b16479_bdb5afdcba9543c5b81aa8e6a894e45f~mv2.png", "https://static.wixstatic.com/media/b16479_eabcd570b2ca4a359c4b5ff98df6a691~mv2.png", "https://static.wixstatic.com/media/b16479_6ed2ea9d62df412180fa1c711e7b2fc7~mv2.png", "https://static.wixstatic.com/media/b16479_869b39284aa8438596cad9a6e63fb4f7~mv2.png"
    ],
    "Helm": [
        "https://static.wixstatic.com/media/b16479_e2b59a0af8964a16ba2d0689cbc96f95~mv2.png", "https://static.wixstatic.com/media/b16479_bffdff07708e408e948509b9d959031b~mv2.png", "https://static.wixstatic.com/media/b16479_95feaf30e4f940aba338cc6448fe2953~mv2.png", "https://static.wixstatic.com/media/b16479_ad78a6403b4a48429515decc3a52a36e~mv2.png", "https://static.wixstatic.com/media/b16479_22856ff220744951afc4800aa5f5ae8f~mv2.png"
    ],
    "Armor": [
        "https://static.wixstatic.com/media/b16479_38a18892e6f7455ca973664e1b8962e8~mv2.png", "https://static.wixstatic.com/media/b16479_7b13fca42dc64e5089422bf3e7806bfd~mv2.png", "https://static.wixstatic.com/media/b16479_4d857b651ab4436f920b8281c42cb938~mv2.png", "https://static.wixstatic.com/media/b16479_df4d6ed423b7473fb9d46553ce373e30~mv2.png", "https://static.wixstatic.com/media/b16479_81cba66f4084448ab653cfcebe61a5ae~mv2.png"
    ],
    "Wand": [
        "https://static.wixstatic.com/media/b16479_43ffac41a1d54299a02fa88bb0189375~mv2.png", "https://static.wixstatic.com/media/b16479_3c3c56801415469aad8ec4a97786e545~mv2.png", "https://static.wixstatic.com/media/b16479_d61b206ad71b49bd887ff20c8271ae8e~mv2.png", "https://static.wixstatic.com/media/b16479_71030fe086154dfe9e57eeb3032f44b0~mv2.png", "https://static.wixstatic.com/media/b16479_432c5a44e03e4b82b3f28c6d377e2fc9~mv2.png", "https://static.wixstatic.com/media/b16479_16f35f2e12284f23a07c6f91c4912b19~mv2.png"
    ],
    "Staff": [
        "https://static.wixstatic.com/media/b16479_db54e75db5ba408797ab74babcff4774~mv2.png", "https://static.wixstatic.com/media/b16479_54f19d37481a4320ac6402bcf5582af7~mv2.png", "https://static.wixstatic.com/media/b16479_4f7cbe4edbf64866ab49b472be344e58~mv2.png", "https://static.wixstatic.com/media/b16479_4e5af2243b9d46f388193adcaee10981~mv2.png", "https://static.wixstatic.com/media/b16479_44af651652ec4e729f898c8fbe65bd87~mv2.png", "https://static.wixstatic.com/media/b16479_bbfdc680c5be4ce6807ce4da7d49218d~mv2.png", "https://static.wixstatic.com/media/b16479_791fe5c3336641c88b3b0ae5ce6ce35d~mv2.png", "https://static.wixstatic.com/media/b16479_cf4a828fd73e4b52bee6f4acb0dd7a8e~mv2.png", "https://static.wixstatic.com/media/b16479_86cb8ae05bb546ff99db964b4556babe~mv2.png", "https://static.wixstatic.com/media/b16479_411cca6e861244c5b17ef76f9b3526bb~mv2.png", "https://static.wixstatic.com/media/b16479_165dcbb93bd24a7d860d1467dfe8c22d~mv2.png"
    ],
    "Bow": [
        "https://static.wixstatic.com/media/b16479_3bd83b51904040de87a05413a9fb2fc6~mv2.png", "https://static.wixstatic.com/media/b16479_6d89cb7e820e47d68daf3378d7610247~mv2.png", "https://static.wixstatic.com/media/b16479_b07649eb8f74408caea57644abc65212~mv2.png", "https://static.wixstatic.com/media/b16479_ff45b316b0224f1e892551b0e9c5885b~mv2.png", "https://static.wixstatic.com/media/b16479_7fd954b90cfe4bb3936b011122c6cb61~mv2.png", "https://static.wixstatic.com/media/b16479_c1917c845f1f4c98a776440a3c036e07~mv2.png", "https://static.wixstatic.com/media/b16479_ac99e8880f9d400bab21e9b1ef56d241~mv2.png", "https://static.wixstatic.com/media/b16479_aab1129fc8024211bb1a84fa6e5c9421~mv2.png", "https://static.wixstatic.com/media/b16479_3daa70c929ed4ab6bdfdd4160d7a5b9c~mv2.png"
    ],
    "Dagger": [
        "https://static.wixstatic.com/media/b16479_8fcf4b4eb377492c9f2bec6ddd6d51f9~mv2.png", "https://static.wixstatic.com/media/b16479_bae94c86a5264d628972c6fef0d2d223~mv2.png", "https://static.wixstatic.com/media/b16479_ab0baa8f373546df97052bde9ed91fb9~mv2.png", "https://static.wixstatic.com/media/b16479_030f85fddbb045af9efaf85c0a163410~mv2.png", "https://static.wixstatic.com/media/b16479_371e09162ad34700837c83c77987306a~mv2.png", "https://static.wixstatic.com/media/b16479_cb64c8002bfa4eac92a9cbf10c073231~mv2.png", "https://static.wixstatic.com/media/b16479_8f3425df2c504f599704b90d09cca05b~mv2.png", "https://static.wixstatic.com/media/b16479_3df342ff771445768aee88a4ddf33a50~mv2.png", "https://static.wixstatic.com/media/b16479_017efb6209e246e88aeb7b1137e227b5~mv2.png", "https://static.wixstatic.com/media/b16479_e5ef3df57f144cad92efa47b31772651~mv2.png"
    ],
    "Boots": [
        "https://static.wixstatic.com/media/b16479_4f3bc72dd85c4fa1a834fb3f40660095~mv2.png", "https://static.wixstatic.com/media/b16479_b4e69e7a855947da8cef539fb1935505~mv2.png", "https://static.wixstatic.com/media/b16479_5d5ecceab1f748919f97f3db1cfd9e4d~mv2.png", "https://static.wixstatic.com/media/b16479_05ed55cfd0b945fa936a51a2d3d26c97~mv2.png", "https://static.wixstatic.com/media/b16479_af4e5d7758d64429b722c3e2b18050af~mv2.png", "https://static.wixstatic.com/media/b16479_8cf296e60bad4827abee99215bbeea17~mv2.png"
    ],
    "Gloves": [
        "https://static.wixstatic.com/media/b16479_e8438c097a7f449693828dfa9ef7a5ff~mv2.png", "https://static.wixstatic.com/media/b16479_8e176bb9ea804d939a0d4a22370bd098~mv2.png", "https://static.wixstatic.com/media/b16479_2dd95362d1494c8eb1824a1f9e59ea90~mv2.png", "https://static.wixstatic.com/media/b16479_2a0d9a3fa1de41f0afbcf05931281ee2~mv2.png", "https://static.wixstatic.com/media/b16479_d6ab40f159634d559b5009d76da193ba~mv2.png", "https://static.wixstatic.com/media/b16479_4d7b4b17d4d241169ef101db169962b3~mv2.png"
    ],
    "Ring": [
        "https://static.wixstatic.com/media/b16479_cb387a62494547d5a5ae1fe9d972e469~mv2.png", "https://static.wixstatic.com/media/b16479_17be1a7118fa4e4aa4085a15769d5d9d~mv2.png", "https://static.wixstatic.com/media/b16479_e2c69a4b9ed14bf08440b6f0216ae827~mv2.png", "https://static.wixstatic.com/media/b16479_aea82eee16fb46fd9a220522381e4c21~mv2.png", "https://static.wixstatic.com/media/b16479_1e59b17b203747db89c72d0418db3fa8~mv2.png", "https://static.wixstatic.com/media/b16479_5bcdd5372b6d4ecfa618561ebb86b8c8~mv2.png", "https://static.wixstatic.com/media/b16479_f1480787dcbb440ea098f7704f62e2ee~mv2.png", "https://static.wixstatic.com/media/b16479_95363b158a0b4c37aba1a542472604de~mv2.png", "https://static.wixstatic.com/media/b16479_b6bb0ea423134557b288e13980213001~mv2.png", "https://static.wixstatic.com/media/b16479_79005a590c2747ac91b5162ae5820100~mv2.png", "https://static.wixstatic.com/media/b16479_b017f18d5b3441c29a1d953cf0878c5d~mv2.png"
    ],
    "Amulet": [
        "https://static.wixstatic.com/media/b16479_7c56222743b24558bd7f1d2871898516~mv2.png", "https://static.wixstatic.com/media/b16479_9bd39b76a7c54423a0cdb70bafed95a7~mv2.png", "https://static.wixstatic.com/media/b16479_6419bcc8d35145a18275bcd32d8bd6b5~mv2.png", "https://static.wixstatic.com/media/b16479_11341b7dfcb54715b85f2f077250b6ad~mv2.png", "https://static.wixstatic.com/media/b16479_54e8142a1c8244d2851658cf93c16947~mv2.png", "https://static.wixstatic.com/media/b16479_ca44b07638c74e30b55dbe41c86d5f28~mv2.png", "https://static.wixstatic.com/media/b16479_b63b70b1f3b94d3ba57764b0e34d5633~mv2.png", "https://static.wixstatic.com/media/b16479_0431e1f0eb234f24970ebbbf96c13049~mv2.png", "https://static.wixstatic.com/media/b16479_c8334c03695a4b98a61cbbd586a45d39~mv2.png", "https://static.wixstatic.com/media/b16479_4b0d7205dfbf4da3871504b9efcc4854~mv2.png", "https://static.wixstatic.com/media/b16479_c3677800edb54af294c64ba94fb0306c~mv2.png"
    ],
    "Cloak": [
        "https://static.wixstatic.com/media/b16479_6ebe2f2ccf254391ba4f3aed87956b60~mv2.png", "https://static.wixstatic.com/media/b16479_2186a046869c4a418d643c483385d9b6~mv2.png", "https://static.wixstatic.com/media/b16479_b9d9ea82d7d046c9977ed3f0625acfd3~mv2.png", "https://static.wixstatic.com/media/b16479_3edd1eaa8a56460ab686dd7b5a64d08e~mv2.png", "https://static.wixstatic.com/media/b16479_53eb9d93e2ab4328bd48ee16dd208968~mv2.png", "https://static.wixstatic.com/media/b16479_0ede1c5215744b5a8dad7f8503d88379~mv2.png", "https://static.wixstatic.com/media/b16479_6c2998bd35464f97aabea7299da75ddd~mv2.png", "https://static.wixstatic.com/media/b16479_7c7cdcff453640fb84ac0d5576e19180~mv2.png", "https://static.wixstatic.com/media/b16479_c12180b8b799462eaaecefdb1276d9e6~mv2.png"
    ],
    "Belt": [
        "https://static.wixstatic.com/media/b16479_a08b2159d4c14684bae67e09843fd220~mv2.png", "https://static.wixstatic.com/media/b16479_ece4f9186c0249b7979a6d6fe491f39d~mv2.png", "https://static.wixstatic.com/media/b16479_5b45905d08414f7cab07c8060e76df49~mv2.png", "https://static.wixstatic.com/media/b16479_e95565fcb16f41a980e663bacead23d8~mv2.png", "https://static.wixstatic.com/media/b16479_75630562eba041b490b01e5150315ede~mv2.png", "https://static.wixstatic.com/media/b16479_2f20590f6a9e4684897fe7da16ca4c18~mv2.png", "https://static.wixstatic.com/media/b16479_54ac04b153774efe82b7b3ef9feadb41~mv2.png", "https://static.wixstatic.com/media/b16479_309ba28cdcdd4de2bee543834bd2982f~mv2.png", "https://static.wixstatic.com/media/b16479_1be13f5919414fcb8b42a4907bb44116~mv2.png"
    ],

    // === CONSUMABLES & SCROLLS ===
    "Pouch of Gold": [
        "https://static.wixstatic.com/media/b16479_81538fe3a32548caa2604077f9d11cd6~mv2.png",
    ],
    "Lucky Coin": [
        "https://static.wixstatic.com/media/b16479_18e0db4a44244ff39644a7f7d40190c9~mv2.png",
    ],
    "Town Portal": [
        "https://static.wixstatic.com/media/b16479_c843409e1c8240259910310d2a7e052a~mv2.png",
    ],
    "Sprint Scroll": [
        "https://static.wixstatic.com/media/b16479_3de53f38c8a84a49a12a7f323ece6446~mv2.png",
    ],
    "Transmute Scroll": [
        "https://static.wixstatic.com/media/b16479_2f9dacc953eb4494b841ad85206538f0~mv2.png",
    ],
    "Elixir of Strength": [
        "https://static.wixstatic.com/media/b16479_a54dc18f484e4fbda6fba32b35b9251e~mv2.png",
    ],
    "Elixir of Speed": [
        "https://static.wixstatic.com/media/b16479_27995ec76358483a81d95ea86b4f274f~mv2.png",
    ],
    "Elixir of Wisdom": [
        "https://static.wixstatic.com/media/b16479_cf94bf5f4baf4b3e807c4b422e5df0ae~mv2.png",
    ],
    "Builder's Hammer": [
        "https://static.wixstatic.com/media/b16479_f099d02754e34f72a1aa4003914e2a10~mv2.png",
    ],
    "Mercenary Contract": [
        "https://static.wixstatic.com/media/b16479_beaac8471c8c447cbae344e9891d1608~mv2.png",
    ],
    "Thief's Glove": [
        "https://static.wixstatic.com/media/b16479_e8a750d554f34eb0a230eb8c62736820~mv2.png",
    ],
    "Royal Pardon": [
        "https://static.wixstatic.com/media/b16479_beaac8471c8c447cbae344e9891d1608~mv2.png",
    ],
    "Map to Riches": [
        "https://static.wixstatic.com/media/b16479_d5392f0b79dc45adb47a3b0fdbc18653~mv2.png",
    ],
    "Investment Deed": [
        "https://static.wixstatic.com/media/b16479_beaac8471c8c447cbae344e9891d1608~mv2.png",
    ],
    "Warp Stone": [
        "https://static.wixstatic.com/media/b16479_b842542d67474c0c89e82ff1255f9d8c~mv2.png",
    ],

    // === UNIQUE / SPECIAL ===
    "Vanguard Blade": [
        "https://static.wixstatic.com/media/b16479_d3d946b739b6400286978a0d39388900~mv2.png"
    ]
};
function generateTreasureDeck() {
    const deck = [];
    // Filter out Creator-Only skills that shouldn't appear on mid-game items
    const abilities = Object.keys(ABILITY_LIBRARY).filter(k =>
        k !== 'scholar' &&
        k !== 'greedy' &&
        k !== 'vanguard' &&
        k !== 'leyline' &&
        k !== 'devotion' &&
        !k.startsWith('ancient_') // Fix: Prevent Ancient abilities on non-legendary items
    );

    const getImg = (name) => {
        const pool = ITEM_IMAGE_POOLS[name];
        return (pool && pool.length > 0) ? pool[Math.floor(Math.random() * pool.length)] : null;
    };

    // --- MAP TO RICHES LOGIC ---
    const mapToRichesFn = (p) => {
        const activeDungeonKeys = Object.keys(activeDungeons);
        if (activeDungeonKeys.length === 0) {
            addLog("The Map to Riches glows, but no Dungeons are active!", "log-fail");
            p.gold += 100;
            return true;
        }
        let closestTile = null;
        let minDistance = 999;
        activeDungeonKeys.forEach(dName => {
            const dTile = tiles.find(t => t.userData.info.name === dName);
            if (dTile) {
                const dist = Math.abs(p.pos - dTile.userData.id);
                const circularDist = Math.min(dist, 40 - dist);
                if (circularDist < minDistance) { minDistance = circularDist; closestTile = dTile; }
            }
        });
        if (closestTile) {
            VFX.trigger('implode', p.mesh.position, null, 0xffd700);
            addLog(`The Map reveals a shortcut to ${closestTile.userData.info.name}!`, "log-epic");
            if (isMultiplayer) {
                db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: closestTile.userData.id, timestamp: firebase.database.ServerValue.TIMESTAMP });
            } else {
                p.pos = closestTile.userData.id; gameState = 'MOVING';
                animateTeleport(p, closestTile, () => resolveLanding(p));
            }
            return true;
        }
        return false;
    };

    // 1. Consumables
    for (let i = 0; i < 15; i++) deck.push({ id: `g${i}`, name: "Pouch of Gold", type: 'scroll', rarity: 'common', cost: 50, desc: "Gain 50 Gold instantly.", img: getImg("Pouch of Gold"), fn: (p) => { let gain = 50 + (p.stats.goldFind || 0); p.gold += gain; addLog(`+${gain} Gold`, "log-gold"); return true; } });
    deck.push({ name: "Map to Riches", type: 'scroll', rarity: 'epic', cost: 400, desc: "Teleport to the closest active Dungeon.", img: getImg("Map to Riches"), fn: mapToRichesFn });

    // 2. Equipment Config
    const slotConfigs = [
        { name: "Sword", slot: "main", type: "primary" },
        { name: "Armor", slot: "body", type: "primary" },
        { name: "Shield", slot: "off", type: "primary" },
        { name: "Helm", slot: "head", type: "secondary" },
        { name: "Gloves", slot: "hands", type: "secondary" },
        { name: "Boots", slot: "feet", type: "secondary" },
        { name: "Ring", slot: "ring_l", type: "secondary" },
        { name: "Ring", slot: "ring_r", type: "secondary" },
        { name: "Amulet", slot: "amulet", type: "secondary" },
        { name: "Cloak", slot: "back", type: "secondary" }
    ];

    const rarities = ['common', 'rare', 'epic', 'legendary'];

    slotConfigs.forEach(config => {
        rarities.forEach(rarity => {
            // Create 2 of each rarity per slot
            for (let k = 0; k < 2; k++) {
                let item = {
                    id: `item_${config.slot}_${rarity}_${generateUID()}`,
                    name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${config.name}`,
                    slot: config.slot,
                    type: 'equip',
                    rarity: rarity,
                    cost: (rarities.indexOf(rarity) + 1) * 250,
                    img: getImg(config.name)
                };

                // STAT LOGIC
                if (config.type === "primary") {
                    // Main, Body, Off get STR/DEX/INT
                    const stat = (config.slot === 'main') ? 'str' : (config.slot === 'body' ? 'str' : 'str');
                    item.bonus = { [stat]: rarities.indexOf(rarity) + 1 };
                } else {
                    // Secondary Stats
                    const power = SECONDARY_STAT_VALUES[rarity];

                    if (config.slot === 'feet') item.moveBonus = Math.ceil(power / 2); // 1, 2, 3, 4

                    // Everyone else gets GF and RES (including Head now)
                    if (['head', 'feet', 'hands', 'ring_l', 'ring_r', 'amulet', 'back'].includes(config.slot)) {
                        item.goldFind = power;
                        item.resistance = power;
                    }
                }

                // ABILITY LOGIC (Rare or Higher)
                if (rarities.indexOf(rarity) >= 1) {
                    const aKey = abilities[Math.floor(Math.random() * abilities.length)];
                    const ab = ABILITY_LIBRARY[aKey];
                    // Only active abilities can be assigned to the bar
                    if (!ab.type || ab.type === 'active') {
                        item.ability = { name: ab.name, type: 'active', desc: ab.desc, fn: ab.fn };
                    } else {
                        item.ability = { name: ab.name, type: 'passive', desc: ab.desc };
                    }
                }
                deck.push(item);
            }
        });
    });

    return deck;
}

const ITEM_FLAVOR_TEXTS = [
    "Legends say *Name* was forged in the heart of a dying star.",
    "A mad king once traded his entire realm just to possess *Name*.",
    "You feel a strange hum of energy radiating from *Name*.",
    "*Name* was thought lost during the Great Cataclysm centuries ago.",
    "The craftsmanship of *Name* is unlike anything you have seen before.",
    "Whispers of the ancients echo in your mind as you hold *Name*.",
    "*Name* is covered in runes that glow faintly in the dark.",
    "It is said that *Name* chooses its wielder, not the other way around.",
    "A simple appearance hides the devastating power of *Name*.",
    "*Name* feels lighter than air, yet strikes with the weight of a mountain.",
    "The previous owner of *Name* vanished under mysterious circumstances.",
    "Dust falls away from *Name*, revealing it to be pristine and untouched.",
    "*Name* smells faintly of ozone and old parchment.",
    "You recognize *Name* from a nursery rhyme you heard as a child.",
    "The metal of *Name* is cold to the touch, stealing heat from the air.",
    "*Name* vibrates in harmony with your own heartbeat.",
    "This *Name* was once wielded by the Captain of the Royal Guard.",
    "A cryptic inscription on *Name* reads: 'To he who dares.'",
    "Holding *Name* fills you with an unshakeable sense of confidence.",
    "*Name* seems to absorb the light around it.",
    "This *Name* is a masterpiece of dwarven engineering.",
    "Elven artisans sang songs of power into the making of *Name*.",
    "The edge of *Name* is so sharp it seems to cut the wind itself.",
    "*Name* is stained with the history of a thousand battles.",
    "A faint mist swirls around *Name* when you grasp it.",
    "*Name* is a relic from the Age of Heroes.",
    "The balance of *Name* is absolute perfection.",
    "You found *Name* hidden beneath a pile of rubble, waiting for you.",
    "This *Name* glimmers with a golden aura of prosperity.",
    "Fate has brought *Name* into your hands for a reason."
];

function getFlavorText(itemName) {
    const text = ITEM_FLAVOR_TEXTS[Math.floor(Math.random() * ITEM_FLAVOR_TEXTS.length)];
    return text.replace('*Name*', `<b>${itemName}</b>`);
}

const DECK_TREASURE = generateTreasureDeck();
const DECK_ENCOUNTER = [
    // STR/DEX
    { name: "Goblin Ambush", type: 'combat', desc: "Goblins jump from the trees!", choices: [{ txt: "Power Through (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture' }, { txt: "Dodge & Counter (DEX 3+)", stat: 'dex', tn: 3, fail: 30, mode: 'capture' }] },
    { name: "Bar Fight", type: 'combat', desc: "A drunk patron swings a stool at you.", choices: [{ txt: "Punch Back (STR 3+)", stat: 'str', tn: 3, fail: 30, mode: 'capture' }, { txt: "Weave Away (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture' }] },
    { name: "Wolf Pack", type: 'combat', desc: "Hungry wolves circle you.", choices: [{ txt: "Intimidate (STR 4+)", stat: 'str', tn: 4, fail: 50, mode: 'capture', val: 20 }, { txt: "Quick Strikes (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 50 }] },
    { name: "Rogue Duelist", type: 'combat', desc: "He challenges you to a duel.", choices: [{ txt: "Overpower (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture', val: 80 }, { txt: "Parry (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 40 }] },
    { name: "Falling Rocks", type: 'check', desc: "A landslide! React fast!", choices: [{ txt: "Hold it up (STR 5+)", stat: 'str', tn: 5, fail: 50, mode: 'capture', val: 100 }, { txt: "Dive (DEX 3+)", stat: 'dex', tn: 3, fail: 30, mode: 'capture', val: 40 }] },
    { name: "Mud Pit", type: 'check', desc: "You are stuck in thick mud.", choices: [{ txt: "Pull Out (STR 3+)", stat: 'str', tn: 3, fail: 20, mode: 'capture', val: 30 }, { txt: "Balance Out (DEX 5+)", stat: 'dex', tn: 5, fail: 40, mode: 'capture', val: 80 }] },
    { name: "Giant Spider", type: 'combat', desc: "It descends on a silk thread.", choices: [{ txt: "Smash It (STR 4+)", stat: 'str', tn: 4, fail: 50, mode: 'capture' }, { txt: "Roll Away (DEX 3+)", stat: 'dex', tn: 3, fail: 30, mode: 'capture' }] },
    { name: "Bear Trap", type: 'check', desc: "SNAP! Your leg is caught.", choices: [{ txt: "Pry Open (STR 4+)", stat: 'str', tn: 4, fail: 50, mode: 'capture', val: 50 }, { txt: "Pick Lock (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 50 }] },
    { name: "Wild Boar", type: 'combat', desc: "It charges from the brush.", choices: [{ txt: "Wrestle (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture' }, { txt: "Matador Dodge (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 40 }] },
    { name: "Falling Chandelier", type: 'check', desc: "The chain snaps above you!", choices: [{ txt: "Catch It (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture', val: 80 }, { txt: "Jump Away (DEX 3+)", stat: 'dex', tn: 3, fail: 20, mode: 'capture', val: 20 }] },
    { name: "Runaway Cart", type: 'check', desc: "It's rolling down the hill towards town.", choices: [{ txt: "Stop it (STR 5+)", stat: 'str', tn: 5, fail: 50, mode: 'capture', val: 100 }, { txt: "Jump on & Steer (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 70 }] },
    { name: "Training Dummy", type: 'combat', desc: "A magically animated sparring partner.", choices: [{ txt: "Heavy Hit (STR 3+)", stat: 'str', tn: 3, fail: 20, mode: 'capture' }, { txt: "Precision (DEX 3+)", stat: 'dex', tn: 3, fail: 20, mode: 'capture' }] },
    { name: "Bee Swarm", type: 'combat', desc: "Not the bees! They are everywhere!", choices: [{ txt: "Swat Wildly (STR 3+)", stat: 'str', tn: 3, fail: 30, mode: 'capture' }, { txt: "Outrun (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 30 }] },
    { name: "Arm Wrestling", type: 'check', desc: "A dwarf challenges you.", choices: [{ txt: "Brute Force (STR 5+)", stat: 'str', tn: 5, fail: 50, mode: 'capture', val: 100 }, { txt: "Technique (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 80 }] },
    { name: "Bandit Toll", type: 'check', desc: "They block the bridge.", choices: [{ txt: "Shove Aside (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture' }, { txt: "Slip Past (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture' }] },
    { name: "Greased Pig", type: 'check', desc: "Catch the prize pig at the fair.", choices: [{ txt: "Tackle (STR 4+)", stat: 'str', tn: 4, fail: 30, mode: 'capture', val: 60 }, { txt: "Snatch (DEX 5+)", stat: 'dex', tn: 5, fail: 30, mode: 'capture', val: 90 }] },
    { name: "Crumbling Floor", type: 'check', desc: "The wood gives way beneath you.", choices: [{ txt: "Hang on (STR 3+)", stat: 'str', tn: 3, fail: 30, mode: 'capture', val: 20 }, { txt: "Leap (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 50 }] },

    // DEX/INT
    { name: "Arcane Trap", type: 'check', desc: "Runes glow on the floor.", choices: [{ txt: "Disarm (DEX 5+)", stat: 'dex', tn: 5, fail: 60, mode: 'capture', val: 100 }, { txt: "Dispel (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture', val: 50 }] },
    { name: "Pickpocket", type: 'check', desc: "A thief bumps into you.", choices: [{ txt: "Grab Him (DEX 3+)", stat: 'dex', tn: 3, fail: 30, mode: 'capture', val: 40 }, { txt: "Predict Path (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 70 }] },
    { name: "Locked Gate", type: 'check', desc: "An ancient mechanism blocks the way.", choices: [{ txt: "Climb Over (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 50 }, { txt: "Solve Puzzle (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 50 }] },
    { name: "Illusionist", type: 'combat', desc: "Copies of the wizard surround you.", choices: [{ txt: "Strike True (DEX 5+)", stat: 'dex', tn: 5, fail: 50, mode: 'capture', val: 80 }, { txt: "See Truth (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture', val: 30 }] },
    { name: "Arrow Storm", type: 'combat', desc: "Arrows fly from the bushes.", choices: [{ txt: "Dodge (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture' }, { txt: "Shield Spell (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture' }] },
    { name: "Card Game", type: 'check', desc: "A high stakes game at a tavern.", choices: [{ txt: "Sleight of Hand (DEX 5+)", stat: 'dex', tn: 5, fail: 100, mode: 'capture', val: 200 }, { txt: "Count Cards (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 100 }] },
    { name: "Poison Gas", type: 'check', desc: "Green mist fills the room.", choices: [{ txt: "Hold Breath & Run (DEX 3+)", stat: 'dex', tn: 3, fail: 30, mode: 'capture', val: 40 }, { txt: "Identify Antidote (INT 5+)", stat: 'int', tn: 5, fail: 60, mode: 'capture', val: 120 }] },
    { name: "Sphinx", type: 'combat', desc: "It demands an answer or your life.", choices: [{ txt: "Run Past (DEX 5+)", stat: 'dex', tn: 5, fail: 80, mode: 'capture' }, { txt: "Answer Riddle (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 50 }] },
    { name: "Shell Game", type: 'check', desc: "A street scammer challenges you.", choices: [{ txt: "Fast Eyes (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 80 }, { txt: "Calculate (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 80 }] },
    { name: "Mimic", type: 'combat', desc: "The chest has teeth!", choices: [{ txt: "Reflex Stab (DEX 4+)", stat: 'dex', tn: 4, fail: 40, mode: 'capture', val: 50 }, { txt: "Identify (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture' }] },
    { name: "Singing Contest", type: 'check', desc: "Perform for the crowd.", choices: [{ txt: "Dance (DEX 4+)", stat: 'dex', tn: 4, fail: 30, mode: 'capture', val: 60 }, { txt: "Compose Lyrics (INT 4+)", stat: 'int', tn: 4, fail: 30, mode: 'capture', val: 60 }] },
    { name: "Flying Book", type: 'check', desc: "A spellbook flutters away.", choices: [{ txt: "Catch It (DEX 4+)", stat: 'dex', tn: 4, fail: 20, mode: 'capture', val: 50 }, { txt: "Summon It (INT 3+)", stat: 'int', tn: 3, fail: 20, mode: 'capture', val: 50 }] },
    { name: "Tripwire", type: 'check', desc: "A thin wire spans the path.", choices: [{ txt: "Cut Carefully (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 30 }, { txt: "Analyze Mechanism (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 30 }] },
    { name: "Fey Prank", type: 'combat', desc: "A pixie steals your boots.", choices: [{ txt: "Chase (DEX 5+)", stat: 'dex', tn: 5, fail: 30, mode: 'capture', val: 40 }, { txt: "Trick It Back (INT 4+)", stat: 'int', tn: 4, fail: 30, mode: 'capture', val: 60 }] },
    { name: "Lost in Woods", type: 'check', desc: "The path has vanished.", choices: [{ txt: "Climb Tree (DEX 3+)", stat: 'dex', tn: 3, fail: 20, mode: 'capture', val: 20 }, { txt: "Navigate Stars (INT 4+)", stat: 'int', tn: 4, fail: 20, mode: 'capture', val: 40 }] },
    { name: "Clockwork Toy", type: 'combat', desc: "A mechanical soldier malfunctions.", choices: [{ txt: "Disable (DEX 4+)", stat: 'dex', tn: 4, fail: 30, mode: 'capture' }, { txt: "Reprogram (INT 5+)", stat: 'int', tn: 5, fail: 50, mode: 'capture', val: 100 }] },
    { name: "Alchemy Accident", type: 'check', desc: "A potion is about to explode.", choices: [{ txt: "Throw it (DEX 4+)", stat: 'dex', tn: 4, fail: 50, mode: 'capture', val: 40 }, { txt: "Neutralize (INT 5+)", stat: 'int', tn: 5, fail: 60, mode: 'capture', val: 100 }] },

    // STR/INT
    { name: "Stone Golem", type: 'combat', desc: "Slow but incredibly tough.", choices: [{ txt: "Shatter (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture', val: 80 }, { txt: "Find Weakness (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture' }] },
    { name: "Cursed Armor", type: 'combat', desc: "An animated suit of armor attacks.", choices: [{ txt: "Bash (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture' }, { txt: "Banish Spirit (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture' }] },
    { name: "Rusted Portcullis", type: 'check', desc: "The gate is heavy and stuck.", choices: [{ txt: "Lift (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture', val: 50 }, { txt: "Leverage (INT 3+)", stat: 'int', tn: 3, fail: 20, mode: 'capture', val: 40 }] },
    { name: "Orc Shaman", type: 'combat', desc: "He channels lightning.", choices: [{ txt: "Rush Him (STR 4+)", stat: 'str', tn: 4, fail: 50, mode: 'capture', val: 30 }, { txt: "Counterspell (INT 5+)", stat: 'int', tn: 5, fail: 60, mode: 'capture', val: 80 }] },
    { name: "Magic Sword", type: 'check', desc: "A sword stuck in a stone.", choices: [{ txt: "Pull (STR 6+)", stat: 'str', tn: 6, fail: 50, mode: 'capture', val: 200 }, { txt: "Arcane Release (INT 5+)", stat: 'int', tn: 5, fail: 50, mode: 'capture', val: 150 }] },
    { name: "Drunken Giant", type: 'combat', desc: "He creates a mess in the tavern.", choices: [{ txt: "Wrestle (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture', val: 70 }, { txt: "Outsmart (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture', val: 30 }] },
    { name: "Haunted House", type: 'combat', desc: "Furniture is flying everywhere.", choices: [{ txt: "Smash Furniture (STR 3+)", stat: 'str', tn: 3, fail: 30, mode: 'capture' }, { txt: "Exorcise (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 50 }] },
    { name: "Collapsed Mine", type: 'check', desc: "Rubble blocks the gold vein.", choices: [{ txt: "Dig (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture', val: 60 }, { txt: "Engineer Support (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 60 }] },
    { name: "Crystal Guardian", type: 'combat', desc: "Made of resonating crystal.", choices: [{ txt: "Smash (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture', val: 70 }, { txt: "Sonic Resonance (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 70 }] },
    { name: "Frozen Door", type: 'check', desc: "Ice seals the vault.", choices: [{ txt: "Kick Open (STR 5+)", stat: 'str', tn: 5, fail: 40, mode: 'capture', val: 60 }, { txt: "Melt Spell (INT 3+)", stat: 'int', tn: 3, fail: 20, mode: 'capture', val: 30 }] },
    { name: "Possessed Bear", type: 'combat', desc: "Glowing purple eyes stare at you.", choices: [{ txt: "Subdue (STR 5+)", stat: 'str', tn: 5, fail: 60, mode: 'capture' }, { txt: "Cleansing Ritual (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 60 }] },
    { name: "Sinking Boat", type: 'check', desc: "Taking on water fast!", choices: [{ txt: "Bail Water (STR 4+)", stat: 'str', tn: 4, fail: 30, mode: 'capture', val: 30 }, { txt: "Repair Hull (INT 4+)", stat: 'int', tn: 4, fail: 30, mode: 'capture', val: 50 }] },
    { name: "Statue Puzzle", type: 'check', desc: "Heavy statues must be arranged.", choices: [{ txt: "Push Them (STR 5+)", stat: 'str', tn: 5, fail: 50, mode: 'capture', val: 60 }, { txt: "Solve Order (INT 4+)", stat: 'int', tn: 4, fail: 50, mode: 'capture', val: 60 }] },
    { name: "Magical Barrier", type: 'check', desc: "A forcefield blocks the loot.", choices: [{ txt: "Hit Hard (STR 6+)", stat: 'str', tn: 6, fail: 80, mode: 'capture', val: 150 }, { txt: "Counter-Frequency (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 80 }] },
    { name: "Entangled Roots", type: 'combat', desc: "Vines grab your legs.", choices: [{ txt: "Rip Free (STR 4+)", stat: 'str', tn: 4, fail: 30, mode: 'capture' }, { txt: "Wither Spell (INT 3+)", stat: 'int', tn: 3, fail: 30, mode: 'capture' }] },
    { name: "Library Fire", type: 'check', desc: "Save the ancient scrolls!", choices: [{ txt: "Carry Water (STR 4+)", stat: 'str', tn: 4, fail: 40, mode: 'capture', val: 70 }, { txt: "Frost Spell (INT 4+)", stat: 'int', tn: 4, fail: 40, mode: 'capture', val: 70 }] },
    { name: "Gargoyle", type: 'combat', desc: "Stone turns to flesh.", choices: [{ txt: "Break Wings (STR 5+)", stat: 'str', tn: 5, fail: 50, mode: 'capture' }, { txt: "Command Word (INT 5+)", stat: 'int', tn: 5, fail: 50, mode: 'capture', val: 100 }] },

];

const DECK_SKIRMISH = [
    // STR/DEX (Bosses)
    { name: "Assassin Lord", type: 'combat', desc: "Fast and deadly.", choices: [{ txt: "Crush Him (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 50 }, { txt: "Match Speed (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 120, mode: 'capture', val: 150 }] },
    { name: "Hydra", type: 'combat', desc: "Heads regrow as you cut them.", choices: [{ txt: "Sever Heads (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Dance Around (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 50 }] },
    { name: "Blade Gauntlet", type: 'check', desc: "A hallway of swinging scythes.", choices: [{ txt: "Block & Move (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 80, mode: 'capture', val: 150 }, { txt: "Acrobatics (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 80, mode: 'capture', val: 150 }] },
    { name: "Dragon Turtle", type: 'combat', desc: "An armored beast of the deep.", choices: [{ txt: "Crack Shell (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 120, mode: 'capture', val: 100 }, { txt: "Aim for Eyes (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 50 }] },
    { name: "Chimera", type: 'combat', desc: "Lion, Goat, and Snake heads attack.", choices: [{ txt: "Hold Heads (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }, { txt: "Dodge Breath (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }] },
    { name: "Collapsing Temple", type: 'check', desc: "The roof is coming down!", choices: [{ txt: "Hold Pillar (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 250 }, { txt: "Parkour Out (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Dragon Rider", type: 'combat', desc: "An elite knight on a drake.", choices: [{ txt: "Knock Off (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 80 }, { txt: "Aerial Battle (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }] },
    { name: "Sandworm", type: 'combat', desc: "It bursts from the ground.", choices: [{ txt: "Wrestle Maw (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 120, mode: 'capture', val: 150 }, { txt: "Ride It (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 120, mode: 'capture', val: 300 }] },
    { name: "Blade Master", type: 'combat', desc: "He wields six swords.", choices: [{ txt: "Parry All (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 80 }, { txt: "Riposte (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }] },
    { name: "Tsunami", type: 'check', desc: "A massive wave approaches.", choices: [{ txt: "Anchor Self (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Climb High (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Juggernaut", type: 'combat', desc: "An unstoppable armored charger.", choices: [{ txt: "Stop Momentum (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Trip Him (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }] },
    { name: "Invisible Stalker", type: 'combat', desc: "You can hear it breathing.", choices: [{ txt: "Flail Wildly (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 80, mode: 'capture' }, { txt: "React to Sound (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 80, mode: 'capture', val: 120 }] },
    { name: "Gladiator Pit", type: 'combat', desc: "You are thrown into the arena.", choices: [{ txt: "Survive (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }, { txt: "Flourish (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 100, mode: 'capture', val: 250 }] },

    // DEX/INT (Bosses)
    // { name: "Lich King", ... REMOVED per user request (Now Mini-Boss in Vampire Manor) },
    { name: "Mirror Maze", type: 'check', desc: "Reflections confuse you.", choices: [{ txt: "Wall Jump (DEX 6+)", stat: 'dex', tn: 6, req: 1, fail: 100, mode: 'capture', val: 200 }, { txt: "Deduce Path (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 80, mode: 'capture', val: 120 }] },
    { name: "Void Stalker", type: 'combat', desc: "It phases out of reality.", choices: [{ txt: "Reaction Shot (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 80 }, { txt: "Predict Phase (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 80 }] },
    { name: "Ancient Vault", type: 'check', desc: "The lock of the gods.", choices: [{ txt: "Legendary Pick (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 150, mode: 'capture', val: 300 }, { txt: "Dispel Ward (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Time Loop", type: 'check', desc: "You are reliving this moment.", choices: [{ txt: "Break Cycle (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 100, mode: 'capture', val: 200 }, { txt: "Unravel Spell (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 100, mode: 'capture', val: 300 }] },
    { name: "Lich's Phylactery", type: 'check', desc: "The source of his power.", choices: [{ txt: "Steal It (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }, { txt: "Disenchant (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Psychic Storm", type: 'check', desc: "Bolts of mental energy rain down.", choices: [{ txt: "Dodge Bolts (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 80, mode: 'capture', val: 100 }, { txt: "Mental Shield (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 80, mode: 'capture', val: 100 }] },
    { name: "Laser Grid", type: 'check', desc: "Deadly beams block the treasure.", choices: [{ txt: "Gymnastics (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 150, mode: 'capture', val: 250 }, { txt: "Hack Terminal (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Doppelganger", type: 'combat', desc: "It knows your every move.", choices: [{ txt: "Reflex Duel (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }, { txt: "Logic Paradox (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }] },
    { name: "Clockwork Dragon", type: 'combat', desc: "A masterpiece of destruction.", choices: [{ txt: "Jam Gears (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 120 }, { txt: "Override Code (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 120, mode: 'capture', val: 220 }] },
    { name: "Poisoned Banquet", type: 'check', desc: "The King is dying!", choices: [{ txt: "Sleight of Hand (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 200, mode: 'capture', val: 300 }, { txt: "Mix Antidote (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 150, mode: 'capture', val: 200 }] },
    { name: "Floating Island", type: 'check', desc: "The bridge has crumbled away.", choices: [{ txt: "Parkour Gaps (DEX 5+)", stat: 'dex', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }, { txt: "Flight Spell (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Shadow Master", type: 'combat', desc: "He attacks from the dark.", choices: [{ txt: "Counter-Strike (DEX 6+)", stat: 'dex', tn: 6, req: 2, fail: 120, mode: 'capture', val: 150 }, { txt: "Light Spell (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 120 }] },

    // STR/INT (Bosses)
    { name: "Demon Gate", type: 'check', desc: "Demons pour from the portal.", choices: [{ txt: "Bar the Gate (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 250 }, { txt: "Close Portal (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Iron Golem", type: 'combat', desc: "Impervious to normal weapons.", choices: [{ txt: "Topple (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 50 }, { txt: "Rust Spell (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }] },
    { name: "Vampire Lord", type: 'combat', desc: "Ancient and powerful.", choices: [{ txt: "Drive Stake (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }, { txt: "Holy Light (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }] },
    { name: "Obelisk", type: 'check', desc: "A fallen monument blocks the road.", choices: [{ txt: "Heave (STR 6+)", stat: 'str', tn: 6, req: 1, fail: 100, mode: 'capture', val: 150 }, { txt: "Levitate (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 80, mode: 'capture', val: 120 }] },
    { name: "Volcano Eruption", type: 'check', desc: "Lava flows towards the village.", choices: [{ txt: "Divert Flow (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Freeze Magma (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 150, mode: 'capture', val: 250 }] },
    { name: "Titan", type: 'combat', desc: "A giant as tall as a mountain.", choices: [{ txt: "Leg Sweep (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 200, mode: 'capture', val: 300 }, { txt: "Banishment (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 200, mode: 'capture', val: 300 }] },
    { name: "Necropolis Gate", type: 'check', desc: "Sealed by blood magic.", choices: [{ txt: "Break It (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Holy Word (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Living Wall", type: 'combat', desc: "The bricks try to crush you.", choices: [{ txt: "Smash Bricks (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }, { txt: "Command Word (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 100 }] },
    { name: "Storm Giant", type: 'combat', desc: "He throws lightning bolts.", choices: [{ txt: "Arm Wrestle (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Lightning Rod (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 120, mode: 'capture', val: 150 }] },
    { name: "Void Rift", type: 'check', desc: "Reality is tearing apart.", choices: [{ txt: "Force Closed (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 200, mode: 'capture', val: 300 }, { txt: "Seal Magic (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 150, mode: 'capture', val: 300 }] },
    { name: "Cursed Tree", type: 'combat', desc: "It drains life from the land.", choices: [{ txt: "Uproot (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 120, mode: 'capture', val: 150 }, { txt: "Purify Root (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Meat Grinder", type: 'check', desc: "A room of spinning blades.", choices: [{ txt: "Jam Gears (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }, { txt: "Shutdown (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 100, mode: 'capture', val: 150 }] },
    { name: "Abyssal Horror", type: 'combat', desc: "Madness given form.", choices: [{ txt: "Crush It (STR 6+)", stat: 'str', tn: 6, req: 2, fail: 150, mode: 'capture', val: 200 }, { txt: "Mind Blast (INT 6+)", stat: 'int', tn: 6, req: 2, fail: 150, mode: 'capture', val: 250 }] },
    { name: "King of the Hill", type: 'combat', desc: "An Orc Warlord challenges you.", choices: [{ txt: "Throw Off (STR 5+)", stat: 'str', tn: 5, req: 2, fail: 80, mode: 'capture', val: 100 }, { txt: "Tactics (INT 5+)", stat: 'int', tn: 5, req: 2, fail: 80, mode: 'capture', val: 120 }] },
];

const LOCATIONS = [
    { name: "Old Crooks Inn", type: "start", cost: 0, color: "#4ade80", img: "https://static.wixstatic.com/media/b16479_b4d35a4270574b5380497c6eb27146bd~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_a353cedcf17c4b618027f64190b6be73~mv2.jpg", flavor: "A warm hearth greets you, smelling of roasted meat and ale. Rough laughter fills the air as adventurers swap stories of their latest conquests." },
    { name: "Rat Cellar", type: "combat", cost: 60, tn: 3, req: 1, color: "#9ca3af", img: "https://static.wixstatic.com/media/b16479_7981e4bf2a9f42fca2ba9335a79b6315~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_1f9645c758e8451c90e7d733f2bc5057~mv2.jpg", flavor: "Squeaking echoes from the damp shadows of this musty basement. Red eyes watch you from the cracks." },
    { name: "Chest", type: "chest", cost: 0, color: "#fcd34d", img: "https://static.wixstatic.com/media/b16479_2a0e4f70b29e4611927b65c33fce86f4~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_87f60295a50d4881bc95f728314e37fb~mv2.jpg", flavor: "The dirt here has been recently disturbed. You spot the corner of a wooden box protruding from the mud." },
    { name: "Wolf Den", type: "combat", cost: 60, tn: 3, req: 1, color: "#9ca3af", img: "https://static.wixstatic.com/media/b16479_4318c9bb74dd48ddbe8702ec17a059dd~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_2e2baedb53b944da923cc49f6dcce0ff~mv2.jpg", flavor: "Gnawed bones litter the entrance to this dark cave. A low growl reverberates from the shadows." },
    { name: "Tax", type: "tax", cost: 0, color: "#f87171", img: "https://static.wixstatic.com/media/b16479_b2ff79acb9db40c1b8e230e2b43f2a53~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_3671f830191345c1b8a315017da72a5b~mv2.jpg", flavor: "The King's tax collectors block the road with their armored carriage. Pay up or face the dungeon." },
    { name: "Stable", type: "shop", cost: 200, color: "#78350f", img: "https://static.wixstatic.com/media/b16479_63e31ea7ac144c2c8086342125a30877~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_f660a75ab6284f56b2c90f4f221f53a3~mv2.jpg", flavor: "The smell of hay and horses is strong here. A merchant offers fresh mounts to speed your journey." },
    { name: "Goblin Camp", type: "combat", cost: 100, tn: 4, req: 1, color: "#84cc16", img: "https://static.wixstatic.com/media/b16479_1d0dc90e90e04783a2cd04823ccf9255~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_c48e6fdf163d4dd68b411d5674de6b4b~mv2.jpg", flavor: "Crude tents made of animal skins dot the clearing. You hear the chaotic chatter of goblins." },
    { name: "Fairy Ring", type: "mystery", cost: 0, color: "#a855f7", img: "https://static.wixstatic.com/media/b16479_1437cc54895e4595a43f461ed959c5ce~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_65c314c4ef784a58b9b162d4d30b1698~mv2.jpg", flavor: "A circle of mushrooms glows with a soft, unnatural light. The air hums with chaotic magic." },
    { name: "Bandit Road", type: "combat", cost: 100, tn: 4, req: 1, color: "#84cc16", img: "https://static.wixstatic.com/media/b16479_5101a6720f074efcb628b70b85bcdac6~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_6364e428d9504a139a2c56e1e168eb3d~mv2.jpg", flavor: "This stretch of road is suspiciously quiet. Broken wagon wheels suggest travelers often meet a grim fate here." },
    { name: "Ogre Cave", type: "combat", cost: 120, tn: 4, req: 1, color: "#84cc16", img: "https://static.wixstatic.com/media/b16479_778f6cf396474b47835aa4e8c103bffd~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_d5dcf031b6c24893b00b8fa6d0145eca~mv2.jpg", flavor: "A massive boulder blocks the wind, but not the smell of rotting meat. Something very large calls this home." },
    { name: "Dungeon", type: "jail", cost: 0, color: "#fb923c", img: "https://static.wixstatic.com/media/b16479_a259ef3e7d8c4c09a88aea824537e57b~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_117e17f3d5b84577beb01fcca1cddad9~mv2.jpg", flavor: "Cold iron bars and damp stone walls surround you. It is a place of despair and lost time." },
    { name: "Crypt", type: "combat", cost: 140, tn: 4, req: 2, color: "#475569", img: "https://static.wixstatic.com/media/b16479_c230f43aefe64d898b4d2dfe91ad0ba0~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_eb64132a865f440c97f6652e340cbb05~mv2.jpg", flavor: "The air is stale and smells of dust and decay. Ancient sarcophagi line the walls. The dead do not sleep easily here." },
    { name: "Mana Well", type: "util", cost: 150, color: "#3b82f6", img: "https://static.wixstatic.com/media/b16479_e2c1dbc5f8f64a988893a00b0cd6f066~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_90031776e646488c93f69cc6461d9333~mv2.jpg", flavor: "Pure arcane energy bubbles up from the earth in a glowing blue spring. Wizards travel miles just to glimpse it." },
    { name: "Witch Hut", type: "combat", cost: 140, tn: 4, req: 2, color: "#475569", img: "https://static.wixstatic.com/media/b16479_6d223ad95ed04eea8a963cf5b3596e35~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_b095b71e60ff4619833aa4b45bc7795d~mv2.jpg", flavor: "A crooked shack stands on chicken legs in the swamp. Green smoke billows from the chimney." },
    { name: "Graveyard", type: "combat", cost: 160, tn: 4, req: 2, color: "#475569", img: "https://static.wixstatic.com/media/b16479_d7da23aa207b4549b9cd245959d69e6e~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_8ae524f80b344def99ec6833ea717083~mv2.jpg", flavor: "Fog clings to the tilted headstones of this forgotten cemetery. The ground feels soft, as if something is trying to claw its way out." },
    { name: "Port", type: "shop", cost: 200, color: "#78350f", img: "https://static.wixstatic.com/media/b16479_bc4d708aeb394233b697b148d0d33dc7~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_7403c140a66345be8cb9a8eb5b0ebc99~mv2.jpg", flavor: "The cry of seagulls and the crash of waves welcome you. Ships from distant lands unload exotic cargo on the docks." },
    { name: "Orc Fort", type: "combat", cost: 180, tn: 5, req: 1, color: "#b91c1c", img: "https://static.wixstatic.com/media/b16479_c529b3b0e6c7410989ac654ae3f8cac7~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_dc2c9a5dfd124ef6b8320451e5359218~mv2.jpg", flavor: "Jagged wooden spikes surround a fortified encampment. War drums beat a steady rhythm that shakes the ground." },
    { name: "Chest", type: "chest", cost: 0, color: "#fcd34d", img: "https://static.wixstatic.com/media/b16479_9bfca911c8764f158b066493eae2bc81~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_87f60295a50d4881bc95f728314e37fb~mv2.jpg", flavor: "An ornate iron-bound chest sits half-buried in the dirt. The lock looks rusty but the wood is sound." },
    { name: "Troll Bridge", type: "combat", cost: 180, tn: 5, req: 1, color: "#b91c1c", img: "https://static.wixstatic.com/media/b16479_249a86b0e4f4415ba0a9be35119eb43a~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_0e9e3392a6a44f8291b357aacf04aef8~mv2.jpg", flavor: "A massive stone bridge spans the rushing river below. A hulking figure demands a toll from anyone wishing to cross." },
    { name: "Wyvern Peak", isDungeonEntrance: true, type: "combat", cost: 200, tn: 5, req: 1, color: "#b91c1c", img: "https://static.wixstatic.com/media/b16479_f91826c1558c493ba71c3a2c0a05ff71~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_d3f9c5b8ba2c4ef2998dd9bd6d2ac062~mv2.jpg", flavor: "The air is thin and cold up on this jagged mountain spire. Screeches echo from the clouds as winged shadows circle above." },
    { name: "Capital City", type: "park", cost: 0, color: "#e2e8f0", img: "https://static.wixstatic.com/media/b16479_e5d51e21d1d84a009b8845a522bb5d23~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_909eefa9a23646b2825e2f3819031b90~mv2.jpg", flavor: "The white walls of the capital gleam in the sunlight. Guards in polished armor patrol the streets. Here, the King's law is absolute." },
    { name: "Lava Pits", type: "combat", cost: 220, tn: 5, req: 2, color: "#7f1d1d", img: "https://static.wixstatic.com/media/b16479_799f54f3baaf47d3a6917ae7c8efb12a~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_7672054ca2e14a6c95d9151543aaba1d~mv2.jpg", flavor: "The heat is unbearable as magma bubbles to the surface. Sulfurous fumes burn your lungs and obscure your vision." },
    { name: "Dark Altar", type: "combat", cost: 200, tn: 5, req: 2, color: "#7f1d1d", img: "https://static.wixstatic.com/media/b16479_3616e7911ae547e8aaf64dd76e7610b8~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_333c76fdd88842199ab18801646ddbbe~mv2.jpg", flavor: "Bloodstains mar the surface of this obsidian slab. Whispers in an unknown tongue fill your mind with dread." },
    { name: "Demon Gate", isDungeonEntrance: true, type: "combat", cost: 220, tn: 5, req: 2, color: "#7f1d1d", img: "https://static.wixstatic.com/media/b16479_0738c43cfb574de79bdf4dd84c0a663b~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_cf022d5d1c264836aade5ffa21a5e77c~mv2.jpg", flavor: "A tear in reality reveals a landscape of fire and torment. Horrors try to claw their way through the barrier." },
    { name: "Dragon Tooth", type: "combat", cost: 240, tn: 5, req: 2, color: "#7f1d1d", img: "https://static.wixstatic.com/media/b16479_aadde8877c854d8fa78d286c00699f7c~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_e373bec825124ac98094938d17fcf71b~mv2.jpg", flavor: "This jagged rock formation looks like the maw of a beast. Legends say an ancient dragon died here, cursing the land." },
    { name: "Airship", type: "shop", cost: 200, color: "#78350f", img: "https://static.wixstatic.com/media/b16479_be49c909366540c8a0b017661cc63e51~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_b79ed0dec9104e64a3180a7683ea3fce~mv2.jpg", flavor: "A massive vessel floats tethered to a high tower. The crew shouts orders as they prepare for departure. The sky is the limit." },
    { name: "Lich Tower", type: "combat", cost: 260, tn: 6, req: 1, color: "#581c87", img: "https://static.wixstatic.com/media/b16479_7bf555b6dc624c4f9523e3faab71a7c8~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_2e1c7a754fa84bfd8523c85fd1d415f8~mv2.jpg", flavor: "A spire of black stone pierces the sky, radiating necromantic energy. The master of this tower conquered death long ago." },
    { name: "Vampire Manor", isDungeonEntrance: true, type: "combat", cost: 260, tn: 6, req: 1, color: "#581c87", img: "https://static.wixstatic.com/media/b16479_20a15d19b6424e22bc444a5e1ee7a994~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_c3cc7bb80938445bb99b8f38f2c91ca1~mv2.jpg", flavor: "An elegant gothic mansion sits atop a lonely hill. The windows are dark, but you feel eyes watching you." },
    { name: "Shrine", type: "util", cost: 150, color: "#3b82f6", img: "https://static.wixstatic.com/media/b16479_b4682e4fcd6f4dc0b127326528fe97a8~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_c90b252d420f4e84ac0340d4555fbdc8~mv2.jpg", flavor: "A humble statue stands covered in vines and offerings. A sense of peace washes over you, healing your spirit." },
    { name: "Giant's Keep", type: "combat", cost: 280, tn: 6, req: 2, color: "#581c87", img: "https://static.wixstatic.com/media/b16479_eb69b5762c8043cc827fd2c0bad0e45a~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_1e0fcc1de9b844359e778231ea7cc1a3~mv2.jpg", flavor: "Massive stone blocks form a fortress that reaches the clouds. You feel like an ant in this place." },
    { name: "Go To Dungeon", type: "goto", cost: 0, color: "#fb923c", img: "https://static.wixstatic.com/media/b16479_33036f2decd74835b1a323a8bfd08ef3~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_a212ee172c0c4df5a2cb3ccc22653f50~mv2.jpg", flavor: "The city guards have caught you red-handed! You are shackled and dragged away without trial." },
    { name: "Cloud Castle", type: "combat", cost: 300, tn: 6, req: 2, color: "#0f172a", img: "https://static.wixstatic.com/media/b16479_1d74349092e741eda4d34f735125ce72~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_ddb8d1cc6af442348847805aaf261ae5~mv2.jpg", flavor: "A fortress floats effortlessly among the clouds. Harps play soft music, and the air tastes sweet." },
    { name: "Titan's Grip", type: "combat", cost: 300, tn: 6, req: 2, color: "#0f172a", img: "https://static.wixstatic.com/media/b16479_0b5cf76a120a45c8b5da8d2d6da2fa62~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_a091ec8e8f164723b44457bc878dedeb~mv2.jpg", flavor: "Two massive stone hands rise from the earth, clutching a valley. The pressure here is immense." },
    { name: "Chest", type: "chest", cost: 0, color: "#fcd34d", img: "https://static.wixstatic.com/media/b16479_5624f6d69ac6404e9aede7d4dd5f4d47~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_87f60295a50d4881bc95f728314e37fb~mv2.jpg", flavor: "A grand chest reinforced with steel bands sits in the open. The latch is broken, inviting you to look inside." },
    { name: "Void Edge", isDungeonEntrance: true, type: "combat", cost: 320, tn: 6, req: 2, color: "#0f172a", img: "https://static.wixstatic.com/media/b16479_9eb9e98ea6084dccbe4e57fdcc525324~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_3e59b7d985d84b9688c33ea51322875c~mv2.jpg", flavor: "The world seems to end here, dropping off into nothingness. Stars shine brightly below you in the abyss." },
    { name: "Portal", type: "shop", cost: 200, color: "#78350f", img: "https://static.wixstatic.com/media/b16479_062be0c2c7a3459b87645b4f86c8bfd0~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_aa482a0a26e94d6a9754eee718278aa1~mv2.jpg", flavor: "A swirling vortex of purple energy stands before you. It promises travel to distant lands in the blink of an eye." },
    { name: "Smuggler Cove", type: "mystery", cost: 0, color: "#a855f7", img: "https://static.wixstatic.com/media/b16479_70c52b2f88864f7ca3f568cf44a3ad70~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_401a126718a64763924ed8ad5314899d~mv2.jpg", flavor: "A hidden cave by the sea. Thieves use secret tunnels here to vanish without a trace." },
    { name: "Royal Palace", type: "combat", cost: 350, tn: 6, req: 3, color: "#fbbf24", img: "https://static.wixstatic.com/media/b16479_6434230067414f34a341a95383fe7896~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_8d01f5e2e59a4244a4101efb92c77487~mv2.jpg", flavor: "The seat of power in the realm, draped in gold and velvet. Nobles scheme in the corridors while the King sits upon his throne." },
    { name: "Luxury Tax", type: "tax", cost: 0, color: "#f87171", img: "https://static.wixstatic.com/media/b16479_9b58c85963434fb3abe9ecfb4b114c67~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_2513d4cb760246f69570e8f7eb040a39~mv2.jpg", flavor: "The Crown demands a tribute for your continued prosperity. Jewelry and fine clothes make you a target for the taxman." },
    { name: "Ancient Vault", type: "combat", cost: 400, tn: 6, req: 3, color: "#000000", img: "https://static.wixstatic.com/media/b16479_b8a71205363745b7ad11f72ca6ca30b2~mv2.jpg", cardImg: "https://static.wixstatic.com/media/b16479_0e78493512ad4e559cd6392a9341ddad~mv2.jpg", flavor: "Massive steel doors guard the greatest treasure in the realm. Traps and guardians wait for the foolish." }
];

// ---Audio Manager ---
const AUDIO = {
    // --- MUSIC TRACKS ---
    bgm_start: new Audio('https://static.wixstatic.com/mp3/b16479_c60fba3015874266934a6c546fa40969.mp3'),
    bgm_day: new Audio('https://static.wixstatic.com/mp3/b16479_c597397512544410bd146fd4ac8db680.mp3'),
    bgm_night: new Audio('https://static.wixstatic.com/mp3/b16479_bcf6ce4574284c0e980537782ef4994b.mp3'),
    bgm_cinematic: new Audio('https://static.wixstatic.com/mp3/b16479_5c55a418a88448fa9b38db181979a3c1.mp3'),
    sfx_equip: new Audio('https://static.wixstatic.com/mp3/b16479_491cb15103f549cb87f770d84ede0c26.mp3'),
    sfx_click: new Audio('https://static.wixstatic.com/mp3/b16479_ba81d5de617146f8bcda766900080f5d.mp3'),
    sfx_fail: new Audio('https://static.wixstatic.com/mp3/b16479_68b7d8f2d0214569b00ad55a90de74a5.mp3'),
    sfx_transition: new Audio('https://static.wixstatic.com/mp3/b16479_37e7a5db0768438985fdc0f17578f394.mp3'),
    sfx_roll: new Audio('https://static.wixstatic.com/mp3/b16479_f1d9c34c2197472aaae5ed91301149a7.mp3'),
    sfx_gold: new Audio('https://static.wixstatic.com/mp3/b16479_e793cc62b89f4111a1b2820828b452be.mp3'),
    sfx_win: new Audio('https://static.wixstatic.com/mp3/b16479_ad96420ff6db49278fcf1fc13e9b816c.mp3'),
    sfx_hit: new Audio('https://static.wixstatic.com/mp3/b16479_7a157bee526d4555a123e97160fceef7.mp3'),
    sfx_monster_roar: new Audio('https://static.wixstatic.com/mp3/placeholder_monster.mp3'),
    sfx_dragon_roar: new Audio('https://static.wixstatic.com/mp3/placeholder_dragon.mp3'),

    currentTrack: null,
    bgmVolume: 0.4,
    sfxVolume: 0.3,
    allowStartMusic: true,

    init: function () {
        this.bgm_start.loop = true;
        this.bgm_day.loop = true;
        this.bgm_night.loop = true;

        // Initial volume setting
        this.bgm_night.volume = 0.2;
    },

    tryPlayStart: function () {
        if (!this.allowStartMusic) return;
        if (this.currentTrack === this.bgm_start) return;

        this.bgm_start.volume = this.bgmVolume;
        const playPromise = this.bgm_start.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (!this.allowStartMusic) {
                    this.bgm_start.pause();
                    this.bgm_start.currentTime = 0;
                } else {
                    this.currentTrack = this.bgm_start;
                }
            }).catch(e => { });
        }
    },

    setBGM: function (val) {
        this.bgmVolume = parseFloat(val);
        if (this.currentTrack) {
            // FIX: Updated logic here too
            if (this.currentTrack === this.bgm_night) this.currentTrack.volume = this.bgmVolume * 0.8;
            else this.currentTrack.volume = this.bgmVolume;
        }
    },

    setSFX: function (val) { this.sfxVolume = parseFloat(val); },

    playMusic: function (isNight) {
        const target = isNight ? this.bgm_night : this.bgm_day;

        // FIX: Increased from 0.5 to 0.8 (80% of master volume)
        const targetVol = isNight ? (this.bgmVolume * 0.8) : this.bgmVolume;

        if (this.currentTrack === target) {
            target.volume = targetVol;
            return;
        }

        if (this.currentTrack) {
            const old = this.currentTrack;
            new TWEEN.Tween({ v: old.volume })
                .to({ v: 0 }, 2000)
                .onUpdate(o => old.volume = o.v)
                .onComplete(() => { old.pause(); old.currentTime = 0; })
                .start();
        }

        target.volume = 0;
        target.play().catch(e => console.log("Audio blocked", e));
        this.currentTrack = target;

        new TWEEN.Tween({ v: 0 })
            .to({ v: targetVol }, 2000)
            .onUpdate(o => target.volume = o.v)
            .start();
    },

    stopStartMusic: function () {
        this.allowStartMusic = false;
        if (this.currentTrack === this.bgm_start) {
            const old = this.bgm_start;
            new TWEEN.Tween({ v: old.volume })
                .to({ v: 0 }, 1500)
                .onUpdate(o => old.volume = o.v)
                .onComplete(() => { old.pause(); old.currentTime = 0; })
                .start();
        } else {
            this.bgm_start.pause();
            this.bgm_start.currentTime = 0;
        }
    },

    playSound: function (name) {
        if (this.sfxVolume <= 0) return;
        let src = this[name];
        if (src) {
            let sound = src.cloneNode();
            sound.volume = (name === 'sfx_click') ? Math.min(this.sfxVolume, 0.6) : this.sfxVolume;
            sound.play().catch(e => { });
        }
    }
};

function showStatTooltip(type) {
    const tt = document.getElementById('tooltip');
    let title = "", desc = "", color = "";

    switch (type) {
        case 'mov':
            title = "MOVEMENT";
            desc = "Adds extra spaces to your roll. (From Boots or Shadow Step)";
            color = "#10b981";
            break;
        case 'gf':
            title = "GOLD FIND";
            desc = "Bonus gold from Coins, Chests, and Bags.";
            color = "#fbbf24";
            break;
        case 'res':
            title = "RESISTANCE";
            desc = "Reduces gold lost to Rent, Theft, and enemy spells.";
            color = "#3b82f6";
            break;
        case 'hp':
            title = "MAX HEALTH";
            desc = "Total Hit Points. Base HP (10) + STR.";
            color = "#ef4444";
            break;
        case 'dodge':
            title = "DODGE CHANCE";
            desc = "Percentage chance to completely avoid enemy attacks. (1% per DEX)";
            color = "#f472b6";
            break;
        case 'mana':
            title = "MANA SURGE";
            desc = "Chance for abilities to deal TRIPLE damage. (1% per INT)";
            color = "#a855f7";
            break;
    }

    tt.innerHTML = `
        <div class="tt-header"><span class="tt-name" style="color:${color}">${title}</span></div>
        <div class="tt-stat" style="color:#aaa; font-style:italic; border:none; margin-top:5px;">${desc}</div>
    `;
    tt.style.display = 'block';
}

function debugLog(msg) {
    // Only log if the overlay is visible
    const overlay = document.getElementById('debug-log-overlay');
    if (overlay.style.display === 'none') return;

    const content = document.getElementById('debug-log-content');
    const line = document.createElement('div');
    line.className = 'debug-line';

    const time = new Date().toLocaleTimeString().split(' ')[0];
    line.innerHTML = `<span>[${time}]</span> ${msg}`;

    // Add to top (since flex-direction is column-reverse)
    content.insertBefore(line, content.firstChild);
    console.log(`[GAME DEBUG] ${msg}`);
}

function updateCamera() {
    const width = window.innerWidth;
    const isMobileMode = document.body.classList.contains('force-mobile') || width <= 768;

    // --- DESKTOP VIEW ---
    if (!isMobileMode) {
        camera.position.set(0, 55, 0.1);
        camera.lookAt(0, 0, 0);
        return;
    }

    // --- MOBILE VIEW (Dynamic Zoom) ---
    const boardSize = 55;
    const fovRad = (45 * Math.PI) / 360;

    const height = window.innerHeight * 0.82;
    const aspect = width / height;

    let dist;
    if (aspect > 1) {
        dist = (boardSize / 2) / Math.tan(fovRad);
    } else {
        dist = ((boardSize / aspect) / 2) / Math.tan(fovRad);
    }

    camera.position.set(0, dist, 0.1);
    camera.lookAt(0, 0, 0);
}

// --- MOVEMENT PHASE ---

async function rollDice() {
    if (activePlayer.hasRolled && activePlayer.remainingMoves <= 0) {
        addLog(`${activePlayer.name} has already rolled!`, 'log-warning');
        return;
    }

    if (activePlayer.remainingMoves > 0) {
        // Player still has moves (maybe from abilities), just skip roll
        addLog(`${activePlayer.name} continues moving.`, 'log-info');
        return;
    }

    toggleActionButtons(false); // Lock UI

    addLog(`${activePlayer.name} rolls for movement...`, 'log-rare');

    // 3D DICE ROLL
    let rollVal = 1;
    try {
        // Ensure initialized
        if (typeof window.DICE_ROLLER !== 'undefined' && !window.DICE_ROLLER.isInitialized) {
            window.DICE_ROLLER.init();
        }

        if (typeof window.DICE_ROLLER !== 'undefined') {
            // Roll 0 STR, 0 DEX, 0 INT, 1 MOVEMENT DIE (Fourth arg)
            const res = await window.DICE_ROLLER.roll(0, 0, 0, 1);
            rollVal = res.move;
        } else {
            console.warn("DICE_ROLLER not found, using fallback");
            rollVal = Math.floor(Math.random() * 6) + 1;
        }
    } catch (e) {
        console.error("Dice Error", e);
        rollVal = Math.floor(Math.random() * 6) + 1;
    }

    // Check "Sprint" Active Buff? (Assuming buffs are tracked in activePlayer.buffs)
    // Simplified for now.

    const finalMoves = rollVal + activePlayer.stats.dex; // Add DEX to movement? Or just raw?
    // Rules say: Move = Roll. Some variations add modifiers.
    // Let's stick to standard: Roll + Nothing? 
    // Wait, the original code had: const roll = Math.floor(Math.random() * 6) + 1;
    // Then: activePlayer.remainingMoves = roll;

    activePlayer.remainingMoves = rollVal;
    activePlayer.hasRolled = true;

    // Show result
    addLog(`${activePlayer.name} rolled a ${rollVal}!`, 'log-info');
    document.getElementById('movement-display').innerText = `Moves: ${activePlayer.remainingMoves}`;

    // Highlight valid moves
    highlightMovementOptions();
    toggleActionButtons(true);
}

function presentLootUI(p, item, canDonate = true) {
    // MODAL STACKING
    if (document.getElementById('card-modal').classList.contains('active')) {
        modalQueue.push(() => presentLootUI(p, item, canDonate));
        return;
    }
    const m = document.getElementById('card-modal');
    const header = document.getElementById('enc-header');

    header.className = 'card-header loot';
    document.getElementById('enc-title').innerText = "Treasure Found!";

    const rarityColor = getRarityColor(item.rarity || 'common');
    const sellVal = Math.floor((item.cost || 100) / 2);

    let imgHtml = "";
    if (item.img) imgHtml = `<img src="${item.img}" style="width:120px; height:120px; border:2px solid ${rarityColor}; border-radius:8px; margin: 10px auto; display:block; background:#000;">`;

    let statsHtml = "";
    if (item.bonus) Object.keys(item.bonus).forEach(k => { statsHtml += `<div class="tt-stat" style="color:#ef4444">+${item.bonus[k]} ${k.toUpperCase()}</div>`; });
    if (item.moveBonus) statsHtml += `<div class="tt-stat" style="color:#10b981">+${item.moveBonus} MOVEMENT</div>`;
    if (item.goldFind) statsHtml += `<div class="tt-stat" style="color:#fbbf24">+${item.goldFind} GOLD FIND</div>`;
    if (item.resistance) statsHtml += `<div class="tt-stat" style="color:#3b82f6">+${item.resistance} RESISTANCE</div>`;

    if (item.ability) statsHtml += `<div class="tt-abil" style="color:var(--gold-glow); margin-top:5px;">${item.ability.name}: ${item.ability.desc}</div>`;
    else if (item.type === 'scroll') statsHtml += `<div class="tt-stat" style="color:#fbbf24; margin-top:5px;">${item.desc}</div>`;

    const flavor = getFlavorText(item.name);
    document.getElementById('enc-desc').innerHTML = `
        ${imgHtml}
        <div style="font-size:1.4rem; font-weight:bold; color:${rarityColor}; margin-bottom:5px;">${item.name}</div>
        <div style="font-size:0.9rem; color:#aaa; font-style:italic; margin-bottom:15px;">"${flavor}"</div>
        <div style="background:rgba(255,255,255,0.1); padding:10px; border-radius:6px; margin-bottom:15px;">${statsHtml}</div>
    `;

    document.getElementById('dice-result').innerHTML = '';
    const l = document.getElementById('choice-list');
    l.innerHTML = '';

    // --- BUTTON 1: KEEP ---
    const btnKeep = document.createElement('div');
    btnKeep.className = 'choice-btn';
    btnKeep.innerHTML = `<span>KEEP</span> <span style="font-size:0.8rem; color:#aaa;">Add to Inventory</span>`;
    btnKeep.onclick = () => {
        if (p.inventory.length >= 12) {
            alert("Inventory Full! You must Sell or Donate.");
            return;
        }

        // Disable all buttons immediately to prevent double-click
        btnKeep.style.pointerEvents = 'none';
        btnSell.style.pointerEvents = 'none';
        if (l.querySelector('.choice-btn:nth-child(3)')) {
            l.querySelector('.choice-btn:nth-child(3)').style.pointerEvents = 'none';
        }

        p.inventory.push(item);
        addLog(`${p.name} kept ${item.name}.`, "log-success");

        // SYNC: Tell everyone I have this new item (Important for Redraws!)
        if (isMultiplayer) syncPlayerState();

        finishLoot();
    };
    l.appendChild(btnKeep);

    // --- BUTTON 2: SELL ---
    const btnSell = document.createElement('div');
    btnSell.className = 'choice-btn';
    btnSell.innerHTML = `<span>SELL</span> <span style="font-size:0.8rem; color:var(--gold-main);">+${sellVal}G</span>`;
    btnSell.onclick = () => {
        // Disable all buttons immediately to prevent double-click
        btnKeep.style.pointerEvents = 'none';
        btnSell.style.pointerEvents = 'none';
        if (l.querySelector('.choice-btn:nth-child(3)')) {
            l.querySelector('.choice-btn:nth-child(3)').style.pointerEvents = 'none';
        }

        p.gold += sellVal;
        addLog(`${p.name} sold ${item.name} for ${sellVal}G.`, "log-gold");

        // SYNC: Update gold balance for everyone
        if (isMultiplayer) syncPlayerState();

        finishLoot();
    };
    l.appendChild(btnSell);

    // --- BUTTON 3: DONATE (1-Time Limit) ---
    if (canDonate) {
        const btnDonate = document.createElement('div');
        btnDonate.className = 'choice-btn';
        btnDonate.style.borderColor = '#a855f7';
        btnDonate.innerHTML = `<span>DONATE</span> <span style="font-size:0.8rem; color:#d8b4fe;">Gift to King & Re-Draw</span>`;
        btnDonate.onclick = () => {
            // Update local value
            treasuryGold += sellVal;
            addLog(`${p.name} donated to Treasury! (+${sellVal}G to Pot)`, "log-rare");

            // MULTIPLAYER SYNC: Non-host players must update the global Treasury in DB
            if (isMultiplayer && gameId && db) {
                db.ref(`games/${gameId}/treasury`).set(treasuryGold);
                // Also sync gold in case penalties were applied
                syncPlayerState();
            }

            m.classList.remove('active');

            setTimeout(() => {
                addLog("The King sends a final gift in return...", "log-epic");
                const newItem = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);

                // Draw animation and then show UI with canDonate = false
                drawCardAnim('treasure', () => presentLootUI(p, newItem, false));
            }, 600);
        };
        l.appendChild(btnDonate);
    }

    const finishLoot = () => {
        updateHUD();
        m.classList.remove('active');
        if (modalQueue.length > 0) {
            const next = modalQueue.shift();
            setTimeout(() => next(), 300);
        } else {
            endStep();
        }
    };

    m.classList.add('active');
    lastInteractionTime = Date.now(); // Reset AFK timer
}

function handleAiLoot(p, item, canDonate = true) {
    const sellVal = Math.floor((item.cost || 100) / 2);
    let action = 'keep';

    if (item.type === 'scroll' || item.name === 'Pouch of Gold') {
        action = 'keep';
    }
    else if (item.type === 'equip') {
        const current = p.equipment[item.slot];
        if (!current) {
            action = 'keep';
        } else {
            const rarityMap = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4 };
            if (rarityMap[item.rarity] > rarityMap[current.rarity]) {
                action = 'keep';
            } else {
                // Only choose Donate if the flag is true, otherwise force Sell
                action = (canDonate && Math.random() > 0.5) ? 'donate' : 'sell';
            }
        }
    }

    if (action === 'keep') {
        p.inventory.push(item);
        addLog(`${p.name} kept ${item.name}.`, "log-success");
        if (isMultiplayer && myPlayerId === 0) syncPlayerState();
        endStep();
    }
    else if (action === 'sell') {
        p.gold += sellVal;
        addLog(`${p.name} sold ${item.name} for ${sellVal}G.`, "log-gold");
        if (isMultiplayer && myPlayerId === 0) syncPlayerState();
        endStep();
    }
    else if (action === 'donate') {
        treasuryGold += sellVal;
        addLog(`${p.name} donated ${item.name} to the King!`, "log-rare");
        if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/treasury`).set(treasuryGold);

        setTimeout(() => {
            const newItem = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);
            // Pass FALSE for canDonate
            handleAiLoot(p, newItem, false);
        }, 1000);
    }
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    // 1. Update Guards (Roaming logic)
    if (typeof updateGuards === 'function') updateGuards();

    const time = Date.now() * 0.005;

    // 2. Hero Animations (Bobbing / Capes)
    players.forEach(p => {
        if (p.mesh && !p.isDead) {
            // Standard Bobbing (disable if moving to keep Tween smooth)
            if (gameState !== 'MOVING') p.mesh.scale.y = 1 + Math.sin(time) * 0.02;

            // Cape Physics simulation
            const cape = p.mesh.getObjectByName("Cape");
            if (cape) cape.rotation.x = (gameState === 'MOVING') ? 0.8 + Math.sin(time * 10) * 0.2 : 0.2 + Math.sin(time * 2) * 0.1;
        }
    });

    // 3. Environment Animations (Fog / Clouds)
    if (fogGroup) fogGroup.children.forEach((cloud, idx) => {
        cloud.rotation.z += 0.001 * (idx % 2 === 0 ? 1 : -1);
        if (isNight) cloud.position.x += Math.sin(Date.now() * 0.0005 + idx) * 0.005;
    });

    // 4. Particle Systems (Weather)
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        const type = particleSystem.userData.type;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.1; // Gravity
            if (type === 'snow') positions[i - 1] -= 0.02; // Wind

            if (positions[i] < 0) { // Reset
                positions[i] = 10 + Math.random() * 5;
                positions[i - 1] = (Math.random() - 0.5) * 60;
                positions[i + 1] = (Math.random() - 0.5) * 60;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Active Event Meshes (e.g. Roaming Merchants rotation)
    activeEvents.forEach(ev => {
        if (ev.mesh) ev.mesh.rotation.y += 0.01;
    });

    // --- 6. NEW: DETAILED BOSS ANIMATION (Multi-Boss Support) ---
    // Iterate over the keys of activeDungeons
    Object.values(activeDungeons).forEach(dungeon => {
        if (dungeon.bossMesh && dungeon.bossMesh.visible) {
            const boss = dungeon.bossMesh;

            // Base Float
            boss.position.y = 1.5 + Math.sin(time) * 0.2;

            // Unique Animations based on Dungeon Type
            if (dungeon.type === "Void Edge") {
                // Spin rings
                boss.children.forEach(child => {
                    if (child.userData && child.userData.rotateSpeed) {
                        child.rotation.x += child.userData.rotateSpeed;
                        child.rotation.y += child.userData.rotateSpeed;
                    }
                });
            }
            else if (dungeon.type === "Wyvern Peak") {
                // Jitter
                boss.position.x += (Math.random() - 0.5) * 0.05;
            }
            else {
                // Standard Intimidating Spin
                boss.rotation.y += 0.01;
            }

            // Pulse
            boss.scale.setScalar(1.5 + Math.sin(time * 2) * 0.05);
        }
    });

    // --- 7. CAMERA TRACKING (UPDATED FOR CINEMATICS) ---
    // We only auto-track if we are NOT in a cinematic sequence and NOT in free cam
    if (!isCinematic && !window.freeCamMode && isZoomed && cameraTarget) {
        camera.lookAt(cameraTarget.position.x, 0, cameraTarget.position.z);
    }

    // Free Cam Drag Logic
    if (window.freeCamMode && isRightMouseDown && lastMousePos) {
        const deltaX = currentMousePos.x - lastMousePos.x;
        const deltaY = currentMousePos.y - lastMousePos.y;

        // Pan
        const moveX = -deltaX * 0.1;
        const moveZ = -deltaY * 0.1;

        // Apply relative to camera rotation
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0; forward.normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0; right.normalize();

        camera.position.add(right.multiplyScalar(moveX));
        camera.position.add(forward.multiplyScalar(moveZ));

        lastMousePos = { ...currentMousePos };
    }

    // --- 8. TURN TIMER LOGIC ---
    const timerContainer = document.getElementById('timer-container');
    const timerBar = document.getElementById('timer-bar');

    // Only run timer in Multiplayer
    if (!isMultiplayer) {
        if (timerContainer) timerContainer.style.display = 'none';
        renderer.render(scene, camera);
        return;
    }

    const curP = players[turnIndex];
    const arrivalModal = document.getElementById('arrival-modal');
    const cardModal = document.getElementById('card-modal');
    const encHeader = document.getElementById('enc-header');

    const isArrivalOpen = arrivalModal && arrivalModal.classList.contains('active');
    const isCardOpen = cardModal && cardModal.classList.contains('active');
    const isShopping = isCardOpen && encHeader && encHeader.classList.contains('market');
    const isHumanAndAlive = curP && !curP.isAi && !curP.isDead;

    const shouldShowTimer = isHumanAndAlive && (
        isArrivalOpen || isCardOpen ||
        (gameState !== 'MOVING' && (gameState === 'ROLL' || gameState === 'END'))
    );

    if (shouldShowTimer) {
        if (timerContainer) timerContainer.style.display = 'block';

        const currentLimit = isShopping ? (TURN_TIME_LIMIT * 3) : TURN_TIME_LIMIT;
        const baseTime = lastInteractionTime || Date.now();
        const elapsed = (Date.now() - baseTime) / 1000;
        const remaining = Math.max(0, currentLimit - elapsed);
        const pct = remaining / currentLimit;

        if (timerBar) {
            timerBar.style.transform = `scaleX(${pct})`;
            if (pct > 0.5) timerBar.style.background = '#10b981';
            else if (pct > 0.2) timerBar.style.background = '#f59e0b';
            else timerBar.style.background = '#ef4444';
        }

        if (remaining <= 0) {
            if (curP.id === myPlayerId) {
                lastInteractionTime = Date.now();
                handleTimeoutAction(curP);
            }
        }
    } else {
        if (timerContainer) timerContainer.style.display = 'none';
    }

    // --- 9. DUNGEON SCENERY PARTICLES (Multi-Dungeon) ---
    if (activeSceneryParticles.length > 0) {
        // Iterate through all active dungeon groups
        if (dungeonGroup) {
            // Find ALL Fog Systems (one per Void dungeon potentially)
            dungeonGroup.children.forEach(childGroup => {
                // If the child group is a specific dungeon
                if (childGroup.isGroup) {
                    const voidSys = childGroup.children.find(c => c.userData.isVoidFog);
                    if (voidSys) {
                        const positions = voidSys.geometry.attributes.position.array;
                        // Animate vertices
                        for (let i = 0; i < positions.length; i += 3) {
                            // Simple wave effect on Y axis
                            positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.02;
                        }
                        voidSys.geometry.attributes.position.needsUpdate = true;
                        voidSys.rotation.y += 0.001;
                    }
                }
            });
        }
    }

    renderer.render(scene, camera);
}

//Camera Functions

function zoomToPiece(p) {
    isZoomed = true;
    cameraTarget = p.mesh; // Target the player mesh again

    // Standard Board Game View Offset
    const offset = { x: 0, y: 22, z: 18 };

    new TWEEN.Tween(camera.position)
        .to({
            x: p.mesh.position.x + offset.x,
            y: offset.y, // Keep Y steady (don't add mesh.y to avoid bobbing start)
            z: p.mesh.position.z + offset.z
        }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

// Moves Player and Camera together to a specific tile
function animateTeleport(p, targetTile, onComplete) {
    gameState = 'MOVING';
    isZoomed = true;
    cameraTarget = p.mesh;

    const startPos = p.mesh.position.clone();
    const endPos = targetTile.position.clone();

    // Move Player
    new TWEEN.Tween(p.mesh.position)
        .to({ x: endPos.x, y: endPos.y, z: endPos.z }, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            // FIX: If we teleported TO a mystery space, treating it as a landing causes a loop.
            // However, we WANT to trigger other spaces (like properties).
            // The fix is to ensure the MYSTERY logic in 'continueFromArrival' checks if we just teleported.

            // Actually, simplest fix: Teleporting consumes your 'action' for the turn. 
            // So we don't call resolveLanding if it's a mystery/teleport result.

            if (onComplete) {
                setTimeout(() => onComplete(), 100);
            }
        })
        .start();

    // Move Camera
    const offset = { x: 0, y: 22, z: 18 };
    new TWEEN.Tween(camera.position)
        .to({
            x: endPos.x + offset.x,
            y: offset.y,
            z: endPos.z + offset.z
        }, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
}

function resetCamera() {
    isZoomed = false;
    cameraTarget = null;

    // Default overhead view
    const width = window.innerWidth;
    const isMobileMode = document.body.classList.contains('force-mobile') || width <= 768;
    let dist = 55;
    if (isMobileMode) {
        const boardSize = 55;
        const fovRad = (45 * Math.PI) / 360;
        const height = window.innerHeight * 0.82;
        const aspect = width / height;
        if (aspect > 1) dist = (boardSize / 2) / Math.tan(fovRad);
        else dist = ((boardSize / aspect) / 2) / Math.tan(fovRad);
    }

    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: dist, z: 0.1 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .start();
}

// Call this from triggerTileEvent() or resolveLanding() when landing on a Dungeon Entrance
function offerDungeonEntry(p, tileName, onDecline = null) {
    // Check if THIS specific dungeon is active
    if (!activeDungeons[tileName]) {
        addLog("The Dungeon gate is sealed...", "log-fail");
        if (onDecline) onDecline();
        else endStep();
        return;
    }

    showModal(tileName, "Enter the Dungeon? (Hard Difficulty)", [
        {
            txt: "Enter Dungeon",
            act: () => {
                p.inDungeon = true;
                p.dungeonType = tileName; // <--- CRITICAL UPDATE
                p.dungeonProgress = 0;
                p.bossAttempts = 3;

                if (isMultiplayer) {
                    syncPlayerState();
                    db.ref(`games/${gameId}/teleportLog`).push({
                        pid: p.id, targetPos: 999, dungeonStep: 0, timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                } else {
                    const firstTile = activeDungeons[tileName].tiles[0];
                    gameState = 'MOVING';
                    animateTeleport(p, firstTile, () => { resolveDungeonStep(p); });
                }
                document.getElementById('card-modal').classList.remove('active');
            }
        },
        {
            txt: "Stay Outside",
            act: () => {
                if (onDecline) {
                    document.getElementById('card-modal').classList.remove('active');
                    onDecline();
                } else {
                    endStep();
                }
            }
        }
    ]);
}

// Replaces rollMove() logic for players inside dungeon
function advanceDungeon(p) {
    // Safety check
    if (!p.dungeonType || !activeDungeons[p.dungeonType]) {
        console.error("Player in invalid dungeon");
        p.inDungeon = false;
        return;
    }

    const currentDungeon = activeDungeons[p.dungeonType];
    const nextStep = (p.dungeonProgress || 0) + 1;

    if (nextStep >= currentDungeon.tiles.length) {
        triggerDungeonBoss(p);
        return;
    }

    addLog(`${p.name} ventures deeper...`);

    if (isMultiplayer && gameId) {
        p.dungeonProgress = nextStep;
        syncPlayerState();
        db.ref(`games/${gameId}/teleportLog`).push({
            pid: p.id, targetPos: 999, dungeonStep: nextStep, timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }
    else {
        p.dungeonProgress = nextStep;
        const targetTile = currentDungeon.tiles[nextStep];
        gameState = 'MOVING';
        new TWEEN.Tween(p.mesh.position)
            .to({ x: targetTile.position.x, z: targetTile.position.z }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => { resolveDungeonStep(p); })
            .start();
    }
}

// Fix: use p.dungeonType to get config, as activeDungeon is not defined here
function resolveDungeonStep(p) {
    if (!p.dungeonType) { console.error("No Dungeon Type on Player"); return; }
    const config = DUNGEON_DATA[p.dungeonType];

    // --- 1. BOSS SUMMON CHECK (1d6) ---
    const bossRoll = Math.floor(Math.random() * 6) + 1;
    addLog(`${p.name} rolled ${bossRoll} for Boss Summon...`);

    if (bossRoll >= 6) {
        setTimeout(() => {
            addLog("THE BOSS HAS AWAKENED!", "log-epic");
            AUDIO.playSound('sfx_transition');
            triggerDungeonBoss(p, true);
        }, 1000);
        return;
    }

    // --- 2. RANDOM MONSTER ENCOUNTER ---
    const enc = config.encounters[Math.floor(Math.random() * config.encounters.length)];

    // Start Battle Sequence
    setTimeout(() => {
        startBattle(p, enc, 'dungeon');
    }, 800);
}

// --- 3D BATTLE RENDERER SYSTEM ---
let battleScene, battleCamera, battleRenderer;
let battleMeshes = []; // Track objects for animation

function initBattleRenderer() {
    if (battleRenderer) return; // Already init

    const container = document.getElementById('battle-container'); // TARGET CONTAINER, NOT BG
    const canvas = document.getElementById('battle-canvas');
    if (!container || !canvas) return;

    // SCENE
    battleScene = new THREE.Scene();

    // CAMERA
    const aspect = container.clientWidth / container.clientHeight;
    battleCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    battleCamera.position.set(0, 2, 8);
    battleCamera.lookAt(0, 1, 0);

    // RENDERER
    battleRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    battleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Initial Size
    const w = container.clientWidth;
    const h = container.clientHeight;
    battleRenderer.setSize(w, h); // Keep default style behavior or set false if handling CSS manually

    // ROBUST RESIZE OBSERVER
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const width = entry.contentRect.width;
            const height = entry.contentRect.height;

            if (width > 0 && height > 0) {
                battleCamera.aspect = width / height;
                battleCamera.updateProjectionMatrix();
                battleRenderer.setSize(width, height, false); // false = don't overwrite CSS style width/height (handled by CSS)
            }
        }
    });
    observer.observe(container);

    // Start separate loop
    animateBattle();
}

function setupBattleScene(dungeonType) {
    if (!battleScene) initBattleRenderer();

    // Clear Old Scene
    while (battleScene.children.length > 0) {
        battleScene.remove(battleScene.children[0]);
    }
    battleMeshes = []; // Reset animation list

    // Lighting (Base)
    const ambient = new THREE.AmbientLight(0x404040, 1); // Soft white light
    battleScene.add(ambient);

    // DUNGEON SPECIFIC GENERATION
    if (dungeonType === 'Demon Gate') {
        battleScene.background = null;
        battleScene.fog = new THREE.FogExp2(0x550000, 0.02);

        // Floor REMOVED for CSS BG Visibility
        // const geo = new THREE.PlaneGeometry(20, 20, 10, 10);
        // ...

        // Floating Embers
        for (let i = 0; i < 30; i++) {
            const pGeo = new THREE.OctahedronGeometry(0.1, 0);
            const pMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const p = new THREE.Mesh(pGeo, pMat);
            p.position.set((Math.random() - 0.5) * 10, Math.random() * 5, (Math.random() - 0.5) * 5);
            p.userData = { speed: Math.random() * 0.05 + 0.01 };
            battleScene.add(p);
            battleMeshes.push(p);
        }

        // Point Lights
        const pl = new THREE.PointLight(0xffaa00, 2, 20);
        pl.position.set(0, 3, 2);
        battleScene.add(pl);

    } else if (dungeonType === 'Void Edge') {
        battleScene.background = null;
        battleScene.fog = new THREE.FogExp2(0x110022, 0.02);

        // Stars
        const starGeo = new THREE.BufferGeometry();
        const starCount = 500;
        const posArray = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
        const stars = new THREE.Points(starGeo, starMat);
        battleScene.add(stars);

        // Floating Rocks
        const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x4b0082, flatShading: true });

        for (let i = 0; i < 10; i++) {
            const rock = new THREE.Mesh(rockGeo, rockMat);
            rock.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6 + 2, (Math.random() - 0.5) * 8 - 2);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            rock.userData = {
                rotSpeed: { x: Math.random() * 0.02, y: Math.random() * 0.02 },
                floatSpeed: Math.random() * 0.01
            };
            battleScene.add(rock);
            battleMeshes.push(rock);
        }

        const dl = new THREE.DirectionalLight(0xa020f0, 1);
        dl.position.set(5, 5, 5);
        battleScene.add(dl);

    } else if (dungeonType === 'Vampire Manor') {
        battleScene.background = null;
        battleScene.fog = new THREE.Fog(0x1a0505, 5, 20);

        // Floor REMOVED
        // ...

        // Pillars REMOVED

        const candleLight = new THREE.PointLight(0xff5500, 1.5, 10);
        candleLight.position.set(0, 2, 2);
        battleScene.add(candleLight);

    } else if (dungeonType === 'Wyvern Peak') {
        battleScene.background = null;
        battleScene.fog = new THREE.Fog(0x87CEEb, 10, 40);

        // Platform REMOVED
        // ...

        // Clouds (White spheres)
        const cloudGeo = new THREE.SphereGeometry(2, 8, 8);
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

        for (let i = 0; i < 8; i++) {
            const c = new THREE.Mesh(cloudGeo, cloudMat);
            c.position.set((Math.random() - 0.5) * 20, (Math.random() * 4) - 2, -10 - Math.random() * 10);
            c.userData = { speed: Math.random() * 0.05 + 0.02 };
            battleScene.add(c);
            battleMeshes.push(c);
        }

        const sun = new THREE.DirectionalLight(0xffffff, 1.2);
        sun.position.set(10, 10, 5);
        battleScene.add(sun);
    } else {
        // DEFAULT OVERWORLD
        battleScene.background = null;
        battleScene.fog = new THREE.Fog(0x223344, 10, 50);
        const sun = new THREE.DirectionalLight(0xffffff, 1.0);
        sun.position.set(5, 10, 7);
        battleScene.add(sun);
    }
}

function animateBattle() {
    requestAnimationFrame(animateBattle);
    if (!battleRenderer || !battleScene || !document.getElementById('battle-modal').classList.contains('active')) return;

    // Animation Logic
    battleMeshes.forEach(m => {
        if (m.userData.speed) {
            m.position.y += Math.sin(Date.now() * 0.001 * m.userData.speed) * 0.01;
        }
        if (m.userData.rotSpeed) {
            m.rotation.x += m.userData.rotSpeed.x;
            m.rotation.y += m.userData.rotSpeed.y;
        }
    });

    battleRenderer.render(battleScene, battleCamera);
}

// Global Battle State


function setBattleTarget(index) {
    if (!activeBattle || !activeBattle.opponents[index] || activeBattle.opponents[index].dead) return;
    activeBattle.targetIndex = index;

    // Update UI Highlights
    const sprites = document.querySelectorAll('.horde-sprite');
    if (sprites.length > 0) {
        sprites.forEach((s, idx) => {
            if (idx === index) s.classList.add('target-selected');
            else s.classList.remove('target-selected');
        });
    }
    // Update HP Bar immediately to show new target's HP
    updateBattleUI();
}

function startBattle(p, opponent, type = 'dungeon', onVictory = null) {
    // 1. Initialize State
    const isBoss = type === 'dungeon' && opponent.isBoss;

    // --- MONSTER AUDIO ---
    if (typeof AUDIO !== 'undefined') {
        const oName = opponent.name.toLowerCase();
        if(oName.includes('dragon') || oName.includes('wyvern')) AUDIO.playSound('sfx_dragon_roar');
        else if(oName.includes('goblin') || oName.includes('orc')) AUDIO.playSound('sfx_goblin_chatter');
        else AUDIO.playSound('sfx_monster_roar');
    }

    // --- COOLDOWN REDUCTION ---
    if (p.battleCooldowns) {
        Object.keys(p.battleCooldowns).forEach(k => {
            // Decrement by 1, min 0
            if (p.battleCooldowns[k] > 0) {
                p.battleCooldowns[k]--;
            }
        });
    }

    // 4. Determine HP (Use new maxHealth stat)
    let pHp, pMax;

    // Ensure stats are calculated
    recalcStats(p);
    const maxHealth = p.stats.maxHealth || (10 + (p.stats.str || 0));

    if (p.dungeonHp) {
        pHp = p.dungeonHp;
        pMax = p.pMaxHp || maxHealth;
    } else {
        // Initialize with maxHealth
        pHp = maxHealth;
        pMax = maxHealth;
    }

    // 5. Active Battle State
    // 5. Active Battle State
    let opponents = [];

    // Check for Minions (Boss + Adds)
    if (opponent.minions && opponent.minions.length > 0) {
        // Add Main Boss
        opponents.push({
            ...opponent,
            id: `${opponent.name}_Boss`,
            hp: opponent.hp || 20,
            maxHp: opponent.hp || 20,
            dead: false,
            isBoss: true
        });

        // Add Minions
        opponent.minions.forEach((m, mIdx) => {
            const mCount = m.count || 1;
            for (let k = 0; k < mCount; k++) {
                opponents.push({
                    name: m.name,
                    hp: m.hp || 10,
                    str: m.str || 1,
                    dex: m.dex || 1,
                    int: m.int || 1,
                    img: m.img || "",
                    id: `Minion_${mIdx}_${k}`,
                    maxHp: m.hp || 10,
                    dead: false,
                    isMinion: true
                });
            }
        });
    } else {
        // Standard Logic (Clones)
        const count = opponent.count || 1;
        for (let i = 0; i < count; i++) {
            opponents.push({
                ...opponent, // Copy base stats
                id: `${opponent.id}_${i}`,
                hp: opponent.hp || 20,
                maxHp: opponent.hp || 20,
                dead: false
            });
        }
    }


    activeBattle = {
        player: p,
        opponent: opponent, // Restore reference for legacy calls
        opponents: opponents, // New Array
        targetIndex: 0, // Default target
        type: type,
        pHp: pHp,
        pMaxHp: pMax,
        // Legacy mHp references will need updates, but keeping for safety if needed temporarily
        mHp: opponents[0].hp,
        mMaxHp: opponents[0].maxHp,
        turnProcessing: false,
        monsterWeakened: 0,
        playerDodging: false,
        burnTurns: 0,
        isBoss: !!(opponent.isBoss),
        onVictory: onVictory
    };

    // APPLY WORLD LEVEL SCALING (Local Copy Only)
    if (worldLevel > 0) {
        activeBattle.opponents.forEach(op => {
            // Add World Level to stats? Monsters usually assume basic stats if not defined.
            // If stats missing, define them?
            if (!op.stats) op.stats = { str: 1, dex: 1, int: 1 };
            op.stats.str += worldLevel;
            op.stats.dex += worldLevel;
            op.stats.int += worldLevel;
            // Scale HP too? "All monsters... by 1".
            op.maxHp += worldLevel;
            op.hp = op.maxHp;
        });
        // Also scale main opponent object references if separate?
        // (activeBattle.opponents is the source of truth now)
    }


    // --- AI AUTO-RESOLVE CHECK ---
    if (p.isAi) {
        if (typeof window.watchAiBattles === 'undefined') window.watchAiBattles = false;
        if (!window.watchAiBattles) {
            simulateAiBattle(activeBattle);
            return;
        }
    }

    // --- INITIATIVE ROLL ---
    activeBattle.turnQueue = [];

    // 1. Player
    const pInit = Math.floor(Math.random() * 20) + 1 + (p.stats.movementBonus || 0);
    p.initiative = pInit;
    p.isPlayer = true;
    activeBattle.turnQueue.push(p);

    // 2. Opponents
    activeBattle.opponents.forEach((op, idx) => {
        // Monsters don't have movementBonus usually, but we can default or add logic later
        const mInit = Math.floor(Math.random() * 20) + 1 + (op.dex || 0); // Using DEX as proxy for now or 0
        op.initiative = mInit;
        op.id = `monster_${idx}`;
        op.isPlayer = false;
        op.maxHp = op.maxHp || op.hp; // Ensure maxHp is set
        activeBattle.turnQueue.push(op);
    });

    // 3. Sort (Descending)
    activeBattle.turnQueue.sort((a, b) => b.initiative - a.initiative);
    activeBattle.turnIndex = 0; // Start with first

    // Log Initiative
    addLog(`Turn Order: ${activeBattle.turnQueue.map(t => `${t.name} (${t.initiative})`).join(', ')}`);

    // 6. UI Init
    const pName = document.getElementById('battle-player-name');
    if (pName) pName.innerText = p.name || "Hero";

    const eName = document.getElementById('battle-enemy-name');
    if (opponent.name) eName.innerText = opponent.name;
    else eName.innerText = "Enemy";

    updateBattleUI();
    const m = document.getElementById('battle-modal');
    const bg = document.getElementById('battle-bg');

    // Background (3D Scene Layer)
    let envType = 'Demon Gate'; // Default
    if (type === 'dungeon' && p.dungeonType) {
        envType = p.dungeonType;
        if (DUNGEON_DATA[envType]) {
            bg.style.backgroundImage = `url('${DUNGEON_DATA[envType].bg}')`;
        }
    } else if (type !== 'dungeon') {
        // OVERWORLD DYNAMIC BACKGROUNDS
        const pos = p.pos || 0;
        if (pos >= 0 && pos <= 9) {
            envType = 'Overworld';
            bg.style.backgroundImage = `url('https://static.wixstatic.com/media/b16479_520e0fffba5d471ea34e0d92878b0a30~mv2.png')`;
        } else if (pos >= 10 && pos <= 19) {
            envType = 'Vampire Manor';
            bg.style.backgroundImage = `url('https://static.wixstatic.com/media/b16479_54882b1816f749688b2709e1bd25b093~mv2.png')`;
        } else if (pos >= 20 && pos <= 29) {
            envType = 'Demon Gate';
            bg.style.backgroundImage = `url('https://static.wixstatic.com/media/b16479_f183cce2886f48f78991ab2f7310505e~mv2.png')`;
        } else if (pos >= 30 && pos <= 39) {
            envType = 'Wyvern Peak';
            bg.style.backgroundImage = `url('https://static.wixstatic.com/media/b16479_87e3f4ad0db74359ad1814d6238f6a00~mv2.png')`;
        }
    }

    // Initialize 3D Scene
    setupBattleScene(envType);

    // TUTORIAL HOOK
    if (TUTORIAL.active) {
        if (type === 'dungeon' && !TUTORIAL.seen.dungeon) TUTORIAL.showBattle(true);
        else if (type !== 'dungeon' && !TUTORIAL.seen.battle) TUTORIAL.showBattle(false);
    }

    // Names & Sprites
    document.getElementById('battle-enemy-name').innerText = opponent.name;
    document.getElementById('battle-player-name').innerText = p.name;

    // --- RENDER MONSTER SPRITES ---
    // Ensure we have a container. If battle-monsters doesn't exist, we might need to use battle-enemy-sprite parent or clear it.
    // Assuming battle-monsters exists or we append to battle-wrapper?
    // Let's rely on the existing container 'battle-monsters' from previous context or fallback.
    let monsterContainer = document.getElementById('battle-monsters');
    if (!monsterContainer) {
        // Fallback: Create it if missing (unlikely if previous steps were correct, but safe)
        monsterContainer = document.createElement('div');
        monsterContainer.id = 'battle-monsters';
        monsterContainer.style.position = 'absolute';
        monsterContainer.style.top = '50px';
        monsterContainer.style.left = '0';
        monsterContainer.style.width = '100%';
        monsterContainer.style.height = '200px';
        const bContainer = document.getElementById('battle-container');
        if (bContainer) bContainer.appendChild(monsterContainer);
    }

    monsterContainer.innerHTML = ''; // Clear old

    activeBattle.opponents.forEach((op, index) => {
        // WRAPPER
        const wrapper = document.createElement('div');
        wrapper.className = 'monster-wrapper'; // New class for positioning
        wrapper.id = `monster-wrapper-${index}`;
        wrapper.style.position = 'absolute';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';

        // SPRITE
        const sprite = document.createElement('img');
        sprite.src = op.img;
        sprite.className = 'battle-monster-sprite'; // Keep existing class for CSS animations
        sprite.id = `monster-sprite-${index}`;
        sprite.style.display = 'block';
        // Reset absolute positioning on sprite since wrapper handles it
        sprite.style.position = 'relative';

        // STAT INDICATOR (Hidden initially)
        const indicator = document.createElement('div');
        indicator.className = 'enemy-stat-indicator';
        indicator.id = `enemy-stat-${index}`;
        indicator.style.marginTop = '-20px'; // Overlap slightly bottom?
        indicator.style.zIndex = '20';
        indicator.style.backgroundColor = 'rgba(0,0,0,0.8)';
        indicator.style.border = '2px solid #ccc';
        indicator.style.borderRadius = '50%';
        indicator.style.width = '30px';
        indicator.style.height = '30px';
        indicator.style.display = 'none'; // Hidden until Reveal
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
        indicator.style.fontSize = '16px';
        indicator.style.color = '#fff';
        indicator.innerText = "?";

        wrapper.appendChild(sprite);
        wrapper.appendChild(indicator);

        // --- POSITION LOGIC (Applied to Wrapper) ---
        let size = 180;
        if (activeBattle.opponents.length > 1) size = 140;
        if (activeBattle.opponents.length > 3) size = 110;

        // BOSS SCALING
        if (isBoss) {
            size = 360;
        }

        let width = size;
        let height = size;

        if (op.name === 'Succubus') width = size * 1.5;
        if (isBoss) width = size * 1.3;

        // Apply size to sprite mainly, wrapper takes content size?
        // Let's set wrapper size to match sprite rough area or just let auto?
        // Existing logic set fixed px sizes.
        sprite.style.width = `${width}px`;
        sprite.style.height = `${height}px`;

        const count = activeBattle.opponents.length;

        // Position Wrapper
        if (count === 1) {
            wrapper.style.left = '50%';
            wrapper.style.top = '40%';
            wrapper.style.transform = 'translate(-50%, -50%)';
        }
        else if (count === 2) {
            if (index === 0) { wrapper.style.left = '30%'; wrapper.style.top = '50%'; }
            if (index === 1) { wrapper.style.left = '70%'; wrapper.style.top = '50%'; }
            wrapper.style.transform = 'translate(-50%, -50%)';
        }
        else if (count === 3) {
            // Triangle
            if (index === 0) { wrapper.style.left = '50%'; wrapper.style.top = '30%'; wrapper.style.zIndex = 10; }
            if (index === 1) { wrapper.style.left = '25%'; wrapper.style.top = '60%'; wrapper.style.zIndex = 20; }
            if (index === 2) { wrapper.style.left = '75%'; wrapper.style.top = '60%'; wrapper.style.zIndex = 20; }
            wrapper.style.transform = 'translate(-50%, -50%)';
        }
        else {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const xBase = col === 0 ? 25 : 75;
            const yBase = 30 + (row * 25);
            const jitter = (index % 3) * 5;
            wrapper.style.left = `${xBase + jitter}%`;
            wrapper.style.top = `${yBase}%`;
            wrapper.style.transform = 'translate(-50%, -50%)';
        }

        // Click wrapper to target
        wrapper.onclick = () => setBattleTarget(index);
        monsterContainer.appendChild(wrapper);
    });

    // Set Initial Target
    setBattleTarget(0);

    document.getElementById('battle-player-sprite').style.backgroundImage = `url('${p.portrait}')`;

    // Log
    const log = document.getElementById('battle-log');
    if (type === 'dungeon') {
        log.innerHTML = isBoss ? `BOSS BATTLE: ${activeBattle.opponent.name} approaches!` : `A wild ${activeBattle.opponent.name} appeared!`;
    } else if (type === 'duel') {
        log.innerHTML = `DUEL STARTED: You vs ${activeBattle.opponent.name}!`;
    }

    // 3. Show
    updateBattleUI();
    m.classList.add('active');
    document.getElementById('battle-actions').style.display = 'flex';

    // SETUP NEW DICE HANDLERS
    setupDiceBattleListeners();

    // START DICE ROUND (Delay slightly for fade in)
    setTimeout(() => startDiceRound(), 1000);

    // --- UPDATE BUTTONS WITH STATS (Initial Placeholder) ---
    const btnStr = document.querySelector('.battle-circle-btn.str');
    const btnDex = document.querySelector('.battle-circle-btn.dex');
    const btnInt = document.querySelector('.battle-circle-btn.int');

    if (btnStr) btnStr.innerHTML = `STR<br><span style="font-size:12px">(${p.stats.str})</span>`;
    if (btnDex) btnDex.innerHTML = `DEX<br><span style="font-size:12px">(${p.stats.dex})</span>`;
    if (btnInt) btnInt.innerHTML = `INT<br><span style="font-size:12px">(${p.stats.int})</span>`;

    // --- 4. GENERATE SKILL BAR ---
    const skillRow = document.getElementById('battle-skills');
    if (skillRow) {
        skillRow.innerHTML = '';

        // --- COOLDOWN INIT ---
        if (!p.battleCooldowns) p.battleCooldowns = {};

        // 1. COLLECT SKILLS
        let skillSet = new Set();

        // Add Selected Actives
        if (p.activeSkillId) skillSet.add(p.activeSkillId);
        if (p.activeSkillId2) skillSet.add(p.activeSkillId2);

        // Add Assigned Skills (Equipment)
        if (p.assignedSkills) {
            Object.values(p.assignedSkills).forEach(s => {
                if (s && s.id) skillSet.add(s.id);
            });
        }

        // Add Inventory/Unlocked Skills
        if (p.skills && Array.isArray(p.skills)) {
            p.skills.forEach(s => skillSet.add(s));
        }

        // --- REMOVED CLASS ACTIVE AUTO-ADD ---
        const availableSkills = Array.from(skillSet);
        const MAX_SLOTS = 8; // Increased slot count

        // 2. GENERATE SLOTS
        for (let i = 0; i < MAX_SLOTS; i++) {
            const skillKey = availableSkills[i];
            const slot = document.createElement('div');

            // Basic Slot Structure
            slot.className = 'dungeon-skill-slot';

            if (skillKey) {
                const skill = ABILITY_LIBRARY[skillKey];
                // Check if skill has a battle function (dungeonFn)
                if (skill && skill.dungeonFn) {
                    slot.id = `dungeon-skill-${skillKey}`;

                    // --- NEW TAP LOGIC (Shop Style) ---
                    slot.onclick = (e) => {
                        e.stopPropagation();
                        // Single click to execute (matching keyboard behavior)
                        useBattleSkill(skillKey);
                    };

                    // Native Tooltip
                    slot.title = skill.desc;
                    // Custom Tooltip (Mouse Hover)
                    slot.onmouseenter = () => {
                        // Only show hover tooltip if NOT in "selected" mode (mobile handling)
                        // Actually, standard behavior: Hover updates tooltip
                        showTooltip(skillKey, true);
                    };
                    slot.onmouseleave = hideTooltip;

                    // Image
                    const img = document.createElement('img');
                    img.src = skill.img || "https://placehold.co/100x100/333/fff?text=?";
                    img.className = 'd-skill-img';
                    slot.appendChild(img);

                    // Key Number
                    const keyDiv = document.createElement('div');
                    keyDiv.className = 'd-skill-key';
                    keyDiv.innerText = i + 1;
                    slot.appendChild(keyDiv);

                    // Name Bar
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'd-skill-title-bar';
                    nameDiv.innerText = skill.name;
                    slot.appendChild(nameDiv);
                } else {
                    // Not a battle skill
                    slot.classList.add('empty');
                    slot.innerHTML = `<div class="d-skill-key">${i + 1}</div><div style="font-size:8px;text-align:center;margin-top:20px;color:#555;">N/A</div>`;
                }
            } else {
                // Empty Slot
                slot.classList.add('empty');
                slot.innerHTML = `<div class="d-skill-key">${i + 1}</div>`;
            }
            skillRow.appendChild(slot);
        }
    }

    updateBattleUI(); // Initial Status Check

    // Start the Turn Loop
    setTimeout(() => startTurnSequence(), 500);
}

function useBattleSkill(skillKey) {
    if (!activeBattle || activeBattle.turnProcessing || activeBattle.gameOver) return;

    // Check Phase compatibility (Allow in ROLL or DECIDE phases)
    if (activeBattle.phase !== 'ROLL' && activeBattle.phase !== 'DECIDE') {
        addLog("Can't use skills right now!", "log-fail");
        return;
    }

    const p = activeBattle.player;

    // Check Cooldown
    if (p.battleCooldowns && p.battleCooldowns[skillKey] > 0) {
        addLog(`Skill on Cooldown! (${p.battleCooldowns[skillKey]} turns)`, "log-fail");
        return;
    }

    const skill = ABILITY_LIBRARY[skillKey];
    if (!skill || !skill.dungeonFn) return;

    // Execute Skill
    const result = skill.dungeonFn(activeBattle);
    if (result) {
        // Success
        // Set Cooldown (Default 3 turns if not specified)
        if (!p.battleCooldowns) p.battleCooldowns = {};
        p.battleCooldowns[skillKey] = 3;

        // Visual Feedback
        const slot = document.getElementById(`dungeon-skill-${skillKey}`);
        if (slot) {
            slot.classList.add('cooldown');
            slot.innerHTML += `<div class="cooldown-overlay">3</div>`;
        }

        // If phase is DECIDE, update UI to show new bonuses immediately
        if (activeBattle.phase === 'DECIDE') {
            updateBattleUI();
        }
    }
}

// --- NEW DICE BATTLE SYSTEM ---

async function startDiceRound() {
    if (!activeBattle || activeBattle.turnProcessing) return;
    activeBattle.turnProcessing = true;
    activeBattle.phase = 'ROLL';

    const p = activeBattle.player;

    // 1. Calculate Dice Pools
    // Player Stats
    let pStr = p.stats.str || 1;
    let pDex = p.stats.dex || 1;
    let pInt = p.stats.int || 1;

    // --- SKILL: DICE BONUSES (e.g. Sprint) ---
    if (p.tempBonuses && p.tempBonuses.dice) {
        pStr += (p.tempBonuses.dice.str || 0);
        pDex += (p.tempBonuses.dice.dex || 0);
        pInt += (p.tempBonuses.dice.int || 0);
    }

    // RESET ENEMY INDICATORS
    activeBattle.opponents.forEach((op, i) => {
        const ind = document.getElementById(`enemy-stat-${i}`);
        if (ind) {
            ind.style.display = 'none'; // Hide or show '?'
            ind.innerText = '?';
            ind.style.borderColor = '#ccc';
        }
    });

    // 2. SHOW ROLL BUTTON (And Hide Allocation Buttons)
    const actionRow = document.getElementById('battle-actions');
    actionRow.style.display = 'flex';

    // Clear existing buttons to show ONLY "Roll"
    actionRow.innerHTML = '';

    const rollBtn = document.createElement('div');
    rollBtn.className = 'battle-btn'; // Re-use generic btn style
    rollBtn.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)';
    rollBtn.style.color = '#fff';
    rollBtn.style.border = '2px solid #fff';
    rollBtn.style.fontSize = '24px';
    rollBtn.style.padding = '15px 40px';
    rollBtn.style.borderRadius = '12px';
    rollBtn.style.boxShadow = '0 0 20px #f59e0b';
    rollBtn.style.cursor = 'pointer';
    rollBtn.innerText = "ROLL";

    // Click Handler
    rollBtn.onclick = async () => {
        // A. Visual Feedback
        rollBtn.style.filter = 'grayscale(100%)';
        rollBtn.innerText = "ROLLING...";
        rollBtn.style.pointerEvents = 'none';

        addLog("Rolling...", "log-rare");

        // B. TRIGGER 3D ROLL (Visual + Logic)
        try {
            if (typeof window.DICE_ROLLER !== 'undefined' && window.DICE_ROLLER.isInitialized) {
                const pResults = await window.DICE_ROLLER.roll(pStr, pDex, pInt);
                activeBattle.pRolls = pResults; // { str: 3, dex: 1, int: 0 }
            } else {
                console.warn("DICE_ROLLER not initialized, using fallback");
                activeBattle.pRolls = { str: Math.floor(pStr / 2), dex: Math.floor(pDex / 2), int: Math.floor(pInt / 2) };
            }
        } catch (e) {
            console.error("DiceRoller failed:", e);
            activeBattle.pRolls = { str: Math.floor(pStr / 2), dex: Math.floor(pDex / 2), int: Math.floor(pInt / 2) };
        }

        // C. Roll for Enemies
        activeBattle.eRolls = activeBattle.opponents.map(op => {
            if (op.dead) return null;
            let s = op.stats || { str: 1, dex: 1, int: 1 };

            // --- SKILL: ENEMY DICE PENALTY ---
            let penalty = 0;
            if (op.debuffs && op.debuffs.dicePenalty) penalty = op.debuffs.dicePenalty;
            if (op.debuffs && op.debuffs.poly) penalty = 99; // Sheep has no power

            // Apply penalty
            let effectiveStats = { ...s };
            let diceToRemove = penalty;
            let pool = effectiveStats.str + effectiveStats.dex + effectiveStats.int;

            while (diceToRemove > 0 && pool > 0) {
                const keys = ['str', 'dex', 'int'].filter(k => effectiveStats[k] > 0);
                if (keys.length === 0) break;
                const k = keys[Math.floor(Math.random() * keys.length)];
                effectiveStats[k]--;
                diceToRemove--;
                pool--;
            }

            // Logic Roll
            let r = { str: 0, dex: 0, int: 0 };
            for (let i = 0; i < effectiveStats.str; i++) if (Math.random() > .5) r.str++;
            for (let i = 0; i < effectiveStats.dex; i++) if (Math.random() > .5) r.dex++;
            for (let i = 0; i < effectiveStats.int; i++) if (Math.random() > .5) r.int++;
            return r;
        });

        // D. TRANSITION TO ALLOCATION
        setupAllocationUI();
    };

    actionRow.appendChild(rollBtn);
    document.getElementById('battle-log').innerHTML = `<span style="color:#fbbf24">ROLL PHASE</span><br>Click to determine your fate!`;
}

// Helper to render the Allocation Circle Buttons (Replacing old static HTML reliance)
function setupAllocationUI() {
    activeBattle.phase = 'DECIDE';
    const actionRow = document.getElementById('battle-actions');
    actionRow.innerHTML = ''; // Remove Roll Button

    // STR Button
    const btnStr = createAllocationButton('str', activeBattle.pRolls.str, '⚔️', '#991b1b');
    const btnDex = createAllocationButton('dex', activeBattle.pRolls.dex, '🏹', '#065f46');
    const btnInt = createAllocationButton('int', activeBattle.pRolls.int, '🔥', '#1e3a8a');

    actionRow.appendChild(btnStr);
    actionRow.appendChild(btnDex);
    actionRow.appendChild(btnInt);

    document.getElementById('battle-log').innerHTML = `<span style="color:#fbbf24">ALLOCATION PHASE</span><br>Pick a stat to Attack/Defend!`;

    toggleBattleControls(true);

    // AI Player Check
    const p = activeBattle.player;
    if (p.isAi) {
        setTimeout(() => {
            const r = activeBattle.pRolls;
            let best = 'str';
            if (r.dex > r[best]) best = 'dex';
            if (r.int > r[best]) best = 'int';
            commitBattleAction(best);
        }, 1500);
    }
}

function createAllocationButton(stat, val, icon, color) {
    const btn = document.createElement('div');
    btn.className = `battle-circle-btn ${stat}`;
    btn.style.borderColor = color;
    btn.style.minWidth = '80px';
    btn.style.minHeight = '80px';
    btn.style.borderRadius = '50%';
    btn.style.border = `3px solid ${color}`;
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.margin = '0 10px';
    btn.style.background = 'rgba(0,0,0,0.8)';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'transform 0.2s';

    btn.innerHTML = `<div>${icon} ${val}</div><div style='font-size:10px'>${stat.toUpperCase()}</div>`;

    btn.onclick = (e) => {
        e.stopPropagation();
        commitBattleAction(stat);
    };

    btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1.0)'; };

    return btn;
}

// Replaces old useBattleSkill/Attack flow for Stats
function commitBattleAction(statKey) {
    if (activeBattle.phase !== 'DECIDE') return;

    // Player Choice
    activeBattle.pChoice = statKey;
    activeBattle.pScore = activeBattle.pRolls[statKey];

    // Enemy Choices (AI)
    activeBattle.eChoices = activeBattle.opponents.map((op, idx) => {
        if (!op || op.dead) return null;
        const roll = activeBattle.eRolls[idx];
        // AI Logic: Pick highest
        let best = 'str';
        if (roll.dex > roll[best]) best = 'dex';
        if (roll.int > roll[best]) best = 'int';

        // Return choice
        return {
            stat: best,
            score: roll[best],
            rolls: roll // Store full rolls for debug/reveal?
        };
    });

    // Proceed to Resolve
    resolveDiceCombat();
}

function resolveDiceCombat() {
    activeBattle.phase = 'RESOLVE';
    toggleBattleControls(false);

    // 1. Reveal (Visuals)
    let logMsg = "";

    // Calculate Final Player Score (Auto Successes)
    let pFinalScore = activeBattle.pScore;
    if (activeBattle.player.tempBonuses && activeBattle.player.tempBonuses.autoSuccesses) {
        pFinalScore += (activeBattle.player.tempBonuses.autoSuccesses[activeBattle.pChoice] || 0);
    }

    // 2. Iterate Enemies and Resolve Clash
    activeBattle.opponents.forEach((op, i) => {
        if (!op || op.dead) return;
        const eCh = activeBattle.eChoices[i];

        // SKILL: SABOTAGE (Reduce Enemy Successes)
        if (op.debuffs && op.debuffs.sabotage) {
            eCh.score = Math.max(0, eCh.score - op.debuffs.sabotage);
        }

        // UPDATE INDICATOR
        const ind = document.getElementById(`enemy-stat-${i}`);
        if (ind) {
            ind.style.display = 'flex';
            let icon = '';
            if (eCh.stat === 'str') icon = '⚔️';
            if (eCh.stat === 'dex') icon = '🏹';
            if (eCh.stat === 'int') icon = '🔥';
            ind.innerHTML = `${icon} ${eCh.score}`;
            // Optional: Color code
            if (eCh.stat === 'str') ind.style.borderColor = '#991b1b';
            if (eCh.stat === 'dex') ind.style.borderColor = '#065f46';
            if (eCh.stat === 'int') ind.style.borderColor = '#1e3a8a';
        }

        // CLASH LOGIC
        if (activeBattle.pChoice === eCh.stat) {
            // DIRECT CLASH (Same Stat = BLOCKED = Half Damage)
            const diff = pFinalScore - eCh.score;
            if (diff > 0) {
                // Player Wins Clash
                let dmg = Math.floor(diff / 2); // BLOCKED: Halve damage
                // SKILL: DOUBLE DAMAGE (Shadow Strike)
                if (activeBattle.player.buffs && activeBattle.player.buffs.doubleDamage) {
                    dmg *= 2;
                    logBattleAction("CRITICAL STRIKE! (Double Damage)");
                }
                op.hp -= dmg;
                showFloatingText(`${dmg}`, "damage-popup", "monster");
                addLog(`Clash Won! You hit ${op.name} for ${dmg} dmg! (Blocked Attack)`, "log-success");
                playBattleAnim('shake', 'enemy');
            } else if (diff < 0) {
                // Enemy Wins Clash
                let dmg = Math.floor(Math.abs(diff) / 2); // BLOCKED: Halve damage

                // SKILL: DAMAGE IMMUNE (Sanctuary)
                if (activeBattle.player.buffs && activeBattle.player.buffs.damageImmune) {
                    dmg = 0;
                    showFloatingText("IMMUNE", "block-popup", "player");
                    activeBattle.player.buffs.damageImmune = false; // Consume? Or last whole turn? Consuming is safer.
                } else {
                    activeBattle.pHp -= dmg;
                    showFloatingText(`-${dmg}`, "dmg-popup", false);
                    addLog(`${op.name} overpowers you for ${dmg} dmg! (Blocked Attack)`, "log-danger");
                    playBattleAnim('shake', 'player');
                }
            } else {
                showFloatingText("PARRY", "block-popup", undefined);
                addLog(`${op.name} parries your attack! (Tie)`, "log-fail");
            }
        } else {
            // UNOPPOSED EXCHANGE (Different Stats)
            // Player Hit
            let pDmg = pFinalScore;
            if (activeBattle.player.buffs && activeBattle.player.buffs.doubleDamage) pDmg *= 2;
            op.hp -= pDmg;

            // Enemy Hit
            let eDmg = eCh.score;
            // SKILL: DAMAGE IMMUNE
            if (activeBattle.player.buffs && activeBattle.player.buffs.damageImmune) {
                eDmg = 0;
                showFloatingText("IMMUNE", "block-popup", "player");
            }

            activeBattle.pHp -= eDmg;

            // Visuals
            addLog(`Exchange! Hit for ${pDmg}, Took ${eDmg}.`, "log-info");
            showFloatingText(`${pDmg}`, "damage-popup", "monster");
            if (eDmg > 0) showFloatingText(`-${eDmg}`, "dmg-popup", false);
        }

        // CLEANUP INSTANT DEBUFFS
        if (op.debuffs) {
            if (op.debuffs.sabotage) op.debuffs.sabotage = 0;
            // dicePenalty can persist? Let's reset it to be safe for now, assuming 1 turn duration.
            if (op.debuffs.dicePenalty) op.debuffs.dicePenalty = 0;
        }
    });

    // CLEANUP PLAYER BUFFS
    // Reset temp bonuses
    if (activeBattle.player.tempBonuses) activeBattle.player.tempBonuses = {};
    if (activeBattle.player.buffs) {
        activeBattle.player.buffs.doubleDamage = false;
        activeBattle.player.buffs.damageImmune = false;
    }

    updateBattleUI();

    // DEATH CHECKS
    const allEnemiesDead = activeBattle.opponents.every(o => o.dead || o.hp <= 0);
    if (activeBattle.pHp <= 0) {
        setTimeout(() => endBattle(false), 1500);
    } else if (allEnemiesDead) {
        setTimeout(() => endBattle(true), 1500);
    } else {
        // Next Round
        setTimeout(() => {
            activeBattle.turnProcessing = false;
            startDiceRound();
        }, 2000);
    }
}

// Fallback aliases if old code calls them
function startTurnSequence() { startDiceRound(); }
function resolveOpponentTurn() { } // Deprecated

function setupDiceBattleListeners() {
    const btnStr = document.querySelector('.battle-circle-btn.str');
    const btnDex = document.querySelector('.battle-circle-btn.dex');
    const btnInt = document.querySelector('.battle-circle-btn.int');

    // Override Default Listeners
    if (btnStr) btnStr.onclick = (e) => { e.stopPropagation(); commitBattleAction('str'); };
    if (btnDex) btnDex.onclick = (e) => { e.stopPropagation(); commitBattleAction('dex'); };
    if (btnInt) btnInt.onclick = (e) => { e.stopPropagation(); commitBattleAction('int'); };
}



function advanceTurn() {
    if (!activeBattle) return;

    // Check Victory/Defeat first
    if (activeBattle.opponents.every(o => o.dead || o.hp <= 0)) {
        setTimeout(() => endBattle(true), 1000);
        return;
    }
    if (activeBattle.pHp <= 0) {
        setTimeout(() => endBattle(false), 1000);
        return;
    }

    activeBattle.turnIndex++;
    if (activeBattle.turnIndex >= activeBattle.turnQueue.length) activeBattle.turnIndex = 0;

    setTimeout(() => startTurnSequence(), 1000);
}

function resolveBattleRound(choice) {
    // This function now handles both ATTACK (Player picks Attack Stat) and DEFEND (Player picks Defense Stat)
    if (!activeBattle || activeBattle.turnProcessing) return;

    const p = activeBattle.player;
    const current = activeBattle.turnQueue[activeBattle.turnIndex];
    const stats = ['str', 'dex', 'int'];

    // Safety check: Is it actually a turn involving the player?
    // If it's Monster vs Monster (not possible here) or AI auto-play.

    activeBattle.turnProcessing = true;
    toggleBattleControls(false); // Lock during animation

    let resultLog = "";
    let isHit = false;
    let dmg = 0;

    // --- CASE 1: PLAYER ATTACKING ---
    if (activeBattle.turnState === 'ATTACK') {
        const target = activeBattle.opponents[activeBattle.targetIndex];
        // Logic: Player picks 'choice'. Monster picks Random Defense.
        // Wait, user said: "If it is the same stat that I picked then that damage will be blocked."
        // So Mismatch = HIT.

        const mDef = stats[Math.floor(Math.random() * 3)];

        if (choice === mDef) {
            // BLOCKED
            resultLog = `Your <b style="color:#fff">${choice.toUpperCase()}</b> vs Enemy <b style="color:#fff">${mDef.toUpperCase()}</b>. <span style="color:#faa">BLOCKED!</span>`;
            playBattleAnim('shake', 'enemy');
        } else {
            // HIT -> UNOPOSED ROLL
            isHit = true;
            let diceCount = (p.stats[choice] || 0) + (isNight ? 2 : 0);
            let hits = 0;
            for (let i = 0; i < diceCount; i++) { if (Math.random() * 6 + 1 >= 4) hits++; } // Success on 4+
            dmg = Math.max(0, hits); // Minimum 0 or 1? "deals that much damage".

            // Apply Damage
            target.hp -= dmg;
            if (target.hp <= 0) target.hp = 0; // Death check in updateUI

            resultLog = `Your <b style="color:#fff">${choice.toUpperCase()}</b> vs Enemy <b style="color:#fff">${mDef.toUpperCase()}</b>. <span style="color:#4ade80">HIT!</span> (${dmg} DMG)`;
            playBattleAnim('lunge-right', 'player');
            setTimeout(() => playBattleAnim('hit', 'enemy'), 300);
            showFloatingText(dmg, "dmg-popup", true);
        }
    }

    // --- CASE 2: PLAYER DEFENDING ---
    else if (activeBattle.turnState === 'DEFEND') {
        const attacker = current; // Monster

        // Monster picks Attack Stat (Random or favored?)
        // Let's use highest stat favor or random. Random is harder to guess.
        const mAtt = stats[Math.floor(Math.random() * 3)];

        // Player picked 'choice' as defense.
        if (choice === mAtt) {
            // BLOCKED
            resultLog = `Enemy <b style="color:#fff">${mAtt.toUpperCase()}</b> vs Your <b style="color:#fff">${choice.toUpperCase()}</b>. <span style="color:#4ade80">BLOCKED!</span>`;
            playBattleAnim('shake', 'player');
        } else {
            // HIT -> Check for DODGE first!
            const dodgeChance = p.stats.dodgeRate || 0;
            const dodgeRoll = Math.random() * 100;

            if (dodgeRoll < dodgeChance) {
                // DODGED!
                resultLog = `Enemy <b style="color:#fff">${mAtt.toUpperCase()}</b> attacks! <span style="color:#fbbf24">⚡ DODGED!</span> (${dodgeChance}% chance)`;
                playBattleAnim('shake', 'player');
            } else {
                // MONSTER ROLLS (Unopposed)
                isHit = true;
                let mStatVal = (attacker.stats ? attacker.stats[mAtt] : attacker[mAtt]) || 2;
                let hits = 0;
                for (let i = 0; i < mStatVal; i++) { if (Math.random() * 6 + 1 >= 4) hits++; }
                dmg = Math.max(0, hits);

                activeBattle.pHp -= dmg;
                if (activeBattle.pHp < 0) activeBattle.pHp = 0;

                resultLog = `Enemy <b style="color:#fff">${mAtt.toUpperCase()}</b> vs Your <b style="color:#fff">${choice.toUpperCase()}</b>. <span style="color:#ef4444">HIT!</span> (${dmg} DMG)`;

                // Find sprite for animation
                const idx = activeBattle.opponents.indexOf(attacker);
                const sprites = document.querySelectorAll('.horde-sprite');
                if (sprites[idx]) {
                    sprites[idx].classList.add('anim-lunge-left');
                    setTimeout(() => sprites[idx].classList.remove('anim-lunge-left'), 400);
                }
                setTimeout(() => playBattleAnim('shake', 'player'), 300);
                showFloatingText(dmg, "dmg-popup", false);
            }
        }
    }

    // Log
    const logDiv = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.className = 'battle-log-entry';
    entry.innerHTML = resultLog;
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;

    updateBattleUI();

    if (typeof isMultiplayer !== 'undefined' && isMultiplayer) syncBattleState();

    // End Step
    setTimeout(() => {
        activeBattle.turnProcessing = false;
        advanceTurn();
    }, 1500);
}

function resolveOpponentTurn() {
    // Deprecated by new system, kept empty/redirect to prevent crash if old calls exist
    // advanceTurn(); 
}

function toggleBattleControls(enable) {
    const btns = document.querySelectorAll('.battle-circle-btn');
    btns.forEach(b => {
        b.disabled = !enable;
        b.style.opacity = enable ? '1' : '0.5';
    });
}



// --- VISUAL HELPERS ---
function getDiceVisuals(pool, hits) {
    let html = '<div class="dice-row">';
    for (let i = 0; i < pool; i++) {
        // First 'hits' are green
        if (i < hits) html += '<div class="dice-square dice-hit"></div>';
        else html += '<div class="dice-square dice-miss"></div>';
    }
    html += '</div>';
    return html;
}

function playBattleAnim(type, target) {
    let el;
    if (target === 'player') {
        el = document.getElementById('battle-player-sprite');
    } else if (target === 'enemy') {
        // Target specific enemy if horde, or default generic container
        if (activeBattle && activeBattle.opponents) {
            const idx = activeBattle.targetIndex || 0;
            // Try to find specific sprite
            const sprites = document.querySelectorAll('.horde-sprite');
            if (sprites.length > 0 && sprites[idx]) el = sprites[idx];
            else el = document.getElementById('battle-enemy-sprite');
        } else {
            el = document.getElementById('battle-enemy-sprite');
        }
    } else if (target === 'all-enemies') {
        const sprites = document.querySelectorAll('.horde-sprite');
        if (sprites.length > 0) {
            sprites.forEach(s => {
                s.classList.remove(`anim-${type}`);
                void s.offsetWidth;
                s.classList.add(`anim-${type}`);
                setTimeout(() => s.classList.remove(`anim-${type}`), 1000);
            });
            return; // Handled batch
        } else {
            el = document.getElementById('battle-enemy-sprite');
        }
    }

    if (el) {
        // Reset anim
        el.classList.remove(`anim-${type}`);
        void el.offsetWidth; // Trigger reflow
        el.classList.add(`anim-${type}`);
        setTimeout(() => {
            if (el) el.classList.remove(`anim-${type}`);
        }, 1000); // Clear after 1s (most anims are < 1s)
    }
}

function updateBattleUI() {
    if (!activeBattle) return;

    // --- RENDER BATTLE QUEUE ---
    const qList = document.getElementById('battle-queue-list');
    if (qList && activeBattle.turnQueue) {
        qList.innerHTML = '';
        activeBattle.turnQueue.forEach((entity, idx) => {
            if (entity.dead || (entity.hp <= 0 && !entity.isPlayer)) return; // Skip dead in queue? Or show dead state? User likely wants to track status suitable for targeting. Let's show all but grey out dead.

            const item = document.createElement('div');
            item.className = 'queue-item';
            if (idx === activeBattle.turnIndex) item.classList.add('active');
            if (entity.hp <= 0 && !entity.isPlayer) item.style.opacity = '0.4';

            // Portrait
            const port = document.createElement('div');
            port.className = 'q-port';
            // Use entity.img for Monsters, entity.portrait for Players
            const imgUrl = entity.isPlayer ? entity.portrait : entity.img;
            port.style.backgroundImage = `url('${imgUrl}')`;

            // Initiative Badge
            const initBadge = document.createElement('div');
            initBadge.className = 'q-init';
            initBadge.innerText = idx + 1; // Turn Order 1, 2, 3...
            port.appendChild(initBadge); // Make sure logic matches visual

            // Info
            const info = document.createElement('div');
            info.className = 'q-info';

            const name = document.createElement('div');
            name.className = 'q-name';
            name.innerText = entity.name;
            info.appendChild(name);

            // HP Bar
            const hpContainer = document.createElement('div');
            hpContainer.className = 'q-hp-bar';
            const hpFill = document.createElement('div');
            hpFill.className = 'q-hp-fill';

            // Calculate HP Pct
            let cur = entity.hp || 0;
            let max = entity.maxHp || 20;
            if (entity.isPlayer) { cur = activeBattle.pHp; max = activeBattle.pMaxHp; }

            hpFill.style.width = `${Math.max(0, (cur / max) * 100)}%`;
            hpContainer.appendChild(hpFill);
            info.appendChild(hpContainer);

            item.appendChild(port);
            item.appendChild(info);

            // Click to Target (if Monster)
            if (!entity.isPlayer) {
                item.style.cursor = 'pointer';
                const originalIdx = activeBattle.opponents.indexOf(entity); // Find index in main array
                if (originalIdx !== -1) {
                    item.onclick = () => setBattleTarget(originalIdx);
                }
            }

            qList.appendChild(item);
        });
    }

    const target = activeBattle.opponents[activeBattle.targetIndex];
    // If target is dead (e.g. just died), try to find alive one?
    // Doing that in loop logic usually, but here just safe render


    // --- REFRESH HP & DEATH CHECK ---
    const mBar = document.getElementById('battle-enemy-hp');

    // Check for death of current target to update bar correctly
    if (target && target.hp <= 0 && !target.dead) {
        target.dead = true;
        target.hp = 0;
        playBattleAnim('vanish', 'enemy'); // Animate death
        // Hide sprite visually?
        const sprites = document.querySelectorAll('.battle-monster-sprite');
        if (sprites[activeBattle.targetIndex]) {
            sprites[activeBattle.targetIndex].style.opacity = '0.2';
            sprites[activeBattle.targetIndex].style.filter = 'grayscale(1)';
        }

        // Auto-switch target if enemies remain
        const aliveIdx = activeBattle.opponents.findIndex(o => !o.dead);
        if (aliveIdx !== -1) {
            setBattleTarget(aliveIdx);
        } else {
            // Victory handles in resolve/endBattle
        }
    }

    // Update ALL sprites opacity based on death state (safety sync)
    const sprites = document.querySelectorAll('.battle-monster-sprite');
    activeBattle.opponents.forEach((op, i) => {
        if (op.hp <= 0) {
            op.dead = true;
            op.hp = 0;
            if (sprites[i]) {
                sprites[i].style.opacity = '0.2';
                sprites[i].style.filter = 'grayscale(1)';
            }
        }
    });

    const tHp = target ? Math.max(0, target.hp) : 0;
    const tMax = target ? target.maxHp : 1;
    const mPct = (tHp / tMax) * 100;

    const pBar = document.getElementById('battle-player-hp');
    const pPct = Math.max(0, (activeBattle.pHp / activeBattle.pMaxHp) * 100);

    mBar.style.width = `${mPct}%`;
    pBar.style.width = `${pPct}%`;

    // Color coding
    mBar.className = mPct < 25 ? 'hp-fill crit' : (mPct < 50 ? 'hp-fill low' : 'hp-fill');
    pBar.className = pPct < 25 ? 'hp-fill crit' : (pPct < 50 ? 'hp-fill low' : 'hp-fill');

    // --- REFRESH SKILL BUTTONS ---
    const p = activeBattle.player;
    if (p.class && p.class.actives) {

        // FILTER: Re-calculate to match slots
        let skillSet = new Set();
        if (p.activeSkillId) skillSet.add(p.activeSkillId);
        if (p.activeSkillId2) skillSet.add(p.activeSkillId2);

        // Add Assigned Skills (Fix for Scholar/Items)
        if (p.assignedSkills) {
            Object.values(p.assignedSkills).forEach(s => {
                if (s && s.id) skillSet.add(s.id);
            });
        }

        if (p.skills && Array.isArray(p.skills)) {
            p.skills.forEach(s => skillSet.add(s));
        }

        // --- FIX: DO NOT AUTO-POPULATE ALL CLASS SKILLS ---
        // if (skillSet.size === 0 && p.class && p.class.actives) {
        //     p.class.actives.forEach(s => skillSet.add(s));
        // }
        // --------------------------------------------------

        const skillsToCheck = Array.from(skillSet);

        // Hide ALL buttons first
        if (p.class.actives) {
            p.class.actives.forEach(key => {
                const btn = document.getElementById(`dungeon-skill-${key}`);
                if (btn) btn.style.display = 'none';
            });
        }

        skillsToCheck.forEach(key => {
            const btn = document.getElementById(`dungeon-skill-${key}`);
            if (btn) {
                btn.style.display = 'flex'; // Show only active ones
                const cd = (p.battleCooldowns && p.battleCooldowns[key]) || 0;

                if (cd > 0) {
                    btn.classList.add('on-cooldown');
                    btn.setAttribute('data-cd', cd);
                } else {
                    btn.classList.remove('on-cooldown');
                    btn.removeAttribute('data-cd');
                }
            }
        });
    }
}

function logBattleAction(msg) {
    const l = document.getElementById('battle-log');
    if (!l) return;

    // Create new entry
    const entry = document.createElement('div');
    entry.className = "log-entry"; // Match Adventure Log class
    entry.innerHTML = `> ${msg}`; // Add prefix

    // Optional: Alternate colors based on content?
    if (msg.includes("attacks")) entry.style.color = "#ffaaaa";
    if (msg.includes("Victory")) entry.style.color = "#aaffaa";

    l.appendChild(entry);

    // Maintain History Limit
    if (l.childElementCount > 50) l.removeChild(l.firstChild);

    // Auto Scroll to bottom (The log itself is scrollable now)
    l.scrollTop = l.scrollHeight;
}

function showFloatingText(txt, cls, onEnemy) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerText = txt;

    // Position roughly over sprites
    // This is simple DOM positioning; ideally would track element rects, 
    // but fixed % works given the container is relative
    if (onEnemy === undefined) {
        // Center (Block)
        el.style.left = '50%'; el.style.top = '40%';
    } else if (onEnemy) {
        el.style.right = '20%'; el.style.top = '30%';
    } else {
        el.style.left = '20%'; el.style.bottom = '40%';
    }

    document.getElementById('battle-container').appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function endBattle(victory, isFleeing = false) {
    const btn = document.getElementById('battle-actions');
    if (btn) btn.style.display = 'none'; // Disable input

    // CAPTURE PLAYER REFERENCE SAFELY
    const player = activeBattle ? activeBattle.player : null;
    const finalHp = activeBattle ? activeBattle.pHp : 0;
    const maxHp = activeBattle ? activeBattle.pMaxHp : 20;

    if (victory && player) {
        logBattleAction("VICTORY! The enemy falls.");

        // DECREMENT COOLDOWNS (Battle-based)
        if (player.dungeonCooldowns) {
            for (const k in player.dungeonCooldowns) {
                if (player.dungeonCooldowns[k] > 0) player.dungeonCooldowns[k]--;
                if (player.dungeonCooldowns[k] <= 0) delete player.dungeonCooldowns[k];
            }
        }

        setTimeout(() => {
            document.getElementById('battle-modal').classList.remove('active');

            if (activeBattle.isBoss) {
                player.dungeonCooldowns = {};
                const lootCount = Math.floor(Math.random() * 6) + 1;
                const lootedItems = [];
                for (let i = 0; i < lootCount; i++) {
                    const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
                    const newItem = createItemInstance(card);
                    player.inventory.push(newItem);
                    lootedItems.push(newItem);
                }
                addLog(`BOSS DEFEATED! Looted ${lootCount} Treasures!`, "log-epic");
                setTimeout(() => {
                    const showItem = lootedItems[0];
                    if (lootedItems.length > 1) addLog(`(You also found ${lootedItems.length - 1} other items!)`, "log-rare");
                    showEncounter(player, showItem, null, 'loot');
                }, 500);

                // Teleport to Inn & Despawn
                setTimeout(() => {
                    player.inDungeon = false;
                    player.isSkipping = false;
                    player.pos = 0;
                    player.hp = player.maxHp; // Fully Heal at Inn
                    player.mesh.position.copy(tiles[0].position);
                    updateHUD();
                    addLog("The Dungeon collapses! Warping to Inn...", "log-rare");
                    endStep();
                }, 4000);

            } else {
                // Normal Overworld/Dungeon Fight Victory
                let treasureDraws = 0;
                if (activeBattle.type === 'dungeon') {
                    // MINI BOSS REWARD: 3 Cards for Lich or Bandit Lord
                    if (activeBattle.opponent.name === "Lich" || activeBattle.opponent.name === "Bandit Lord") {
                        treasureDraws = 3;
                        addLog(`${player.name} defeated the Mini-Boss!`, "log-epic");
                    } else {
                        treasureDraws = 1;
                    }
                }
                else {
                    for (let i = 0; i < activeBattle.opponents.length; i++) {
                        if (Math.floor(Math.random() * 6) + 1 >= 5) treasureDraws++;
                    }
                }

                if (treasureDraws > 0) {
                    addLog(`Looting... Found ${treasureDraws} items!`, "log-success");
                    for (let t = 0; t < treasureDraws; t++) {
                        const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
                        const newItem = createItemInstance(card);
                        if (t === 0 && !player.isAi) {
                            setTimeout(() => showEncounter(player, newItem, null, 'loot'), 500);
                        } else {
                            player.inventory.push(newItem);
                            if (player.isAi) addLog(`${player.name} looted ${newItem.name}.`, "log-rare");
                        }
                    }
                }

                // HEALTH PERSISTENCE: Save HP
                player.hp = finalHp;
                updateHUD();
                addLog(`Victory! HP: ${player.hp}/${player.maxHp}`, "log-success");

                if (activeBattle.onVictory) {
                    activeBattle.onVictory();
                } else {
                    endStep();
                }
            }
            activeBattle = null;
        }, 1000);

    } else if (player) {
        // --- DEFEAT OR FLEE ---
        const isDungeon = activeBattle.type === 'dungeon';

        if (isFleeing) {
            logBattleAction(isDungeon ? "You flee the dungeon in terror!" : "You choose to flee!");
        } else {
            logBattleAction(isDungeon ? "DEFEAT... You pass out in the dungeon." : "DEFEAT... You are beaten.");
        }

        setTimeout(() => {
            document.getElementById('battle-modal').classList.remove('active');

            if (isDungeon) {
                // DUNGEON DEATH/FLEE PENALTY
                const lostGold = Math.floor(player.gold / 2);
                player.gold -= lostGold;

                // ITEM LOSS: Lose one random ENTIRE item from equipment
                const equippedSlots = ['head', 'body', 'main', 'off', 'feet'];
                const filledSlots = equippedSlots.filter(s => player.equipment && player.equipment[s]);

                let lostItemName = "nothing";
                if (filledSlots.length > 0) {
                    const slot = filledSlots[Math.floor(Math.random() * filledSlots.length)];
                    lostItemName = player.equipment[slot].name;
                    player.equipment[slot] = null;
                    if (typeof recalcStats === 'function') recalcStats(player);
                }

                player.inDungeon = false;
                player.pos = 0; // Respawn at Old Crooks Inn
                player.hp = player.maxHp; // Fully Heal at Inn
                player.mesh.position.copy(tiles[0].position);
                updateHUD();

                addLog(`Woke up at the Inn. Lost ${lostGold}G and your ${lostItemName}.`, "log-fail");
                endStep();
            } else {
                // OVERWORLD DEFEAT/FLEE
                const penaltyMult = isFleeing ? 0.2 : 0.1; // Double penalty for fleeing
                const fine = Math.floor(player.gold * penaltyMult);
                player.gold -= fine;
                player.hp = Math.max(1, finalHp); // Don't let overworld death set HP to 0 if we don't respawn
                updateHUD();

                addLog(`You fled/lost and dropped ${fine}G.`, "log-fail");
                endStep();
            }

            activeBattle = null;
            if (typeof isMultiplayer !== 'undefined' && isMultiplayer) {
                db.ref(`games/${gameId}/battleState`).set(null);
            }
        }, 1500);
    }
}

function fleeBattle() {
    if (!activeBattle || activeBattle.turnProcessing) return;
    // Confirm? Maybe just go for it as per user request
    endBattle(false, true);
}

function simulateAiBattle(battle) {
    // Simple math simulation for AI vs Horde/Single
    const p = battle.player;
    const opponents = battle.opponents || [];

    // Safety: If no opponents, assume victory or abort
    if (opponents.length === 0) {
        activeBattle = null;
        if (typeof isMultiplayer !== 'undefined' && isMultiplayer) db.ref(`games/${gameId}/battleState`).set(null);
        return;
    }

    const pStr = (p.stats && p.stats.str) || 1;
    let totalDmgTaken = 0;
    let defeatedCount = 0;
    let treasureDraws = 0;

    // Simulate fight for EACH opponent
    opponents.forEach(m => {
        const mStr = (m.stats && m.stats.str) || (m.str || 1);

        // Win chance favored by stats
        let winChance = 0.6 + ((pStr - mStr) * 0.05);
        if (winChance > 0.9) winChance = 0.9;
        if (winChance < 0.1) winChance = 0.1;

        const victory = Math.random() < winChance;

        if (victory) {
            defeatedCount++;
            // 20% Dmg on win
            totalDmgTaken += Math.floor(battle.pMaxHp * 0.2);

            // Loot Logic (Dungeon=100%, Overworld=33%)
            if (battle.type === 'dungeon') treasureDraws++;
            else if (Math.random() * 6 + 1 >= 5) treasureDraws++;

        } else {
            // 50% Dmg on loss
            totalDmgTaken += Math.floor(battle.pMaxHp * 0.5);
        }
    });

    // Apply outcome
    p.dungeonHp = Math.max(1, (battle.pHp || battle.pMaxHp) - totalDmgTaken);

    // Overall Victory? If defeated at least 1? Or All?
    // Let's say if you defeated > 50% of horde, you "won" the encounter?
    // Or strictly all? For simplicity, if (defeatedCount === opponents.length) -> Total Win
    // If partial, maybe retreat?
    // User requested "Win/Loss". Let's stick to simple:
    // If you survived and killed at least one, count as success?
    // Better: Boolean result based on total survival logic.
    // Let's simplify: If defeatedCount == opponents.length, "Victory".

    const isVictory = (defeatedCount === opponents.length);

    if (isVictory) {
        if (treasureDraws > 0) {
            for (let t = 0; t < treasureDraws; t++) {
                if (p.inventory) {
                    const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
                    const newItem = createItemInstance(card);
                    p.inventory.push(newItem);
                    if (t === 0) addLog(`${p.name} defeated the horde and found ${newItem.name}.`, "log-success");
                    else addLog(`(And another item)`, "log-rare");
                }
            }
        } else {
            addLog(`${p.name} defeated the enemy.`, "log-success");
        }

        // Logic for tile?
        if (battle.type === 'overworld') {
            continueLandingLogic(p, tiles[p.pos]);
        } else {
            endStep();
        }

    } else {
        // Loss
        const fine = Math.floor(p.gold * 0.1);
        p.gold = Math.max(0, p.gold - fine);
        addLog(`${p.name} flagged to ${opponents[0].name} and paid ${fine}G.`, "log-fail"); // "flagged" -> "fell"? Typo fix: "lost"
        endStep();
    }

    activeBattle = null;
    if (typeof isMultiplayer !== 'undefined' && isMultiplayer) {
        db.ref(`games/${gameId}/battleState`).set(null);
    }
}

function syncBattleState() {
    if (!activeBattle || !gameId || !db) return;
    // Only the 'owner' of the turn should ideally write, but strictly syncing state is safer
    // We send: pHp, mHp, turn
    const state = {
        pHp: activeBattle.pHp,
        mHp: activeBattle.mHp,
        opponentIdx: activeBattle.opponent.id || "MONSTER", // identify opponent
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    db.ref(`games/${gameId}/battleState`).set(state);
}

function handleRemoteBattleUpdate(val) {
    if (!activeBattle) return; // If we aren't in battle, ignore? Or should we auto-join?
    // For now, assume we are both in battle.

    // Sync HP
    activeBattle.pHp = val.pHp;
    activeBattle.mHp = val.mHp;

    // Update UI
    updateBattleUI();
}

// Override triggerDungeonBoss to use new system
function triggerDungeonBoss(p, isAmbush) {
    const config = DUNGEON_DATA[p.dungeonType];
    const bossData = {
        name: config.bossName,
        hp: config.bossStats.hp,
        str: config.bossStats.str,
        dex: config.bossStats.dex,
        int: config.bossStats.int,
        img: config.bossStats.img,
        minions: config.minions, // Copy Minions Configuration
        isBoss: true // Added flag for startBattle detection
    };

    // Start Boss Battle
    startBattle(p, bossData, 'dungeon');
}


function handleActionClick() {
    // If it's the Roll Phase, Roll.
    if (gameState === 'ROLL') {
        rollMove();
    }
    // If it's the End Phase, End Turn.
    else if (gameState === 'END') {
        endTurn();
    }
    // Otherwise, button shouldn't be clickable, but just in case:
    else {
        console.log("Not a valid phase for action button");
    }
}

function onWindowResize() {
    const wrapper = document.getElementById('game-viewport-wrapper');
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    // IMPORTANT: style.width/height needs to match to prevent stretching
    renderer.domElement.style.width = width + 'px';
    renderer.domElement.style.height = height + 'px';

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    updateCamera();
}

// Replace the old transitionDayNight function with this one
function updateEnvironmentVisuals() {
    // 1. Determine Logic
    // Check if the "Dense Fog" event is currently active in the list
    const isFogEvent = activeEvents.some(e => e.data && e.data.id === 'event_fog');

    // Fog should appear if it is Night OR if the Fog Event is active
    const shouldHaveFog = isNight || isFogEvent;

    // 2. Animate Board Overlay (Darkness)
    // Only dark at Night. Fog Event during day is just foggy, not pitch black.
    if (nightBoard) {
        new TWEEN.Tween(nightBoard.material)
            .to({ opacity: isNight ? 1 : 0 }, 2000)
            .start();
    }

    // 3. Animate Skybox
    // Night = Dark Blue/Black
    // Day = Light Grey (0xcccccc to match init)
    const skyColor = isNight ? { r: 0.02, g: 0.02, b: 0.06 } : { r: 0.8, g: 0.8, b: 0.8 };
    new TWEEN.Tween(scene.background)
        .to(skyColor, 2000)
        .start();

    // 4. Animate Fog Clouds
    if (fogGroup) {
        fogGroup.children.forEach(cloud => {
            // If fog is on, go to its max opacity. If off, go to 0.
            const targetOpacity = shouldHaveFog ? cloud.userData.maxOpacity : 0;

            new TWEEN.Tween(cloud.material)
                .to({ opacity: targetOpacity }, 2000)
                .start();
        });
    }

    // 5. Update HUD Text
    const elDayNight = document.getElementById('day-night-indicator');
    if (elDayNight) {
        elDayNight.innerText = isNight ? "☾ NIGHT" : "☀ DAY";
        elDayNight.style.color = isNight ? "#a855f7" : "#87ceeb";
    }
}

// Keep this wrapper for compatibility if old code calls it
function transitionDayNight(toNight) {
    updateEnvironmentVisuals();
}

// --- DYNAMIC EVENT GLOBALS ---
let activeEvents = [];
let activeEvent = null; // Stores current event data { id, mesh, pos, type }
let particleSystem = null; // For weather
let eventTurnCounter = 0; // Duration tracker

// --- EVENT DEFINITIONS ---

// --- EVENT ENTITY HANDLERS (Visuals Only) ---
function spawnEventEntity(data) {
    // 1. Create Model (Visuals)
    const mesh = createDetailedBossMesh(data.modelType);

    // 2. Create ID
    const entityId = -1 * (Math.floor(Math.random() * 1000) + 10);

    // 3. Random Spawn Position
    const startPos = Math.floor(Math.random() * 40);

    // 4. Create Entity Object
    const entityPlayer = {
        id: entityId,
        name: data.name,
        isEventEntity: true,
        isAi: true,
        bossType: data.type,
        color: '#a855f7',
        pos: startPos,
        mesh: mesh,
        gold: 99999,
        stats: { str: 0, dex: 0, int: 0 },
        race: null,
        class: null,
        // FIX: Initialize these to null
        activeSkillId: null,
        passiveSkillId: null,
        // -----------------------------
        inventory: [],
        equipment: { head: null, body: null, hands: null, feet: null, ring_l: null, ring_r: null, amulet: null, back: null, main: null, off: null },
        quickSlots: [null, null],
        isPolymorphed: false,
        originalMesh: mesh,
        metrics: { spacesMoved: 0, successfulSieges: 0, guardsHired: 0 },
        history: []
    };

    // 5. Setup Mesh Scaling and Position
    // FIX: Changed 'g' to 'mesh' to fix the ReferenceError
    mesh.scale.set(1.5, 1.5, 1.5);

    const t = tiles[startPos].position.clone();
    mesh.position.set(t.x, 0, t.z);

    // 6. Add to Players Array
    const maxIdx = Math.max(1, players.length);
    players.splice(maxIdx, 0, entityPlayer);

    addLog(`${data.name} has arrived at ${tiles[startPos].userData.info.name}!`, "log-epic");
    updateHUD();

    return entityPlayer;
}

function removeEventEntity(entityPlayer) {
    if (!entityPlayer) return;
    const idx = players.indexOf(entityPlayer);
    if (idx > -1) {
        players.splice(idx, 1);
        if (entityPlayer.mesh) scene.remove(entityPlayer.mesh);
        addLog(`${entityPlayer.name} has departed.`, "log-rare");

        // Adjust turn index if we removed someone before current turn
        if (idx < turnIndex) turnIndex--;
        updateHUD();
    }
}

function removeBossPlayer(bossPlayer) {
    const idx = players.indexOf(bossPlayer);
    if (idx > -1) {
        players.splice(idx, 1);
        scene.remove(bossPlayer.mesh);
        addLog(`${bossPlayer.name} has departed.`, "log-rare");

        // Adjust turn index if we removed someone before current turn
        if (idx < turnIndex) turnIndex--;
        updateHUD();
    }
}

const MAP_EVENTS = [
    // 1. THE ALCHEMIST
    {
        id: 'merch_alchemist', name: "Roaming Alchemist", type: 'merchant', duration: 12, modelType: 'merchant_purple',
        desc: "Potions and Scrolls.",
        onStart: () => { activeEvent.playerRef = spawnEventEntity(MAP_EVENTS[0]); },
        onEnd: () => { removeEventEntity(activeEvent.playerRef); },
        onTurn: (me) => false,
        onLand: (p, me, next) => {
            if (p.id === 0) {
                const stock = DECK_TREASURE.filter(i => i.type === 'scroll' && !i.name.includes('Gold') && !i.name.includes('Coin'));
                const items = [];
                for (let k = 0; k < 3; k++) items.push(stock[Math.floor(Math.random() * stock.length)]);
                openCustomShop(p, items, "Alchemist's Cart", next);
            } else { if (next) next(); }
        }
    },
    // 2. THE ARMORER
    {
        id: 'merch_armorer', name: "Iron Caravan", type: 'merchant', duration: 12, modelType: 'merchant_red',
        desc: "Heavy armor and shields.",
        onStart: () => { activeEvent.playerRef = spawnEventEntity(MAP_EVENTS[1]); },
        onEnd: () => { if (activeEvent && activeEvent.playerRef) removeEventEntity(activeEvent.playerRef); },
        onTurn: (me) => false,
        onLand: (p, me, next) => {
            if (p.id === 0) {
                const stock = DECK_TREASURE.filter(i => (i.slot === 'head' || i.slot === 'body' || i.slot === 'off') && !i.name.includes('Gold'));
                const items = [];
                for (let k = 0; k < 3; k++) items.push(stock[Math.floor(Math.random() * stock.length)]);
                openCustomShop(p, items, "The Iron Caravan", next);
            } else { if (next) next(); }
        }
    },
    // 3. THE WEAPONSMITH
    {
        id: 'merch_weaponsmith', name: "Blade Peddler", type: 'merchant', duration: 12, modelType: 'merchant_red',
        desc: "Sharp steel for sale.",
        onStart: () => { activeEvent.playerRef = spawnEventEntity(MAP_EVENTS[2]); },
        onEnd: () => { if (activeEvent && activeEvent.playerRef) removeEventEntity(activeEvent.playerRef); },
        onTurn: (me) => false,
        onLand: (p, me, next) => {
            if (p.id === 0) {
                const stock = DECK_TREASURE.filter(i => i.slot === 'main' && !i.name.includes('Gold'));
                const items = [];
                for (let k = 0; k < 3; k++) items.push(stock[Math.floor(Math.random() * stock.length)]);
                openCustomShop(p, items, "Blade Peddler", next);
            } else { if (next) next(); }
        }
    },
    // --- WEATHER & GLOBAL ---
    { id: 'weather_blizzard', name: "Great Blizzard", type: 'weather', duration: 3, desc: "Heavy snow slows everyone down (-1 Move).", onStart: () => createParticleSystem('snow'), onTurn: () => { }, onEnd: () => { removeParticles(); addLog("The blizzard clears."); } },
    { id: 'weather_goldrain', name: "Golden Rain", type: 'weather', duration: 1, desc: "Magical rain! Gain 10G per step taken.", onStart: () => createParticleSystem('gold'), onTurn: () => { }, onEnd: () => { removeParticles(); addLog("The gold rain stops."); } },
    { id: 'event_fog', name: "Dense Fog", type: 'weather', duration: 3, desc: "Visibility reduced. Encounter requirements are hidden!", onStart: () => updateEnvironmentVisuals(), onEnd: () => updateEnvironmentVisuals() },
    { id: 'event_market', name: "Market Boom", type: 'global', duration: 3, desc: "All properties generate +50% Rent.", onStart: () => addLog("Real estate prices skyrocket!", "log-success") },
    { id: 'event_tax', name: "Royal Audit", type: 'global', duration: 1, desc: "The King demands a tribute instantly.", onStart: () => { players.forEach(pl => { if (!pl.isDead && !pl.isEventEntity) { const tax = Math.floor(pl.gold * 0.1); pl.gold -= tax; treasuryGold += tax; } }); addLog("Royal Audit: Everyone lost 10% Gold.", "log-fail"); updateHUD(); } },

    // --- NEW DUNGEON EVENTS ---
    // Note: onStart is empty here because forceTriggerEvent handles the DB/Visual spawning logic directly based on the name.
    { id: 'dungeon_void', name: "Void Edge", type: 'dungeon', duration: 20, desc: "A rift to the Void has opened!", onStart: () => { } },
    { id: 'dungeon_vampire', name: "Vampire Manor", type: 'dungeon', duration: 20, desc: "The Countess invites you to dinner...", onStart: () => { } },
    { id: 'dungeon_demon', name: "Demon Gate", type: 'dungeon', duration: 20, desc: "Hellfire rises from the deep!", onStart: () => { } },
    { id: 'dungeon_wyvern', name: "Wyvern Peak", type: 'dungeon', duration: 20, desc: "Storms gather around the high peak.", onStart: () => { } }
];

// --- EVENT VISUAL BUILDERS ---
// --- ADVANCED MODEL BUILDER ---
function createDetailedBossMesh(type) {
    const g = new THREE.Group();
    let matBody;

    // Only Merchants remain
    if (type.includes('merchant')) {
        const isMystic = type.includes('purple');
        matBody = new THREE.MeshStandardMaterial({ color: isMystic ? 0x6b21a8 : 0x991b1b }); // Purple or Red Robe

        // Body
        const robe = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 8), matBody);
        robe.position.y = 0.9;

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35), new THREE.MeshStandardMaterial({ color: 0xffccaa }));
        head.position.y = 1.9;

        // Hat
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 8), matBody);
        hat.position.y = 2.3;
        hat.rotation.x = -0.2;

        // Backpack
        const packGroup = new THREE.Group();
        const packMain = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.8), new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
        const bedroll = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2), new THREE.MeshStandardMaterial({ color: 0xeee8aa }));
        bedroll.rotation.z = Math.PI / 2;
        bedroll.position.y = 0.7;

        packGroup.add(packMain, bedroll);
        packGroup.position.set(0, 1.2, -0.6);

        g.add(robe, head, hat, packGroup);
    }
    // Fallback if something else is called (prevents crash)
    else {
        const fallback = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff00ff }));
        fallback.position.y = 1;
        g.add(fallback);
    }

    g.position.copy(tiles[0].position);
    scene.add(g);
    return g;
}

function createParticleSystem(type) {
    const count = 1000;
    const geom = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < count; i++) {
        positions.push((Math.random() - 0.5) * 60, 10 + Math.random() * 10, (Math.random() - 0.5) * 60);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    let col = (type === 'snow') ? 0xffffff : 0xffd700;
    const mat = new THREE.PointsMaterial({ color: col, size: 0.3, transparent: true });
    particleSystem = new THREE.Points(geom, mat);
    particleSystem.userData = { type: type };
    scene.add(particleSystem);
}

function removeParticles() {
    if (particleSystem) {
        scene.remove(particleSystem);
        particleSystem = null;
    }
}

// --- LOGIC HELPERS ---
function triggerRandomEvent() {
    // 1. Roll Event Index
    const idx = Math.floor(Math.random() * MAP_EVENTS.length);
    const evData = MAP_EVENTS[idx];

    // 2. Initialize Instance Object
    const newEvent = {
        id: Date.now() + Math.random(),
        data: evData,
        turnsLeft: evData.duration,
        playerRef: null
    };

    let delayRequired = 0;

    // 3. Mapping for Dungeons
    const dungeonMap = {
        "Void Edge": "Void Edge",
        "Vampire Manor": "Vampire Manor",
        "Demon Gate": "Demon Gate",
        "Wyvern Peak": "Wyvern Peak"
    };

    // 4. Multiplayer Logic (Host)
    if (isMultiplayer && db && gameId) {
        db.ref(`games/${gameId}/activeEvents`).push({
            idx: idx,
            turns: evData.duration,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Trigger Dungeon if applicable
        if (dungeonMap[evData.name]) {
            db.ref(`games/${gameId}/dungeonActive`).set({ type: dungeonMap[evData.name] });
            delayRequired = 8000; // 8 seconds for cinematic sync
        }

        globalLog(`EVENT: ${evData.name}!`, "log-epic");
    }
    // 5. Single Player Logic
    else {
        // Handle "onStart" (Bosses, Weather particles)
        // Temporarily set global activeEvent so spawn functions work
        activeEvent = newEvent;
        if (evData.onStart) evData.onStart();

        // --- FIX: Explicitly Spawn Dungeon Visuals ---
        if (dungeonMap[evData.name]) {
            spawnDungeonVisuals(dungeonMap[evData.name]);
            delayRequired = 8000; // 8s for cinematic
        }

        activeEvents.push(newEvent);

        addLog(`EVENT: ${evData.name}!`, "log-epic");
        addLog(evData.desc, "log-rare");
    }

    // Play Sound
    AUDIO.playSound('sfx_transition');

    // Clear temp global
    activeEvent = null;

    return delayRequired;
}

function processBossTurn(boss) {
    debugLog(`Boss Turn: ${boss.name}`);
    if (!isZoomed) zoomToPiece(boss);

    if (boss.pos === 0) boss.abilityReady = true;

    // Custom Logic
    const eventDef = MAP_EVENTS.find(e => e.name === boss.name);
    let specialMoveUsed = false;
    if (eventDef && eventDef.onTurn) {
        specialMoveUsed = eventDef.onTurn(boss);
    }

    if (specialMoveUsed) {
        debugLog("Boss used Special Move");
        return;
    }

    // Standard Move
    let moveRoll = 0;
    const bName = boss.name || "";
    if (bName.includes("Dragon") || bName.includes("Inferno")) moveRoll = Math.floor(Math.random() * 4) + 2;
    else if (bName.includes("Wraith") || bName.includes("Void")) moveRoll = 3;
    else if (bName.includes("Golem")) moveRoll = 1;
    else moveRoll = 2;

    addLog(`${boss.name} moves ${moveRoll} spaces.`);
    debugLog(`Boss Rolling: ${moveRoll}`);

    gameState = 'MOVING';
    animateMove(boss, moveRoll);
}

function moveEntity(eventObj, steps) {
    if (!eventObj.mesh) return;

    let currentPos = eventObj.pos;
    eventObj.pos = (currentPos + steps) % 40;

    const target = tiles[eventObj.pos].position;

    // Animate jump
    new TWEEN.Tween(eventObj.mesh.position)
        .to({ x: target.x, z: target.z }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            // Apply effect on tile landed
            if (eventObj.data.onTileEffect) eventObj.data.onTileEffect(tiles[eventObj.pos]);
        })
        .start();
}

function openCustomShop(p, items, title, nextCallback) {
    const m = document.getElementById('card-modal');
    document.getElementById('enc-title').innerText = title;
    document.getElementById('enc-desc').innerText = "Hover/Tap to view info. Double-Tap to buy.";
    document.getElementById('enc-header').className = 'card-header market';

    const l = document.getElementById('choice-list');
    l.innerHTML = '';

    let selectedItemUID = null;

    // --- DISCOUNT LOGIC ---
    const getDiscountedPrice = (baseCost) => {
        let cost = baseCost;
        if (p.passiveSkillId === 'veteran') {
            cost = Math.floor(cost * 0.8); // 20% Off
        }
        if (p.passiveSkillId === 'haggler') {
            cost = Math.floor(cost * 0.75); // 25% Off
        }
        // If both, they stack multiplicatively (approx 40% total)
        return Math.max(0, cost);
    };

    items.forEach(it => {
        if (!it) return; // Prevent crash if item is null

        let b = document.createElement('div');
        b.className = 'choice-btn';
        b.style.display = 'flex';
        b.style.flexDirection = 'column';
        b.style.alignItems = 'flex-start';
        b.style.gap = '2px';

        const finalCost = getDiscountedPrice(it.cost);

        // Show discount visual if price is different
        let costHtml = `<span style="color:var(--gold)">${finalCost}G</span>`;
        if (finalCost < it.cost) {
            costHtml = `<span style="text-decoration:line-through; color:#666; font-size:0.8em; margin-right:5px;">${it.cost}G</span> ` + costHtml;
        }

        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.width = '100%';
        headerDiv.innerHTML = `<span style="font-weight:bold; color:${getRarityColor(it.rarity)}">${it.name}</span> <div>${costHtml}</div>`;

        const subDiv = document.createElement('div');
        subDiv.style.fontSize = '0.75rem';
        subDiv.style.color = '#aaa';
        subDiv.innerText = it.type === 'scroll' ? "Scroll (Consumable)" : `Equip: ${it.slot ? it.slot.toUpperCase() : '?'}`;

        b.appendChild(headerDiv);
        b.appendChild(subDiv);

        b.onmouseenter = () => showTooltip(it);
        b.onmouseleave = hideTooltip;

        const attemptBuy = () => {
            if (p.gold >= finalCost) {
                if (p.inventory.length >= 12) {
                    addLog("Inventory Full!", "log-fail");
                    return;
                }
                p.gold -= finalCost;
                p.inventory.push(createItemInstance(it));
                addLog(`Bought ${it.name} for ${finalCost}G.`, "log-success");
                updateHUD();
                if (isMultiplayer) syncPlayerState();
                b.remove();
                hideTooltip();
                selectedItemUID = null;
            } else {
                addLog("Not enough Gold!", "log-fail");
            }
        };

        b.onclick = (e) => {
            e.stopPropagation();
            if (selectedItemUID === it.id) attemptBuy();
            else {
                document.querySelectorAll('.choice-btn').forEach(btn => btn.style.borderColor = '#4a5568');
                b.style.borderColor = '#fbbf24';
                selectedItemUID = it.id;
                showTooltip(it);
            }
        };

        b.ondblclick = (e) => { e.stopPropagation(); attemptBuy(); };
        l.appendChild(b);
    });

    // --- LEAVE BUTTON ---
    let b = document.createElement('div');
    b.className = 'choice-btn';
    b.innerText = "Leave Shop";
    b.style.marginTop = "15px";
    b.style.textAlign = "center";
    b.style.justifyContent = "center";
    b.onclick = () => {
        hideTooltip();
        m.classList.remove('active');
        if (nextCallback) nextCallback();
    };
    l.appendChild(b);

    m.classList.add('active');
}

// --- UNIQUE ID GENERATOR ---
function generateUID() {
    return 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// --- ITEM INSTANTIATOR ---
// Creates a unique copy of an item so it doesn't share state with others
function createItemInstance(templateItem) {
    if (!templateItem) return null;

    // Deep copy data properties
    const newItem = JSON.parse(JSON.stringify(templateItem));

    // Ensure Unique ID
    newItem.uid = 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

    // Restore function reference from local template (if available)
    if (templateItem.fn) newItem.fn = templateItem.fn;
    if (templateItem.ability && templateItem.ability.fn) newItem.ability.fn = templateItem.ability.fn;

    newItem.isDepleted = false;

    // --- ANCIENT UPGRADE LOGIC (10% Chance for Legendary) ---
    if (newItem.rarity && newItem.rarity.toLowerCase() === 'legendary') {
        if (Math.random() < 0.10) {
            newItem.rarity = 'ancient';
            newItem.name = newItem.name.replace(/Legendary/i, "Ancient");

            // Assign Random Ancient Ability
            const ancientKeys = Object.keys(ABILITY_LIBRARY).filter(k => k.startsWith('ancient_'));
            if (ancientKeys.length > 0) {
                const randomKey = ancientKeys[Math.floor(Math.random() * ancientKeys.length)];
                newItem.ability = randomKey;
                // Note: The system uses ABILITY_LIBRARY[id].fn later, so ID is enough, 
                // but some logic might expect the full object. 
                // Let's attach metadata to be safe or just the ID if that's how items work.
                // Based on previous code: items store 'ability' field which might be an ID string or object?
                // Looking at standard items: 'ability: null' or 'ability: something'.
                // Looking at 'Vanguard' passive: 'ability: null'.
                // Looking at 'Transmute' item: 'ability' isn't explicitly shown in definition but 'fn' is.
                // Standard items usually have 'fn' directly if they are consumable.
                // Equipment usually has 'ability' as a property or grants stats.
                // If it's Equipment, it likely doesn't have an 'on-use' fn unless specialized.
                // But these are Super Abilities.
                // We'll set 'ability' to the ID string, and ensuring the UI/logic handles it.
                // Actually, let's look at how skills/abilities are used.
                // If it's equipment, `setupItemInteractions` checks `item.ability`?

                // Let's mimic how 'Arcane Eye' or similar active items work.
                // They likely have 'fn' on the item itself if it's a scroll.
                // But this is Equipment.
                // The implementation plan says "Equipment ... has the word Ancient".
                // And "appear on Legendary Equipment".
                // So they are EQUIPABLE items that grant an ABILITY.
                // Usually `p.activeSkillId` or `p.assignedSkills`.
                // If the item grants a skill, we need to let the player cast it.
                // Current engine: Does equipped gear grant active skills?
                // Likely not supported by default.
                // I'll attach the ability ID to `newItem.grantedAbility = randomKey`.
                // And we'll need to ensure the HUD shows it.

                // WAIT. The prompt says "appear on Legendary Equipment".
                // "FireWave - This will cost the caster 1000 Gold...".
                // This implies an Active Skill.
                // If I just set `newItem.ability = rKey`, does the engine pick it up?
                // I'll assume YES for now, or I'll check `openCharDetail` or `updateHUD`.
                // `openCharDetail` had a "MANAGE SKILLS" button.

                newItem.grantedAbility = randomKey;
                newItem.desc = (newItem.desc || "") + " [ANCIENT: " + ABILITY_LIBRARY[randomKey].name + "]";
            }
        }
    }

    return newItem;
}

// --- UNIFIED NOTIFICATION SYSTEM ---
// NOTIFICATIONS object moved to ui_common.js to fix overlap/load order


function init() {
    // 1. Three.js Setup
    scene = new THREE.Scene();
    const fogColor = 0xcccccc;
    scene.background = new THREE.Color(fogColor);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-layer').appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 0.6); scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffd700, 0.8); dir.position.set(30, 40, 20); dir.castShadow = true; scene.add(dir);

    updateCamera();
    window.addEventListener('resize', onWindowResize, false);
    createEnvironment();
    createBoard();
    createDecks();
    createFog();
    updateEnvironmentVisuals();

    AUDIO.init();

    // --- GLOBAL TIMER RESET ON INTERACTION ---
    document.addEventListener('click', () => {
        // Cannot reset time while moving
        if (gameState === 'MOVING') return;

        const p = players[turnIndex];
        if (!p || p.isAi) return;

        // Multiplayer: If it's MY turn
        if (isMultiplayer && p.id === myPlayerId) {
            if (Date.now() - lastInteractionTime > 1000) {
                lastInteractionTime = Date.now();
                if (gameId && db) {
                    db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);
                }
            }
        }
        // Single Player
        else if (!isMultiplayer) {
            lastInteractionTime = Date.now();
        }
    });
    // ----------------------------------------------

    // --- TRANSITION LOGIC ---
    let hasPlayedCinematic = false;

    window.playCinematicIntro = (onComplete) => {
        hasPlayedCinematic = true;
        const overlay = document.getElementById('cinematic-overlay');
        const bg = document.getElementById('cine-bg');
        const heroesCon = document.getElementById('cine-heroes');
        const enemyCon = document.getElementById('cine-enemy');
        const flash = document.getElementById('cine-flash');
        const vs = document.getElementById('cine-vs');
        
        overlay.style.display = 'flex';
        
        if (typeof AUDIO !== 'undefined' && AUDIO.bgm_cinematic) {
            AUDIO.bgm_cinematic.volume = AUDIO.bgmVolume * 1.0;
            AUDIO.bgm_cinematic.currentTime = 0;
            AUDIO.bgm_cinematic.play().catch(e => console.log('Audio blocked', e));
        }

        // reset transition states
        overlay.style.opacity = '1';
        bg.style.opacity = '0'; 
        bg.style.transform = 'scale(1.1)';
        heroesCon.style.bottom = '-50%';
        heroesCon.style.left = '50%';
        enemyCon.style.top = '-50%';
        enemyCon.style.left = '50%';
        vs.style.opacity = '0';
        vs.style.transform = 'translate(-50%, -50%) scale(0)';
        
        let skipHandlers = [];
        let timeouts = [];
        let isSkipped = false;

        const cleanup = () => {
            if (isSkipped) return;
            isSkipped = true;
            skipHandlers.forEach(h => {
                document.removeEventListener('keydown', h);
                overlay.removeEventListener('click', h);
            });
            timeouts.forEach(t => clearTimeout(t));

            if (typeof AUDIO !== 'undefined' && AUDIO.bgm_cinematic) {
                const old = AUDIO.bgm_cinematic;
                new TWEEN.Tween({ v: old.volume })
                    .to({ v: 0 }, 1500)
                    .onUpdate(o => old.volume = o.v)
                    .onComplete(() => { 
                        old.pause(); 
                        old.currentTime = 0; 
                        if(onComplete) onComplete();
                    })
                    .start();
            } else {
                if(onComplete) onComplete();
            }
            
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        };

        const skipFn = (e) => { cleanup(); };
        skipHandlers.push(skipFn);
        console.log("Cinematic Intro playing. Press any key or click to skip.");
        document.addEventListener('keydown', skipFn);
        overlay.addEventListener('click', skipFn);

        // Assets Fetch
        const races = ['human', 'elf', 'dwarf', 'orc', 'gnome', 'halfling'];
        const classes = ['fighter', 'wizard', 'rogue', 'cleric'];
        
        const heroesObjects = []; 
        for (let i = 0; i < classes.length; i++) {
            const r = races[Math.floor(Math.random() * races.length)];
            const key = `${r}_${classes[i]}`;
            let url = CHAR_PORTRAITS[key] || CHAR_PORTRAITS[`human_${classes[i]}`];
            heroesObjects.push({ classType: classes[i], url: url });
        }
        
        const monsters = [];
        for(let i=0; i<2; i++) {
            monsters.push(OVERWORLD_MONSTERS[Math.floor(Math.random()*OVERWORLD_MONSTERS.length)]);
        }
        
        const dKeys = Object.keys(DUNGEON_DATA);
        const dungeon = DUNGEON_DATA[dKeys[Math.floor(Math.random()*dKeys.length)]];
        const boss = dungeon.bossStats;

        bg.style.backgroundImage = `url(${dungeon.bg})`;
        heroesCon.innerHTML = heroesObjects.map((h, i) => `<img id="cine-hero-${i}" class="hero-obj" src="${h.url}">`).join('');

        // T+0s Show BG
        timeouts.push(setTimeout(() => { bg.style.opacity = '0.5'; bg.style.transform = 'scale(1.0)'; }, 100));
        
        // T+1s Slide in Heroes
        timeouts.push(setTimeout(() => { heroesCon.style.bottom = '5%'; }, 1000));

        const spawnFX = (emoji, cssAnim) => {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.animation = `${cssAnim} 0.6s ease-in forwards`;
            div.innerHTML = emoji;
            div.style.fontSize = '100px';
            div.style.filter = 'drop-shadow(0 0 15px #fbbf24)';
            document.getElementById('fx-layer').appendChild(div);
            setTimeout(() => div.remove(), 600);
        };

        const activeAttacks = {
            'fighter': [{e:'⚔️', c:'fxSlash'}, {e:'🛡️', c:'fxSlash'}, {e:'🪓', c:'fxSlash'}, {e:'🗡️', c:'fxSlash'}],
            'wizard':  [{e:'🔥', c:'fxFireball'}, {e:'⚡', c:'fxLightning'}, {e:'☄️', c:'fxFireball'}, {e:'🌪️', c:'fxLightning'}],
            'rogue':   [{e:'🏹', c:'fxArrow'}, {e:'🗡️', c:'fxArrow'}, {e:'🥷', c:'fxSlash'}, {e:'☠️', c:'fxArrow'}],
            'cleric':  [{e:'✨', c:'fxSmite'}, {e:'☀️', c:'fxSmite'}, {e:'☄️', c:'fxFireball'}, {e:'💫', c:'fxHeal'}]
        };

        const heroAttackRound = (delay) => {
            timeouts.push(setTimeout(() => {
                // Heroes jump up
                Array.from(heroesCon.children).forEach((c, idx) => {
                    c.classList.remove('lunge-up');
                    void c.offsetWidth; 
                    c.classList.add('lunge-up');
                    
                    // Spawn class specific FX
                    const cls = heroesObjects[idx].classType;
                    const attack = activeAttacks[cls][Math.floor(Math.random()*4)];
                    spawnFX(attack.e, attack.c);
                });
                
                // Monster gets hit shortly after
                setTimeout(() => {
                    if(enemyCon.children[0]) {
                        enemyCon.children[0].classList.remove('monster-hit');
                        void enemyCon.children[0].offsetWidth;
                        enemyCon.children[0].classList.add('monster-hit');
                    }
                    flash.style.opacity = '0.8';
                    overlay.classList.add('cine-shake');
                    
                    vs.innerText = "-" + Math.floor(Math.random() * 80 + 20);
                    vs.style.color = "#fbbf24";
                    vs.style.opacity = '1';
                    vs.style.transform = 'translate(-50%, -50%) scale(1.0)';
                    
                    setTimeout(() => { 
                        flash.style.opacity = '0'; 
                        overlay.classList.remove('cine-shake'); 
                    }, 100);
                    setTimeout(() => {
                        vs.style.opacity = '0';
                        vs.style.transform = 'translate(-50%, -50%) scale(0)';
                    }, 800);
                }, 400); // Wait for projectiles to travel
            }, delay));
        };

        const monsterAttackRound = (delay) => {
            timeouts.push(setTimeout(() => {
                if(enemyCon.children[0]) {
                    enemyCon.children[0].classList.remove('monster-lunge');
                    void enemyCon.children[0].offsetWidth;
                    enemyCon.children[0].classList.add('monster-lunge');
                }
                
                setTimeout(() => {
                    Array.from(heroesCon.children).forEach(c => {
                        c.classList.remove('hero-hit');
                        void c.offsetWidth;
                        c.classList.add('hero-hit');
                    });
                    flash.style.opacity = '0.8';
                    flash.style.backgroundColor = '#ef4444'; 
                    overlay.classList.add('cine-shake-heavy');
                    
                    setTimeout(() => { 
                        flash.style.opacity = '0'; 
                        setTimeout(()=> flash.style.backgroundColor = '#fff', 200);
                        overlay.classList.remove('cine-shake-heavy'); 
                    }, 150);
                }, 300);
            }, delay));
        };

        const showMonster = (index, spawnTime, exitTime) => {
            timeouts.push(setTimeout(() => {
                const mName = monsters[index].name.toLowerCase();
                if(typeof AUDIO !== 'undefined') {
                    if(mName.includes('dragon') || mName.includes('wyvern')) AUDIO.playSound('sfx_dragon_roar');
                    else if(mName.includes('goblin') || mName.includes('orc')) AUDIO.playSound('sfx_goblin_chatter');
                    else AUDIO.playSound('sfx_monster_roar');
                }

                enemyCon.innerHTML = `<img class="monster-obj" src="${monsters[index].img}">`;
                enemyCon.style.top = '10%'; 
                
                heroAttackRound(1200);  
                monsterAttackRound(2800); 
                heroAttackRound(4200);  
                
                timeouts.push(setTimeout(() => {
                    if(enemyCon.children[0]) enemyCon.children[0].style.opacity = '0';
                    setTimeout(() => { enemyCon.style.top = '-50%'; }, 500);
                }, exitTime - spawnTime));
            }, spawnTime));
        };

        // Compress to 30 Seconds Total
        // 2 Normal Monsters
        showMonster(0, 3000, 9000);  // 3s to 9s
        showMonster(1, 10000, 16000); // 10s to 16s

        // Boss Epic Battle at 18s
        timeouts.push(setTimeout(() => {
            const bName = dungeon.bossName.toLowerCase();
            if(typeof AUDIO !== 'undefined') {
                if(bName.includes('dragon') || bName.includes('wyvern')) AUDIO.playSound('sfx_dragon_roar');
                else AUDIO.playSound('sfx_monster_roar');
            }
            enemyCon.innerHTML = `<img class="monster-obj" src="${boss.img}" style="height:500px; filter:drop-shadow(0 0 40px #ef4444);">`;
            enemyCon.style.top = '5%';
            bg.style.opacity = '0.2'; 
            bg.style.transform = 'scale(1.05)';
            
            // Round 1
            monsterAttackRound(1500);
            heroAttackRound(3000);
            
            // Round 2
            monsterAttackRound(4500);
            heroAttackRound(6000);
            
            // Round 3
            monsterAttackRound(7500);
            heroAttackRound(8500);
            
            // Fade to black at 28s
            timeouts.push(setTimeout(() => {
                document.getElementById('cine-fadeout').style.opacity = '1';
                setTimeout(() => { cleanup(); }, 1500); // Finishes around 30.5s
            }, 10500));
        }, 18000));
    };

    window.triggerGameMenu = () => {
        const logo = document.getElementById('logo-screen');
        const splash = document.getElementById('splash-screen');
        const authScreen = document.getElementById('auth-screen');
        const logoImg = document.getElementById('logo-img');
        const logoText = document.getElementById('logo-text');

        document.getElementById('top-right-hud').style.display = 'none';

        logo.style.display = 'flex';
        logo.style.opacity = '1';
        if (logoImg) logoImg.style.opacity = '1';
        if (logoText) logoText.style.opacity = '1';

        setTimeout(() => {
            if (logoImg) logoImg.style.opacity = '0';
            if (logoText) logoText.style.opacity = '0';

            const finishMenuTransition = () => {
                if (currentUser) {
                    authScreen.style.display = 'none';
                    splash.style.display = 'flex';
                    splash.style.opacity = '1';
                    document.getElementById('top-right-hud').style.display = 'flex';

                    const urlParams = new URLSearchParams(window.location.search);
                    const joinId = urlParams.get('join');
                    if (joinId) setTimeout(() => LOBBY.attemptJoin(joinId), 500);

                } else {
                    splash.style.display = 'none';
                    authScreen.style.display = 'flex';
                }

                logo.style.opacity = '0';
                AUDIO.tryPlayStart();

                setTimeout(() => {
                    logo.style.display = 'none';
                }, 1500);
            };

            setTimeout(() => {
                if(!hasPlayedCinematic) {
                    playCinematicIntro(finishMenuTransition);
                } else {
                    finishMenuTransition();
                }
            }, 2000);
        }, 100);
    };

    document.getElementById('logo-screen').addEventListener('click', () => {
        if (document.getElementById('logo-screen').style.opacity !== '0') {
            window.triggerGameMenu();
        }
    }, { once: true });

    AUTH.init();

    setupCreationUI();
    setupEquipDragDrop();
    animate();

    document.addEventListener('click', function (e) {
        if (e.target.closest('button, .choice-btn, .sel-opt, .skill-card, .color-opt, .help-tab, .skill-slot, .equip-slot, .inv-slot, .close-x, #btn-help, #btn-settings')) {
            AUDIO.playSound('sfx_click');
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            window.scrollTo(0, 0);
            setTimeout(() => window.scrollTo(0, 0), 100);
        }
    });

    document.addEventListener('touchstart', function () {
        const tt = document.getElementById('tooltip');
        if (tt) tt.style.display = 'none';
    }, { passive: true });

    makeDraggable(document.getElementById("p1-sheet"));
    makeDraggable(document.getElementById("leaderboard"));
    makeDraggable(document.getElementById("dm-window"));
}

function createTileTexture(name, cStr, cost) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const ctx = c.getContext('2d');
    ctx.fillStyle = cStr; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "rgba(0,0,0,0.1)"; for (let i = 0; i < 50; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, 10, 10);
    ctx.fillStyle = "#fff"; ctx.fillRect(10, 10, 236, 40); ctx.strokeRect(10, 10, 236, 40);
    ctx.fillStyle = "#000"; ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(name, 128, 30);
    if (cost > 0) { ctx.fillStyle = "#fbbf24"; ctx.fillRect(80, 210, 96, 30); ctx.strokeRect(80, 210, 96, 30); ctx.fillStyle = "#000"; ctx.fillText(cost + " G", 128, 225); }
    return new THREE.CanvasTexture(c);
}
function createGrassTexture() { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const ctx = c.getContext('2d'); ctx.fillStyle = "#14532d"; ctx.fillRect(0, 0, 512, 512); for (let i = 0; i < 2000; i++) { ctx.fillStyle = Math.random() > 0.5 ? "#166534" : "#15803d"; ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3); } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(8, 8); return t; }
function createEnvironment() {
    // Clear old trees if rebuilding
    if (worldTrees.length > 0) {
        worldTrees.forEach(t => scene.remove(t));
        worldTrees = [];
    }

    // Ground Plane
    const g = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ map: createGrassTexture() }));
    g.rotation.x = -Math.PI / 2;
    g.position.y = -0.6;
    g.receiveShadow = true;
    scene.add(g);

    // Generate Trees
    for (let i = 0; i < 400; i++) {
        const rad = 45 + Math.random() * 250;
        const ang = Math.random() * Math.PI * 2;
        const x = Math.cos(ang) * rad;
        const z = Math.sin(ang) * rad;

        // Don't spawn trees on the main board area
        if (z > 30 && x > -20 && x < 20) continue;

        const t = new THREE.Group();

        // Trunk
        const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 2), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        tr.position.y = 1;

        // Leaves
        const lv = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
        lv.position.y = 4;

        t.add(tr);
        t.add(lv);
        t.position.set(x, -0.6, z);
        t.scale.setScalar(0.8 + Math.random());

        scene.add(t);
        worldTrees.push(t); // Store for physics checks
    }
}
function animateTreeFall(tree) {
    // Prevent double-falling
    if (tree.userData.isFalling) return;
    tree.userData.isFalling = true;

    // 1. Play Sound (Optional, using a heavy thud or existing sound)
    // AUDIO.playSound('sfx_roll'); 

    // 2. Determine Fall Direction (Away from center roughly)
    const axis = Math.random() > 0.5 ? 'x' : 'z';
    const dir = Math.random() > 0.5 ? 1 : -1;
    const targetRot = tree.rotation[axis] + (Math.PI / 2 * dir);

    // 3. Animate Rotation (The Fall)
    new TWEEN.Tween(tree.rotation)
        .to({ [axis]: targetRot }, 800)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();

    // 4. Animate Sink (Disappear into ground)
    new TWEEN.Tween(tree.position)
        .to({ y: -5 }, 1000)
        .delay(1000) // Wait for fall to finish
        .onComplete(() => {
            tree.visible = false;
            scene.remove(tree);
            // Remove from array to optimize future checks
            const idx = worldTrees.indexOf(tree);
            if (idx > -1) worldTrees.splice(idx, 1);
        })
        .start();

    // 5. Dust Cloud Effect
    setTimeout(() => {
        VFX.trigger('smoke', tree.position);
    }, 600);
}
function createBoard() {
    const loader = new THREE.TextureLoader();
    const boardTex = loader.load('https://static.wixstatic.com/media/b16479_5caac3525f59406d8ff175695ef11cb1~mv2.jpg');
    const board = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), new THREE.MeshStandardMaterial({ map: boardTex }));
    board.rotation.x = -Math.PI / 2; board.position.y = -0.55; board.receiveShadow = true; scene.add(board);

    // --- NEW: NIGHT BOARD OVERLAY ---
    const nightTex = loader.load('https://static.wixstatic.com/media/b16479_2458008184884e2986ee9e7c6dc37fc8~mv2.jpg');
    // Transparent, Opacity 0 to start. Sits slightly higher (-0.54) to avoid glitching
    nightBoard = new THREE.Mesh(new THREE.PlaneGeometry(45, 45), new THREE.MeshStandardMaterial({ map: nightTex, transparent: true, opacity: 0 }));
    nightBoard.rotation.x = -Math.PI / 2;
    nightBoard.position.y = -0.54;
    nightBoard.receiveShadow = true;
    scene.add(nightBoard);
    // --------------------------------

    for (let i = 0; i < 40; i++) {
        const info = LOCATIONS[i]; let mapTex = (info.img && info.img.length > 0) ? loader.load(info.img) : createTileTexture(info.name, info.color, info.cost);
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.5, 3.8), new THREE.MeshStandardMaterial({ map: mapTex }));
        const side = Math.floor(i / 10); const pos = i % 10; let x = 0, z = 0, rot = 0; const off = 20; const spa = 4;
        if (side === 0) { x = off - (pos * spa); z = off; rot = 0; } else if (side === 1) { x = -off; z = off - (pos * spa); rot = -Math.PI / 2; } else if (side === 2) { x = -off + (pos * spa); z = -off; rot = Math.PI; } else { x = off; z = -off + (pos * spa); rot = Math.PI / 2; }
        if (i === 0) { x = off; z = off; } mesh.position.set(x, 0, z); mesh.rotation.y = rot; mesh.receiveShadow = true; mesh.userData = { id: i, info: info, owner: null, buildingLevel: 0 }; scene.add(mesh); tiles.push(mesh);

        // --- SPAWN DUNGEON IF APPLICABLE ---
        // REMOVED: Dungeons should only spawn when the Event is triggered, not at start.
        // if (info.isDungeonEntrance) {
        //    spawnDungeonVisuals(info.name);
        // }
    }

}
function createFog() {
    if (fogGroup) scene.remove(fogGroup); // Safety cleanup
    fogGroup = new THREE.Group();

    // Create a procedural "Cloud" texture
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.4)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 128, 128);
    const fogTex = new THREE.CanvasTexture(c);

    // Create 40 fog clouds
    for (let i = 0; i < 40; i++) {
        const mat = new THREE.MeshBasicMaterial({
            map: fogTex,
            transparent: true,
            opacity: 0, // <--- IMPORTANT: Start completely invisible
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), mat);

        // Initial random placement
        mesh.position.set((Math.random() * 60) - 30, 2 + Math.random() * 3, (Math.random() * 60) - 30);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        // Store initial opacity target for animation randomness
        mesh.userData.maxOpacity = 0.3 + Math.random() * 0.3;

        fogGroup.add(mesh);
    }
    scene.add(fogGroup);
}
function transitionDayNight(toNight) {
    // 1. Board Transition (5 Seconds)
    // Fade NightBoard IN (1) or OUT (0)
    new TWEEN.Tween(nightBoard.material)
        .to({ opacity: toNight ? 1 : 0 }, 5000)
        .start();

    // 2. Fog Transition
    if (toNight) {
        // --- DAY TO NIGHT: Fog Fades In ---
        if (fogGroup) {
            fogGroup.children.forEach(cloud => {
                // Reset positions to random over board
                cloud.position.x = cloud.userData.initialX;
                cloud.position.z = cloud.userData.initialZ;

                // Fade In
                new TWEEN.Tween(cloud.material)
                    .to({ opacity: 0.5 + Math.random() * 0.3 }, 5000) // Varied opacity
                    .start();
            });
        }
        // Darken Background
        new TWEEN.Tween(scene.background).to({ r: 0.02, g: 0.02, b: 0.06 }, 5000).start();
    } else {
        // --- NIGHT TO DAY: Fog Moves Out & Fades Out ---
        if (fogGroup) {
            fogGroup.children.forEach(cloud => {
                // Determine direction: Left or Right based on position
                const destX = cloud.position.x > 0 ? 60 : -60;

                // Move Out
                new TWEEN.Tween(cloud.position)
                    .to({ x: destX }, 5000) // Move off screen over 5s
                    .start();

                // Fade Out
                new TWEEN.Tween(cloud.material)
                    .to({ opacity: 0 }, 5000)
                    .start();
            });
        }
        // Lighten Background
        new TWEEN.Tween(scene.background).to({ r: 0.8, g: 0.8, b: 0.8 }, 5000).start();
    }
}
function createDecks() {
    const geo = new THREE.BoxGeometry(7.5, 0.15, 10.5); const loader = new THREE.TextureLoader(); const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    function createMaterials(texture) { return [whiteMat, whiteMat, new THREE.MeshStandardMaterial({ map: texture }), whiteMat, whiteMat, whiteMat]; }
    normalDeck = new THREE.Group(); const nMats = createMaterials(loader.load('https://static.wixstatic.com/media/b16479_b3d23c888e524e31a6ba70275de7f665~mv2.jpg')); for (let i = 0; i < 5; i++) { let c = new THREE.Mesh(geo, nMats); c.position.y = i * 0.16; c.rotation.y = Math.random() * 0.05; normalDeck.add(c); } normalDeck.position.set(-10, 0, -2); scene.add(normalDeck);
    skirmishDeck = new THREE.Group(); const sMats = createMaterials(loader.load('https://static.wixstatic.com/media/b16479_cd6258f031004df4962a76830ae296f3~mv2.jpg')); for (let i = 0; i < 5; i++) { let c = new THREE.Mesh(geo, sMats); c.position.y = i * 0.16; c.rotation.y = Math.random() * 0.05; skirmishDeck.add(c); } skirmishDeck.position.set(10, 0, -2); scene.add(skirmishDeck);
    treasureDeck = new THREE.Group(); const tMats = createMaterials(loader.load('https://static.wixstatic.com/media/b16479_03570af932d9445ea8b35d26c915366d~mv2.jpg')); for (let i = 0; i < 5; i++) { let c = new THREE.Mesh(geo, tMats); c.position.y = i * 0.16; c.rotation.y = Math.random() * 0.05; treasureDeck.add(c); } treasureDeck.position.set(0, 0, -2); scene.add(treasureDeck);
}

// --- REGION 4: PLAYER & AI (WAS MISSING) ---
function spawnPlayer(id, n, r, c, actId, pasId, ai, col, startPos = 0) {
    const stats = { str: r.stats.str, dex: r.stats.dex, int: r.stats.int, gold: 1000, movementBonus: 0, goldFind: 0, resistance: 0 };
    console.log(`SpawnPlayer: ${n} (${id}) Race=${r.name} Class=${c.name} Passive=${pasId}`);
    // FIX: Do not call effect(stats) here directly, as it now requires 'p'.
    // We will call recalcStats(newPlayer) below after creation.
    const passiveDef = ABILITY_LIBRARY[pasId];

    const g = createPlayerMesh(r, c, col);
    g.position.copy(tiles[startPos] ? tiles[startPos].position : tiles[0].position);
    scene.add(g);

    const newPlayer = {
        id: id, name: n, race: r, class: c, portrait: CHAR_PORTRAITS[`${r.id}_${c.id}`] || "",
        activeSkillId: actId, passiveSkillId: pasId,
        stats: stats, gold: stats.gold, hp: 20, maxHp: 20,
        permBonuses: { str: 0, dex: 0, int: 0 },
        tempBonuses: { str: 0, dex: 0, int: 0 },
        pos: startPos, mesh: g, color: col, isAi: ai,
        equipment: { head: null, body: null, hands: null, feet: null, ring_l: null, ring_r: null, amulet: null, back: null, main: null, off: null },
        assignedSkills: [null, null, null, null, null, null],
        inventory: [], quickSlots: [null, null],
        isPolymorphed: false,
        isSkipping: false,
        classSkillDepleted: false,   // Slot 1
        classSkill2Depleted: false,  // Slot 2 (Scholar)
        metrics: { spacesMoved: 0, successfulSieges: 0, guardsHired: 0 },
        history: [{ turn: 0, gold: 1000, props: 0 }]
    };

    // Auto-assign Slot 1
    newPlayer.assignedSkills[0] = { id: actId, name: ABILITY_LIBRARY[actId].name, desc: ABILITY_LIBRARY[actId].desc, img: ABILITY_LIBRARY[actId].img, source: "Class Ability", isClass: true };

    // --- PASSIVE ON-START TRRIGGER ---
    if (passiveDef && passiveDef.onStart) {
        passiveDef.onStart(newPlayer);
    }

    // --- RECALC STATS (Apply Equipment/Passives properly) ---
    recalcStats(newPlayer);

    // Initial Calc
    recalcStats(newPlayer);

    players.push(newPlayer);
}

function processTax(victim, amount) {
    // --- SAFETY CHECK: Prevent Double Payment ---
    if (victim.taxLocked) return;
    victim.taxLocked = true;
    setTimeout(() => { victim.taxLocked = false; }, 2000);

    // Check Boss Immunity
    if (victim.isBoss) {
        addLog(`${victim.name} scares the Tax Collector away!`, "log-rare");
        return;
    }

    // Check Player Immunity (Court Mage)
    if (victim.passiveSkillId === 'court_mage' || victim.activeSkillId === 'court_mage') {
        addLog(`${victim.name} (Court Mage) is Tax Exempt!`, "log-rare");
        return;
    }

    // Siphon logic (Court Mage steals tax)
    const mage = players.find(p => !p.isDead && p.id !== victim.id && (p.passiveSkillId === 'court_mage' || p.activeSkillId === 'court_mage'));
    let taxAmount = amount;

    if (mage) {
        const siphon = Math.min(10, taxAmount);
        taxAmount -= siphon;
        mage.gold += siphon;
        addLog(`Court Mage (${mage.name}) took ${siphon}G tax cut.`, "log-epic");
    }

    // Pay Logic
    if (taxAmount > 0) {
        // 1. Deduct Gold
        victim.gold -= taxAmount;

        // 2. Handle Debt or Payment
        if (victim.gold < 0) {
            handleDebt(victim, Math.abs(victim.gold));
        } else {
            // Success Payment -> Treasury
            treasuryGold += taxAmount;
            addLog(`${victim.name} paid ${taxAmount}G Tax.`, "log-fail");
            checkTreasuryLevel();

            if (isMultiplayer) {
                syncPlayerState(); // Update Victim's gold
                // Only Host updates Treasury to prevent race conditions
                if (myPlayerId === 0) {
                    db.ref(`games/${gameId}/treasury`).set(treasuryGold);
                }
            }
            updateHUD();
        }
    }
    AUDIO.playSound('sfx_gold');
}

function checkTreasuryLevel() {
    if (treasuryGold >= 1000) {
        treasuryGold -= 1000;
        worldLevel++;
        addLog(`The world grows darker... Level ${worldLevel}! (Monsters +1 All)`, "log-crises");
        AUDIO.playSound('sfx_powerup'); // Or ominous sound
    }
}

function manageAiInventory(p) {
    if (!p || !p.inventory) return;

    // 1. Clean Inventory
    p.inventory = p.inventory.filter(item => item !== null && item !== undefined);

    const secondarySlots = ['head', 'hands', 'feet', 'ring_l', 'ring_r', 'amulet', 'back'];

    for (let i = p.inventory.length - 1; i >= 0; i--) {
        const item = p.inventory[i];
        if (item && item.type === 'equip') {
            const current = p.equipment[item.slot];
            let shouldEquip = false;

            if (!current) {
                shouldEquip = true;
            } else {
                // Simple Rarity Comparison for AI
                const rarityMap = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4 };
                if (rarityMap[item.rarity] > rarityMap[current.rarity]) {
                    shouldEquip = true;
                }
            }

            if (shouldEquip) {
                equipItem(p.id, i);
            }
        }
    }
}

// --- MULTIPLAYER TIMER FUNCTIONS ---

function resetTurnTimerMP() {
    if (!isMultiplayer || !gameId) return;

    // Only send update if significant time passed (throttle to every 1s) to save bandwidth
    if (Date.now() - lastInteractionTime > 1000) {
        lastInteractionTime = Date.now();
        // Update the 'lastAction' timestamp in DB
        db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);
    }
}

// Host runs this loop to enforce rules
function startHostTimerLoop() {
    if (afkCheckInterval) clearInterval(afkCheckInterval);

    afkCheckInterval = setInterval(() => {
        if (!isMultiplayer || myPlayerId !== 0 || !gameId) return;

        // --- FIX: PAUSE TIMER DURING ACTIONS ---
        // If pieces are moving, or a cinematic is playing, DO NOT count time.
        // We also check if the game is in 'SETUP' or other non-playable states.
        if (gameState === 'MOVING' || (typeof isCinematic !== 'undefined' && isCinematic)) {
            // Update the timestamp so it doesn't look like they are AFK
            db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);
            return;
        }

        // Only enforce during active decision phases
        if (gameState !== 'ROLL' && gameState !== 'END') return;

        // Check current event to see if it is a shop (giving more time)
        let isShopping = false;
        if (currentRoomData && currentRoomData.currentEvent && currentRoomData.currentEvent.mode === 'shop') {
            isShopping = true;
        }

        // Determine Enforcement Limit (45s for shop, 25s normally to account for lag/reading)
        // INCREASED from 15s to 25s to be safe
        const enforcementLimit = isShopping ? 60 : 25;

        db.ref(`games/${gameId}/turnTimer`).once('value', snap => {
            const lastAction = snap.val() || Date.now();
            const elapsed = (Date.now() - lastAction) / 1000;

            if (elapsed > enforcementLimit) {
                const curP = players[turnIndex];
                // Ensure we don't kick AI or Dead players
                if (curP && !curP.isAi && !curP.isDead) {
                    console.log(`Player ${curP.name} timed out (Limit: ${enforcementLimit}s).`);
                    handleAfkTimeout(curP.id);
                }
            }
        });
    }, 1000);
}

// Function called by the Host Loop in Multiplayer
function handleAfkTimeout(pid) {
    const p = players.find(pl => pl.id === pid);
    if (!p) return;

    // Use the unified logic to handle the game state
    // Note: Since this is Host Logic running in background, it can't manipulate the Client DOM of the AFK player.
    // Therefore, the Host acts as the ultimate fail-safe to force the turn to end if the client doesn't do it themselves.

    p.afkStrikes = (p.afkStrikes || 0) + 1;
    let logMsg = `${p.name} timed out! (${p.afkStrikes}/3)`;

    // Elimination
    if (p.afkStrikes >= 3) {
        logMsg = `${p.name} was kicked for AFK!`;
        db.ref(`games/${gameId}/players/${pid}`).update({
            isDead: true,
            gold: 0,
            afkStrikes: 3
        });
        tiles.forEach(t => {
            if (t.userData.owner === pid) {
                db.ref(`games/${gameId}/board/${t.userData.id}`).set({
                    owner: null, level: 0, guardCount: 0
                });
            }
        });
    } else {
        db.ref(`games/${gameId}/players/${pid}`).update({ afkStrikes: p.afkStrikes });
    }

    // HOST FORCE END
    // Even if they are in a modal, the Host overrides everything and forces Next Turn
    db.ref(`games/${gameId}/request`).push({
        type: 'END_TURN',
        pid: pid,
        force: true,
        msg: logMsg
    });
}

function attemptAiAbilities(p, phase) {
    // --- PHASE 1: PRE-ROLL ---
    if (phase === 'pre-roll') {

        // 1. USE CONSUMABLES (Scrolls/Potions)
        // Find a usable scroll (exclude passive loot like Pouch of Gold if we want to save it for Transmute, 
        // but for now AI just uses Pouch of Gold immediately via equipItem logic usually, or we filter it out here)
        const scrollIndex = p.inventory.findIndex(it => it.type === 'scroll');

        if (scrollIndex > -1) {
            const item = p.inventory[scrollIndex];

            // Basic AI Logic:
            let shouldUse = true;

            // Don't use Town Portal if rich (save for escape? or just use to bank gold?)
            // Actually, AI logic is simple: Use buffs/heals. 
            // Pouch of Gold: Use immediately.

            if (shouldUse) {
                console.log(`[AI] ${p.name} using item ${item.name}`);
                // equipItem handles the "Use Scroll" logic (executes fn, removes from inv)
                equipItem(p.id, scrollIndex);
                return true; // Action taken, wait for animation
            }
        }

        // 2. USE CLASS SKILLS
        if (p.classSkillDepleted || !p.activeSkillId) return false;
        const skill = ABILITY_LIBRARY[p.activeSkillId];
        if (!skill) return false;

        // A. AGGRESSIVE SPELLS
        if (['Fireball', 'Pickpocket', 'Intimidate', 'Shadow Strike'].includes(skill.name)) {
            if (skill.name === 'Fireball') {
                const hasTargets = tiles.some(t => t.userData.owner !== null && String(t.userData.owner) !== String(p.id));
                if (p.gold >= 150 && hasTargets) return useSkillAi(p, 0);
            }
            else if (players.length > 1) return useSkillAi(p, 0);
        }

        // B. MOVEMENT SPELLS
        else if (['Sprint', 'Blink', 'Teleport', 'Town Portal', 'Dash'].includes(skill.name)) {
            const currentTileInfo = tiles[p.pos].userData.info;
            if (currentTileInfo.type === 'jail' || currentTileInfo.type === 'tax' || Math.random() > 0.5) {
                return useSkillAi(p, 0);
            }
        }

        // C. BUFFS
        else if (['Power Strike', 'Rally', 'Bless', 'Second Wind', 'Divine Intervention'].includes(skill.name)) {
            return useSkillAi(p, 0);
        }

        // D. HEALING
        else if (skill.name === 'Heal' || skill.name === 'Royal Pardon') {
            if (p.isSkipping) return useSkillAi(p, 0);
        }
    }

    return false;
}

function checkItemSkills(p, skillKeys) {
    ['head', 'body', 'main', 'off'].forEach(slot => {
        const item = p.equipment[slot];
        if (item && item.ability && !item.isDepleted) {
            const key = Object.keys(ABILITY_LIBRARY).find(k => ABILITY_LIBRARY[k].name === item.ability.name);
            if (skillKeys.includes(key) || Math.random() > 0.7) { item.ability.fn(p); item.isDepleted = true; updateHUD(); }
        }
    });
}

function useSkillAi(p, slotIdx) {
    // Slot 0 is Class Skill
    if (slotIdx === 0 && !p.classSkillDepleted) {
        const skill = ABILITY_LIBRARY[p.activeSkillId];
        if (skill && skill.fn) {

            console.log(`[AI] ${p.name} using ${skill.name}...`);
            const success = skill.fn(p); // This triggers VFX

            if (success === true) {
                p.classSkillDepleted = true;
                updateHUD();

                // HOST SYNC: Update AI state (cooldowns/gold) for everyone
                if (isMultiplayer && myPlayerId === 0) {
                    syncPlayerState();
                }
                return true;
            }
        }
    }
    return false;
}

// --- REGION 5: LOGIC (Turns, Move, Combat) ---
async function rollMove() {
    if (gameState !== 'ROLL') return;
    const p = players[turnIndex];
    if (!p) return;

    // ATTUNEMENT FIX: Recalculate stats at start of turn to update dynamic bonuses
    recalcStats(p);

    // --- ATTUNEMENT PASSIVE LOGIC ---
    // "+1 INT for every 500G you hold." (Checked at start of turn)
    let attunementBonus = 0;
    const equipSlots = ['head', 'body', 'main', 'off', 'hands', 'feet', 'ring_l', 'ring_r', 'amulet', 'back'];

    equipSlots.forEach(slot => {
        const item = p.equipment[slot];
        if (item) {
            // Check Item Description OR Ability Description
            const text = (item.desc || "") + (item.ability ? item.ability.desc : "");
            if (text.includes("Attunement")) {
                attunementBonus += Math.floor(p.gold / 500);
            }
        }
    });

    if (attunementBonus > 0) {
        p.stats.int += attunementBonus;
        addLog(`Attunement grants +${attunementBonus} INT based on wealth.`, "log-rare");
    }

    if (p.inDungeon) {
        if (p.isAi) setTimeout(() => advanceDungeon(p), 1000);
        else if (p.id === myPlayerId) advanceDungeon(p);
        return;
    }

    if (p.isDead) { endTurn(); return; }

    const btn = document.getElementById('btn-action');
    if (btn) btn.disabled = true;

    if (!p.isAi) {
        p.afkStrikes = 0;
        lastInteractionTime = Date.now();
        if (isMultiplayer && db && gameId) {
            db.ref(`games/${gameId}/players/${p.id}`).update({ afkStrikes: 0 });
            db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);
        }
    }

    // --- SINGLE PLAYER ROLL ---
    if (!isMultiplayer) {
        let total = 0;

        // POLYMORPH FIX: Force roll to 1 if sheep (No 3D needed, immediate stumble)
        if (p.isPolymorphed) {
            total = 1;
            addLog("Baa! Sheep movement is limited.", "log-fail");
            finishRollLogic(p, total);
            return;
        }

        // TAX / NORMAL LOGIC
        let diceCount = 2;
        if (p.taxDebuff) {
            diceCount = 1;
            addLog("Taxed! Movement limited to 1d6.", "log-fail");
        }

        // 3D DICE ROLL
        if (typeof window.DICE_ROLLER !== 'undefined') {
            try {
                if (!window.DICE_ROLLER.isInitialized) window.DICE_ROLLER.init();
                // Roll pure movement dice
                const res = await window.DICE_ROLLER.roll(0, 0, 0, diceCount);
                total = res.move;
            } catch (e) {
                console.error("Dice Vis Error", e);
                // Fallback
                for (let i = 0; i < diceCount; i++) total += Math.floor(Math.random() * 6) + 1;
            }
        } else {
            // No DiceRoller found
            for (let i = 0; i < diceCount; i++) total += Math.floor(Math.random() * 6) + 1;
        }

        addLog(`${p.name} rolled ${total}.`);
        // Sound already played by DICE_ROLLER if active

        finishRollLogic(p, total);
        return;
    }

    // --- MULTIPLAYER REQUEST ---
    const isMyTurn = (p.id === myPlayerId);
    let isAiTurn = (p.isAi && myPlayerId === 0);
    if (currentRoomData && currentRoomData.slots[p.id].type === 'human') isAiTurn = false;

    if (isMyTurn || isAiTurn) {
        if (db && gameId) {
            db.ref(`games/${gameId}/request`).push({ type: 'ROLL', pid: p.id });
        }
    }
}
function finishRollLogic(p, r) {
    // 1. Ensure stats are calculated correctly
    recalcStats(p);

    // 2. APPLY MOVEMENT BONUS
    // This looks at p.stats.movementBonus, which includes Shadow Step + Boots
    const moveBonus = p.stats.movementBonus || 0;
    if (moveBonus > 0) {
        r += moveBonus;
        addLog(`Movement Bonus: +${moveBonus} Total!`, "log-success");
    }

    // 3. Blizzard Penalty (-1)
    const isBlizzard = activeEvents.some(e => e.data && e.data.id === 'weather_blizzard');
    if (isBlizzard) {
        r = Math.max(1, r - 1);
        addLog("Blizzard slows you down! (-1)", "log-fail");
    }

    // 4. Golden Rain Bonus
    const isGoldRain = activeEvents.some(e => e.data && e.data.id === 'weather_goldrain');
    if (isGoldRain) {
        const goldFind = p.stats.goldFind || 0;
        const bonus = (r * 10) + goldFind;
        p.gold += bonus;
        addLog(`Golden Rain: +${bonus}G (Gold Find: +${goldFind})`, "log-gold");
        if (isMultiplayer) syncPlayerState();
        updateHUD();
    }

    addLog(`${p.name} moves ${r} spaces.`);

    gameState = 'MOVING';
    animateMove(p, r);
}

function animateMove(p, s) {
    // 1. Movement Finished Base Case
    if (s <= 0) {
        new TWEEN.Tween(p.mesh.rotation)
            .to({ y: 0 }, 300)
            .onComplete(() => {
                resolveLanding(p);
            })
            .start();
        return;
    }

    // 2. Camera Setup
    if (!isZoomed || cameraTarget !== p.mesh) {
        cameraTarget = p.mesh;
        isZoomed = true;
    }

    // 3. Logic Step
    p.pos = (p.pos + 1) % 40;
    p.metrics.spacesMoved = (p.metrics.spacesMoved || 0) + 1;

    const isMe = (p.id === myPlayerId);
    const isMyAi = (p.isAi && myPlayerId === 0);

    // 4. Recharge Class Spells (Sprint/Pickpocket recharges every 10 steps)
    if ((p.activeSkillId === 'pickpocket' || p.activeSkillId === 'sprint_act') && p.classSkillDepleted) {
        if (p.metrics.spacesMoved % 10 === 0) {
            p.classSkillDepleted = false;
            if (isMe) {
                addLog(`${ABILITY_LIBRARY[p.activeSkillId].name} Recharged!`, "log-gold");
                AUDIO.playSound('sfx_equip');
            }
        }
    }

    // TAX COLLECTOR RECHARGE: Clear debuff when passing Tax Tile
    if (p.taxDebuff && tiles[p.pos] && tiles[p.pos].userData.info.type === 'tax') {
        p.taxDebuff = false;
        if (isMe) addLog("Tax Paid! Movement restored.", "log-success");
    }

    // 5. Tile 0 Logic: Inn / Start (Gold & Reset All Skills)
    if (p.pos === 0) {
        if (isMe || isMyAi) {
            p.gold += 200;
            // NEW: Full Heal on Start
            p.hp = p.maxHp;
            addLog("Passed Inn (+200G & Full Rest)", "log-success");
            showFloatingText("FULL REST", "damage-popup", "player");

            // Reset Class Skills (Independent flags)
            p.classSkillDepleted = false;
            p.classSkill2Depleted = false; // <--- FIX: Scholar reset
            p.battleCooldowns = {};

            p.shadowStrikeDebuff = false;
            p.pacifistBuff = false;

            // Recharge all Equipment Abilities
            EQUIP_ORDER.forEach(slot => {
                if (p.equipment[slot] && p.equipment[slot].isDepleted) {
                    p.equipment[slot].isDepleted = false;
                }
            });

            // Recharge Quick Item Slots (like Scholar's Grimoire)
            if (p.quickSlots) {
                p.quickSlots.forEach(item => {
                    if (item && item.isPermanent) item.isDepleted = false;
                });
            }

            updateHUD();
            if (isMultiplayer) syncPlayerState();
        }
    }

    // 5.5. Capital City Healing (Pass or Land)
    if (tiles[p.pos] && tiles[p.pos].userData.info.name === "Capital City") {
        if (isMe || isMyAi) {
            p.hp = p.maxHp;
            addLog("Capital City: Rested and Healed.", "log-success");
            showFloatingText("FULL REST", "damage-popup", "player");
            updateHUD();
            if (isMultiplayer) syncPlayerState();
        }
    }

    // 6. Passing Effects (Cutpurse)
    if (p.passiveSkillId === 'cutpurse' && s > 1) {
        const victims = players.filter(v => v.id !== p.id && !v.isDead && v.pos === p.pos);
        let stolenPassing = 0;
        victims.forEach(v => {
            const amt = Math.min(5, v.gold);
            if (amt > 0) {
                v.gold -= amt;
                stolenPassing += amt;
                if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/players/${v.id}/gold`).set(v.gold);
            }
        });
        if (stolenPassing > 0) {
            p.gold += stolenPassing;
            if (isMe) addLog(`Cutpurse: Swiped ${stolenPassing}G.`, "log-rare");
            if (isMultiplayer && (isMe || isMyAi)) syncPlayerState();
        }
    }

    // 7. 3D Animation (Rotation -> Move -> Hop)
    const t = tiles[p.pos].position.clone();
    if (p.id > 0) {
        t.x += (Math.random() - 0.5) * 0.6;
        t.z += (Math.random() - 0.5) * 0.6;
    }

    const dx = t.x - p.mesh.position.x;
    const dz = t.z - p.mesh.position.z;
    let targetAngle = Math.atan2(dx, dz);
    let diff = targetAngle - p.mesh.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    new TWEEN.Tween(p.mesh.rotation).to({ y: p.mesh.rotation.y + diff }, 150).onComplete(() => {
        // Linear Move
        new TWEEN.Tween(p.mesh.position).to({ x: t.x, z: t.z }, 300).start();

        // Camera Follow
        if (isZoomed) {
            const offset = { x: 0, y: 22, z: 18 };
            new TWEEN.Tween(camera.position).to({ x: t.x + offset.x, y: offset.y, z: t.z + offset.z }, 300).start();
        }

        // Visual Hop
        new TWEEN.Tween(p.mesh.position)
            .to({ y: 1.3 }, 150)
            .yoyo(true)
            .repeat(1)
            .onComplete(() => {
                // Next Step Recursive Call
                animateMove(p, s - 1);
            })
            .start();
    }).start();
}

function endStep() {
    // Prevent double-ending the same turn
    if (gameState === 'END') return;

    gameState = 'END';
    updateHUD();

    // AI/Boss Auto-End
    const currentP = players[turnIndex];
    if (currentP.isAi || currentP.isBoss) {
        // Short delay to let the user see the result (e.g., "Captured!")
        setTimeout(endTurn, 800);
    }
}

function endTurn() {
    if (turnProcessing || gameState === 'MOVING') return;
    turnProcessing = true;

    const btnAction = document.getElementById('btn-action');
    if (btnAction) { btnAction.disabled = true; btnAction.innerText = "..."; }

    const prevP = players[turnIndex];
    if (prevP && !prevP.isEventEntity && !prevP.isBoss) {
        prevP.tempBonuses = { str: 0, dex: 0, int: 0 };
        if (prevP.isPolymorphed) cureSheep(prevP);
        recalcStats(prevP);

        // 1. Reset Stats Locally
        recalcStats(prevP);

        // 2. Sync Clean Stats to DB (MP)
        if (isMultiplayer && db && gameId) {
            if (prevP.id === myPlayerId || (prevP.isAi && myPlayerId === 0)) {
                db.ref(`games/${gameId}/players/${prevP.id}/stats`).set(prevP.stats);
            }
        }

        // 3. AI Inventory
        if (prevP.isAi && (!isMultiplayer || myPlayerId === 0)) manageAiInventory(prevP);

        // 4. History Logging
        const props = tiles.filter(t => t.userData.owner === prevP.id).length;
        prevP.history.push({ turn: turnCount, gold: prevP.gold, props: props });
    }

    lastInteractionTime = Date.now();

    // Use a timeout to allow UI to update before processing logic
    setTimeout(() => {
        // --- MULTIPLAYER REQUEST LOGIC (Client Side) ---
        if (isMultiplayer && db && gameId && myPlayerId !== 0) {
            // Clients just send request and wait for Host
            if (prevP.id === myPlayerId) {
                db.ref(`games/${gameId}/request`).push({ type: 'END_TURN', pid: prevP.id });
            }
            turnProcessing = false;
            return;
        }

        // --- HOST / SINGLE PLAYER LOGIC ---

        // 1. Calculate Next Player
        let nextIndex;
        if (prevP && prevP.extraTurn) {
            nextIndex = turnIndex;
            prevP.extraTurn = false;
            addLog(`${prevP.name} warps time! Taking another turn.`, "log-epic");
        } else {
            nextIndex = (turnIndex + 1) % players.length;
            let safetyCount = 0;
            while (players[nextIndex].isDead && safetyCount < players.length) {
                nextIndex = (nextIndex + 1) % players.length;
                safetyCount++;
            }
        }

        let turnDelay = 0; // Default delay before next player starts

        // 2. Round Cycles & Events
        if (nextIndex === 0 && !prevP.extraTurn) {
            turnCount++;

            // A. Day/Night Cycle (Every 10 Rounds)
            if (turnCount > 0 && turnCount % 10 === 0) {
                isNight = !isNight;
                updateEnvironmentVisuals();
                AUDIO.playSound('sfx_transition');
                AUDIO.playMusic(isNight);

                const phaseName = isNight ? "NIGHT FALLS (Skirmish Cards)" : "DAWN BREAKS (Encounter Cards)";
                addLog(`=== ${phaseName} ===`, "log-epic");

                if (isMultiplayer && myPlayerId === 0) {
                    db.ref(`games/${gameId}/isNight`).set(isNight);
                }
            }

            // B. Event Duration Management
            // (Loop backwards to safely remove)
            for (let i = activeEvents.length - 1; i >= 0; i--) {
                let ev = activeEvents[i];
                ev.turnsLeft--;

                if (ev.turnsLeft <= 0) {
                    if (ev.data.onEnd) ev.data.onEnd();
                    if (ev.playerRef) removeEventEntity(ev.playerRef);

                    // Specific Dungeon Cleanup for SP
                    if (ev.data.type === 'dungeon' && !isMultiplayer) {
                        if (dungeonGroup) { scene.remove(dungeonGroup); dungeonGroup = null; activeDungeon = null; }
                    }

                    activeEvents.splice(i, 1);
                    addLog(`${ev.data.name} ended.`, "log-entry");

                    updateEnvironmentVisuals();
                    const hasWeather = activeEvents.some(e => e.data.type === 'weather');
                    if (!hasWeather) removeParticles();
                }
            }

            // C. EVENT ROLL (1 in 6 chance -> Now 33% chance: 5 or 6)
            const roll = Math.floor(Math.random() * 6) + 1;
            if (roll >= 5) {
                // Trigger the event and get required wait time (if any)
                const eventWaitTime = triggerRandomEvent();
                if (eventWaitTime > 0) {
                    turnDelay = eventWaitTime; // Wait for cinematic
                }
            }
        }

        // --- EXECUTE NEXT TURN (After Delay) ---
        setTimeout(() => {

            // MP Sync (Host Only)
            if (isMultiplayer && myPlayerId === 0) {
                db.ref(`games/${gameId}`).update({ turnIndex: nextIndex });
                // We don't continue local logic here, we wait for the listener to update
                turnProcessing = false;
                return;
            }

            // Single Player Continuation
            turnIndex = nextIndex;
            gameState = 'ROLL';
            lastInteractionTime = Date.now();
            updateHUD();
            turnProcessing = false;

            const curP = players[turnIndex];

            // Handle Skipping
            if (curP.isSkipping) {
                curP.isSkipping = false;
                addLog(`${curP.name} is in Jail (Turn Skipped).`, "log-fail");
                endTurn(); // Recursively skip
                return;
            }

            if (curP.isDead) { endTurn(); return; }

            // Turn Start Actions
            if (curP.isAi) {
                zoomToPiece(curP);
                if (curP.isEventEntity) {
                    setTimeout(() => processBossTurn(curP), 800);
                }
                else {
                    setTimeout(() => {
                        // AI Dungeon Check
                        if (curP.inDungeon) {
                            advanceDungeon(curP);
                        } else {
                            const didAction = attemptAiAbilities(curP, 'pre-roll');
                            setTimeout(() => {
                                if (gameState === 'ROLL') rollMove();
                            }, didAction ? 1500 : 500);
                        }
                    }, 1000);
                }
            }
            else {
                // Human Turn
                zoomToPiece(curP);
                if (curP.id === myPlayerId) {
                    addLog("Your Turn!");
                } else {
                    addLog(`${curP.name}'s Turn`);
                }
            }

        }, turnDelay); // Apply the calculated delay here

    }, 1200); // Initial small delay for UI smoothness
}

function checkAndTriggerTrap(p, tile, onComplete) {
    // 1. Check if trap exists & isn't ours
    if (tile.userData.trapOwner === undefined || tile.userData.trapOwner === null || String(tile.userData.trapOwner) === String(p.id)) {
        // NO TRAP or MY TRAP - Do nothing, return false immediately.
        return false;
    }

    // 2. Check Immunity (Rogue)
    if (p.class && p.class.id === 'rogue') {
        addLog(`${p.name} (Rogue) bypassed the Dungeon trap!`, "log-success");
        if (onComplete) onComplete(); // We still need to continue the turn after bypassing.
        return true; // A trap was present, but handled.
    }

    // 3. TRIGGER TRAP
    const trapperId = tile.userData.trapOwner;
    const trapper = players.find(pl => String(pl.id) === String(trapperId));

    const stealAmt = Math.min(200, p.gold);
    p.gold = Math.max(0, p.gold - stealAmt);

    if (trapper) {
        trapper.gold += stealAmt;
        addLog(`${p.name} triggered ${trapper.name}'s Trap! (-${stealAmt}G)`, "log-fail");
    } else {
        addLog(`${p.name} triggered a Dungeon Trap! (-${stealAmt}G)`, "log-fail");
    }

    VFX.trigger('implode', p.mesh.position, null, 0xff0000);

    // 4. Visuals & Sync
    // The onComplete callback is NOW ONLY CALLED HERE
    animateTrapSpring(tile, () => {
        tile.userData.trapOwner = null;
        updateTrapVisuals(tile);
        updateHUD();

        if (isMultiplayer) {
            syncPlayerState();
            if (trapper) db.ref(`games/${gameId}/players/${trapper.id}/gold`).set(trapper.gold);
            db.ref(`games/${gameId}/board/${tile.userData.id}/trapOwner`).remove();
        }

        if (onComplete) onComplete(); // Continue the rest of the turn logic
    });

    return true; // Trap was triggered
}

function resolveLanding(p) {
    const tile = tiles[p.pos];
    // Check for trap. If handled, logic continues in callback.
    const trapTriggered = checkAndTriggerTrap(p, tile, () => {
        // --- NEW: D20 BATTLE ROLL ---
        rollForBattle(p, tile);
    });
    // If no trap, continue immediately.
    if (!trapTriggered) {
        rollForBattle(p, tile);
    }
}

function rollForBattle(p, tile) {
    // 1. Skip battle if owning the tile or it's a special tile (Start, Jail, etc.)
    const info = tile.userData.info;
    if (tile.userData.owner === p.id || !info.cost || info.type === 'start' || info.type === 'jail' || info.type === 'park' || info.type === 'goto') {
        continueLandingLogic(p, tile);
        return;
    }

    // --- SKIP AMBUSH IF DUNGEON IS ACTIVE HERE ---
    if (activeDungeons && activeDungeons[info.name]) {
        console.log(`[DUNGEON CHECK] Skipping Ambush on ${info.name} (Dungeon Active)`);
        continueLandingLogic(p, tile);
        return;
    }

    // 2. Secret Roll
    // If it's your turn, you roll. If AI turn, AI rolls.
    const d20 = Math.floor(Math.random() * 20) + 1;
    console.log(`Battle Roll for ${p.name}: ${d20}`);

    if (d20 <= 10) {
        // --- BATTLE START ---
        const mon = OVERWORLD_MONSTERS[Math.floor(Math.random() * OVERWORLD_MONSTERS.length)];

        // Clone monster to avoid reference issues
        const opponent = JSON.parse(JSON.stringify(mon));

        // Horde Scalling (Optional: Scale HP by count?)
        if (opponent.type === 'horde') {
            opponent.hp = opponent.hp * (opponent.count || 1);
            opponent.maxHp = opponent.hp;
        }

        addLog(`${p.name} was ambushed by ${opponent.name}!`, "log-warning");
        if (p.id === myPlayerId) AUDIO.playSound('sfx_transition');

        // Start Battle
        // Victory Callback: continueLandingLogic
        // Defeat Callback: pay penalty / end turn
        startBattle(p, opponent, 'overworld', () => handlePostBattleLanding(p, tile));
    } else {
        // Safe -> Continue
        addLog(`${p.name} travels safely. (Rolled ${d20})`, "log-success");
        continueLandingLogic(p, tile);
    }
}

function continueLandingLogic(p, tile) {
    // --- 1. MEDIC PASSIVE CHECK (FIXED FOR PERSISTENCE) ---
    if (p.passiveSkillId === 'medic' && !p.isAi) {
        const patient = players.find(x => x.id !== p.id && !x.isDead && x.pos === p.pos);
        if (patient) {
            showModal("Medic", `Give 100G to ${patient.name} to gain +1 Permanent Stat?`, [
                {
                    txt: "Heal (Give 100G)",
                    act: () => {
                        if (p.gold >= 100) {
                            p.gold -= 100;
                            patient.gold += 100;
                            addLog(`${p.name} healed ${patient.name}!`, "log-success");

                            // Initialize Perm Bonuses if missing (Safety)
                            if (!p.permBonuses) p.permBonuses = { str: 0, dex: 0, int: 0 };

                            // Sync Gold
                            if (isMultiplayer) {
                                syncPlayerState();
                                db.ref(`games/${gameId}/players/${patient.id}/gold`).set(patient.gold);
                            }

                            // Show Choice for Permanent Stat
                            showModal("Divine Reward", "Choose a PERMANENT stat boost:", [
                                {
                                    txt: "+1 STR", act: () => {
                                        p.permBonuses.str++;
                                        recalcStats(p);
                                        addLog("Medic: Gained Permanent +1 STR");
                                        if (isMultiplayer) syncPlayerState();
                                        triggerTileEvent(p);
                                    }
                                },
                                {
                                    txt: "+1 DEX", act: () => {
                                        p.permBonuses.dex++;
                                        recalcStats(p);
                                        addLog("Medic: Gained Permanent +1 DEX");
                                        if (isMultiplayer) syncPlayerState();
                                        triggerTileEvent(p);
                                    }
                                },
                                {
                                    txt: "+1 INT", act: () => {
                                        p.permBonuses.int++;
                                        recalcStats(p);
                                        addLog("Medic: Gained Permanent +1 INT");
                                        if (isMultiplayer) syncPlayerState();
                                        triggerTileEvent(p);
                                    }
                                }
                            ]);
                        } else {
                            addLog("Not enough gold to Heal.");
                            triggerTileEvent(p);
                        }
                    }
                },
                { txt: "Ignore", act: () => triggerTileEvent(p) }
            ]);
            return;
        }
    }

    debugLog(`Landed: ${p.name} at Tile ${p.pos} (AI: ${p.isAi})`);

    // --- 2. DUNGEON ENTRANCE CHECK ---
    const tInfo = tile.userData.info || {};
    if (activeDungeons && activeDungeons[tInfo.name] && tInfo.isDungeonEntrance) {

        // AI LOGIC
        if (p.isAi) {
            // Multiplayer Authority Check: Clients do NOT decide for AI
            if (isMultiplayer && myPlayerId !== 0) return;

            // 80% Chance to Enter
            if (Math.random() < 0.8) {
                p.inDungeon = true;
                p.dungeonType = tInfo.name;
                p.dungeonProgress = 0;
                p.bossAttempts = 3;
                addLog(`${p.name} enters the ${tInfo.name}!`, "log-epic");

                if (isMultiplayer) {
                    syncPlayerState();
                    db.ref(`games/${gameId}/teleportLog`).push({
                        pid: p.id, targetPos: 999, dungeonStep: 0, timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                } else {
                    const firstTile = activeDungeons[tInfo.name].tiles[0];
                    gameState = 'MOVING';
                    animateTeleport(p, firstTile, () => { resolveDungeonStep(p); });
                }
                return;
            } else {
                addLog(`${p.name} passes by the ${tInfo.name}.`);
                runStandardLanding(p, tile);
                return;
            }
        }

        // HUMAN LOGIC
        if (!p.isAi) {
            offerDungeonEntry(p, tInfo.name, () => {
                // On Decline: Proceed to standard logic
                runStandardLanding(p, tile);
            });
            return;
        }
    }

    runStandardLanding(p, tile);
}

/**
 * runStandardLanding
 * Standard tile logic (Merchant, Inn, or Card Trigger)
 */
function runStandardLanding(p, tile) {
    if (!isMultiplayer) {

        // A. Dynamic Merchant Event Check (MOVED UP)
        const merchantEvent = activeEvents.find(e => e.data.type === 'merchant' && e.playerRef && e.playerRef.pos === p.pos);
        if (merchantEvent) {
            // AI LOGIC FOR MERCHANT
            if (p.isAi) {
                addLog(`Merch: ${p.name} browses the wares...`);
                // Optional: 30% Chance to buy a potion if rich?
                // For now, simple "Pass" is acceptable to avoid combat
                endStep();
                return;
            }

            let stock = [];
            if (merchantEvent.data.id === 'merch_alchemist') stock = DECK_TREASURE.filter(it => it.type === 'scroll' && !it.name.includes('Gold'));
            else if (merchantEvent.data.id === 'merch_armorer') stock = DECK_TREASURE.filter(it => ['head', 'body', 'off'].includes(it.slot) && !it.name.includes('Gold'));
            else if (merchantEvent.data.id === 'merch_weaponsmith') stock = DECK_TREASURE.filter(it => it.slot === 'main' && !it.name.includes('Gold'));

            const items = [];
            for (let k = 0; k < 3; k++) items.push(createItemInstance(stock[Math.floor(Math.random() * stock.length)]));
            openCustomShop(p, items, merchantEvent.data.name, () => endStep());
            AUDIO.playSound('sfx_gold');
            return;
        }

        if (p.isAi) {
            triggerTileEvent(p);
            return;
        }

        // B. Old Crooks Inn (Start Tile)
        const i = tile.userData.info;
        if (i.type === 'start') {
            const stock = DECK_TREASURE.filter(it => !it.name.includes('Gold'));
            const items = [];
            for (let k = 0; k < 3; k++) items.push(createItemInstance(stock[Math.floor(Math.random() * stock.length)]));
            openCustomShop(p, items, "Old Crooks General Store", () => endStep());
            AUDIO.playSound('sfx_gold');
            return;
        }

        // C. Standard Tile Event
        triggerTileEvent(p);
        return;
    }

    // Multiplayer
    const isMe = (p.id === myPlayerId);
    const isMyAi = (p.isAi && myPlayerId === 0);
    if (isMe || isMyAi) {
        db.ref(`games/${gameId}/players/${p.id}`).update({ pos: p.pos });
        triggerTileEvent(p);
    }
}

/**
 * handlePostBattleLanding
 * Optimized landing logic after a victory to skip random encounters.
 */
function handlePostBattleLanding(p, tile) {
    const i = tile.userData.info;
    const owner = tile.userData.owner;

    // AI logic still uses standard path
    if (p.isAi) {
        continueLandingLogic(p, tile);
        return;
    }

    addLog(`Area Cleared! Secure the ${i.name}.`, "log-gold");

    if (owner === null) {
        // Automated Free Capture (Skip Random Card)
        addLog(`${p.name} cleared the area and claimed the ${i.name}!`, "log-epic");
        capture(tile, p, 1, () => endStep());
    }
    else if (String(owner) === String(p.id)) {
        // Upgrade directly (Skip Skirmish Card)
        if (tile.userData.buildingLevel === 1) {
            showModal("Upgrade?", `Build Tavern at ${i.name} for ${i.cost * 2}G?`, [
                {
                    txt: "Upgrade", act: () => {
                        if (p.gold >= i.cost * 2) {
                            p.gold -= i.cost * 2;
                            capture(tile, p, 2, () => endStep());
                        } else { globalLog("Not enough Gold"); endStep(); }
                    }
                },
                { txt: "Skip", act: endStep }
            ]);
        } else {
            // Already a tavern
            continueLandingLogic(p, tile);
        }
    }
    else {
        // Enemy tile or special tile (Fall back to standard logic)
        continueLandingLogic(p, tile);
    }
}

function triggerTileEvent(p) {
    if (p.isProcessingEvent) return;
    p.isProcessingEvent = true;
    setTimeout(() => { p.isProcessingEvent = false; }, 2000);

    const t = tiles[p.pos];
    const i = t.userData.info;

    if (p.isAi && !isMultiplayer) {
        processAiTurn(p, t, i);
        return;
    }

    if (isMultiplayer) {
        const isMyTurn = (p.id === myPlayerId);
        const isAiTurn = (p.isAi && myPlayerId === 0);

        if (isMyTurn || isAiTurn) {
            db.ref(`games/${gameId}/request`).push({
                type: 'TILE_EVENT',
                pid: p.id,
                tileIndex: p.pos
            });
        }
        return;
    }

    // Dynamic Merchant
    const merchantEvent = activeEvents.find(e => e.data.type === 'merchant' && e.playerRef && e.playerRef.pos === p.pos);
    if (merchantEvent) {
        let stock = [];
        if (merchantEvent.data.id === 'merch_alchemist') stock = DECK_TREASURE.filter(it => it.type === 'scroll' && !it.name.includes('Gold'));
        else if (merchantEvent.data.id === 'merch_armorer') stock = DECK_TREASURE.filter(it => ['head', 'body', 'off'].includes(it.slot) && !it.name.includes('Gold'));
        else if (merchantEvent.data.id === 'merch_weaponsmith') stock = DECK_TREASURE.filter(it => it.slot === 'main' && !it.name.includes('Gold'));

        const items = [];
        for (let k = 0; k < 3; k++) items.push(createItemInstance(stock[Math.floor(Math.random() * stock.length)]));
        openCustomShop(p, items, merchantEvent.data.name, () => endStep());
        AUDIO.playSound('sfx_gold');
        return;
    }

    // Inn
    if (i.type === 'start') {
        if (p.pacifistBuff) {
            p.pacifistBuff = false;
            p.stats.str--; p.stats.dex--; p.stats.int--;
            addLog(`${p.name}'s Pacifist calm fades. (-1 All Stats)`, "log-warn");
        }

        const stock = DECK_TREASURE.filter(it => !it.name.includes('Gold'));
        const items = [];
        for (let k = 0; k < 3; k++) items.push(createItemInstance(stock[Math.floor(Math.random() * stock.length)]));
        openCustomShop(p, items, "Old Crooks General Store", () => endStep());
        AUDIO.playSound('sfx_gold');
        return;
    }

    // Arrival Modal
    const m = document.getElementById('arrival-modal');
    if (m) {
        const imgEl = document.getElementById('arrival-image');
        if (imgEl) {
            if (i.cardImg) { imgEl.src = i.cardImg; imgEl.style.display = 'block'; }
            else { imgEl.style.display = 'none'; }
        }
        const flavorEl = document.getElementById('arrival-flavor');
        if (flavorEl) flavorEl.innerText = i.flavor || "You arrive at " + i.name + ".";

        const btn = m.querySelector('button.primary');
        const closeBtn = m.querySelector('.close-x');
        const nextAction = () => continueFromArrival();

        btn.onclick = nextAction;
        if (closeBtn) closeBtn.onclick = nextAction;

        m.classList.add('active');
        lastInteractionTime = Date.now();
    }
    AUDIO.playSound('sfx_gold');
}

function openSkillPicker(slotIdx, currentTab = 'active') {
    activePickerSlot = slotIdx;
    const p = players.find(pl => pl.id === myPlayerId);
    const modal = document.getElementById('skill-picker-modal');
    const container = modal.querySelector('.modal-content');

    container.innerHTML = `
    <div class="close-x" onclick="document.getElementById('skill-picker-modal').style.display='none'">×</div>
    <h2 style="color:var(--gold-main); padding:20px 0 10px 20px; margin:0;">Hero Skills</h2>
    <div class="skill-tabs">
        <div class="skill-tab ${currentTab === 'active' ? 'active' : ''}" onclick="openSkillPicker(${slotIdx}, 'active')">ACTIVES</div>
        <div class="skill-tab ${currentTab === 'passive' ? 'active' : ''}" onclick="openSkillPicker(${slotIdx}, 'passive')">PASSIVES</div>
    </div>
    <div id="skill-list-container"></div>
    `;

    const list = container.querySelector('#skill-list-container');
    const allSkills = [];

    allSkills.push({ ...ABILITY_LIBRARY[p.activeSkillId], id: p.activeSkillId, source: "Class Ability", isClass: true, type: 'active' });
    allSkills.push({ ...ABILITY_LIBRARY[p.passiveSkillId], id: p.passiveSkillId, source: "Class Passive", isClass: true, type: 'passive' });

    EQUIP_ORDER.forEach(slot => {
        const item = p.equipment[slot];
        if (item && item.ability) {
            let ab = item.ability;

            // FIX: Resolve Ancient Item string IDs
            if (typeof ab === 'string') {
                ab = ABILITY_LIBRARY[ab] || { name: 'Unknown', desc: '...', type: 'active', img: '' };
            }

            const libEntry = Object.values(ABILITY_LIBRARY).find(s => s.name === ab.name);
            allSkills.push({
                ...ab,
                id: item.uid,
                source: item.name,
                img: libEntry ? libEntry.img : item.img,
                isClass: false,
                ref: item,
                type: ab.type || 'active'
            });
        }
    });

    const filtered = allSkills.filter(s => s.type === currentTab);
    filtered.forEach(skill => {
        const div = document.createElement('div');
        div.className = `skill-pick-item ${skill.isClass ? 'is-class' : ''}`;
        div.innerHTML = `
            <div class="skill-pick-icon" style="background-image: url('${skill.img}')"></div>
            <div class="skill-pick-info">
                <div class="skill-pick-source">${skill.source}</div>
                <div class="skill-pick-name">${skill.name}</div>
                <div class="skill-pick-desc">${skill.desc}</div>
            </div>
        `;
        if (currentTab === 'active') {
            div.onclick = () => {
                p.assignedSkills[slotIdx] = skill;
                updateHUD();
                modal.style.display = 'none';
                if (isMultiplayer) syncPlayerState();
            };
        }
        list.appendChild(div);
    });

    // Show the modal
    modal.style.display = 'flex';
}


function offerSkeletonKeyTrap(p) {
    // 1. Force position to Jail (Tile 10) just in case
    const jailTile = tiles[10];

    // 2. Define Logic
    const openMenu = () => {
        const isOverwrite = (jailTile.userData.trapOwner !== undefined && jailTile.userData.trapOwner !== null);
        const btnText = isOverwrite ? "Overwrite Trap (-50G)" : "Set Trap (-50G)";
        const msg = isOverwrite ? "A trap is already set here. Replace it with your own?" : "You unlocked the cell door. Set a trap for the next visitor?";

        showModal("Skeleton Key", msg, [
            {
                txt: btnText,
                act: () => {
                    if (p.gold >= 50) {
                        p.gold -= 50;
                        jailTile.userData.trapOwner = p.id;
                        addLog(`${p.name} rigged the Dungeon with a trap!`, "log-rare");

                        // Visuals
                        updateTrapVisuals(jailTile);
                        updateHUD();

                        if (isMultiplayer) {
                            syncPlayerState();
                            db.ref(`games/${gameId}/board/10/trapOwner`).set(p.id);
                        }
                    }
                    endStep();
                }
            },
            { txt: "Just Visit", act: endStep }
        ]);
    };

    // 3. Handle Movement (If coming from "Go To Dungeon")
    if (p.pos !== 10) {
        addLog("Skeleton Key: Used secret tunnel to Dungeon.", "log-success");
        p.pos = 10;

        // Sync movement in MP
        if (isMultiplayer) {
            db.ref(`games/${gameId}/players/${p.id}/pos`).set(10);
            // Visual log for others
            db.ref(`games/${gameId}/teleportLog`).push({
                pid: p.id, targetPos: 10, timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            // Just open menu immediately, listener handles visual movement for others
            openMenu();
        } else {
            // SP: Animate then open
            gameState = 'MOVING';
            animateTeleport(p, jailTile, () => {
                // Ensure camera is looking at jail
                if (isZoomed) cameraTarget = p.mesh;
                openMenu();
            });
        }
    } else {
        // Already at jail (Just Visiting)
        openMenu();
    }
}

function continueFromArrival() {
    document.getElementById('arrival-modal').classList.remove('active');
    const p = players[turnIndex];
    const t = tiles[p.pos];
    const i = t.userData.info;

    // 1. MYSTERY SPACE
    if (i.type === 'mystery') {
        const deckType = isNight ? 'skirmish' : 'normal';
        drawCardAnim(deckType, () => showEncounter(p, i, t, 'mystery_event'));
        return;
    }

    // 2. CORNER SPACES
    if (i.type === 'start') {
        if (p.id === 0) showEncounter(p, i, t, 'shop');
        else endStep();
        return;
    }

    if (i.type === 'park') {
        if (treasuryGold > 0) {
            const pot = treasuryGold;
            p.gold += pot;
            globalLog(`JACKPOT! ${p.name} collected ${pot}G from Treasury!`, "log-gold");
            AUDIO.playSound('sfx_win');
            treasuryGold = 0;
            if (isMultiplayer && gameId) {
                db.ref(`games/${gameId}/treasury`).set(0);
                syncPlayerState();
            }
            updateHUD();
        } else {
            globalLog(`${p.name} visited empty Treasury.`);
        }
        endStep(); return;
    }

    if (i.type === 'tax') {
        processTax(p, 50);
        endStep();
        return;
    }

    // --- GO TO DUNGEON (UPDATED FOR TRAPS) ---
    if (i.type === 'goto') {
        if (p.passiveSkillId === 'smoke_bomb' || p.activeSkillId === 'smoke_bomb') {
            globalLog("Smoke Bomb: Evaded Capture!", "log-epic");
            endStep();
            return;
        }

        if (p.passiveSkillId === 'skeleton_key') {
            offerSkeletonKeyTrap(p);
            return;
        }

        globalLog(`${p.name} ARRESTED!`, "log-fail");
        p.isSkipping = true;

        if (isMultiplayer) {
            db.ref(`games/${gameId}/players/${p.id}`).update({ isSkipping: true, pos: 10 });
            db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: 10, timestamp: firebase.database.ServerValue.TIMESTAMP });
            // The MP listener for teleportLog will trigger the trap check for all clients
            return;
        }

        // Single Player Logic
        p.pos = 10;
        gameState = 'MOVING';
        animateTeleport(p, tiles[10], () => {
            // FIX: Check trap upon arrival at Jail
            const trapHandled = checkAndTriggerTrap(p, tiles[10], () => endStep());
            if (!trapHandled) endStep();
        });
        return;
    }

    // --- JAIL ---
    if (i.type === 'jail') {
        if (p.passiveSkillId === 'skeleton_key' && p.gold >= 50) {
            document.getElementById('arrival-modal').classList.remove('active');
            offerSkeletonKeyTrap(p);
            return;
        }
        if (!p.isSkipping) globalLog(`${p.name} just visiting.`);
        endStep();
        return;
    }

    // --- CHEST ---
    if (i.type === 'chest') {
        const card = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);
        if (p.isAi) {
            if (!isMultiplayer || myPlayerId === 0) handleAiLoot(p, card);
            return;
        }
        presentLootUI(p, card);
        return;
    }

    // 3. PROPERTY LOGIC
    const deckType = isNight ? 'skirmish' : 'normal';
    const modeType = isNight ? 'wild_skirmish' : 'wild';
    const owner = t.userData.owner;

    if (owner === p.id) {
        if (t.userData.buildingLevel === 1) {
            showModal("Upgrade?", `Build Tavern ${i.cost * 2}G? (Skirmish)`, [
                {
                    txt: "Upgrade", act: () => {
                        if (p.gold >= i.cost * 2) {
                            p.gold -= i.cost * 2;
                            drawCardAnim('skirmish', () => showEncounter(p, i, t, "upgrade"));
                        } else { globalLog("Not enough Gold"); endStep(); }
                    }
                },
                { txt: "Skip", act: endStep }
            ]);
        } else {
            let guards = t.userData.guardCount || 0;
            showModal("Manage Tavern", `Current Guards: ${guards}. Hire Bodyguard for 50G?`, [
                {
                    txt: "Hire Guard (50G)", act: () => {
                        if (p.gold >= 50) {
                            p.gold -= 50;
                            t.userData.guardCount = (t.userData.guardCount || 0) + 1;
                            p.metrics.guardsHired++;
                            globalLog(`${p.name} hired a Guard!`, "log-gold");
                            updateHUD();
                            capture(t, p, t.userData.buildingLevel, () => endStep());
                        } else { globalLog("Not enough Gold"); endStep(); }
                    }
                },
                { txt: "Rest (Skip)", act: endStep }
            ]);
        }
    } else if (owner !== null) {
        showEncounter(p, i, t, "enemy");
    } else {
        drawCardAnim(deckType, () => showEncounter(p, i, t, modeType));
    }
}
function processAiTurn(p, t, i) {
    if (isMultiplayer && myPlayerId !== 0) return;
    if (isMultiplayer && currentRoomData && currentRoomData.slots[p.id].type === 'human') return;

    // DEBUG: Force logs to see what's happening
    console.log(`[AI DEBUG] ${p.name} on ${i.name}. TileOwner: ${t.userData.owner}, MyID: ${p.id}`);

    setTimeout(() => {
        try {
            // --- 0. POST-MOVE ABILITIES (Smite, Sanctuary) ---
            if (!p.classSkillDepleted && p.activeSkillId) {
                const skillName = ABILITY_LIBRARY[p.activeSkillId].name;

                // SMITE: Use if land is expensive and unowned, OR to upgrade own land
                if (skillName === 'Smite') {
                    const isUnowned = t.userData.owner === null && i.cost > 50;
                    const isMine = String(t.userData.owner) === String(p.id) && t.userData.buildingLevel === 1;

                    if (isUnowned || isMine) {
                        useSkillAi(p, 0);
                        return; // Smite handles the capture/end turn
                    }
                }

                // SANCTUARY: Set a checkpoint if we don't have one
                if (skillName === 'Sanctuary' && (p.sanctuaryPos === undefined || p.sanctuaryPos === null)) {
                    useSkillAi(p, 0);
                    // Continue turn (Sanctuary doesn't end turn)
                }
            }
            // --- 1. EVENT ENTITIES (Do nothing) ---
            if (p.isEventEntity) { endStep(); return; }

            // --- 2. MYSTERY TILE ---
            if (i.type === 'mystery') {
                const deck = isNight ? DECK_SKIRMISH : DECK_ENCOUNTER;
                const card = deck[Math.floor(Math.random() * deck.length)] || DECK_ENCOUNTER[0];
                if (card && card.choices) {
                    let best = card.choices[0];
                    if (card.choices[1]) {
                        const isFoggy = activeEvents.some(e => e.data && e.data.id === 'event_fog');
                        if (isFoggy) best = card.choices[Math.floor(Math.random() * card.choices.length)];
                        else {
                            const stat1 = p.stats[best.stat] || 0;
                            const stat2 = p.stats[card.choices[1].stat] || 0;
                            if (stat2 > stat1) best = card.choices[1];
                        }
                    }

                    // --- FORCE TELEPORT MODE ---
                    // This ensures the AI uses 'teleport' logic regardless of what the card says (usually 'capture')
                    const actualMode = 'teleport';
                    resolveAiCombat(p, best.stat, best.tn, best.req || 1, t, actualMode, best.val || 0, best.fail || 50);
                    return;
                }
                endStep(); return;
            }

            // --- 3. CHEST ---
            if (i.type === 'chest') {
                const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
                p.inventory.push(createItemInstance(card));
                addLog(`${p.name} found ${card.name}.`, "log-success");
                if (isMultiplayer) syncPlayerState();
                endStep(); return;
            }

            // --- 4. SHOPS ---
            if (i.type === 'shop' || i.type === 'start') {
                const stock = DECK_TREASURE.filter(it => !it.name.includes('Gold'));
                const shopItems = [];
                for (let k = 0; k < 3; k++) shopItems.push(createItemInstance(stock[Math.floor(Math.random() * stock.length)]));
                evaluateAndBuy(p, shopItems);
                endStep(); return;
            }

            // --- 5. TAX & PARK ---
            if (i.type === 'tax') { processTax(p, 50); endStep(); return; }
            if (i.type === 'park') {
                if (treasuryGold > 0) {
                    p.gold += treasuryGold;
                    addLog(`${p.name} wins Treasury!`, "log-gold");
                    treasuryGold = 0; updateHUD();
                    if (isMultiplayer) syncPlayerState();
                }
                endStep(); return;
            }

            // --- 6. DUNGEON ---
            if (i.type === 'goto') {
                if (p.passiveSkillId === 'smoke_bomb') {
                    addLog("Skeleton Key Used!", "log-epic");
                } else {
                    addLog(`${p.name} sent to Dungeon!`, "log-fail");
                    p.isSkipping = true;
                    p.pos = 10; // Update local immediately
                    if (tiles[10]) p.mesh.position.copy(tiles[10].position);

                    if (isMultiplayer) {
                        // Update both flags specifically
                        db.ref(`games/${gameId}/players/${p.id}`).update({ isSkipping: true, pos: 10 });
                        db.ref(`games/${gameId}/teleportLog`).push({
                            pid: p.id, targetPos: 10, timestamp: firebase.database.ServerValue.TIMESTAMP
                        });
                    }
                }
                endStep(); return;
            }
            if (i.type === 'jail') { endStep(); return; }

            // --- 7. OWN PROPERTY ---
            // Use String comparison for safety
            if (String(t.userData.owner) === String(p.id)) {
                if (t.userData.buildingLevel === 1 && p.gold >= i.cost * 2) {
                    p.gold -= i.cost * 2;
                    capture(t, p, 2);
                    addLog(`${p.name} upgraded to Tavern!`, "log-success");
                    if (isMultiplayer) syncPlayerState();
                }
                else if (t.userData.buildingLevel === 2) {
                    const guards = t.userData.guardCount || 0;
                    if (guards < 2 && p.gold >= 150) {
                        p.gold -= 50;
                        t.userData.guardCount = guards + 1;
                        addLog(`${p.name} hired a guard.`, "log-gold");
                        applyCaptureVisuals(t, p, 2);
                        if (isMultiplayer) {
                            syncPlayerState();
                            db.ref(`games/${gameId}/board/${t.userData.id}/guardCount`).set(t.userData.guardCount);
                        }
                    }
                }
                endStep(); return;
            }

            // --- 8. ENEMY LAND (Strict Fix) ---
            // Ensure owner is NOT null/undefined AND NOT me
            if (t.userData.owner != null && String(t.userData.owner) !== String(p.id)) {
                console.log("[AI DEBUG] Entering Enemy Land Logic");

                const owner = players.find(pl => String(pl.id) === String(t.userData.owner));
                const rentCost = (i.cost * ((t.userData.buildingLevel > 1) ? 2 : 1)) + ((t.userData.guardCount || 0) * 20);
                const defStat = t.userData.defendingStat || 'str';

                let myStatVal = p.stats[defStat] || 0;
                let shouldSiege = (p.gold < rentCost) || (myStatVal >= 4);

                if (shouldSiege) {
                    addLog(`${p.name} attacks the property!`, "log-accent");
                    const failCost = rentCost * 2;
                    resolveAiCombat(p, defStat, 3, 1, t, 'capture', 0, failCost);
                } else {
                    addLog(`${p.name} pays rent.`, "log-fail");
                    pay(p, rentCost, owner);
                    endStep();
                }
                return;
            }

            // --- 9. EMPTY LAND ---
            if (i.cost > 0 && t.userData.owner == null) {
                if (p.gold >= i.cost * 1.5) {
                    capture(t, p, 1, () => checkForBonusLoot(p));
                } else {
                    addLog(`${p.name} passes.`, "log-entry");
                    endStep();
                }
                return;
            }

            endStep();

        } catch (err) {
            console.error("AI Error", err);
            // Fallback: If AI crashes on enemy land, force pay
            if (t.userData.owner != null && t.userData.owner != p.id) {
                const owner = players.find(pl => String(pl.id) === String(t.userData.owner));
                pay(p, 50, owner); // Default 50g safety payment
            }
            endStep();
        }
    }, 600);
}

function evaluateAndBuy(p, items) {
    let bought = false;

    // AI Strategy: Prioritize Items that boost their highest stat (Archetype)
    const mainStat = p.archetype || 'str'; // Defined in spawnPlayer

    items.forEach(item => {
        // 1. Check Cost
        if (p.gold >= item.cost) {
            let isUpgrade = false;

            if (item.type === 'scroll') {
                // Always buy cheap useful scrolls if rich
                if (p.gold > 500 && item.cost < 200) isUpgrade = true;
            }
            else if (item.type === 'equip') {
                const current = p.equipment[item.slot];
                const newStat = (item.bonus && item.bonus[mainStat]) ? item.bonus[mainStat] : 0;

                if (!current) {
                    isUpgrade = true; // Empty slot, buy it
                } else {
                    const currentStat = (current.bonus && current.bonus[mainStat]) ? current.bonus[mainStat] : 0;
                    if (newStat > currentStat) isUpgrade = true; // Better stats
                }
            }

            // 2. Buy if Upgrade
            if (isUpgrade) {
                p.gold -= item.cost;
                p.inventory.push(item);
                addLog(`${p.name} bought ${item.name}.`, "log-gold");
                bought = true;
            }
        }
    });

    if (bought) {
        if (isMultiplayer) syncPlayerState(); // Update Gold/Inv in DB
        manageAiInventory(p); // Auto-equip the new items
    } else {
        addLog(`${p.name} browses but buys nothing.`, "log-entry");
    }
}

function syncPlayerState() {
    if (!isMultiplayer || !db || !gameId) return;

    const updatePlayer = (player) => {
        const cleanEquip = {};
        ['head', 'body', 'main', 'off', 'feet', 'hands', 'ring_l', 'ring_r', 'amulet', 'back'].forEach(s => {
            if (player.equipment[s]) cleanEquip[s] = serializeItem(player.equipment[s]);
        });
        const cleanInv = player.inventory.map(i => serializeItem(i));

        db.ref(`games/${gameId}/players/${player.id}`).update({
            gold: player.gold,
            stats: player.stats,
            permBonuses: player.permBonuses || { str: 0, dex: 0, int: 0 },
            classSkillDepleted: player.classSkillDepleted || false,
            classSkill2Depleted: player.classSkill2Depleted || false, // SCHOLAR SYNC
            isPolymorphed: player.isPolymorphed || false,
            metrics: player.metrics,
            equipment: cleanEquip,
            inventory: cleanInv
        });
    };

    const me = players.find(pl => pl.id === myPlayerId);
    if (me) updatePlayer(me);

    if (myPlayerId === 0) {
        players.forEach(p => { if (p.isAi) updatePlayer(p); });
    }
}

// NEW HELPER: Headless Combat for AI (No UI)
function resolveAiCombat(p, stat, tn, req, t, mode, rewardVal, failCost) {
    // Prevent double triggers
    if (p.combatLocked) return;
    p.combatLocked = true;
    setTimeout(() => { p.combatLocked = false; }, 2000);

    // 1. Calculate Dice Pool
    let poolSize = p.stats[stat] || 1;

    // Check for Fog Event (Array aware)
    const isFoggy = activeEvents.some(e => e.data && e.data.id === 'event_fog');

    // 2. Roll Dice
    let wins = 0;
    for (let i = 0; i < poolSize; i++) {
        const roll = Math.floor(Math.random() * 6) + 1;
        if (roll >= tn) wins++;
    }

    // 3. Evaluate Result
    if (wins >= req) {
        addLog(`${p.name} Siege Successful! (${wins} wins)`, "log-success");

        if (mode === 'teleport') {
            const newPos = Math.floor(Math.random() * 40);

            // --- FIX START: Proper Teleport Handling ---
            if (isMultiplayer && db && gameId) {
                // Multiplayer: Push to DB, let listeners handle visuals
                db.ref(`games/${gameId}/teleportLog`).push({
                    pid: p.id, targetPos: newPos, timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            } else {
                // Single Player: Trigger Animation & Callback locally
                p.pos = newPos;
                gameState = 'MOVING';

                // Use animateTeleport so the camera follows the AI
                animateTeleport(p, tiles[newPos], () => {
                    resolveLanding(p);
                });
            }
            // --- FIX END ---
            return;
        }
        else if (mode === 'capture' || mode === 'upgrade') {
            const lvl = (mode === 'upgrade') ? 2 : 1;
            // Success! Capture/Upgrade the tile
            capture(t, p, lvl, () => checkForBonusLoot(p));
            return;
        }
    } else {
        // Failure
        addLog(`${p.name} Siege Failed. Paid ${failCost}G penalty.`, "log-fail");
        pay(p, failCost);
    }

    // If we didn't capture/teleport, we must end the step here
    endStep();
}
function showEncounter(p, i, t, mode, preDeterminedCard = null) {
    // MODAL STACKING: Check if active
    if (document.getElementById('card-modal').classList.contains('active')) {
        modalQueue.push(() => showEncounter(p, i, t, mode, preDeterminedCard));
        return;
    }

    // TUTORIAL HOOK
    if (typeof TUTORIAL !== 'undefined' && TUTORIAL.active) TUTORIAL.showEncounter();
    const originalMode = mode;
    const m = document.getElementById('card-modal');
    const l = document.getElementById('choice-list');
    const headerEl = document.getElementById('enc-header');

    l.innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';
    document.getElementById('market-sell-area').style.display = 'none';

    // 1. Draw Card Logic (Background Prep)
    let card;
    if (preDeterminedCard) {
        card = preDeterminedCard;
    } else {
        if (mode === 'loot') card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
        else if (mode === 'mystery_event') card = (isNight ? DECK_SKIRMISH : DECK_ENCOUNTER)[Math.floor(Math.random() * 15)];
        else if (mode.includes('skirmish') || mode === 'upgrade') card = DECK_SKIRMISH[Math.floor(Math.random() * 15)];
        else card = DECK_ENCOUNTER[Math.floor(Math.random() * 15)];
    }

    // Mode Overrides
    if (card.type === 'shop') mode = 'shop';
    if (card.type === 'loot') {
        mode = 'loot';
        if (!card.cost && !card.name) card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
    }

    // 2. Header Styling
    let title = card.name;
    headerEl.className = 'card-header';

    if (mode === 'enemy') {
        title = "Enemy Territory";
        headerEl.classList.add('skirmish');
    }
    else if (mode.includes('skirmish') || mode === 'upgrade' || (mode === 'mystery_event' && isNight)) {
        headerEl.classList.add('skirmish');
        title += " (SKIRMISH)";
    }
    else if (mode === 'loot') { headerEl.classList.add('loot'); }
    else if (mode === 'shop') { headerEl.classList.add('market'); }

    document.getElementById('enc-title').innerText = title;

    let desc = card.desc || "Event occurs.";
    let opts = [];

    // --- LOGIC BRANCHES ---

    // A. ENEMY PROPERTY (Priority Fix: Checked BEFORE card.choices)
    if (mode === 'enemy') {
        let guards = t.userData.guardCount || 0;
        let defStat = t.userData.defendingStat || 'str';
        let rentCost = (i.cost * ((t.userData.buildingLevel > 1) ? 2 : 1)) + (guards * 20);
        let failCost = (i.cost * 2) + (guards * 10);

        const ownerName = players[t.userData.owner] ? players[t.userData.owner].name : "Unknown";
        desc = `Owned by ${ownerName}. Defending: ${defStat.toUpperCase()}. Guards: ${guards}.`;

        opts = [
            { txt: `Pay Rent ${rentCost}G`, act: () => { pay(p, rentCost, players[t.userData.owner]); closeEnc(); } },
            { txt: `Siege | Risk: -${failCost}G`, stat: defStat, tn: 3, req: 1, mode: 'capture', penalty: false, failCost: failCost, isSiege: true }
        ];

        if (p.isAi && myPlayerId === 0) {
            const owner = players.find(pl => pl.id === t.userData.owner);
            pay(p, rentCost, owner);
            endStep();
            return;
        }

        if (p.activeSkillId === 'siege_breaker' && !p.classSkillDepleted) {
            opts.unshift({
                txt: "★ Siege Breaker", act: () => {
                    p.classSkillDepleted = true; updateHUD();
                    addLog("Siege Breaker used!", "log-epic");
                    let roll = Math.floor(Math.random() * 6) + 1;
                    if (roll >= 4) {
                        if (guards > 0) { t.userData.guardCount--; addLog("Guard Killed!", "log-success"); }
                        else if (t.userData.buildingLevel > 1) { t.userData.buildingLevel = 1; addLog("Tavern Downgraded!", "log-success"); }
                        else {
                            t.userData.owner = null;
                            if (t.userData.prop) { t.remove(t.userData.prop); t.userData.prop = null; }
                            addLog("Property Destroyed!", "log-epic");
                            setTimeout(() => { drawCardAnim('normal', () => showEncounter(p, i, t, 'wild')); }, 1000);
                            closeEnc();
                            return;
                        }
                        applyCaptureVisuals(t, players[t.userData.owner], t.userData.buildingLevel);
                        closeEnc();
                    } else {
                        addLog("Siege Breaker failed.", "log-fail");
                    }
                }
            });
        }
    }
    // B. LOOT
    else if (mode === 'loot') {
        desc = `You found: ${card.name} (${card.rarity || 'Common'})`;

        if (p.inventory.length >= 12) {
            opts = [{ txt: "Inventory Full (Discard)", act: () => { addLog("Inventory full. Item discarded.", "log-fail"); updateHUD(); closeEnc(); } }];
        } else {
            opts = [{
                txt: "Keep", act: () => {
                    p.inventory.push(createItemInstance(card));
                    addLog("Gained " + card.name, "log-success");
                    if (card.name === "Pouch of Gold" && p.passiveSkillId === 'alchemist_pas') {
                        addLog("Alchemist: Transmuting extra loot...", "log-epic");
                        updateHUD();
                        setTimeout(() => { drawCardAnim('treasure', () => showEncounter(p, null, null, 'loot')); }, 500);
                        return;
                    }
                    if (typeof isMultiplayer !== 'undefined' && isMultiplayer) syncPlayerState();
                    updateHUD();
                    closeEnc();
                }
            }];
        }
    }
    // C. SHOP
    else if (mode === 'shop' || (i && i.type === 'start')) {
        openCustomShop(p, [], "Merchant", () => {
            const isCombatMode = (originalMode === 'wild' || originalMode === 'wild_skirmish');
            if (isCombatMode) drawCardAnim('normal', () => showEncounter(p, i, t, originalMode));
            else closeEnc();
        });
        return;
    }
    // D. STANDARD CHOICES (Wild Encounter / Skirmish)
    else if (card.choices) {
        card.choices.forEach(c => {
            let btnTxt = c.txt;
            if (c.fail) btnTxt += ` | Fail: -${c.fail}G`;

            let useMode = c.mode;
            if (originalMode === 'mystery_event') useMode = 'teleport';
            else if (originalMode === 'upgrade') useMode = 'upgrade';

            // Remove gold cost from button text if it's a level 1 capture
            if (useMode === 'capture' && (!t || !t.userData.buildingLevel || t.userData.buildingLevel < 1)) {
                btnTxt = btnTxt.replace(/\(\d+G\)/g, '').replace(/Cost: \d+G/g, '').trim();
                if (btnTxt.includes('|')) {
                    // split and clean
                    const parts = btnTxt.split('|');
                    parts[0] = parts[0].replace(/\(\d+G\)/, '').trim();
                    btnTxt = parts.join('|');
                }
            }

            opts.push({ txt: btnTxt, stat: c.stat, tn: c.tn, req: c.req || 1, mode: useMode, val: c.val || 0, failCost: c.fail || 50 });
        });

        if (p.passiveSkillId === 'pacifist') {
            opts.push({
                txt: "★ Flee (Pacifist +30G)", act: () => {
                    p.gold += 30;
                    if (!p.pacifistBuff) {
                        p.pacifistBuff = true;
                        p.stats.str++; p.stats.dex++; p.stats.int++;
                    }
                    addLog("Pacifist Flee: +30G and Temp Stats (+1 All)!", "log-success");
                    updateHUD(); closeEnc();
                }
            });
        } else {
            opts.push({ txt: "Leave / Flee", act: closeEnc });
        }
    }
    // E. PAY TAX
    else if (card.type === 'pay') {
        opts = [{ txt: `Pay ${card.cost}G`, act: () => { processTax(p, card.cost); closeEnc(); } }];
    }
    else {
        opts = [{ txt: "Continue", act: closeEnc }];
    }

    // Render Description & Buttons
    const descEl = document.getElementById('enc-desc');
    if (descEl) descEl.innerText = desc;

    opts.forEach(o => {
        let b = document.createElement('div');
        b.className = 'choice-btn';
        b.innerText = o.txt;
        b.onclick = () => {
            if (o.act) o.act(b);
            else rollCombat(p, o.stat, o.tn, o.req, t, o.mode, o.penalty, o.val, o.failCost, o.isSiege);
        };
        l.appendChild(b);
    });

    lastInteractionTime = Date.now();
    m.classList.add('active');
}
function closeEnc() {
    document.getElementById('card-modal').classList.remove('active');
    if (modalQueue.length > 0) {
        const next = modalQueue.shift();
        setTimeout(() => next(), 300);
    } else {
        endStep();
    }
}
function closeFlavor() { document.getElementById('flavor-modal').classList.remove('active'); continueFromArrival(); }
function drawCardAnim(type, cb) {
    let deck, texUrl;
    if (type === 'treasure') { deck = treasureDeck; texUrl = 'https://static.wixstatic.com/media/b16479_03570af932d9445ea8b35d26c915366d~mv2.jpg'; }
    else if (type === 'skirmish') { deck = skirmishDeck; texUrl = 'https://static.wixstatic.com/media/b16479_cd6258f031004df4962a76830ae296f3~mv2.jpg'; }
    else { deck = normalDeck; texUrl = 'https://static.wixstatic.com/media/b16479_b3d23c888e524e31a6ba70275de7f665~mv2.jpg'; }

    const loader = new THREE.TextureLoader();
    const tex = loader.load(texUrl);
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mats = [whiteMat, whiteMat, new THREE.MeshStandardMaterial({ map: tex }), whiteMat, whiteMat, whiteMat];
    const c = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.15, 10.5), mats);
    c.position.copy(deck.position);
    c.position.y += 2;
    scene.add(c);

    // --- FIX: Ensure Callback Runs Exactly Once ---
    let hasRun = false;
    const finish = () => {
        if (!hasRun) {
            hasRun = true;
            scene.remove(c);
            if (cb) cb();
        }
    };
    // ----------------------------------------------

    new TWEEN.Tween(c.position).to({ x: camera.position.x * 0.8, y: camera.position.y - 20, z: camera.position.z * 0.8 }, 600).start();
    new TWEEN.Tween(c.rotation).to({ x: Math.PI / 2, y: Math.PI, z: 0 }, 600).onComplete(finish).start();

    // Safety fallback
    setTimeout(finish, 800);
}

function rollCombat(p, stat, tn, req, t, mode, penalty, rewardVal, failCost, isSiege) {
    const d = document.getElementById('dice-result');
    d.innerHTML = '';

    let poolSize = p.stats[stat] || 1;
    if (isNight) poolSize += 2; // NIGHT BONUS
    if (p.isPolymorphed) { poolSize = 1; }
    if (isSiege && p.passiveSkillId === 'ambush_pas') { req = Math.max(0, req - 1); }
    if (penalty) poolSize = Math.floor(poolSize / 2);
    if (poolSize < 1) poolSize = 1;

    let results = [];
    for (let i = 0; i < poolSize; i++) {
        results.push(Math.floor(Math.random() * 6) + 1);
    }

    const finalizeCombat = (finalResults) => {
        let wins = 0;
        d.innerHTML = '';

        finalResults.forEach(r => {
            let b = document.createElement('div');
            b.className = 'mini-die ' + (r >= tn ? 'win' : 'lose');
            b.innerText = r;
            d.appendChild(b);
            if (r >= tn) {
                wins++;
                if (r === 6 && p.passiveSkillId === 'executioner') { wins++; b.style.boxShadow = "0 0 10px #ef4444"; }
            }
        });

        // Small delay to see the dice result before logic triggers
        setTimeout(() => {
            const isLocalControl = (p.id === myPlayerId) || (p.isAi && myPlayerId === 0);

            if (wins >= req) {
                // --- SUCCESS ---
                globalLog(`${p.name} Succeeded! (${wins} wins)`, "log-success");
                if (isLocalControl) AUDIO.playSound('sfx_win');

                // CRITICAL FIX: Close the modal NOW so we can see the board animation
                document.getElementById('card-modal').classList.remove('active');

                // Keep button grayed out by setting state to MOVING/PROCESSING
                gameState = 'MOVING';
                updateHUD();

                const lootCallback = () => checkForBonusLoot(p);

                if (mode === 'teleport') {
                    // (Teleport logic handled in your previous version)
                    const newPos = Math.floor(Math.random() * 40);
                    if (isMultiplayer) {
                        db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: newPos, timestamp: firebase.database.ServerValue.TIMESTAMP });
                    } else {
                        p.pos = newPos;
                        animateTeleport(p, tiles[newPos], () => { resolveLanding(p); });
                    }
                }
                else if (isSiege) {
                    let guards = t.userData.guardCount || 0;
                    if (guards > 0) {
                        t.userData.guardCount--;
                        globalLog(`Guard Defeated!`, "log-success");
                        if (isMultiplayer) db.ref(`games/${gameId}/board/${t.userData.id}/guardCount`).set(t.userData.guardCount);
                        applyCaptureVisuals(t, players.find(pl => pl.id === t.userData.owner), t.userData.buildingLevel);
                        endStep(); // Return to standard turn flow
                    } else {
                        capture(t, p, 1, lootCallback);
                    }
                }
                else if (mode === 'capture' || mode === 'upgrade') {
                    const targetLvl = (mode === 'upgrade') ? 2 : 1;
                    capture(t, p, targetLvl, lootCallback);
                }

            } else {
                // --- FAILURE ---
                globalLog(`${p.name} Failed the roll.`, "log-fail");
                if (isLocalControl) AUDIO.playSound('sfx_fail');

                if (isSiege) pay(p, failCost, players.find(pl => pl.id === t.userData.owner));
                else pay(p, failCost);

                // Close and end turn on failure
                closeEnc();
            }
        }, 1000);
    };

    if (p.id === myPlayerId) AUDIO.playSound('sfx_roll');
    finalizeCombat(results);
}

function createPlayerMesh(race, charClass, playerColor) {
    const group = new THREE.Group();

    // --- 1. CONFIG ---
    const colors = {
        skin: 0xffccaa,
        hair: 0x3e2723,
        primary: playerColor,
        secondary: 0x222222,
        gold: 0xffd700
    };

    let scale = { x: 1, y: 1, z: 1 };

    // Race adjustments
    if (race.id === 'orc') { colors.skin = 0x558b2f; scale = { x: 1.25, y: 1.15, z: 1.25 }; }
    else if (race.id === 'elf') { colors.skin = 0xffe0b2; scale = { x: 0.9, y: 1.2, z: 0.9 }; }
    else if (race.id === 'dwarf') { colors.skin = 0xd7ccc8; scale = { x: 1.4, y: 0.75, z: 1.4 }; }
    else if (race.id === 'gnome') { colors.skin = 0xffccaa; scale = { x: 0.7, y: 0.7, z: 0.7 }; }
    else if (race.id === 'halfling') { colors.skin = 0xffccaa; scale = { x: 0.7, y: 0.7, z: 0.7 }; }
    else if (race.id === 'tiefling') { colors.skin = 0x7b1fa2; scale = { x: 1, y: 1.15, z: 1 }; }
    else if (race.id === 'dragonborn') { colors.skin = 0xb71c1c; scale = { x: 1.2, y: 1.3, z: 1.2 }; }

    const matSkin = new THREE.MeshStandardMaterial({ color: colors.skin });
    const matClothe = new THREE.MeshStandardMaterial({ color: colors.primary });
    const matDark = new THREE.MeshStandardMaterial({ color: colors.secondary });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.7, roughness: 0.3 });

    // --- 2. BODY ---
    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale.x, 0.6 * scale.y, 0.3 * scale.z), matClothe);
    torso.position.y = 0.8 * scale.y;
    torso.castShadow = true;
    group.add(torso);

    // Belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.52 * scale.x, 0.1 * scale.y, 0.32 * scale.z), matDark);
    belt.position.y = 0.55 * scale.y;
    group.add(belt);

    // Head
    let headGeo = (race.id === 'gnome') ? new THREE.IcosahedronGeometry(0.35 * scale.x, 1) : new THREE.DodecahedronGeometry(0.25 * scale.x);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.position.y = 1.25 * scale.y;
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 4, 4);
    const matEye = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeGeo, matEye); eyeL.position.set(-0.1, 1.25 * scale.y, 0.2 * scale.x);
    const eyeR = new THREE.Mesh(eyeGeo, matEye); eyeR.position.set(0.1, 1.25 * scale.y, 0.2 * scale.x);
    group.add(eyeL, eyeR);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.18 * scale.x, 0.5 * scale.y, 0.2 * scale.z);
    const legL = new THREE.Mesh(legGeo, matDark); legL.position.set(-0.15 * scale.x, 0.25 * scale.y, 0);
    const legR = new THREE.Mesh(legGeo, matDark); legR.position.set(0.15 * scale.x, 0.25 * scale.y, 0);
    group.add(legL, legR);

    // Arms 
    // Arms are at X +/- 0.35. Weapons should align with this X value.
    const armGeo = new THREE.BoxGeometry(0.15 * scale.x, 0.5 * scale.y, 0.15 * scale.z);
    const armL = new THREE.Mesh(armGeo, matClothe); armL.position.set(-0.35 * scale.x, 0.8 * scale.y, 0);
    const armR = new THREE.Mesh(armGeo, matClothe); armR.position.set(0.35 * scale.x, 0.8 * scale.y, 0);
    group.add(armL, armR);

    // --- 3. ACCESSORIES (Capes) ---
    if (charClass.id !== 'rogue') {
        const capeGeo = new THREE.BoxGeometry(0.5 * scale.x, 0.8 * scale.y, 0.05);
        capeGeo.translate(0, -0.4 * scale.y, 0);
        const cape = new THREE.Mesh(capeGeo, matClothe);
        cape.position.set(0, 1.1 * scale.y, -0.17 * scale.z);
        cape.name = "Cape";
        group.add(cape);
    } else {
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.3), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        pack.position.set(0, 0.9 * scale.y, -0.2 * scale.z);
        group.add(pack);
    }

    // --- 4. RACE DETAILS (Ears/Horns/Beards) ---
    if (race.id === 'elf' || race.id === 'halfling') {
        const earL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 4), matSkin);
        earL.rotation.z = 1.5; earL.position.set(-0.25, 1.25 * scale.y, 0);
        const earR = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 4), matSkin);
        earR.rotation.z = -1.5; earR.position.set(0.25, 1.25 * scale.y, 0);
        group.add(earL, earR);
    }
    if (race.id === 'gnome') {
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.35 * scale.x, 0.8 * scale.y, 16), matClothe);
        hat.position.set(0, 1.7 * scale.y, 0); hat.rotation.x = -0.2;
        group.add(hat);
        const beard = new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale.x, 0.25 * scale.y, 0.1 * scale.z), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
        beard.position.set(0, 1.1 * scale.y, 0.28 * scale.z);
        group.add(beard);
    }
    if (race.id === 'dwarf') {
        const beard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.15), new THREE.MeshStandardMaterial({ color: colors.hair }));
        beard.position.set(0, 1.1 * scale.y, 0.18);
        group.add(beard);
    }
    if (race.id === 'tiefling') {
        const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 4), matSteel);
        hornL.position.set(-0.15, 1.55 * scale.y, 0); hornL.rotation.z = 0.5;
        const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 4), matSteel);
        hornR.position.set(0.15, 1.55 * scale.y, 0); hornR.rotation.z = -0.5;
        group.add(hornL, hornR);
    }
    if (race.id === 'dragonborn') {
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 8), matSkin);
        tail.position.set(0, 0.4, -0.4); tail.rotation.x = -2;
        group.add(tail);
        const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.25), matSkin);
        snout.position.set(0, 1.2 * scale.y, 0.2); group.add(snout);
    }

    // --- 5. CLASS GEAR (FIXED WEAPON POSITIONS) ---
    // Weapons aligned with Arms at X: +/- 0.35

    if (charClass.id === 'wizard' && race.id !== 'gnome') {
        // Hat
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 8), matClothe);
        brim.position.y = 1.45 * scale.y;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 8), matClothe);
        cone.position.y = 1.75 * scale.y;
        group.add(brim, cone);

        // Staff (Right Hand)
        const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), new THREE.MeshStandardMaterial({ color: 0x5d4037 }));
        // X=0.35 (Arm), Y=0.8 (Hand height), Z=0.2 (Slightly forward)
        staff.position.set(0.35 * scale.x, 0.8 * scale.y, 0.2);
        staff.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaaa })));
        group.add(staff);
    }

    if (charClass.id === 'fighter' || charClass.id === 'cleric') {
        // Sword / Mace (Right Hand)
        const weaponGroup = new THREE.Group();
        // X=0.35 (Arm), Y=0.8 (Hand height)
        weaponGroup.position.set(0.35 * scale.x, 0.8 * scale.y, 0.2);
        // Rotate to point forward/up
        weaponGroup.rotation.x = Math.PI / 4;

        // Handle
        weaponGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3), matDark));

        if (charClass.id === 'cleric') {
            // Mace Head
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.25), matSteel);
            head.position.y = 0.3;
            weaponGroup.add(head);
        } else {
            // Sword Blade
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.04), matSteel);
            blade.position.y = 0.6;
            weaponGroup.add(blade);
        }
        group.add(weaponGroup);

        // Shield (Left Hand)
        const shield = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.05), matSteel);
        // X=-0.35 (Left Arm)
        shield.position.set(-0.35 * scale.x, 0.8 * scale.y, 0.2);
        shield.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.06), matClothe));
        group.add(shield);
    }

    if (charClass.id === 'rogue' && race.id !== 'gnome') {
        const hood = new THREE.Mesh(new THREE.SphereGeometry(0.32 * scale.x, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), matClothe);
        hood.position.y = 1.3 * scale.y;
        group.add(hood);

        // Dagger (Right Hand)
        const dag1 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.4, 4), matSteel);
        // X=0.35 (Arm)
        dag1.position.set(0.35 * scale.x, 0.7 * scale.y, 0.2);
        dag1.rotation.x = Math.PI / 2;
        group.add(dag1);

        // Dagger (Left Hand - Dual Wield)
        const dag2 = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.4, 4), matSteel);
        dag2.position.set(-0.35 * scale.x, 0.7 * scale.y, 0.2);
        dag2.rotation.x = Math.PI / 2;
        group.add(dag2);
    }

    group.position.y = 0;
    return group;
}

// --- 1. BUILD THE TRAP MESH ---
function createTrapMesh(color) {
    const g = new THREE.Group();

    // Base (Grey Steel)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.4 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16), baseMat);
    base.position.y = 0.05;
    g.add(base);

    // Pressure Plate (Owner Color)
    const plateMat = new THREE.MeshStandardMaterial({ color: color, emissive: 0x000000 });
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.15, 16), plateMat);
    plate.position.y = 0.1;
    g.add(plate);

    // Jaws Group
    const jawMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 });
    const toothGeo = new THREE.ConeGeometry(0.1, 0.4, 4);

    // Left Jaw Hinge
    const leftJaw = new THREE.Group();
    leftJaw.name = "LeftJaw"; // Naming for animation
    const leftRim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 8, 16, Math.PI), jawMat);
    leftRim.rotation.x = Math.PI / 2;
    leftRim.rotation.y = Math.PI / 2; // Face inwards
    leftJaw.add(leftRim);

    // Teeth Left
    for (let i = 0; i < 5; i++) {
        const t = new THREE.Mesh(toothGeo, jawMat);
        t.position.set(0, 0.5, -0.8 + (i * 0.4));
        t.rotation.z = -Math.PI / 4;
        leftJaw.add(t);
    }
    leftJaw.position.set(-0.1, 0.1, 0);
    g.add(leftJaw);

    // Right Jaw Hinge
    const rightJaw = new THREE.Group();
    rightJaw.name = "RightJaw"; // Naming for animation
    const rightRim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 8, 16, Math.PI), jawMat);
    rightRim.rotation.x = Math.PI / 2;
    rightRim.rotation.y = -Math.PI / 2;
    rightJaw.add(rightRim);

    // Teeth Right
    for (let i = 0; i < 5; i++) {
        const t = new THREE.Mesh(toothGeo, jawMat);
        t.position.set(0, 0.5, -0.8 + (i * 0.4));
        t.rotation.z = Math.PI / 4;
        rightJaw.add(t);
    }
    rightJaw.position.set(0.1, 0.1, 0);
    g.add(rightJaw);

    // Scale down slightly to fit tile
    g.scale.set(0.8, 0.8, 0.8);
    return g;
}

// --- 2. UPDATE TRAP ON TILE (Visual Sync) ---
function updateTrapVisuals(tile) {
    // Clean up old trap
    const oldTrap = tile.getObjectByName("BearTrap");
    if (oldTrap) tile.remove(oldTrap);

    // Add new trap if owner exists
    if (tile.userData.trapOwner !== undefined && tile.userData.trapOwner !== null) {
        const owner = players.find(p => String(p.id) === String(tile.userData.trapOwner));
        const color = owner ? owner.color : 0xffffff;

        const trap = createTrapMesh(color);
        trap.name = "BearTrap";
        trap.position.set(0, 0.3, 0); // Sit on top of tile

        // Open Jaws state
        const lj = trap.getObjectByName("LeftJaw");
        const rj = trap.getObjectByName("RightJaw");
        if (lj) lj.rotation.z = -1.2; // Open wide
        if (rj) rj.rotation.z = 1.2;  // Open wide

        tile.add(trap);
    }
}

// --- 3. ANIMATE SNAP ---
function animateTrapSpring(tile, callback) {
    const trap = tile.getObjectByName("BearTrap");
    if (!trap) { if (callback) callback(); return; }

    const lj = trap.getObjectByName("LeftJaw");
    const rj = trap.getObjectByName("RightJaw");

    // Play Sound
    AUDIO.playSound('sfx_hit'); // Clang sound

    // Animate Shut
    new TWEEN.Tween(lj.rotation).to({ z: 0 }, 150).easing(TWEEN.Easing.Bounce.Out).start();
    new TWEEN.Tween(rj.rotation).to({ z: 0 }, 150).easing(TWEEN.Easing.Bounce.Out).onComplete(() => {
        // Wait 1 second before removing visuals so player sees it closed
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
    }).start();
}

function checkForBonusLoot(p) {
    // Internal roll (1 in 6 chance)
    const roll = Math.floor(Math.random() * 6) + 1;

    if (roll === 6) {
        addLog(`${p.name} found hidden loot!`, "log-gold");

        // Draw Card
        const card = createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]);

        // AI Logic
        if (p.isAi) {
            if (!isMultiplayer || myPlayerId === 0) {
                handleAiLoot(p, card);
            }
            return;
        }

        // Human Logic -> Open Loot UI
        setTimeout(() => {
            drawCardAnim('treasure', () => presentLootUI(p, card));
        }, 500);

    } else {
        endStep();
    }
}

function createGuardMesh() {
    const g = new THREE.Group();
    // Simple low-poly guard
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5), new THREE.MeshStandardMaterial({ color: 0x555555 })); // Grey armor
    body.position.y = 0.25;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshStandardMaterial({ color: 0xffccaa }));
    head.position.y = 0.6;
    const helm = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    helm.position.y = 0.7;
    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), new THREE.MeshStandardMaterial({ color: 0x5d4037 }));
    spear.position.set(0.2, 0.4, 0);
    g.add(body, head, helm, spear);
    g.scale.set(0.8, 0.8, 0.8); // Make them smaller than players
    return g;
}

function capture(t, p, lvl, callback) {
    lvl = parseInt(lvl);

    // Disable interaction while capturing
    gameState = 'MOVING';
    updateHUD();

    // --- MULTIPLAYER LOGIC ---
    if (isMultiplayer && db && gameId) {
        if (p.id === myPlayerId) {
            const commitCapture = (stat) => {
                db.ref(`games/${gameId}/board/${t.userData.id}`).set({
                    owner: p.id,
                    level: lvl,
                    guardCount: t.userData.guardCount || 0,
                    defendingStat: stat
                });
                if (callback) setTimeout(callback, 1000);
            };

            if (lvl === 1) {
                // Wait for building animation (4s) then show choice
                setTimeout(() => {
                    chooseDefense(t, () => {
                        commitCapture(t.userData.defendingStat);
                    });
                }, 4000);
            } else {
                commitCapture(t.userData.defendingStat || 'str');
            }
            return;
        }
        // AI Host authority handled here...
        if (myPlayerId === 0 && p.isAi) {
            let defStat = 'str';
            if (p.stats.dex > p.stats.str) defStat = 'dex';
            if (p.stats.int > p.stats.dex) defStat = 'int';
            db.ref(`games/${gameId}/board/${t.userData.id}`).set({
                owner: p.id, level: lvl, guardCount: 0, defendingStat: defStat
            });
            if (callback) setTimeout(callback, 1000);
            return;
        }
    }

    // --- SINGLE PLAYER LOGIC ---
    t.userData.owner = p.id;
    t.userData.buildingLevel = lvl;
    applyCaptureVisuals(t, p, lvl); // This function handles the 4s animation

    if (p.id === 0) { // Local Human
        if (lvl === 1) {
            // Wait for building to finish growing, then ask for Stat
            setTimeout(() => chooseDefense(t, callback), 4000);
        } else {
            // Upgraded Tavern, just finish after animation
            setTimeout(() => { if (callback) callback(); else endStep(); }, 4000);
        }
    } else {
        // AI Logic
        const s = p.stats;
        t.userData.defendingStat = (s.str >= s.dex && s.str >= s.int) ? 'str' : (s.dex >= s.int ? 'dex' : 'int');
        setTimeout(() => { if (callback) callback(); else endStep(); }, 2000);
    }
}

// NEW FUNCTION: Handles the 3D graphics (Called by Capture OR DB Listener)
function applyCaptureVisuals(t, p, lvl) {
    lvl = parseInt(lvl);

    // 1. CLEANUP: Wipe old buildings and guards immediately
    if (t.userData.prop) {
        t.remove(t.userData.prop);
        t.userData.prop = null;
    }

    if (typeof activeGuards !== 'undefined') {
        activeGuards = activeGuards.filter(g => {
            if (g.tileId === t.userData.id) {
                if (g.mesh) {
                    if (g.mesh.parent) g.mesh.parent.remove(g.mesh);
                    scene.remove(g.mesh);
                }
                return false;
            }
            return true;
        });
    }

    // 2. STOP if destroyed (no owner)
    if (!p || t.userData.owner === null) return;

    // 3. CREATE THE BUILDING
    const g = new THREE.Group();
    const buildingMat = new THREE.MeshStandardMaterial({ color: p.color });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });

    if (lvl === 1) {
        const tent = new THREE.Mesh(new THREE.ConeGeometry(1, 1.5, 4), buildingMat);
        tent.position.set(0, 0.75, 0);
        tent.rotation.y = Math.PI / 4;
        tent.castShadow = true;
        g.add(tent);
    } else {
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), woodMat);
        base.position.set(0, 0.6, 0);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.2, 4), buildingMat);
        roof.position.set(0, 1.8, 0);
        roof.rotation.y = Math.PI / 4;
        g.add(base); g.add(roof);
    }

    // 4. SPAWN GUARDS
    const guardCount = t.userData.guardCount || 0;
    if (guardCount > 0) {
        for (let i = 0; i < guardCount; i++) {
            const guardMesh = createGuardMesh();
            const angle = (i / guardCount) * Math.PI * 2;
            const radius = 1.3;
            guardMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            g.add(guardMesh);
            activeGuards.push({ mesh: guardMesh, target: { x: guardMesh.position.x, z: guardMesh.position.z }, tileId: t.userData.id });
        }
    }

    // 5. ANIMATE BUILDING CONSTRUCTION
    g.scale.set(0.01, 0.01, 0.01);
    g.position.y = -2;
    t.add(g);
    t.userData.prop = g;

    new TWEEN.Tween(g.scale).to({ x: 1, y: 1, z: 1 }, 3000).easing(TWEEN.Easing.Elastic.Out).start();
    new TWEEN.Tween(g.position).to({ y: 0 }, 3000).easing(TWEEN.Easing.Quadratic.Out).start();

    // 6. HERO CELEBRATION DANCE (Only if player is actually there)
    if (p && p.mesh && p.pos === t.userData.id) {
        new TWEEN.Tween(p.mesh.position).to({ y: 1.8 }, 400).yoyo(true).repeat(7).easing(TWEEN.Easing.Quadratic.Out).start();
        new TWEEN.Tween(p.mesh.rotation).to({ y: p.mesh.rotation.y + (Math.PI * 8) }, 3200).easing(TWEEN.Easing.Quartic.InOut).start();
        if (p.id === myPlayerId) AUDIO.playSound('sfx_win');
    }
}
function chooseDefense(t, callback) {
    // This function runs while camera is still zoomed in

    const next = () => {
        if (callback) callback();
        else endStep(); // This triggers resetCamera()
    };

    showModal("Tactics", "Choose a stat to defend this location.", [
        { txt: "Strength (STR)", act: () => { t.userData.defendingStat = 'str'; addLog("Defense set to STR", "log-success"); next(); } },
        { txt: "Dexterity (DEX)", act: () => { t.userData.defendingStat = 'dex'; addLog("Defense set to DEX", "log-success"); next(); } },
        { txt: "Intelligence (INT)", act: () => { t.userData.defendingStat = 'int'; addLog("Defense set to INT", "log-success"); next(); } }
    ]);
}
function pay(p, amount, recipient) {
    // --- 1. APPLY RESISTANCE ---
    // Resistance lowers gold loss from abilities and rent
    let resistance = p.stats.resistance || 0;
    let afterResistance = Math.max(0, amount - resistance);

    if (resistance > 0 && amount > 0) {
        addLog(`${p.name}'s Resistance blocked ${amount - afterResistance}G loss!`, "log-success");
    }

    // --- 2. APPLY IRON SKIN ---
    // Flattened reduction of 20G
    let finalAmount = afterResistance;
    if (p.passiveSkillId === 'iron_skin' && finalAmount > 0) {
        const oldAmt = finalAmount;
        finalAmount = Math.max(0, finalAmount - 20);
        addLog(`Iron Skin reduced loss by ${oldAmt - finalAmount}G`, "log-rare");
    }

    // --- 3. MANA SHIELD SACRIFICE ---
    if (p.passiveSkillId === 'mana_shield' && p.gold < finalAmount && p.inventory.length > 0) {
        p.inventory.shift();
        addLog("Mana Shield: Item sacrificed to negate debt!", "log-epic");
        if (isMultiplayer) syncPlayerState();
        updateHUD();
        return;
    }

    // --- 4. EXECUTE PAYMENT ---
    p.gold -= finalAmount;

    if (p.gold < 0) {
        // Handle debt if player cannot afford finalAmount
        handleDebt(p, Math.abs(p.gold), recipient);
    }
    else {
        if (recipient) {
            // Apply recipient's Gold Find to income? 
            // Usually, Gold Find applies to "Loot" (Lucky coins/Bags), 
            // but we can add a small bonus here if you wish.
            recipient.gold += finalAmount;
            if (isMultiplayer && myPlayerId === 0) {
                db.ref(`games/${gameId}/players/${recipient.id}`).update({ gold: recipient.gold });
            }
        }
        else {
            treasuryGold += finalAmount;
            if (isMultiplayer && gameId && myPlayerId === 0) {
                db.ref(`games/${gameId}/treasury`).set(treasuryGold);
            }
        }

        if (finalAmount > 0) addLog(`${p.name} paid ${finalAmount}G`, "log-fail");

        if (isMultiplayer) syncPlayerState();
        updateHUD();
    }
    AUDIO.playSound('sfx_gold');
}
function handleDebt(p, debtAmount, recipient) {
    const ownedTiles = tiles.filter(t => String(t.userData.owner) === String(p.id));

    // Resurrection Check
    if (p.passiveSkillId === 'resurrection' && !p.resurrectionUsed && p.gold < 0 && ownedTiles.length === 0) {
        p.gold = 500;
        p.resurrectionUsed = true;
        if (!p.permBonuses) p.permBonuses = { str: 0, dex: 0, int: 0 };
        p.permBonuses.str -= 1;
        p.permBonuses.dex -= 1;
        p.permBonuses.int -= 1;
        recalcStats(p);
        addLog(`${p.name} RESURRECTED!`, "log-epic");
        updateHUD();
        if (isMultiplayer && (p.id === myPlayerId || myPlayerId === 0)) syncPlayerState();
        return;
    }

    // AI Logic
    if (p.isAi) {
        while (p.gold < 0 && ownedTiles.length > 0) {
            ownedTiles.sort((a, b) => b.userData.info.cost - a.userData.info.cost);
            const t = ownedTiles.shift();
            const val = Math.floor(t.userData.info.cost / 2);
            sellPropertyLogic(t, p, val);
            addLog(`${p.name} sold ${t.userData.info.name} for ${val}G.`, "log-fail");
        }

        if (p.gold < 0) {
            eliminatePlayer(p);
        } else {
            if (recipient) {
                recipient.gold += debtAmount;
                if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/players/${recipient.id}/gold`).set(recipient.gold);
            } else {
                treasuryGold += debtAmount;
                if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/treasury`).set(treasuryGold);
            }
            updateHUD();
            if (isMultiplayer && myPlayerId === 0) syncPlayerState();
        }
    }
    // Human Logic
    else {
        if (ownedTiles.length === 0) {
            eliminatePlayer(p);
        } else {
            showBankruptcyModal(p, debtAmount, recipient, ownedTiles);
        }
    }
}
function sellPropertyLogic(t, p, val) {
    p.gold += val;
    t.userData.owner = null;
    t.userData.buildingLevel = 0;
    t.userData.guardCount = 0;
    t.userData.defendingStat = null;

    if (t.userData.prop) {
        const prop = t.userData.prop;
        new TWEEN.Tween(prop.scale).to({ y: 0 }, 500).onComplete(() => {
            t.remove(prop);
        }).start();
        t.userData.prop = null;
    }

    if (typeof activeGuards !== 'undefined') {
        activeGuards = activeGuards.filter(g => {
            if (g.tileId === t.userData.id) {
                if (g.mesh) scene.remove(g.mesh);
                return false;
            }
            return true;
        });
    }

    if (isMultiplayer && (myPlayerId === 0 || p.id === myPlayerId)) {
        db.ref(`games/${gameId}/board/${t.userData.id}`).set({
            owner: null, level: 0, guardCount: 0
        });
    }
}

function setupMultiplayerListeners() {
    if (listenersActive) return;
    listenersActive = true;

    console.log("Setting up Host-Authoritative Listeners...");
    const connectionTime = Date.now();

    // ==========================================
    //  SECTION A: HOST LOGIC
    // ==========================================
    if (myPlayerId === 0) {
        db.ref(`games/${gameId}/request`).on('child_added', snap => {
            const req = snap.val();
            const reqKey = snap.key;
            if (!req) return;

            if (req.type === 'ROLL') {
                const p = players.find(pl => pl.id === req.pid);
                if (p && !p.isDead) { // Check Alive
                    // Update Timer immediately on action
                    db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);

                    let d1 = 0, d2 = 0, total = 0;
                    if (p.isPolymorphed) { d1 = 1; d2 = 0; total = 1; }
                    // TAX COLLECTOR FIX: MP Logic
                    else if (p.taxDebuff) {
                        d1 = Math.floor(Math.random() * 6) + 1;
                        d2 = 0;
                        total = d1;
                    }
                    else {
                        d1 = Math.floor(Math.random() * 6) + 1;
                        d2 = Math.floor(Math.random() * 6) + 1;
                        total = d1 + d2;
                        if (p.passiveSkillId && ABILITY_LIBRARY[p.passiveSkillId] && ABILITY_LIBRARY[p.passiveSkillId].name === "Shadow Step") total += 1;
                        if (activeEvents.some(e => e.data && e.data.id === 'weather_blizzard')) total = Math.max(1, total - 1);
                        if (activeEvents.some(e => e.data && e.data.id === 'weather_goldrain')) {
                            const bonus = total * 10;
                            p.gold += bonus;
                            db.ref(`games/${gameId}/players/${p.id}/gold`).set(p.gold);
                        }
                    }
                    db.ref(`games/${gameId}/moveHistory`).push({
                        pid: p.id, d1: d1, d2: d2, finalSteps: total, startPos: p.pos,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                }
                db.ref(`games/${gameId}/request/${reqKey}`).remove();
            }

            if (req.type === 'TILE_EVENT') {
                // Update Timer on interaction
                db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);

                const p = players.find(pl => pl.id === req.pid);
                // Safety: check p exists
                if (!p) { db.ref(`games/${gameId}/request/${reqKey}`).remove(); return; }

                const tile = tiles[req.tileIndex];
                const info = tile.userData.info;
                let eventData = { pid: req.pid, tileIndex: req.tileIndex, timestamp: firebase.database.ServerValue.TIMESTAMP, mode: 'normal' };

                const merchantEvent = activeEvents.find(e => e.data.type === 'merchant' && e.playerRef && e.playerRef.pos === req.tileIndex);
                if (merchantEvent) {
                    eventData.mode = 'shop';
                    let stock = [];
                    if (merchantEvent.data.id === 'merch_alchemist') stock = DECK_TREASURE.filter(it => it.type === 'scroll' && !it.name.includes('Gold'));
                    else if (merchantEvent.data.id === 'merch_armorer') stock = DECK_TREASURE.filter(it => ['head', 'body', 'off'].includes(it.slot) && !it.name.includes('Gold'));
                    else if (merchantEvent.data.id === 'merch_weaponsmith') stock = DECK_TREASURE.filter(it => it.slot === 'main' && !it.name.includes('Gold'));

                    const shopItems = [];
                    for (let k = 0; k < 3; k++) shopItems.push(serializeItem(createItemInstance(stock[Math.floor(Math.random() * stock.length)])));
                    eventData.items = shopItems;
                }
                else if (info.type === 'start' || info.type === 'shop') {
                    eventData.mode = 'shop';
                    const stock = DECK_TREASURE.filter(i => !i.name.includes('Gold'));
                    const shopItems = [];
                    for (let k = 0; k < 3; k++) shopItems.push(serializeItem(createItemInstance(stock[Math.floor(Math.random() * stock.length)])));
                    eventData.items = shopItems;
                }
                else if (info.type === 'goto') eventData.mode = 'goto';
                else if (info.type === 'jail') eventData.mode = 'jail';
                else if (info.type === 'park') eventData.mode = 'park';
                else if (info.type === 'tax') { eventData.mode = 'tax_card'; eventData.card = { cost: 50 }; }
                else if (info.type === 'chest') {
                    eventData.mode = 'loot';
                    eventData.card = serializeItem(createItemInstance(DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)]));
                }
                else if (info.type === 'mystery') {
                    eventData.mode = 'mystery_event';
                    eventData.card = JSON.parse(JSON.stringify((isNight ? DECK_SKIRMISH : DECK_ENCOUNTER)[Math.floor(Math.random() * 15)]));
                }
                else {
                    const ownerId = tile.userData.owner;
                    if (ownerId === req.pid) { eventData.mode = 'own_property'; eventData.card = { name: "Home", desc: "Manage your property." }; }
                    else if (ownerId !== null) { eventData.mode = 'enemy'; eventData.card = { name: "Siege or Pay", desc: "Choose your action." }; }
                    else {
                        eventData.mode = (isNight ? 'wild_skirmish' : 'wild');
                        eventData.card = JSON.parse(JSON.stringify((isNight ? DECK_SKIRMISH : DECK_ENCOUNTER)[Math.floor(Math.random() * 15)]));
                    }
                }

                db.ref(`games/${gameId}/currentEvent`).set(eventData);
                db.ref(`games/${gameId}/request/${reqKey}`).remove();
            }

            if (req.type === 'END_TURN') {
                const prevP = players[turnIndex];
                let nextIndex = turnIndex;

                if (prevP) {
                    if (prevP.isPolymorphed) { db.ref(`games/${gameId}/players/${prevP.id}`).update({ isPolymorphed: false }); }
                    if (prevP.extraTurn) { db.ref(`games/${gameId}/players/${prevP.id}/extraTurn`).set(false); }
                    else {
                        nextIndex = (turnIndex + 1) % players.length;
                        let safety = 0;
                        while (players[nextIndex].isDead && safety < 4) { nextIndex = (nextIndex + 1) % players.length; safety++; }
                    }
                }

                if (nextIndex === 0 && (!prevP || !prevP.extraTurn)) {
                    db.ref(`games/${gameId}/roundCount`).transaction(count => { return (count || 0) + 1; }, (error, committed, snapshot) => {
                        if (committed) {
                            const newCount = snapshot.val();
                            if (newCount > 0 && newCount % 10 === 0) {
                                db.ref(`games/${gameId}/isNight`).once('value', snap => { db.ref(`games/${gameId}/isNight`).set(!snap.val()); });
                            }
                            db.ref(`games/${gameId}/activeEvents`).once('value', snap => {
                                const events = snap.val() || {};
                                Object.keys(events).forEach(key => {
                                    const ev = events[key];
                                    const newDur = ev.turns - 1;
                                    if (newDur <= 0) {
                                        db.ref(`games/${gameId}/activeEvents/${key}`).remove();
                                        const evDef = MAP_EVENTS[ev.idx];
                                        if (evDef && ["Void Edge", "Vampire Manor", "Demon Gate", "Wyvern Peak"].includes(evDef.name)) {
                                            db.ref(`games/${gameId}/dungeonActive/${evDef.name}`).remove();
                                        }
                                    } else {
                                        db.ref(`games/${gameId}/activeEvents/${key}`).update({ turns: newDur });
                                    }
                                });

                                if (Math.floor(Math.random() * 6) + 1 === 6) {
                                    const idx = Math.floor(Math.random() * MAP_EVENTS.length);
                                    const newEvDef = MAP_EVENTS[idx];
                                    db.ref(`games/${gameId}/activeEvents`).push({ idx: idx, turns: newEvDef.duration, timestamp: firebase.database.ServerValue.TIMESTAMP });
                                    if (["Void Edge", "Vampire Manor", "Demon Gate", "Wyvern Peak"].includes(newEvDef.name)) {
                                        db.ref(`games/${gameId}/dungeonActive/${newEvDef.name}`).set({ type: newEvDef.name });
                                    }
                                }
                            });
                        }
                    });
                }

                db.ref(`games/${gameId}/turnTimer`).set(firebase.database.ServerValue.TIMESTAMP);
                db.ref(`games/${gameId}`).update({ turnIndex: nextIndex });
                db.ref(`games/${gameId}/request/${reqKey}`).remove();
            }
        });
    }

    // ==========================================
    //  SECTION B: CLIENT LOGIC
    // ==========================================

    db.ref(`games/${gameId}/moveHistory`).orderByChild('timestamp').startAt(connectionTime).on('child_added', snap => {
        const move = snap.val();
        if (!move) return;
        const p = players.find(pl => pl.id === move.pid);
        if (p) {
            p.pos = move.startPos;
            if (!p.inDungeon && tiles[p.pos]) p.mesh.position.copy(tiles[p.pos].position);
            addLog(`${p.name} rolled ${move.d1 + move.d2}.`);
            if (p.id === myPlayerId) AUDIO.playSound('sfx_roll');
            gameState = 'MOVING';
            animateMove(p, move.finalSteps);
        }
    });

    db.ref(`games/${gameId}/serverLogs`).orderByChild('timestamp').startAt(connectionTime).on('child_added', snap => {
        const val = snap.val();
        if (val) addLog(val.msg, val.type);
    });

    db.ref(`games/${gameId}/currentEvent`).on('value', snap => {
        const ev = snap.val();
        if (!ev) return;
        if (window.lastEventTimestamp && ev.timestamp <= window.lastEventTimestamp) return;
        window.lastEventTimestamp = ev.timestamp;

        const p = players.find(pl => pl.id === ev.pid);
        if (!p) return;
        const isMe = (p.id === myPlayerId);
        const isMyAi = (p.isAi && myPlayerId === 0);

        if (isMe || isMyAi) {
            const tile = tiles[ev.tileIndex];
            const info = tile.userData.info;
            if (ev.items) ev.items = ev.items.map(hydrateItem);
            if (ev.card) ev.card = hydrateItem(ev.card);

            if (p.isAi && myPlayerId === 0) {
                if (ev.mode === 'goto') {
                    if (p.passiveSkillId === 'smoke_bomb') addLog("Skeleton Key Used!", "log-epic");
                    else { p.pos = 10; p.mesh.position.copy(tiles[10].position); p.isSkipping = true; db.ref(`games/${gameId}/players/${p.id}`).update({ isSkipping: true }); }
                    endStep();
                }
                else if (ev.mode === 'park') { if (treasuryGold > 0) { p.gold += treasuryGold; treasuryGold = 0; updateHUD(); syncPlayerState(); } endStep(); }
                else if (ev.mode === 'jail') { if (p.passiveSkillId === 'skeleton_key' && p.gold >= 100) { p.gold -= 50; tile.userData.trapOwner = p.id; db.ref(`games/${gameId}/board/${tile.userData.id}/trapOwner`).set(p.id); } endStep(); }
                else if (ev.mode === 'tax_card') { processTax(p, ev.card ? ev.card.cost : 50); endStep(); }
                else if (ev.mode === 'own_property') { resolveAiEvent(p, null, tile, ev.mode, null); }
                else if (ev.mode === 'loot') { handleAiLoot(p, ev.card); }
                else { resolveAiEvent(p, ev.card, tile, ev.mode, ev.items); }
            }
            else {
                const executeNextStep = () => {
                    document.getElementById('arrival-modal').classList.remove('active');
                    if (activeDungeons && activeDungeons[info.name] && !p.inDungeon) { offerDungeonEntry(p, info.name); return; }
                    if (ev.mode === 'goto') {
                        if (p.passiveSkillId === 'smoke_bomb') { addLog("Skeleton Key Used!", "log-epic"); endStep(); }
                        else {
                            p.isSkipping = true;
                            db.ref(`games/${gameId}/players/${p.id}`).update({ isSkipping: true, pos: 10 });
                            addLog(`${p.name} sent to Dungeon!`, "log-fail");
                            db.ref(`games/${gameId}/teleportLog`).push({ pid: p.id, targetPos: 10, timestamp: firebase.database.ServerValue.TIMESTAMP });
                            setTimeout(() => { checkAndTriggerTrap(p, tiles[10], () => { endStep(); }); }, 1500);
                        }
                    }
                    else if (ev.mode === 'jail') { if (p.passiveSkillId === 'skeleton_key') offerSkeletonKeyTrap(p); else { addLog("Just visiting."); endStep(); } }
                    else if (ev.mode === 'park') { if (treasuryGold > 0) { p.gold += treasuryGold; addLog(`Won ${treasuryGold}G!`, "log-success"); treasuryGold = 0; updateHUD(); syncPlayerState(); } else addLog("Treasury empty."); endStep(); }
                    else if (ev.mode === 'tax_card') { const cost = ev.card ? ev.card.cost : 50; showModal("Royal Tax", "The King demands " + cost + "G.", [{ txt: `Pay ${cost}G`, act: () => { processTax(p, cost); syncPlayerState(); endStep(); } }]); }
                    else if (ev.mode === 'own_property') {
                        if (tile.userData.buildingLevel === 1) { showModal("Upgrade?", `Build Tavern ${info.cost * 2}G?`, [{ txt: "Upgrade", act: () => { if (p.gold >= info.cost * 2) { p.gold -= info.cost * 2; drawCardAnim('skirmish', () => showEncounter(p, info, tile, "upgrade")); } else { addLog("No Gold"); endStep(); } } }, { txt: "Skip", act: endStep }]); }
                        else { let guards = tile.userData.guardCount || 0; showModal("Manage Tavern", `Current Guards: ${guards}. Hire Bodyguard for 50G?`, [{ txt: "Hire Guard (50G)", act: () => { if (p.gold >= 50) { p.gold -= 50; tile.userData.guardCount = (tile.userData.guardCount || 0) + 1; p.metrics.guardsHired++; addLog("Guard Hired!", "log-gold"); updateHUD(); capture(tile, p, tile.userData.buildingLevel, () => endStep()); } else { addLog("Not enough Gold"); endStep(); } } }, { txt: "Rest (Skip)", act: endStep }]); }
                    }
                    else if (ev.mode === 'shop') openCustomShop(p, ev.items, info.name, () => endStep());
                    else if (ev.mode === 'loot') presentLootUI(p, ev.card);
                    else showEncounter(p, info, tile, ev.mode, ev.card);
                };

                const m = document.getElementById('arrival-modal');
                const imgEl = document.getElementById('arrival-image');
                const flavorEl = document.getElementById('arrival-flavor');
                const btn = m.querySelector('button.primary');
                const closeBtn = m.querySelector('.close-x');

                if (info.cardImg) { imgEl.src = info.cardImg; imgEl.style.display = 'block'; }
                else { imgEl.style.display = 'none'; }
                flavorEl.innerText = info.flavor || "You arrive at " + info.name + ".";

                btn.onclick = executeNextStep;
                if (closeBtn) closeBtn.onclick = executeNextStep; // --- FIX: SAFE CHECK ---

                m.classList.add('active');

                // Update Local Timer to avoid timeout while reading
                lastInteractionTime = Date.now();

                AUDIO.playSound('sfx_gold');
            }
        }
    });

    db.ref(`games/${gameId}/turnIndex`).on('value', snap => {
        const idx = snap.val();
        if (idx !== null && idx !== turnIndex) {
            turnIndex = idx;
            // Update Local Timer on Turn Start
            lastInteractionTime = Date.now();

            const curP = players[turnIndex];
            gameState = 'ROLL';
            updateHUD();
            if (curP) {
                if (curP.isSkipping) {
                    addLog(`${curP.name} is stunned/jailed and skips turn.`, "log-fail");
                    if (myPlayerId === 0) {
                        setTimeout(() => {
                            db.ref(`games/${gameId}/players/${curP.id}`).update({ isSkipping: false });
                            db.ref(`games/${gameId}/request`).push({ type: 'END_TURN', pid: curP.id });
                        }, 2000);
                    }
                    return;
                }
                zoomToPiece(curP);
                if (curP.id === myPlayerId) { addLog("Your Turn!"); AUDIO.playSound('sfx_transition'); }
                else { addLog(`${curP.name}'s Turn`); }
                if (curP.isAi && myPlayerId === 0) { setTimeout(() => { if (curP.inDungeon) advanceDungeon(curP); else db.ref(`games/${gameId}/request`).push({ type: 'ROLL', pid: curP.id }); }, 1500); }
            }
        }
    });

    db.ref(`games/${gameId}/players`).on('child_changed', snap => {
        const pData = snap.val();
        const pId = parseInt(snap.key);
        const p = players.find(pl => pl.id === pId);

        if (p && pData) {
            if (pData.gold !== undefined) p.gold = pData.gold;
            if (pData.stats !== undefined) p.stats = pData.stats;
            if (pData.permBonuses !== undefined) { p.permBonuses = pData.permBonuses; recalcStats(p); }
            if (pData.isDead !== undefined) { if (pData.isDead && !p.isDead) eliminatePlayer(p); p.isDead = pData.isDead; }
            if (pData.extraTurn !== undefined) p.extraTurn = pData.extraTurn;
            if (pData.isSkipping !== undefined) p.isSkipping = pData.isSkipping;
            if (pData.inDungeon !== undefined) p.inDungeon = pData.inDungeon;
            if (pData.dungeonType !== undefined) p.dungeonType = pData.dungeonType;
            if (pData.dungeonProgress !== undefined) p.dungeonProgress = pData.dungeonProgress;
            if (pData.bossAttempts !== undefined) p.bossAttempts = pData.bossAttempts;
            if (pData.pos !== undefined) { if (gameState !== 'MOVING' || p.id !== turnIndex) { p.pos = pData.pos; } }
            if (pData.isPolymorphed !== undefined) {
                if (p.isPolymorphed !== pData.isPolymorphed) {
                    if (pData.isPolymorphed) {
                        makeSheep(p);
                    } else {
                        cureSheep(p);
                    }
                }
            }
            // --- SYNC SANCTUARY POS (Visuals) ---
            if (pData.sanctuaryPos !== undefined) {
                p.sanctuaryPos = pData.sanctuaryPos;
                // If pos is set, create visual. If null, remove it.
                if (p.sanctuaryPos !== null && tiles[p.sanctuaryPos]) {
                    if (!p.sanctuaryMesh) {
                        p.sanctuaryMesh = createShrineMesh();
                        p.sanctuaryMesh.position.copy(tiles[p.sanctuaryPos].position);
                        scene.add(p.sanctuaryMesh);
                    } else {
                        p.sanctuaryMesh.position.copy(tiles[p.sanctuaryPos].position);
                    }
                } else {
                    if (p.sanctuaryMesh) {
                        scene.remove(p.sanctuaryMesh);
                        p.sanctuaryMesh = null;
                    }
                }
            }
            // --- SYNC INVENTORY & EQUIPMENT ---
            if (pData.inventory !== undefined) p.inventory = pData.inventory || [];
            if (pData.equipment !== undefined) {
                p.equipment = pData.equipment;
                recalcStats(p);
            }
            // ----------------------------------
            updateHUD();
        }
    });

    const boardHandler = (snap) => {
        const tileId = parseInt(snap.key);
        const data = snap.val();
        const tile = tiles[tileId];
        if (tile) {
            if (data.owner !== undefined) {
                const owner = players.find(p => p.id === data.owner);
                if (owner) {
                    tile.userData.owner = owner.id;
                    tile.userData.buildingLevel = parseInt(data.level);
                    tile.userData.guardCount = data.guardCount || 0;
                    tile.userData.defendingStat = data.defendingStat || 'str';
                    if (gameState === 'MOVING') setTimeout(() => applyCaptureVisuals(tile, owner, parseInt(data.level)), 3000);
                    else applyCaptureVisuals(tile, owner, parseInt(data.level));
                } else {
                    tile.userData.owner = null;
                    tile.userData.buildingLevel = 0;
                    tile.userData.guardCount = 0;
                    if (tile.userData.prop) { tile.remove(tile.userData.prop); tile.userData.prop = null; }
                    if (typeof activeGuards !== 'undefined') activeGuards = activeGuards.filter(g => g.tileId !== tile.userData.id);
                }
            }
            if (data.trapOwner !== undefined) tile.userData.trapOwner = data.trapOwner;
            else tile.userData.trapOwner = null;
            if (typeof updateTrapVisuals === 'function') updateTrapVisuals(tile);
        }
    };
    db.ref(`games/${gameId}/board`).on('child_added', boardHandler);
    db.ref(`games/${gameId}/board`).on('child_changed', boardHandler);

    db.ref(`games/${gameId}/teleportLog`).orderByChild('timestamp').startAt(connectionTime).on('child_added', snap => {
        const data = snap.val();
        if (!data) return;
        const p = players.find(pl => pl.id === data.pid);
        if (p) {
            const isDungeonMove = (data.targetPos === 999);
            let targetObj = null;
            if (isDungeonMove) {
                if (activeDungeons[p.dungeonType] && activeDungeons[p.dungeonType].tiles) {
                    const stepIndex = data.dungeonStep || 0;
                    targetObj = activeDungeons[p.dungeonType].tiles[stepIndex];
                } else return;
            } else {
                targetObj = tiles[data.targetPos];
                p.pos = data.targetPos;
            }
            if (!targetObj) return;
            addLog(isDungeonMove ? `${p.name} moves deeper...` : `${p.name} teleported!`, isDungeonMove ? "" : "log-epic");
            if (!isDungeonMove) AUDIO.playSound('sfx_transition');
            closeEnc();
            gameState = 'MOVING';
            animateTeleport(p, targetObj, () => {
                const isMe = (p.id === myPlayerId);
                const isMyAi = (p.isAi && myPlayerId === 0);
                const hasAuthority = isMe || isMyAi;
                if (isDungeonMove) {
                    if (hasAuthority) resolveDungeonStep(p);
                }
                else {
                    if (data.targetPos === 10) {
                        if (hasAuthority) checkAndTriggerTrap(p, tiles[10], () => endStep());
                    } else {
                        const info = tiles[data.targetPos] ? tiles[data.targetPos].userData.info : null;
                        if (info && info.type === 'mystery') {
                            addLog("Teleported safely.", "log-success");
                            if (hasAuthority) endStep();
                        } else {
                            if (hasAuthority) resolveLanding(p);
                        }
                    }
                }
            });
        }
    });

    db.ref(`games/${gameId}/dungeonActive`).on('child_added', snap => {
        const val = snap.val();
        if (val && val.type && !activeDungeons[val.type]) {
            spawnDungeonVisuals(val.type);
        }
    });
    db.ref(`games/${gameId}/dungeonActive`).on('child_removed', snap => {
        const key = snap.key;
        if (activeDungeons[key]) {
            if (activeDungeons[key].group) dungeonGroup.remove(activeDungeons[key].group);
            delete activeDungeons[key];
        }
    });

    db.ref(`games/${gameId}/isNight`).on('value', snap => {
        const val = snap.val();
        if (val !== null && val !== isNight) { isNight = val; updateEnvironmentVisuals(); updateHUD(); }
    });
    db.ref(`games/${gameId}/treasury`).on('value', snap => {
        treasuryGold = snap.val() || 0;
        updateHUD();
    });
    db.ref(`games/${gameId}/turnTimer`).on('value', snap => {
        lastInteractionTime = snap.val() || Date.now();
    });
    if (myPlayerId === 0) startHostTimerLoop();
    db.ref(`games/${gameId}/vfxLog`).orderByChild('timestamp').startAt(connectionTime).on('child_added', snap => {
        const data = snap.val();
        if (data && (Date.now() - data.timestamp < 5000)) VFX.trigger(data.type, data.start, data.end, data.color, true);
    });

    // --- BATTLE SYNC LISTENER ---
    db.ref(`games/${gameId}/battleState`).on('value', snap => {
        const val = snap.val();
        if (val && typeof handleRemoteBattleUpdate === 'function') {
            handleRemoteBattleUpdate(val);
        }
    });
}
// --- MP BATTLE SYNC ---
function handleRemoteBattleUpdate(state) {
    // If we are NOT in battle locally, or if the battle ID matches
    // Note: state should contain { isActive: bool, log: [], hp: num, maxHp: num, enemyHp: num, status: ... }

    if (!state) return;

    if (state.isActive) {
        // OPEN BATTLE UI if not open
        const battleUI = document.getElementById('battle-ui');
        if (battleUI.style.display !== 'flex') {
            // We need to know WHICH dungeon to show. 
            // Ideally state passes currentDungeon info or we infer it?
            // For now just show UI to prevent desync
            battleUI.style.display = 'flex';
        }

        // UPDATE LOGS
        // This is a simplified sync. A full sync requires broadcasting every log event.
        // If state has a 'lastLog' field?
        if (state.lastLog) {
            const battleLog = document.getElementById('battle-log');
            if (battleLog) {
                const d = document.createElement('div');
                d.innerText = state.lastLog;
                d.className = 'log-entry';
                battleLog.appendChild(d);
                battleLog.scrollTop = battleLog.scrollHeight;
            }
        }

        // UPDATE HP BARS (Visual Only)
        // We assume local 'activeBattle' might be null for spectators
        // If we are observing, we need to populate dummy activeBattle data?
        if (activeBattle && activeBattle.id === state.id) {
            // We are IN the battle (or spectating it if we set activeBattle for spectators)
            activeBattle.hp = state.hp;
            activeBattle.enemy.hp = state.enemyHp;
            updateBattleUI();
        }
    } else {
        // CLOSE BATTLE
        if (document.getElementById('battle-ui').style.display === 'flex') {
            closeBattle();
        }
    }
}

function showBankruptcyModal(p, originalDebt, recipient, ownedTiles) {
    const m = document.getElementById('bankruptcy-modal');
    const list = document.getElementById('debt-prop-list');
    const debtLabel = document.getElementById('debt-amount');
    const btn = document.getElementById('btn-debt-done');

    m.style.display = 'flex';

    // Helper to refresh the list of properties
    const refreshList = () => {
        debtLabel.innerText = Math.abs(p.gold); // Show current negative balance
        debtLabel.style.color = "#ef4444";

        list.innerHTML = '';
        // Re-fetch owned tiles
        const currentOwned = tiles.filter(t => t.userData.owner === p.id);

        // --- BUTTON STATE LOGIC ---
        if (p.gold >= 0) {
            // SOLVENT
            debtLabel.innerText = "PAID";
            debtLabel.style.color = "#10b981";
            btn.disabled = false;
            btn.style.backgroundColor = "#10b981";
            btn.style.color = "#fff";
            btn.innerText = "Debt Cleared - Continue";

            btn.onclick = () => {
                m.style.display = 'none';
                // Finalize Payment to recipient
                if (recipient) {
                    recipient.gold += originalDebt;
                    if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/players/${recipient.id}`).update({ gold: recipient.gold });
                } else {
                    treasuryGold += originalDebt;
                    if (isMultiplayer && myPlayerId === 0) db.ref(`games/${gameId}/treasury`).set(treasuryGold);
                }
                updateHUD();
                if (isMultiplayer) syncPlayerState();
            };
        }
        else if (currentOwned.length === 0) {
            // BANKRUPT (No properties left, still negative)
            btn.disabled = false;
            btn.style.backgroundColor = "#ef4444";
            btn.innerText = "Declare Bankruptcy (Game Over)";
            btn.onclick = () => {
                m.style.display = 'none';
                eliminatePlayer(p);
            };
        }
        else {
            // STILL IN DEBT
            btn.disabled = true;
            btn.style.backgroundColor = "#333";
            btn.innerText = `Sell ${Math.abs(p.gold)}G more value`;
        }

        // Render List
        currentOwned.forEach(t => {
            const val = Math.floor(t.userData.info.cost / 2);
            const row = document.createElement('div');
            row.className = 'choice-btn';
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.innerHTML = `<span>${t.userData.info.name}</span> <span style="color:var(--gold-main)">+${val}G</span>`;
            row.onclick = () => {
                sellPropertyLogic(t, p, val);
                updateHUD();
                if (isMultiplayer) syncPlayerState();
                refreshList();
            };
            list.appendChild(row);
        });
    };

    refreshList();
}
function eliminatePlayer(p) {
    p.isDead = true;

    // --- Inheritance (Resurrection) ---
    const inheritor = players.find(x => !x.isDead && x.id !== p.id && x.passiveSkillId === 'resurrection');
    if (inheritor && p.gold > 0) {
        const loot = Math.floor(p.gold * 0.5);
        inheritor.gold += loot;
        addLog(`${inheritor.name} inherits ${loot}G from ${p.name}.`, "log-epic");
        if (isMultiplayer && myPlayerId === 0) {
            db.ref(`games/${gameId}/players/${inheritor.id}/gold`).set(inheritor.gold);
        }
    }

    p.gold = 0;

    // --- Visual Removal ---
    if (p.mesh) {
        new TWEEN.Tween(p.mesh.scale).to({ x: 0, y: 0, z: 0 }, 1000).onComplete(() => {
            scene.remove(p.mesh);
        }).start();
    }

    // --- Clear Properties ---
    tiles.forEach(t => {
        if (String(t.userData.owner) === String(p.id)) {
            t.userData.owner = null;
            t.userData.buildingLevel = 0;
            t.userData.guardCount = 0;
            t.userData.defendingStat = null;

            if (t.userData.prop) {
                t.remove(t.userData.prop);
                t.userData.prop = null;
            }

            // Clean Guards
            if (typeof activeGuards !== 'undefined') {
                activeGuards = activeGuards.filter(g => {
                    if (g.tileId === t.userData.id) {
                        if (g.mesh) scene.remove(g.mesh);
                        return false;
                    }
                    return true;
                });
            }

            if (isMultiplayer && myPlayerId === 0) {
                db.ref(`games/${gameId}/board/${t.userData.id}`).set({
                    owner: null, level: 0, guardCount: 0
                });
            }
        }
    });

    addLog(`${p.name} has been ELIMINATED!`, "log-fail");

    if (isMultiplayer && (p.id === myPlayerId || myPlayerId === 0)) {
        db.ref(`games/${gameId}/players/${p.id}`).update({ isDead: true, gold: 0, pos: -1 });
    }

    updateHUD();

    if (p.id === myPlayerId) showGameOver(false);
    else checkWinCondition();
}
function checkWinCondition() { const livingAi = players.filter(pl => pl.isAi && !pl.isDead); const human = players[0]; if (livingAi.length === 0 && !human.isDead) { showGameOver(true); } }
function showGameOver(victory) {
    const m = document.getElementById('game-over-modal');
    const t = document.getElementById('go-title');
    const msg = document.getElementById('go-msg');
    const statsDiv = document.getElementById('go-stats');
    const legend = document.getElementById('graph-legend');

    m.style.display = 'flex';

    if (victory) {
        t.innerText = "VICTORY!"; t.style.color = "var(--gold)";
        msg.innerText = "You have defeated all rivals and conquered the realm!";
        AUDIO.playSound('sfx_win');
    } else {
        t.innerText = "DEFEAT"; t.style.color = "var(--accent)";
        msg.innerText = "You have lost everything. Your legend ends here.";
        AUDIO.playSound('sfx_fail');
    }

    // Populate Stats & Legend
    statsDiv.innerHTML = '';
    legend.innerHTML = '';

    players.forEach(p => {
        const camps = tiles.filter(tile => tile.userData.owner === p.id && tile.userData.buildingLevel === 1).length;
        const taverns = tiles.filter(tile => tile.userData.owner === p.id && tile.userData.buildingLevel === 2).length;

        // Stats Row
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <span style="color:${p.color}; font-weight:bold;">${p.name}</span>
            <span>💰${p.gold} | ⛺${camps} | 🍺${taverns} | ⚔️${p.metrics.successfulSieges}</span>
        `;
        statsDiv.appendChild(row);

        // Legend Item
        const li = document.createElement('div');
        li.className = 'legend-item';
        li.innerHTML = `<div class="legend-box" style="background:${p.color}"></div> ${p.name}`;
        legend.appendChild(li);
    });
}
function resetGame() {
    // Hide Modals
    document.getElementById('game-over-modal').style.display = 'none';
    document.getElementById('bankruptcy-modal').style.display = 'none';

    // Remove Player Meshes
    players.forEach(p => scene.remove(p.mesh));
    players = [];

    // Reset Board Tiles
    tiles.forEach(t => {
        t.userData.owner = null;
        t.userData.buildingLevel = 0;
        t.userData.guardCount = 0;
        t.userData.defendingStat = null; // Clear defense stat
        if (t.userData.prop) {
            t.remove(t.userData.prop);
            t.userData.prop = null;
        }
    });

    // Reset Global Variables
    turnIndex = 0;
    turnCount = 0;
    isNight = false;
    treasuryGold = 0;
    gameState = 'SETUP';

    // Reset Environment
    const fogColor = 0xcccccc;
    scene.background = new THREE.Color(fogColor);

    // --- FIX: Clear Game Log ---
    const log = document.getElementById('game-log');
    if (log) log.innerHTML = '';
    // ---------------------------

    // Show Character Creation
    document.getElementById('create-screen').style.display = 'flex';
}

// --- REGION 6: UI UPDATES & INTERACTION ---
// SAFE UPDATE FUNCTION (CRASH FIX)

// Add this to your script section
function switchHelpTab(tabId) {
    // 1. Hide all Content Sections
    const sections = document.querySelectorAll('.help-section');
    sections.forEach(s => s.classList.remove('active'));

    // 2. Show the Target Section
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    // 3. Update Tab Buttons (Visual State)
    const buttons = document.querySelectorAll('.help-tab');
    buttons.forEach(b => {
        b.classList.remove('active');
        // Check data-tab attribute for robust matching
        if (b.getAttribute('data-tab') === tabId) {
            b.classList.add('active');
        }
    });
}

function addLog(m, c) {
    const l = document.getElementById('game-log');
    if (!l) return;

    let d = document.createElement('div');
    d.className = 'log-entry ' + (c || '');
    d.innerText = '> ' + m;

    // CHANGED: Append to bottom instead of insertBefore
    l.appendChild(d);

    // CHANGED: Auto-scroll to the bottom to show new message
    l.scrollTop = l.scrollHeight;
}

// --- NEW HELPER: LONG PRESS TO SELL ---
function setupLongPressSell(element, identifier, source) {
    let pressTimer;

    element.addEventListener('touchstart', (e) => {
        // Start a timer when touch begins
        pressTimer = setTimeout(() => {
            const sellArea = document.getElementById('market-sell-area');
            const modal = document.getElementById('card-modal');

            // Only trigger if Modal is Active AND Sell Area is visible (Merchant)
            if (modal.classList.contains('active') && sellArea && sellArea.style.display !== 'none') {
                sellItem(identifier, source);
                if (navigator.vibrate) navigator.vibrate(50); // Little vibration for feedback
            }
        }, 600); // 600ms hold time
        hideTooltip();
    }, { passive: true });

    // Cancel timer if finger moves (scrolling) or lifts up
    const clearTimer = () => clearTimeout(pressTimer);
    element.addEventListener('touchend', clearTimer);
    element.addEventListener('touchmove', clearTimer);
    element.addEventListener('touchcancel', clearTimer);
}

function setupItemInteractions(element, index, source) {
    // 1. Target Local Player
    const p = players.find(pl => pl.id === myPlayerId);
    if (!p) return;

    const item = (source === 'inv') ? p.inventory[index] : p.equipment[index];

    // Reset handlers
    element.onclick = null;
    element.oncontextmenu = null;
    element.ondblclick = null;
    element.onmouseenter = null;
    element.onmouseleave = null;
    element.onpointerup = null;
    element.ontouchstart = null;
    element.ontouchend = null;

    // Hover -> Tooltip
    if (item) {
        element.onmouseenter = () => showTooltip(item);
        element.onmouseleave = hideTooltip;
    }

    // Right Click -> Context Menu
    element.oncontextmenu = (e) => {
        e.preventDefault();
        // Pass myPlayerId context implicitly handled by handleContextOpen logic (updated below)
        if (item) handleContextOpen(e, index, source);
    };

    // Double Click -> Equip/Unequip
    element.ondblclick = (e) => {
        e.preventDefault();
        hideTooltip();
        // Pass myPlayerId instead of 0
        if (source === 'inv' && item) equipItem(myPlayerId, index);
        else if (source === 'equip' && item) unequipItem(index);
    };

    // Single Click (Backup)
    element.onclick = (e) => {
        if (item) showTooltip(item);
    };

    // --- TOUCH LOGIC (Long Press / Double Tap) ---
    let pressTimer;
    let lastTap = 0;

    element.ontouchstart = (e) => {
        pressTimer = setTimeout(() => {
            if (item) {
                handleContextOpen(e, index, source);
                if (navigator.vibrate) navigator.vibrate(50);
            }
        }, 600);
    };

    element.ontouchend = (e) => {
        clearTimeout(pressTimer);
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            hideTooltip();
            if (source === 'inv' && item) equipItem(myPlayerId, index);
            else if (source === 'equip' && item) unequipItem(index);
            lastTap = 0;
        } else {
            if (item) showTooltip(item);
            lastTap = currentTime;
        }
    };

    element.ontouchmove = () => clearTimeout(pressTimer);
    element.ontouchcancel = () => clearTimeout(pressTimer);
}

function globalLog(msg, type) {
    if (typeof isMultiplayer !== 'undefined' && isMultiplayer && gameId && db) {
        db.ref(`games/${gameId}/serverLogs`).push({
            msg: msg,
            type: type || '',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    } else {
        addLog(msg, type);
    }
}

function updateHUD() {
    if (players.length === 0) return;

    // 1. Identify Local Player (Your Hero)
    const p = players.find(pl => pl.id === myPlayerId) || players[0];
    if (!p) return;

    // 2. Main Stat Widgets & Sidebar Header
    setT('p1-name', p.name);
    setT('p1-gold', p.gold);
    setT('p1-str', p.stats.str);
    setT('p1-dex', p.stats.dex);
    setT('p1-int', p.stats.int);
    setT('p1-class', (p.race ? p.race.name : "") + " " + (p.class ? p.class.name : ""));

    // Treasury & Player Stats Widget
    setT('treasury-val', treasuryGold);
    const myOwned = tiles.filter(t => t.userData.owner == myPlayerId);
    setT('ms-gold', p.gold);
    setT('ms-camps', myOwned.filter(t => t.userData.buildingLevel == 1).length);
    setT('ms-taverns', myOwned.filter(t => t.userData.buildingLevel == 2).length);

    // Portrait
    const elPortrait = document.getElementById('p1-portrait');
    if (elPortrait) {
        const imgToShow = p.avatar || p.portrait;
        if (imgToShow) {
            elPortrait.style.backgroundImage = `url('${imgToShow}')`;
            elPortrait.style.backgroundColor = "transparent";
        } else {
            elPortrait.style.backgroundColor = p.color || "var(--gold-main)";
        }
    }

    // Turn Info
    setT('day-night-indicator', isNight ? "☾ NIGHT" : "☀ DAY");
    const elDayNight = document.getElementById('day-night-indicator');
    if (elDayNight) { elDayNight.style.color = isNight ? "#a855f7" : "#87ceeb"; }

    const curTurnPlayer = players[turnIndex];
    if (curTurnPlayer) {
        setT('turn-banner', curTurnPlayer.id === myPlayerId ? "YOUR TURN" : `${curTurnPlayer.name}'S TURN`);
        const btnAction = document.getElementById('btn-action');
        if (btnAction) {
            btnAction.disabled = (curTurnPlayer.id !== myPlayerId);
            if (curTurnPlayer.id === myPlayerId) {
                if (gameState === 'ROLL') {
                    btnAction.innerText = "ROLL";
                    btnAction.classList.remove('state-end');
                } else if (gameState === 'END') {
                    btnAction.innerText = "END TURN";
                    btnAction.classList.add('state-end');
                }
            } else {
                btnAction.innerText = isMultiplayer ? "WAITING" : "AI TURN";
                btnAction.classList.remove('state-end');
            }
        }
    }

    // --- GRID UPDATES (Blocked while moving to prevent icon vanishing) ---
    if (gameState === 'MOVING') return;

    // 1. Skill Bar (Slots 1-6)
    for (let i = 0; i < 6; i++) {
        const el = document.getElementById(`skill-${i}`);
        const txt = document.getElementById(`txt-skill-${i}`);
        if (!el || !txt) continue;

        const skill = p.assignedSkills[i];
        el.style.backgroundImage = 'none';

        if (skill) {
            // SCHOLAR LOGIC: Check depletion flag based on slot type
            let isDepleted = false;
            if (skill.isClass) {
                isDepleted = skill.isSecondClass ? p.classSkill2Depleted : p.classSkillDepleted;
            } else {
                isDepleted = skill.ref?.isDepleted || false;
            }

            // FIX: Resolve Name/Image for Ancient Items (String IDs)
            let displayName = skill.name;
            let displayImg = skill.img;

            if (skill.ref && typeof skill.ref.ability === 'string') {
                const libEntry = ABILITY_LIBRARY[skill.ref.ability];
                if (libEntry) {
                    if (!displayName) displayName = libEntry.name;
                    if (!displayImg) displayImg = libEntry.img;
                }
            }
            if (!displayName) displayName = "Unknown";

            // CHECK FOR BATTLE COOLDOWNS
            let battleCooldown = 0;
            if (activeBattle && activeBattle.cooldowns) {
                battleCooldown = activeBattle.cooldowns[i] || 0;
            }

            // Apply visual state
            if (battleCooldown > 0) {
                // Skill is on cooldown in battle
                el.style.opacity = "0.4";
                el.style.filter = "grayscale(1)";
                txt.innerText = `${battleCooldown}`;
            } else if (isDepleted) {
                // Skill is depleted (overworld)
                el.style.opacity = "0.4";
                el.style.filter = "none";
                txt.innerText = "RECHARGE";
            } else {
                // Skill is ready
                el.style.opacity = "1";
                el.style.filter = "none";
                txt.innerText = displayName;
            }

            if (displayImg) el.style.backgroundImage = `url('${displayImg}')`;

            el.onclick = (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                useSkill(i);
            };
            el.oncontextmenu = (e) => { e.preventDefault(); openSkillPicker(i); };
            el.onmouseenter = () => showTooltip(skill.id || skill, !!skill.id);
            el.onmouseleave = () => { document.getElementById('tooltip').style.display = 'none'; };
        } else {
            txt.innerText = (i === 0) ? "CLASS" : "EMPTY";
            el.style.opacity = "0.2";
            el.oncontextmenu = (e) => { e.preventDefault(); openSkillPicker(i); };
            el.onclick = () => { if (p.id === myPlayerId) openSkillPicker(i); };
            el.onmouseenter = null;
            el.onmouseleave = null;
        }
    }

    // 2. Paper Doll (Sidebar & Character Modal)
    EQUIP_ORDER.forEach((slotName) => {
        const elements = [document.getElementById('slot-' + slotName), document.getElementById('cd-slot-' + slotName)];
        elements.forEach(el => {
            if (!el) return;
            const item = p.equipment[slotName];
            el.style.backgroundImage = 'none';
            if (item) {
                el.classList.add('filled', 'rarity-' + (item.rarity || 'common'));
                el.style.backgroundImage = `url('${item.img}')`;
                el.innerText = "";
            } else {
                el.classList.remove('filled', 'rarity-common', 'rarity-rare', 'rarity-epic', 'rarity-legendary');
                el.innerText = slotName.replace('_', ' ').toUpperCase();
            }
            if (p.id === myPlayerId) setupItemInteractions(el, slotName, 'equip');
        });
    });

    // 3. Inventory Grids
    const invDiv = document.getElementById('p1-inv');
    const modalInvDiv = document.getElementById('cd-inv-grid-new');
    [invDiv, modalInvDiv].forEach(container => {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            let d = document.createElement('div');
            d.className = 'inv-slot';
            const item = p.inventory[i];
            if (item) {
                d.classList.add('rarity-' + (item.rarity || 'common'));
                d.style.backgroundImage = `url('${item.img}')`;
                if (p.id === myPlayerId) setupItemInteractions(d, i, 'inv');
            }
            container.appendChild(d);
        }
    });

    // 4. Leaderboard
    const lb = document.getElementById('leader-list');
    if (lb) {
        lb.innerHTML = '';
        players.forEach(pl => {
            let d = document.createElement('div');
            d.className = 'leader-row' + (pl.isDead ? ' dead' : (pl.isBoss ? ' boss' : ''));
            const camps = tiles.filter(t => t.userData.owner == pl.id && t.userData.buildingLevel == 1).length;
            const taverns = tiles.filter(t => t.userData.owner == pl.id && t.userData.buildingLevel == 2).length;
            d.innerHTML = `
                <span style="color:${pl.color}; cursor:pointer;" onclick="openCharDetail(${pl.id})">${pl.name}</span>
                <div style="display:flex; gap:8px; align-items:center;">
                    <span style="font-size:0.8rem; opacity:0.7;">⛺${camps} 🍺${taverns}</span>
                    <span style="font-weight:bold;">${pl.isDead ? "OUT" : pl.gold + "G"}</span>
                </div>`;
            lb.appendChild(d);
        });
    }

    // 5. Secondary Stats Labels
    // Ensure stats are up to date (handles modifiers like Polymorph)
    recalcStats(p);

    setT('p1-move', "+" + (p.stats.movementBonus || 0));
    setT('p1-gf', "+" + (p.stats.goldFind || 0));
    setT('p1-res', (p.stats.resistance || 0));

    // Derived stats are now populated by recalcStats
    setT('p1-health', p.stats.maxHealth || 10);
    setT('p1-dodge', (p.stats.dodgeRate || 0) + "%");
    setT('p1-mana-surge', (p.stats.manaSurge || 0) + "%");
}

function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // UPDATED: Now looks for .char-header (P1) OR .leader-header (Leaderboard) OR h3 (Mobile fallback)
    const header = elmnt.querySelector('.char-header') || elmnt.querySelector('.leader-header') || elmnt.querySelector('.dm-header') || elmnt.querySelector('h3');

    if (header) {
        header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        // IMPORTANT: Unset 'right' so the 'left' property takes priority allows movement
        elmnt.style.right = 'auto';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function setT(id, t) { let e = document.getElementById(id); if (e) e.innerText = t; }
function handleContextOpen(e, identifier, source = 'inv') {
    const p = players.find(pl => pl.id === myPlayerId);
    if (!p) return;

    let item = (source === 'equip') ? p.equipment[identifier] : p.inventory[identifier];
    if (!item) return;

    const menu = document.getElementById('context-menu');
    menu.style.pointerEvents = 'auto';
    menu.innerHTML = '';

    const sellPrice = Math.floor((item.cost || 0) / 2);

    const createItem = (text, onClick, disabled = false) => {
        const div = document.createElement('div');
        div.className = 'ctx-item' + (disabled ? ' disabled' : '');
        div.innerText = text;
        if (!disabled) {
            div.onclick = (ev) => { ev.stopPropagation(); onClick(); closeCtx(); };
        }
        menu.appendChild(div);
    };

    if (source === 'equip') createItem('Unequip Item', () => unequipItem(identifier));
    // Pass myPlayerId to equipItem
    else createItem(item.type === 'scroll' ? 'Use Scroll' : 'Equip Item', () => equipItem(myPlayerId, identifier));

    createItem(`Sell (${sellPrice}G)`, () => sellItem(identifier, source), false);
    createItem('Cancel', () => { });

    let x = e.touches ? e.touches[0].clientX : e.clientX;
    let y = e.touches ? e.touches[0].clientY : e.clientY;
    if (x + 150 > window.innerWidth) x = window.innerWidth - 160;
    if (y + 150 > window.innerHeight) y = window.innerHeight - 160;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'flex';
}
function closeCtx() { document.getElementById('context-menu').style.display = 'none'; }
function togglePanel(id) { const panel = document.getElementById(id); if (!panel) return; panel.classList.toggle('minimized'); const btn = panel.querySelector('.minimize-btn'); if (btn) btn.innerText = panel.classList.contains('minimized') ? "+" : "-"; }
function toggleCreatorPortrait() { const el = document.getElementById('creator-portrait-frame'); const btn = document.getElementById('btn-min-portrait'); if (!el || !btn) return; el.classList.toggle('minimized'); btn.innerText = el.classList.contains('minimized') ? "+" : "-"; }


function showModal(t, d, o) {
    // MODAL STACKING: Check if active
    if (document.getElementById('card-modal').classList.contains('active')) {
        modalQueue.push(() => showModal(t, d, o));
        return;
    }

    const m = document.getElementById('card-modal');

    // Set Title
    setT('enc-title', t);
    setT('enc-desc', d);

    // Ensure header is styled generally (not red/green/brown)
    document.getElementById('enc-header').className = 'card-header';

    const l = document.getElementById('choice-list');
    l.innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';

    // Hide sell area if visible
    const sell = document.getElementById('market-sell-area');
    if (sell) sell.style.display = 'none';

    o.forEach(x => {
        let b = document.createElement('div');
        b.className = 'choice-btn';
        b.innerText = x.txt;
        b.onclick = () => {
            // Don't close immediately if action handles it (like paying tax which calls endStep)
            // But usually we close modal to prevent double clicks
            m.classList.remove('active');
            x.act();
        };
        l.appendChild(b);
    });

    m.classList.add('active');
}
function openCharDetail(id) {
    const p = players.find(pl => pl.id === id);
    if (!p) return;

    // DEBUG: Check for shared reference
    const me = players[myPlayerId];
    const isShared = (me && p !== me && p.equipment === me.equipment);
    console.log(`OpenSheet: ID=${id} Name=${p.name} IsMe=${p.id === myPlayerId} SharedRef=${isShared}`);
    console.log(`EquipDump:`, JSON.stringify(p.equipment));

    recalcStats(p);

    const modal = document.getElementById('char-detail-modal');
    const container = modal.querySelector('.modal-content');
    const isMe = (p.id === myPlayerId);

    container.innerHTML = `
        <div class="close-x" onclick="closeCharDetail()">×</div>
        <div class="cs-header-bg">
            <div class="cs-portrait" style="background-image: url('${p.portrait}')"></div>
            <div class="cs-info">
                <div class="cs-name">${p.name}</div>
                <div class="cs-class">${p.race.name} ${p.class.name}</div>
            </div>
        </div>

        <div class="sheet-scroll-area">
            <div class="cs-main-stats">
                <div class="cs-stat-orb"><span class="cs-stat-val">${p.stats.str}</span><span class="cs-stat-label">STR</span></div>
                <div class="cs-stat-orb"><span class="cs-stat-val">${p.stats.dex}</span><span class="cs-stat-label">DEX</span></div>
                <div class="cs-stat-orb"><span class="cs-stat-val">${p.stats.int}</span><span class="cs-stat-label">INT</span></div>
            </div>

            <div class="sec-stat-row">
                <div class="sec-stat-box" onmouseenter="showStatTooltip('mov')" onmouseleave="hideTooltip()" onclick="showStatTooltip('mov')">
                    <span class="sec-stat-lbl">MOV:</span> 
                    <span class="sec-stat-val">+${p.stats.movementBonus || 0}</span>
                </div>
                <div class="sec-stat-box" onmouseenter="showStatTooltip('gf')" onmouseleave="hideTooltip()" onclick="showStatTooltip('gf')">
                    <span class="sec-stat-lbl">G-FIND:</span> 
                    <span class="sec-stat-val">+${p.stats.goldFind || 0}</span>
                </div>
                <div class="sec-stat-box" onmouseenter="showStatTooltip('res')" onmouseleave="hideTooltip()" onclick="showStatTooltip('res')">
                    <span class="sec-stat-lbl">RESIST:</span> 
                    <span class="sec-stat-val">${p.stats.resistance || 0}</span>
                </div>
            </div>
            <div class="sec-stat-row" style="margin-top: 5px;">
                <div class="sec-stat-box" onmouseenter="showStatTooltip('hp')" onmouseleave="hideTooltip()" onclick="showStatTooltip('hp')">
                    <span class="sec-stat-lbl">HP:</span> 
                    <span class="sec-stat-val">${p.stats.maxHealth || 10}</span>
                </div>
                <div class="sec-stat-box" onmouseenter="showStatTooltip('dodge')" onmouseleave="hideTooltip()" onclick="showStatTooltip('dodge')">
                    <span class="sec-stat-lbl">DODGE:</span> 
                    <span class="sec-stat-val">${p.stats.dodgeRate || 0}%</span>
                </div>
                <div class="sec-stat-box" onmouseenter="showStatTooltip('mana')" onmouseleave="hideTooltip()" onclick="showStatTooltip('mana')">
                    <span class="sec-stat-lbl">MANA SURGE:</span> 
                    <span class="sec-stat-val">${p.stats.manaSurge || 0}%</span>
                </div>
            </div>

            <div style="padding: 15px;">
                <div class="paper-doll-container">
                    <div class="doll-placement doll-img" style="top: 5%; left: 22%; width: 56%; height: 70%;"></div>
                    <div id="modal-slot-head" class="doll-placement doll-slot" style="top: 5%; left: 5%;">HEAD</div>
                    <div id="modal-slot-body" class="doll-placement doll-slot" style="top: 25%; left: 5%;">BODY</div>
                    <div id="modal-slot-main" class="doll-placement doll-slot" style="top: 45%; left: 5%;">MAIN</div>
                    <div id="modal-slot-feet" class="doll-placement doll-slot" style="top: 65%; left: 5%;">FEET</div>
                    <div id="modal-slot-back"   class="doll-placement doll-slot" style="top: 5%; right: 5%;">BACK</div>
                    <div id="modal-slot-amulet" class="doll-placement doll-slot" style="top: 25%; right: 5%;">AMULET</div>
                    <div id="modal-slot-ring_l" class="doll-placement doll-slot" style="top: 45%; right: 5%;">RING L</div>
                    <div id="modal-slot-ring_r" class="doll-placement doll-slot" style="top: 65%; right: 5%;">RING R</div>
                    <div id="modal-slot-hands" class="doll-placement doll-slot" style="bottom: 5%; left: 25%;">HANDS</div>
                    <div id="modal-slot-off"   class="doll-placement doll-slot" style="bottom: 5%; right: 25%;">OFF</div>
                </div>

                ${isMe ? `<button class="hero-sheet-skill-btn" onclick="openSkillPicker(0)">⚡ MANAGE SKILLS</button>` : ''}
                
                <div style="margin-top:20px; font-size:0.9rem; color:var(--gold-main); font-family:var(--font-head); border-bottom:1px solid #333; padding-bottom:5px;">INVENTORY</div>
                <div id="modal-inv-grid" class="inv-grid" style="margin-top:10px;"></div>
            </div>
        </div>
    `;

    // 2. Attach Listeners to Equipment Slots
    EQUIP_ORDER.forEach(slot => {
        const item = p.equipment[slot];
        const slotEl = document.getElementById('modal-slot-' + slot);
        if (slotEl) {
            console.log(`Slot ${slot}: Item=${item ? item.name : 'NULL'} ElFound=YES`);
            if (item) {
                slotEl.classList.add('filled', 'rarity-' + (item.rarity || 'common'));
                slotEl.style.backgroundImage = `url('${item.img}')`;
                slotEl.innerText = "";
                // If it's my sheet, allow full interaction. If not, only tooltips.
                if (isMe) {
                    setupItemInteractions(slotEl, slot, 'equip');
                } else {
                    slotEl.onmouseenter = () => showTooltip(item);
                    slotEl.onmouseleave = hideTooltip;
                }
            } else {
                // EXPLICITLY CLEAR EMPTY SLOTS
                slotEl.classList.remove('filled', 'rarity-common', 'rarity-rare', 'rarity-epic', 'rarity-legendary');
                slotEl.style.backgroundImage = '';
                slotEl.innerText = slot.toUpperCase();
                slotEl.onmouseenter = null;
                slotEl.onmouseleave = null;
            }
        }
    });

    // 3. Attach Listeners to Inventory
    const invGrid = document.getElementById('modal-inv-grid');
    if (invGrid) {
        invGrid.innerHTML = '';
        console.log(`InvGrid found. Items=${p.inventory.length}`);
        p.inventory.forEach((item, i) => {
            // Logic below handles creating checked items...
        });
        // RE-IMPLEMENT LOOP to support the logic properly
        for (let i = 0; i < 12; i++) {
            let d = document.createElement('div');
            d.className = 'inv-slot';
            const item = p.inventory[i];
            if (item) {
                d.classList.add('rarity-' + (item.rarity || 'common'));
                d.style.backgroundImage = `url('${item.img}')`;
                d.innerText = "";
                // Interaction check
                if (isMe) {
                    setupItemInteractions(d, i, 'inv');
                } else {
                    d.onmouseenter = () => showTooltip(item);
                    d.onmouseleave = hideTooltip;
                }
            }
            invGrid.appendChild(d);
        }
    }
    modal.classList.add('active');
    updateHUD();
}
//if(invSection) invSection.style.display = 'block'; if(hiddenMsg) hiddenMsg.style.display = 'none'; ['head','body','main','off'].forEach(slot => { const item = p.equipment[slot]; const el = document.getElementById('cd-slot-'+slot); if(el) { el.innerHTML = item ? item.name : slot.toUpperCase(); el.className = 'equip-slot' + (item ? ' filled' : ''); if(item) { el.onmouseenter = () => showTooltip(item); el.onmouseleave = hideTooltip; } else { el.onmouseenter = null; } } }); const grid = document.getElementById('cd-inv-grid'); if(grid) { grid.innerHTML = ''; p.inventory.forEach(item => { let d = document.createElement('div'); d.className = 'inv-slot'; d.innerText = item.name; d.classList.add('rarity-' + item.rarity); d.onmouseenter = () => showTooltip(item); d.onmouseleave = hideTooltip; grid.appendChild(d); }); for(let i=p.inventory.length; i<12; i++) { let d = document.createElement('div'); d.className = 'inv-slot'; grid.appendChild(d); } } } else { if(invSection) invSection.style.display = 'none'; if(hiddenMsg) hiddenMsg.style.display = 'block'; } const modal = document.getElementById('char-detail-modal'); if(modal) modal.classList.add('active'); }
function closeCharDetail() { document.getElementById('char-detail-modal').classList.remove('active'); hideTooltip(); }
function getRarityColor(r) { if (r === 'common') return '#fff'; if (r === 'rare') return '#3b82f6'; if (r === 'epic') return '#a855f7'; return '#f59e0b'; }
function showTooltip(data, isSkillId = false) {
    if (!data) return;
    const tt = document.getElementById('tooltip');
    let html = '';
    let imgSrc = '';

    if (isSkillId) {
        const s = ABILITY_LIBRARY[data];
        if (!s) return;
        if (s.img) imgSrc = `<img src="${s.img}" class="tt-icon">`;
        html = `<div class="tt-header" style="display:flex; align-items:center;">${imgSrc}<div><span class="tt-name">${s.name}</span><br><span class="tt-rarity">${s.type || 'Active'}</span></div></div><div class="tt-abil" style="border:none;">${s.desc}</div>`;
    } else {
        const col = getRarityColor(data.rarity || 'common');

        // Find Image
        if (data.ability) {
            const libSkill = Object.values(ABILITY_LIBRARY).find(s => s.name === data.ability.name);
            if (libSkill && libSkill.img) imgSrc = `<img src="${libSkill.img}" class="tt-icon">`;
            else if (data.img) imgSrc = `<img src="${data.img}" class="tt-icon">`;
        } else if (data.img) {
            imgSrc = `<img src="${data.img}" class="tt-icon">`;
        }

        html = `<div class="tt-header" style="display:flex; align-items:center;">${imgSrc}<div><span class="tt-name" style="color:${col}">${data.name}</span><br><span class="tt-rarity">${data.rarity || 'Common'}</span></div></div>`;

        // --- DISPLAY STATS ---
        let statsHtml = '<div style="margin: 5px 0;">';

        // Primary Stats
        if (data.bonus) {
            Object.keys(data.bonus).forEach(k => {
                statsHtml += `<div class="tt-stat" style="color:#ef4444">+${data.bonus[k]} ${k.toUpperCase()}</div>`;
            });
        }

        // Secondary Stats (The missing part!)
        if (data.moveBonus) statsHtml += `<div class="tt-stat" style="color:#10b981">+${data.moveBonus} MOVEMENT</div>`;
        if (data.goldFind) statsHtml += `<div class="tt-stat" style="color:#fbbf24">+${data.goldFind} GOLD FIND</div>`;
        if (data.resistance) statsHtml += `<div class="tt-stat" style="color:#3b82f6">+${data.resistance} RESISTANCE</div>`;

        statsHtml += '</div>';
        html += statsHtml;

        if (data.desc) html += `<div style="color:#aaa; font-size:0.75rem; font-style:italic; margin-bottom:5px;">${data.desc}</div>`;

        // Handle Ability (Object or String ID)
        let abil = data.ability;
        if (typeof abil === 'string') abil = ABILITY_LIBRARY[abil];
        if (abil) {
            html += `<div class="tt-abil" style="color:var(--gold-glow)">${abil.name}: ${abil.desc}</div>`;
        }
    }

    tt.innerHTML = html;
    tt.style.display = 'block';
}
function hideTooltip() { document.getElementById('tooltip').style.display = 'none'; }
// --- UPDATED TOOLTIP FOLLOWER ---
document.addEventListener('mousemove', (e) => {
    const tt = document.getElementById('tooltip');
    if (tt && tt.style.display === 'block') {
        const pad = 15;
        let left = e.clientX + pad;
        let top = e.clientY + pad;

        // Boundaries to keep it on screen
        if (left + tt.offsetWidth > window.innerWidth) left = e.clientX - tt.offsetWidth - pad;
        if (top + tt.offsetHeight > window.innerHeight) top = e.clientY - tt.offsetHeight - pad;

        tt.style.left = left + 'px';
        tt.style.top = top + 'px';
    }
});
document.addEventListener('click', (e) => { const menu = document.getElementById('context-menu'); if (menu && !e.target.classList.contains('inv-slot') && !e.target.classList.contains('ctx-item')) menu.style.display = 'none'; });
let lastTouchTime = 0; let lastTouchSlot = "";
function toggleHelpModal() {
    const m = document.getElementById('help-modal');
    if (m.style.display === 'flex') {
        m.style.display = 'none';
    } else {
        m.style.display = 'flex';
        // Reset to first tab when opening
        switchHelpTab('tab-basics');
    }
}

// --- SECRET DEBUG TRIGGER ---
let secretTapCount = 0;
let secretTapTimer = null;

function handleSecretDebugTap() {
    secretTapCount++;

    // Clear the timer so it doesn't reset while you are still tapping
    clearTimeout(secretTapTimer);

    // Reset count if you stop tapping for more than 1 second
    secretTapTimer = setTimeout(() => {
        secretTapCount = 0;
    }, 1000);

    // If tapped 10 times...
    if (secretTapCount >= 10) {
        secretTapCount = 0; // Reset

        // TOGGLE THE EXISTING DEBUG CONSOLE
        const consoleDiv = document.getElementById('debug-console');
        const input = document.getElementById('console-input');

        if (consoleDiv) {
            if (consoleDiv.style.display === 'none' || consoleDiv.style.display === '') {
                consoleDiv.style.display = 'block';
                if (input) input.focus();
            } else {
                consoleDiv.style.display = 'none';
            }
        }
    }
}

function toggleSettingsModal() {
    const m = document.getElementById('settings-modal');
    // Toggle between Flex and None
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
}
function toggleUIMode(isForced) {
    if (isForced) {
        document.body.classList.add('force-mobile');
    } else {
        document.body.classList.remove('force-mobile');
    }
    // Recalculate camera because viewport size/logic effectively changed
    updateCamera();
}
function handleEquipTouch(slot) { const currentTime = new Date().getTime(); const tapLength = currentTime - lastTouchTime; if (lastTouchSlot === slot && tapLength < 500 && tapLength > 0) { unequipItem(slot); lastTouchTime = 0; } else { useEquipped(slot); lastTouchTime = currentTime; lastTouchSlot = slot; } }
function allowDrop(ev) { ev.preventDefault(); }
function dragStart(ev, i) { ev.dataTransfer.setData("idx", i); }
function handleSellDrop(ev) { ev.preventDefault(); if (document.getElementById('market-sell-area').style.display !== 'none') { const idx = ev.dataTransfer.getData("idx"); if (idx !== null) sellItem(idx); } }
function handleSkillDrop(ev, slotIdx) { ev.preventDefault(); const invIdx = ev.dataTransfer.getData("idx"); const p = players[0]; if (invIdx !== null && p.inventory[invIdx]) { const item = p.inventory[invIdx]; if (item.type === 'scroll' || (item.ability && item.ability.type === 'active')) { p.quickSlots[slotIdx] = item; updateHUD(); } else { addLog("Cannot assign passive item.", "log-fail"); } } }
function setupEquipDragDrop() { ['head', 'body', 'main', 'off'].forEach(slot => { const el = document.getElementById('slot-' + slot); if (el) { el.ondragover = allowDrop; el.ondrop = (e) => handleEquipDrop(e, slot); } }); }
function handleEquipDrop(ev, slotName) { ev.preventDefault(); const invIdx = ev.dataTransfer.getData("idx"); const p = players[0]; if (invIdx !== null && p.inventory[invIdx]) { const item = p.inventory[invIdx]; if (item.slot === slotName) equipItem(0, invIdx); else addLog(`Cannot equip ${item.name} to ${slotName.toUpperCase()}`, "log-fail"); } }
function unequipItem(slot) {
    const p = players.find(pl => pl.id === myPlayerId);
    if (!p) return;

    if (p.equipment[slot] && p.inventory.length < 12) {
        const it = p.equipment[slot];
        if (it.bonus) p.stats[Object.keys(it.bonus)[0]] -= Object.values(it.bonus)[0];
        p.equipment[slot] = null;
        p.inventory.push(it);

        AUDIO.playSound('sfx_equip');
        updateHUD();
        syncPlayerState(); // <--- SYNC
    }
}

function equipItem(pId, invIdx) {
    const p = players.find(pl => pl.id === pId);
    if (!p) return;

    if (invIdx < 0 || invIdx >= p.inventory.length) return;
    const item = p.inventory[invIdx];
    if (!item) return;

    if (item.type === 'scroll') {
        let success = false;
        if (typeof item.fn === 'function') {
            success = item.fn(p);
        }
        if (success === true) {
            p.inventory.splice(invIdx, 1);
            if (isMultiplayer) syncPlayerState();
        }
    }
    else {
        const slot = item.slot;
        const cur = p.equipment[slot];

        // Swap or Equip
        if (cur) {
            p.inventory[invIdx] = cur;
        } else {
            p.inventory.splice(invIdx, 1);
        }

        p.equipment[slot] = item;

        if (p.id === myPlayerId) AUDIO.playSound('sfx_equip');

        // --- THE FIX: Recalculate stats IMMEDIATELY ---
        recalcStats(p);

        if (isMultiplayer) syncPlayerState();
    }

    // Refresh UI immediately so the numbers change now
    updateHUD();
}
function useEquipped(slot) {
    // 1. Target Local Player
    const p = players.find(pl => pl.id === myPlayerId);
    if (!p) return;

    if (turnIndex !== myPlayerId) {
        addLog("Not your turn!", "log-fail");
        return;
    }

    const it = p.equipment[slot];
    if (it && it.ability && it.ability.type === 'active') {
        if (!it.isDepleted) {
            const success = it.ability.fn(p);
            if (success === true) {
                it.isDepleted = true;
                updateHUD();
                syncPlayerState(); // <--- SYNC CHANGE
            }
        } else {
            addLog("Ability depleted! Pass Start to recharge.", "log-fail");
        }
    }
}

function useSkill(slotIndex) {
    if (players.length === 0) return;

    // 1. Find the local player
    const p = players.find(pl => pl.id === myPlayerId);

    // NUCLEAR DEBUG
    console.warn(`[USE_SKILL] Triggered for Slot ${slotIndex}. activeBattle type: ${typeof activeBattle}, Value:`, activeBattle);

    // 2. Safety Check: Only allow if it is actually your turn
    if (!p || turnIndex !== myPlayerId) {
        console.warn(`[USE_SKILL] Turn Check Failed. Turn: ${turnIndex}, Me: ${myPlayerId}`);
        addLog("It is not your turn!", "log-fail");
        return;
    }

    // 2.5 Polymorph Check (You are a sheep!)
    if (p.isPolymorphed) {
        addLog("Baa! You are a sheep and cannot use abilities!", "log-fail");
        AUDIO.playSound('sfx_fail');
        return;
    }

    const skill = p.assignedSkills[slotIndex];
    if (!skill) return;

    // --- BATTLE SKILL CHECK ---
    if (typeof activeBattle !== 'undefined' && activeBattle) {
        // Validation: Is it my turn in battle?
        if (String(activeBattle.player.id) === String(myPlayerId)) {
            // COOLDOWN CHECK
            if (!activeBattle.cooldowns) activeBattle.cooldowns = {};
            const cdRemaining = activeBattle.cooldowns[slotIndex] || 0;

            if (cdRemaining > 0) {
                addLog(`${skill.name} is on cooldown! (${cdRemaining} turns remaining)`, "log-fail");
                AUDIO.playSound('sfx_fail');
                return;
            }

            // Resolve Function
            let battleFn = null;
            if (skill.isClass) {
                if (ABILITY_LIBRARY[skill.id] && ABILITY_LIBRARY[skill.id].dungeonFn) {
                    battleFn = ABILITY_LIBRARY[skill.id].dungeonFn;
                } else {
                    addLog(`Debug: Missing battle logic for ${skill.name}`, "log-fail");
                }
            } else if (skill.ref && skill.ref.ability) {
                // Item Ability
                let abId = skill.ref.ability;
                if (typeof abId === 'string' && ABILITY_LIBRARY[abId] && ABILITY_LIBRARY[abId].dungeonFn) {
                    battleFn = ABILITY_LIBRARY[abId].dungeonFn;
                }
            }

            if (battleFn) {
                // Execute Battle Logic
                const success = battleFn(activeBattle);
                if (success) {
                    // Set 3-turn cooldown
                    activeBattle.cooldowns[slotIndex] = 3;
                    AUDIO.playSound('sfx_click');
                    updateHUD(); // Refresh UI to show cooldown
                } else {
                    AUDIO.playSound('sfx_fail');
                }
                return; // STOP HERE. Do not run Overworld logic.
            } else {
                addLog(`This skill doesn't work in battle yet.`, "log-fail");
                return;
            }
        }
    }

    // Validation: Is it my turn in battle?


    // 3. DEPLETION CHECK
    // Determine if the skill in this slot is already used up
    if (skill.isClass) {
        // Main Class Skill (Slot 1)
        if (!skill.isSecondClass && p.classSkillDepleted) {
            addLog(`${skill.name} is depleted. Pass Start to recharge.`, "log-fail");
            return;
        }
        // Scholar's Second Skill (Slot 2)
        if (skill.isSecondClass && p.classSkill2Depleted) {
            addLog(`${skill.name} is depleted. Pass Start to recharge.`, "log-fail");
            return;
        }
    } else {
        // Equipment Item Skills
        if (skill.ref && skill.ref.isDepleted) {
            addLog("Item ability depleted. Pass Start to recharge.", "log-fail");
            return;
        }
    }

    // 4. EXECUTE LOGIC
    // Get the function from the Library (for class skills) or the Item reference
    let skillFn;

    if (skill.isClass) {
        skillFn = ABILITY_LIBRARY[skill.id].fn;
    } else {
        // Item Skills
        // 1. Try to use the .fn directly on the skill object (populated by openSkillPicker)
        if (typeof skill.fn === 'function') {
            skillFn = skill.fn;
        }
        // 2. Fallback: Resolve from the item reference if needed (Ancient Items = String ID handling)
        else if (skill.ref && skill.ref.ability) {
            let ab = skill.ref.ability;
            if (typeof ab === 'string') ab = ABILITY_LIBRARY[ab];

            if (ab && typeof ab.fn === 'function') {
                skillFn = ab.fn;
            }
        }
    }

    if (skillFn) {
        const success = skillFn(p); // Run the skill logic (returns true if successful)

        if (success === true) {
            // 5. SET DEPLETION FLAGS ON SUCCESS
            if (skill.isSecondClass) {
                p.classSkill2Depleted = true; // Scholar's second slot
            } else if (skill.isClass) {
                p.classSkillDepleted = true;  // Primary class slot
            } else if (skill.ref) {
                skill.ref.isDepleted = true;  // Specific item wielder
            }

            // 6. UPDATE STATE & UI
            // Important: Recalculate stats immediately to show Power Strike/Bless buffs
            recalcStats(p);
            updateHUD();

            // Sync the used skill state to other players in Multiplayer
            if (isMultiplayer) {
                syncPlayerState();
            }
        }
    }
}
function sellItem(identifier, source = 'inv') {
    const p = players.find(pl => pl.id === myPlayerId);
    if (!p) return;

    let item = (source === 'equip') ? p.equipment[identifier] : p.inventory[identifier];
    if (item) {
        let multiplier = 0.5;
        if (p.passiveSkillId === 'fence') multiplier = 0.8;
        if (p.passiveSkillId === 'heal') multiplier = 3.0;

        let v = Math.floor((item.cost || 0) * multiplier);
        p.gold += v;

        if (source === 'equip') {
            if (item.bonus) p.stats[Object.keys(item.bonus)[0]] -= Object.values(item.bonus)[0];
            p.equipment[identifier] = null;
        } else {
            p.inventory.splice(identifier, 1);
        }

        AUDIO.playSound('sfx_gold');

        let msg = `Sold for ${v}G`;
        if (multiplier === 3.0) msg += " (Well Made!)";
        else if (multiplier === 0.8) msg += " (Fence)";

        addLog(msg, "log-gold");
        updateHUD();
        syncPlayerState(); // <--- SYNC
    }
}
document.addEventListener('keydown', (e) => { if (["1", "2", "3", "4", "5", "6", "7"].includes(e.key)) useSkill(parseInt(e.key) - 1); });

// --- REGION 7: CREATION SCREEN ---
function enterCreation(isMP = false) {
    isMultiplayer = isMP;
    AUDIO.allowStartMusic = false;
    AUDIO.stopStartMusic();
    AUDIO.playMusic(false);

    // --- UPDATE: HIDE HUD ---
    document.getElementById('top-right-hud').style.display = 'none';
    // ------------------------

    const splash = document.getElementById('splash-screen');
    const create = document.getElementById('create-screen');

    create.style.display = 'flex';

    setTimeout(() => {
        create.style.opacity = '1';
        splash.style.opacity = '0';
    }, 50);

    setTimeout(() => {
        splash.style.display = 'none';
    }, 1500);
}

function cleanInventory(p) {
    if (!p || !p.inventory) return;
    // Remove nulls, undefined, or items without a type
    p.inventory = p.inventory.filter(item => item && item.type);
}

function setupCreationUI() {
    const cg = document.getElementById('color-grid'); PLAYER_COLORS.forEach(c => { let d = document.createElement('div'); d.className = 'color-opt'; d.style.backgroundColor = c; d.onclick = () => { selColor = c; document.querySelectorAll('.color-opt').forEach(e => e.classList.remove('selected')); d.classList.add('selected'); }; cg.appendChild(d); });
    const rg = document.getElementById('race-grid'); RACES.forEach(r => { let d = document.createElement('div'); d.className = 'sel-opt'; d.innerHTML = `<b>${r.name}</b><small>S:${r.stats.str} D:${r.stats.dex} I:${r.stats.int}</small>`; d.onclick = () => { selRace = r; hl(d); up(); }; rg.appendChild(d); });
    const clg = document.getElementById('class-grid');
    CLASSES.forEach(c => {
        let d = document.createElement('div');
        d.className = 'sel-opt';
        d.innerHTML = `<b>${c.name}</b>`;
        d.onclick = () => {
            selClass = c;
            // FIX: Reset skills when changing class to prevent cross-class exploits
            selActiveId = null;
            selActiveId2 = null;
            selPassiveId = null;

            hl(d);
            showClassOptions(c);
            up();
        };
        clg.appendChild(d);
    });
}
function showClassOptions(c) {
    document.getElementById('active-section').style.display = 'flex';
    const ag = document.getElementById('active-grid');
    ag.innerHTML = '';

    // --- RENDER ACTIVE SKILLS ---
    c.actives.forEach(id => {
        const skill = ABILITY_LIBRARY[id];
        let d = document.createElement('div');
        d.className = 'skill-card';
        d.dataset.id = id; // Store ID for easy access
        d.innerHTML = `<img src="${skill.img || ''}" style="${!skill.img ? 'display:none' : ''}"><b>${skill.name}</b><small>${skill.desc}</small>`;

        d.onclick = () => {
            // SCHOLAR LOGIC (Multi-Select)
            if (selPassiveId === 'scholar') {
                if (selActiveId === id) { selActiveId = null; } // Deselect Primary
                else if (selActiveId2 === id) { selActiveId2 = null; } // Deselect Secondary
                else if (!selActiveId) { selActiveId = id; } // Fill Primary
                else if (!selActiveId2) { selActiveId2 = id; } // Fill Secondary
                else { selActiveId2 = id; } // Replace Secondary if both full
            }
            // STANDARD LOGIC (Single Select)
            else {
                selActiveId = id;
                selActiveId2 = null;
            }
            updateSkillVisuals();
            up();
        };
        ag.appendChild(d);
    });

    document.getElementById('passive-section').style.display = 'flex';
    const pg = document.getElementById('passive-grid');
    pg.innerHTML = '';

    // --- RENDER PASSIVE SKILLS ---
    c.passives.forEach(id => {
        const skill = ABILITY_LIBRARY[id];
        let d = document.createElement('div');
        d.className = 'skill-card';
        d.dataset.id = id;
        d.innerHTML = `<img src="${skill.img || ''}" style="${!skill.img ? 'display:none' : ''}"><b>${skill.name}</b><small>${skill.desc}</small>`;

        d.onclick = () => {
            const wasScholar = (selPassiveId === 'scholar');
            selPassiveId = id;

            // Visual Update for Passives
            document.querySelectorAll('#passive-grid .skill-card').forEach(e => {
                e.classList.remove('selected');
                if (e.dataset.id === id) e.classList.add('selected');
            });

            // Logic Switch: If switching TO or FROM Scholar, reset actives or visuals
            if (id === 'scholar' && !wasScholar) {
                // Switched TO Scholar: Keep current active, allow 2nd
                selActiveId2 = null;
            } else if (id !== 'scholar' && wasScholar) {
                // Switched AWAY from Scholar: Clear 2nd active
                selActiveId2 = null;
            }

            updateSkillVisuals();
            up();
        };
        pg.appendChild(d);
    });
}

function updateSkillVisuals() {
    // Update Active Grid Visuals
    document.querySelectorAll('#active-grid .skill-card').forEach(e => {
        e.classList.remove('selected');
        const id = e.dataset.id;
        if (id === selActiveId || id === selActiveId2) {
            e.classList.add('selected');
        }
    });
}

function up() {
    const btn = document.getElementById('btn-start-game');

    // Check Basic Requirements
    let isReady = (selRace && selClass && selActiveId && selPassiveId);

    // Check Scholar Requirement (Must have 2 actives)
    if (selPassiveId === 'scholar' && !selActiveId2) {
        isReady = false;
    }

    // Enable/Disable button
    btn.disabled = !isReady;

    // Toggle Alpha (Opacity)
    btn.style.opacity = isReady ? "1" : "0.5";
    btn.style.cursor = isReady ? "pointer" : "not-allowed";

    // Update Portrait if ready
    if (selRace && selClass) {
        const key = `${selRace.id}_${selClass.id}`;
        const url = CHAR_PORTRAITS[key];
        if (url) {
            const frame = document.getElementById('creator-portrait-frame');
            // UPDATED: Hero Art + Background
            // Layer 1 (Top): Hero URL (Contained, Bottom Center)
            // Layer 2 (Bottom): Background URL (Cover, Center)
            frame.style.backgroundImage = `url('${url}'), url('https://static.wixstatic.com/media/b16479_87e3f4ad0db74359ad1814d6238f6a00~mv2.png')`;
            frame.style.backgroundSize = "contain, cover";
            frame.style.backgroundPosition = "center bottom, center center";
            frame.style.backgroundRepeat = "no-repeat, no-repeat";

            frame.style.display = 'block';
        }
    }
}
function hl(el) { el.parentElement.childNodes.forEach(c => c.classList && c.classList.remove('selected')); el.classList.add('selected'); }
function startGame() {
    document.getElementById('create-screen').style.display = 'none';
    const name = document.getElementById('char-name-input').value || "Hero";

    // --- MULTIPLAYER STARTUP ---
    if (isMultiplayer && gameId && db) {
        db.ref(`games/${gameId}`).once('value', snap => {
            const g = snap.val();
            if (!g) return;

            gameState = 'ROLL';
            players = [];

            for (let i = 0; i < 4; i++) {
                const slot = g.slots ? g.slots[i] : null;

                if (slot && (slot.type === 'human' || slot.type === 'ai')) {
                    // HYDRATE: Match the ID from the database to the full Object in your code
                    const pRace = RACES.find(r => r.id === (slot.charData.race.id || slot.charData.race)) || RACES[0];
                    const pClass = CLASSES.find(c => c.id === (slot.charData.class.id || slot.charData.class)) || CLASSES[0];
                    const pAct = slot.charData.active;
                    const pPas = slot.charData.passive;
                    const isBot = (slot.type === 'ai');

                    spawnPlayer(i, slot.name, pRace, pClass, pAct, pPas, isBot, slot.color, 0);

                    const p = players[i];

                    // SCHOLAR SYNC: Handle the second skill if it was chosen
                    if (slot.charData.active2 && pPas === 'scholar') {
                        const s2 = ABILITY_LIBRARY[slot.charData.active2];
                        if (s2) {
                            p.assignedSkills[1] = {
                                id: slot.charData.active2,
                                name: s2.name,
                                desc: s2.desc,
                                img: s2.img,
                                source: "Scholar Mastery",
                                isClass: true,
                                isSecondClass: true
                            };
                        }
                    }

                    // GOLD RECOVERY: Ensure starting gold (from passives like Greed) is synced
                    if (g.players && g.players[i] && g.players[i].gold !== undefined) {
                        p.gold = g.players[i].gold;
                    }
                } else {
                    // Fill empty slots with dummy players to keep the index (0-3) consistent
                    players.push({ id: i, isDead: true, metrics: { spacesMoved: 0 }, history: [] });
                }
            }
            updateHUD();
            setupMultiplayerListeners();
            addLog("The Adventure Begins!");
        });

    } else {
        // --- SINGLE PLAYER STARTUP ---
        players = []; // Reset local array

        // 1. Spawn Human Player
        spawnPlayer(0, name, selRace, selClass, selActiveId, selPassiveId, false, selColor);
        const p = players[0];

        // TUTORIAL HOOK
        const tutCheck = document.getElementById('chk-tutorial');
        if (tutCheck && tutCheck.checked) {
            TUTORIAL.start();
        }

        // 2. Scholar Logic (Slot 2)
        if (selPassiveId === 'scholar' && selActiveId2) {
            const s2 = ABILITY_LIBRARY[selActiveId2];
            p.assignedSkills[1] = {
                id: selActiveId2,
                name: s2.name,
                desc: s2.desc,
                img: s2.img,
                source: "Scholar Mastery",
                isClass: true,
                isSecondClass: true
            };
        }

        // 3. Spawn AI Opponents
        let aiColors = PLAYER_COLORS.filter(c => c !== selColor);
        let availableNames = [...NPC_NAMES];

        for (let i = 1; i < 4; i++) {
            const r = RACES[Math.floor(Math.random() * RACES.length)];
            const c = CLASSES[Math.floor(Math.random() * CLASSES.length)];
            const aiName = availableNames.splice(Math.floor(Math.random() * availableNames.length), 1)[0];
            const aiCol = aiColors.shift();

            // Randomize Skills
            const rndActive = c.actives[Math.floor(Math.random() * c.actives.length)];
            const rndPassive = c.passives[Math.floor(Math.random() * c.passives.length)];

            spawnPlayer(i, aiName, r, c, rndActive, rndPassive, true, aiCol);
        }

        gameState = 'ROLL';
        updateHUD();
        AUDIO.playMusic(false);
        addLog("Welcome to Questopoly!");
    }
}

function handleScholarChoice(p) {
    const m = document.getElementById('card-modal');
    document.getElementById('enc-title').innerText = "Scholar's Knowledge";
    document.getElementById('enc-desc').innerText = "Your intense study allows you to master a second spell. Choose one:";
    document.getElementById('enc-header').className = 'card-header';
    const l = document.getElementById('choice-list');
    l.innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';

    // List of allowed spells (exclude current one)
    // We grab all active skills from the library
    const options = Object.keys(ABILITY_LIBRARY).filter(k => {
        const s = ABILITY_LIBRARY[k];
        // Exclude Passives and Current Active
        return (!s.type || s.type === 'active') && k !== p.activeSkillId &&
            !['midas', 'well_made', 'gamblers_luck'].includes(k); // Exclude item-specific traits
    });

    // Pick 4 random options to avoid overwhelming the screen
    const choices = [];
    while (choices.length < 4 && options.length > 0) {
        const idx = Math.floor(Math.random() * options.length);
        choices.push(options.splice(idx, 1)[0]);
    }

    choices.forEach(key => {
        const skill = ABILITY_LIBRARY[key];
        let b = document.createElement('div');
        b.className = 'choice-btn';
        b.style.display = 'flex';
        b.style.alignItems = 'center';
        b.innerHTML = `
            <img src="${skill.img || ''}" style="width:40px; height:40px; margin-right:10px; border-radius:4px; background:#000;">
            <div>
                <div style="font-weight:bold; color:var(--gold-main)">${skill.name}</div>
                <div style="font-size:0.7rem; color:#aaa;">${skill.desc}</div>
            </div>
        `;
        b.onclick = () => {
            // Create a "Grimoire" item that holds this skill
            const grimoire = {
                id: 'scholar_tome',
                name: "Grimoire: " + skill.name,
                type: 'equip', // Treat as equip so it persists
                slot: 'scholar_slot', // Dummy slot
                rarity: 'legendary',
                img: skill.img,
                ability: {
                    name: skill.name,
                    type: 'active',
                    desc: skill.desc,
                    fn: skill.fn
                },
                isDepleted: false
            };

            // Assign to Quick Slot 6 (Index 0 of quickSlots)
            p.quickSlots[0] = grimoire;

            addLog(`Scholar learned ${skill.name}!`, "log-success");
            updateHUD();
            document.getElementById('card-modal').classList.remove('active');
        };
        l.appendChild(b);
    });

    m.classList.add('active');
}

// Remove functions from objects before sending to Firebase
function serializeItem(item) {
    if (!item) return null;
    // Deep clone to avoid modifying the actual game object by ref
    const clean = JSON.parse(JSON.stringify(item));

    // Explicitly delete function properties
    delete clean.fn;
    if (clean.ability) {
        delete clean.ability.fn;
        delete clean.ability.onRoll;
        delete clean.ability.onLanding;
        delete clean.ability.onCapture;
        delete clean.ability.onCombatVictory;
        delete clean.ability.effect;
    }
    return clean;
}

// Restore functions to objects received from Firebase
function hydrateItem(item) {
    if (!item) return null;

    // Attempt to find original template to restore logic based on Name
    // We check DECK_TREASURE first as it contains most items
    const original = DECK_TREASURE.find(i => i.name === item.name);

    if (original) {
        if (original.fn) item.fn = original.fn;
        if (original.ability) {
            if (!item.ability) item.ability = {};
            // Restore logic properties
            Object.assign(item.ability, original.ability);
            // Ensure function references are copied
            item.ability.fn = original.ability.fn;
        }
    }
    return item;
}

// --- NEW HELPER FUNCTION FOR MP LISTENERS ---
function recalcStats(p) {
    if (!p || p.isBoss || p.isEventEntity || !p.race) return;

    // 1. Base Race Stats + Permanent (Medic/Elixir) Bonuses + TEMPORARY (Skill) Bonuses
    p.stats.str = p.race.stats.str + (p.permBonuses?.str || 0) + (p.tempBonuses?.str || 0);
    p.stats.dex = p.race.stats.dex + (p.permBonuses?.dex || 0) + (p.tempBonuses?.dex || 0);
    p.stats.int = p.race.stats.int + (p.permBonuses?.int || 0) + (p.tempBonuses?.int || 0);

    // 2. Reset Secondary Stats before recalculating from gear
    p.stats.movementBonus = 0;
    p.stats.goldFind = 0;
    p.stats.resistance = 0;

    // 3. Process all 10 Equipment Slots
    EQUIP_ORDER.forEach(slot => {
        const item = p.equipment[slot];
        if (!item) return;

        // Primary Stat items (Sword, Armor, etc)
        if (['body', 'main', 'off'].includes(slot) && item.bonus) {
            Object.keys(item.bonus).forEach(k => {
                if (p.stats[k] !== undefined) p.stats[k] += item.bonus[k];
            });
        }

        // Secondary Stats (Boots, Rings, Cloaks)
        if (slot === 'feet' && item.moveBonus) p.stats.movementBonus += item.moveBonus;
        if (['head', 'feet', 'hands', 'ring_l', 'ring_r', 'amulet', 'back'].includes(slot)) {
            if (item.goldFind) p.stats.goldFind += item.goldFind;
            if (item.resistance) p.stats.resistance += item.resistance;
        }
    });

    // 4. Passives
    if (p.passiveSkillId === 'shadow_step') p.stats.movementBonus += 1;
    const pasDef = ABILITY_LIBRARY[p.passiveSkillId];
    if (pasDef && pasDef.effect) pasDef.effect(p.stats, p);

    // 4.5. NEW: Derived Stats from Core Stats
    p.stats.maxHealth = 10 + p.stats.str;
    p.stats.dodgeRate = p.stats.dex;
    p.stats.manaSurge = p.stats.int;

    // SYNC: Ensure player maxHp matches derived stat
    // Also clamp current HP if it exceeds new max (fix for 20/20 default bug)
    if (!p.isBoss && !p.isEventEntity) {
        if (p.maxHp !== p.stats.maxHealth) {
            // Check if player was at full health before change? 
            const wasFull = (p.hp >= p.maxHp);
            p.maxHp = p.stats.maxHealth;

            // Fix for the specific bug: if hp is 20 and max should be 14
            if (p.hp > p.maxHp) p.hp = p.maxHp;
            // Also if was full, ensure still full? 
            if (wasFull) p.hp = p.maxHp;
        }
    }

    // 5. Final Overrides (Polymorph / Shadow Strike Debuff)
    if (p.isPolymorphed) {
        p.stats.str = 1; p.stats.dex = 1; p.stats.int = 1;
        p.stats.movementBonus = 0;
        p.stats.goldFind = 0;
        p.stats.resistance = 0;
        // Update derived stats too
        p.stats.maxHealth = 11; // 10 + 1 STR
        p.stats.dodgeRate = 1;
        p.stats.manaSurge = 1;
    }
    if (p.shadowStrikeDebuff) {
        p.stats.str = Math.max(1, p.stats.str - 1);
        p.stats.dex = Math.max(1, p.stats.dex - 1);
        p.stats.int = Math.max(1, p.stats.int - 1);
        // Recalc derived stats after debuff
        p.stats.maxHealth = 10 + p.stats.str;
        p.stats.dodgeRate = p.stats.dex;
        p.stats.manaSurge = p.stats.int;
    }
}
function resolveAiEvent(p, card, t, mode, items) {
    // 1. SHOPS & START
    if (mode === 'shop') {
        endStep();
        return;
    }

    // 2. LOOT
    if (mode === 'loot') {
        if (card) {
            p.inventory.push(createItemInstance(card));
            globalLog(`${p.name} found ${card.name}.`, "log-success");

            if (card.name === "Pouch of Gold" && p.passiveSkillId === 'alchemist_pas') {
                const extra = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
                p.inventory.push(createItemInstance(extra));
                globalLog(`Alchemist Bonus: ${extra.name}!`, "log-epic");
            }
            if (isMultiplayer && myPlayerId === 0) syncPlayerState();
        }
        endStep();
        return;
    }

    // 3. PARK / TREASURY
    if (mode === 'park') {
        if (treasuryGold > 0) {
            const pot = treasuryGold;
            p.gold += pot;
            globalLog(`${p.name} wins Treasury (${pot}G)!`, "log-gold");

            treasuryGold = 0;
            updateHUD();
            if (isMultiplayer && myPlayerId === 0) {
                db.ref(`games/${gameId}/treasury`).set(0);
                syncPlayerState();
            }
        } else {
            globalLog(`${p.name} visits empty Treasury.`);
        }
        endStep();
        return;
    }

    // 4. TAX
    if (mode === 'tax_card') {
        processTax(p, card ? card.cost : 50);
        endStep();
        return;
    }

    // 5. GO TO DUNGEON
    if (mode === 'goto') {
        if (p.passiveSkillId === 'smoke_bomb') {
            globalLog(`${p.name} (Skeleton Key) evaded the Dungeon!`, "log-epic");
        } else {
            p.pos = 10;
            if (tiles[10]) p.mesh.position.copy(tiles[10].position);
            p.isSkipping = true;

            if (isMultiplayer && myPlayerId === 0) {
                db.ref(`games/${gameId}/players/${p.id}`).update({ isSkipping: true, pos: 10 });
                db.ref(`games/${gameId}/teleportLog`).push({
                    pid: p.id, targetPos: 10, timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            }
            globalLog(`${p.name} was sent to Dungeon!`, "log-fail");
        }
        endStep();
        return;
    }

    // 6. VISITING JAIL
    if (mode === 'jail') {
        if (p.passiveSkillId === 'skeleton_key' && p.gold >= 100) {
            p.gold -= 50;
            t.userData.trapOwner = p.id;

            globalLog(`${p.name} (AI) set a trap in the Dungeon!`, "log-rare");

            updateTrapVisuals(t);
            if (isMultiplayer && myPlayerId === 0) {
                syncPlayerState();
                db.ref(`games/${gameId}/board/${t.userData.id}/trapOwner`).set(p.id);
            }
        } else {
            if (!p.isSkipping) globalLog(`${p.name} visits the Dungeon.`);
        }
        endStep();
        return;
    }

    // 7. OWN PROPERTY (Upgrade/Guard)
    if (mode === 'own_property') {
        const info = t.userData.info;
        if (t.userData.buildingLevel === 1 && p.gold >= info.cost * 2) {
            p.gold -= info.cost * 2;
            capture(t, p, 2);
            globalLog(`${p.name} upgraded to Tavern!`, "log-success");
            if (isMultiplayer) syncPlayerState();
        }
        else if (t.userData.buildingLevel === 2) {
            const guards = t.userData.guardCount || 0;
            if (guards < 2 && p.gold >= 150) {
                p.gold -= 50;
                t.userData.guardCount = guards + 1;
                globalLog(`${p.name} hired a guard.`, "log-gold");
                applyCaptureVisuals(t, p, 2);
                if (isMultiplayer) {
                    syncPlayerState();
                    db.ref(`games/${gameId}/board/${t.userData.id}/guardCount`).set(t.userData.guardCount);
                }
            }
        }
        endStep();
        return;
    }

    // 8. ENEMY PROPERTY
    if (mode === 'enemy') {
        const owner = players.find(pl => String(pl.id) === String(t.userData.owner));
        if (!owner) { endStep(); return; }

        const info = t.userData.info;
        const rentCost = (info.cost * ((t.userData.buildingLevel > 1) ? 2 : 1)) + ((t.userData.guardCount || 0) * 20);
        const defStat = t.userData.defendingStat || 'str';

        let myStatVal = p.stats[defStat] || 0;
        let shouldSiege = (p.gold < rentCost) || (myStatVal >= 4);

        if (shouldSiege) {
            globalLog(`${p.name} attacks the property!`, "log-accent");
            const failCost = (info.cost * 2) + ((t.userData.guardCount || 0) * 10);
            resolveAiCombat(p, defStat, 3, 1, t, 'capture', 0, failCost);
        } else {
            globalLog(`${p.name} pays rent.`, "log-fail");
            pay(p, rentCost, owner);
            endStep();
        }
        return;
    }

    // --- 9. EMPTY LAND (Potential Capture) ---
    // If the space is 'wild' (not owned, not special) and has a cost
    const info = t.userData.info;
    if ((mode === 'wild' || mode === 'wild_skirmish') && info.cost > 0 && t.userData.owner == null) {
        // AI Logic: Buy if we have 1.5x the cost in gold
        if (p.gold >= info.cost * 1.5) {
            capture(t, p, 1, () => checkForBonusLoot(p));
            // Return here so we don't process the encounter card below
            return;
        }
        // If too poor, fall through to process the card (Encounter)
        else {
            globalLog(`${p.name} passes (saving gold).`, "log-entry");
            // Do NOT return here, let it fall through to process the 'card' (Encounter)
            // unless you want them to skip the encounter entirely?
            // SP Logic: "else { endStep() }" -> They skip encounter.
            endStep();
            return;
        }
    }

    // 10. CARDS / EVENTS (If not captured above)
    if (card && card.choices) {
        let best = card.choices[0];

        if (card.choices[1]) {
            const isFoggy = activeEvents.some(e => e.data && e.data.id === 'event_fog');
            if (isFoggy) {
                best = card.choices[Math.floor(Math.random() * card.choices.length)];
            } else {
                const stat1 = p.stats[best.stat] || 0;
                const stat2 = p.stats[card.choices[1].stat] || 0;
                if (stat2 > stat1) best = card.choices[1];
            }
        }

        setTimeout(() => {
            const actionStat = best.stat;
            const tn = best.tn;
            const req = best.req || 1;
            const failCost = best.fail || 50;
            let resultMode = best.mode;

            if (mode === 'mystery_event') resultMode = 'teleport';
            else if (mode === 'upgrade') resultMode = 'upgrade';
            else if (mode === 'enemy') resultMode = 'capture';

            resolveAiCombat(p, actionStat, tn, req, t, resultMode, best.val || 0, failCost);
        }, 800);
        return;
    }

    // Fallback
    endStep();
}

function handleBoardUpdate(snap) {
    const tileId = parseInt(snap.key);
    const data = snap.val();

    const tile = tiles[tileId];
    // Attempt to find owner. If data.owner is null/undefined, this returns undefined.
    const owner = players.find(p => p.id === data.owner);

    if (tile) {
        // CASE 1: Valid Owner (Update/Create Building)
        if (owner) {
            tile.userData.owner = owner.id;
            tile.userData.buildingLevel = parseInt(data.level);
            tile.userData.guardCount = data.guardCount || 0;
            tile.userData.defendingStat = data.defendingStat || 'str';

            // Delay visuals if moving to prevent popping during animation
            if (gameState === 'MOVING') {
                setTimeout(() => {
                    applyCaptureVisuals(tile, owner, parseInt(data.level));
                }, 3000);
            } else {
                applyCaptureVisuals(tile, owner, parseInt(data.level));
            }
        }
        // CASE 2: No Owner (Destroy/Clear Building)
        else {
            tile.userData.owner = null;
            tile.userData.buildingLevel = 0;
            tile.userData.guardCount = 0;
            tile.userData.defendingStat = null;

            // Remove 3D Prop
            if (tile.userData.prop) {
                // Shrink animation for smooth removal
                new TWEEN.Tween(tile.userData.prop.scale).to({ y: 0 }, 500).onComplete(() => {
                    tile.remove(tile.userData.prop);
                    tile.userData.prop = null;
                }).start();
            } else {
                // Just in case it was already removed or glitchy
                if (tile.getObjectByName("BuildingGroup")) tile.remove(tile.getObjectByName("BuildingGroup"));
            }

            // Clean up any guards on this tile
            if (typeof activeGuards !== 'undefined') {
                activeGuards = activeGuards.filter(g => {
                    if (g.tileId === tile.userData.id) {
                        if (g.mesh) scene.remove(g.mesh);
                        return false; // Remove from array
                    }
                    return true; // Keep others
                });
            }
        }

        // Sync Traps (Separate from Building Owner)
        if (data.trapOwner !== undefined) tile.userData.trapOwner = data.trapOwner;
        else tile.userData.trapOwner = null;
        if (typeof updateTrapVisuals === 'function') updateTrapVisuals(tile);
    }
}
function forcePortrait() {
    // Check if the Screen Orientation API is supported
    if (screen.orientation && screen.orientation.lock) {
        // Attempt to lock to portrait-primary
        screen.orientation.lock('portrait-primary').catch(function (error) {
            // Locking failed (common on iOS or if not fullscreen), but the CSS overlay will handle it visually.
            console.log("Orientation lock not supported/allowed: " + error);
        });
    }
}

// Attempt to lock when the game starts
document.getElementById('btn-start-game').addEventListener('click', forcePortrait);

function toggleGraph() {
    // This function is now deprecated by the direct "setGraphMode" buttons, 
    // but kept for compatibility if needed.
    const gc = document.getElementById('graph-container');
    gc.style.display = 'block';
    drawGraph();
}

function setGraphMode(mode) {
    currentGraphMode = mode;
    const gc = document.getElementById('graph-container');
    gc.style.display = 'block';
    drawGraph();
}

function drawGraph() {
    const canvas = document.getElementById('game-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 1. Clear & Background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Define Margins (Room for labels)
    const padLeft = 60;   // Space for Gold/Prop numbers
    const padBottom = 40; // Space for Turn numbers
    const padTop = 20;
    const padRight = 20;

    const graphW = canvas.width - padLeft - padRight;
    const graphH = canvas.height - padTop - padBottom;

    // 3. Determine Max Values from History
    let maxVal = 0;
    let maxTurns = 0;

    players.forEach(p => {
        if (p.history.length > maxTurns) maxTurns = p.history.length;
        p.history.forEach(entry => {
            const val = (currentGraphMode === 'gold') ? entry.gold : entry.props;
            if (val > maxVal) maxVal = val;
        });
    });

    // 4. Configure Axis Scaling based on Mode
    let yStep = 0;
    let yMax = 0;

    if (currentGraphMode === 'gold') {
        yStep = 200; // User requested 200 increments
        // Round max up to the nearest 200, minimum 1000 to look nice
        yMax = Math.ceil(Math.max(maxVal, 1000) / 200) * 200;

        // Safety: If gold is huge (e.g. 50,000), 200 steps is too many lines. 
        // We auto-scale the step if there are too many lines (more than 20 lines)
        if (yMax / yStep > 20) {
            yStep = Math.ceil(yMax / 20 / 200) * 200;
        }
    } else {
        // Properties
        yStep = 1;
        // User requested 1 to 20. If someone has 25, we scale to 25.
        yMax = Math.max(maxVal, 20);

        // Safety for crazy property counts (unlikely in Monopoly but safe to add)
        if (yMax > 30) yStep = 5;
    }

    // 5. Draw Grid & Y-Axis Labels
    ctx.lineWidth = 1;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let v = 0; v <= yMax; v += yStep) {
        // Calculate Y pixel position (0 is at bottom)
        const y = (padTop + graphH) - ((v / yMax) * graphH);

        // Draw Grid Line
        ctx.strokeStyle = (v === 0) ? "#fff" : "#333"; // White for 0 line, dark grey for others
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + graphW, y);
        ctx.stroke();

        // Draw Label
        ctx.fillStyle = "#aaa";
        ctx.fillText(v, padLeft - 10, y);
    }

    // 6. Draw X-Axis Labels (Turns)
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Determine label skip (don't draw every turn if game is 100 turns long)
    const turnStep = Math.ceil(maxTurns / 15); // Aim for ~15 labels max

    for (let t = 0; t < maxTurns; t += turnStep) {
        const x = padLeft + (t / (maxTurns - 1 || 1)) * graphW;

        // Draw Tick Mark
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(x, padTop + graphH);
        ctx.lineTo(x, padTop + graphH + 5);
        ctx.stroke();

        // Draw Label
        ctx.fillStyle = "#aaa";
        ctx.fillText(t, x, padTop + graphH + 8);
    }

    // Axis Titles
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px sans-serif";
    // X Title
    ctx.fillText("Turns", padLeft + (graphW / 2), canvas.height - 12);

    // Y Title (Rotated)
    ctx.save();
    ctx.translate(15, padTop + (graphH / 2));
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(currentGraphMode === 'gold' ? "Gold Amount" : "Properties Owned", 0, 0);
    ctx.restore();

    // 7. Plot Data Lines
    ctx.lineWidth = 2;

    players.forEach(p => {
        if (p.history.length < 1) return;

        ctx.beginPath();
        ctx.strokeStyle = p.color;

        p.history.forEach((entry, i) => {
            const val = (currentGraphMode === 'gold') ? entry.gold : entry.props;

            // Map logic to pixels
            const x = padLeft + (i / (maxTurns - 1 || 1)) * graphW;
            const y = (padTop + graphH) - ((val / yMax) * graphH);

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Draw Name at the end of the line
        const lastEntry = p.history[p.history.length - 1];
        const lastVal = (currentGraphMode === 'gold') ? lastEntry.gold : lastEntry.props;
        const lastX = padLeft + graphW;
        const lastY = (padTop + graphH) - ((lastVal / yMax) * graphH);

        // Small dot at end
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Name Label (offset slightly so it doesn't overlap line)
        ctx.textAlign = "right";
        ctx.fillText(p.name, lastX - 5, lastY - 5);
    });
}

function drawLine(ctx, p, key, maxVal, pad, gw, gh, maxTurns, color, dashed) {
    if (p.history.length < 2) return;
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([5, 5]); else ctx.setLineDash([]);
    p.history.forEach((h, i) => {
        const x = pad + (i / (maxTurns - 1)) * gw;
        const y = (canvas.height - pad) - (h[key] / maxVal) * gh;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
}

function togglePanelVisibility(id) {
    const el = document.getElementById(id);
    if (!el) return;

    // Check if it is currently hidden
    // We check for 'none' OR if the class 'active' is missing on mobile
    const isHidden = (getComputedStyle(el).display === 'none');

    if (isHidden) {
        // OPEN IT
        el.style.display = 'flex'; // Force flex display
        el.classList.add('active'); // For mobile popup styling
        if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_click');
    } else {
        // CLOSE IT
        el.style.display = 'none'; // Force hide
        el.classList.remove('active');
        if (typeof AUDIO !== 'undefined') AUDIO.playSound('sfx_click');
    }
}

// --- HELPER: PLAYER PICKER MODAL ---
function showPlayerPicker(title, targets, onPick) {
    const m = document.getElementById('card-modal');
    document.getElementById('enc-title').innerText = title;
    document.getElementById('enc-desc').innerText = "Choose a target:";
    document.getElementById('enc-header').className = 'card-header';
    const l = document.getElementById('choice-list');
    l.innerHTML = '';
    document.getElementById('dice-result').innerHTML = '';
    document.getElementById('market-sell-area').style.display = 'none';

    targets.forEach(t => {
        let b = document.createElement('div');
        b.className = 'choice-btn';
        b.innerText = t.name + (t.isBoss ? " (Boss)" : "");
        b.onclick = () => {
            m.classList.remove('active');
            onPick(t);
        };
        l.appendChild(b);
    });

    // Cancel Button
    let b = document.createElement('div');
    b.className = 'choice-btn';
    b.innerText = "Cancel";
    b.onclick = () => { m.classList.remove('active'); };
    l.appendChild(b);

    m.classList.add('active');
}

// --- HELPER: CREATE SHRINE MESH ---
function createShrineMesh() {
    const g = new THREE.Group();
    const matStone = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const matGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaaa });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.2, 6), matStone);
    base.position.y = 0.1;

    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), matStone);
    pillar.position.y = 0.8;

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.25), matGlow);
    orb.position.y = 1.6;

    g.add(base, pillar, orb);
    return g;
}

// ==========================================
//   DEBUG CONSOLE LOGIC
// ==========================================

// 1. Listen for Backtick (`)
document.addEventListener('keydown', function (e) {
    if (e.key === '`') {
        const consoleDiv = document.getElementById('debug-console');
        const input = document.getElementById('console-input');

        if (consoleDiv.style.display === 'none') {
            consoleDiv.style.display = 'block';
            input.focus();
        } else {
            consoleDiv.style.display = 'none';
        }
        e.preventDefault(); // Prevent typing ` in the box
    }
});

// 2. Handle Console Command
document.getElementById('console-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const val = this.value.trim();

        if (val === "Testy") {
            // ENABLE DEBUG
            enableDebugMode();
            this.value = "";
            document.getElementById('debug-console').style.display = 'none';
            const settings = document.getElementById('settings-modal');
            settings.style.display = 'flex';
            AUDIO.playSound('sfx_gold');
        }
        else if (val === "TestyOff") {
            // DISABLE DEBUG
            disableDebugMode();
            this.value = "";
            document.getElementById('debug-console').style.display = 'none';
            AUDIO.playSound('sfx_fail'); // Audio confirmation
        }
        else {
            // UNKNOWN COMMAND
            this.value = "";
            this.placeholder = "Unknown Command";
            setTimeout(() => this.placeholder = "Type command...", 1000);
        }
    }
});

function grantPremiumByEmail() {
    const email = prompt("Enter the User's Email to GRANT Premium:");
    if (!email) return;
    const cleanEmail = email.trim();

    // 1. Check if user already exists in DB
    db.ref('users').orderByChild('email').equalTo(cleanEmail).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                // CASE A: User Exists - Apply immediately
                snapshot.forEach(childSnap => {
                    const uid = childSnap.key;
                    db.ref(`users/${uid}/isPremium`).set(true)
                        .then(() => alert(`SUCCESS: Premium added to existing user ${cleanEmail}.`));
                });
            } else {
                // CASE B: User Does Not Exist - Pre-approve
                const confirmInvite = confirm(`User ${cleanEmail} not found in database.\n\n1. Add to Pre-Approved list?\n2. Generate Invite?`);

                if (confirmInvite) {
                    // 1. Add to VIP List (Sanitize email by replacing . with ,)
                    const sanitizedEmail = cleanEmail.replace(/\./g, ',');
                    db.ref(`preapproved_premium/${sanitizedEmail}`).set(true);

                    // 2. Prepare Message
                    const subject = "You've been gifted Questopoly Premium!";
                    const bodyText = `Welcome to Questopoly!\n\nAn admin has granted you Ad-Free status.\n\n1. Go to: https://deathforgegames.com\n2. Register with this email: ${cleanEmail}\n3. Log in and enjoy!`;

                    // 3. Try to open Email Client
                    const mailtoLink = `mailto:${cleanEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
                    const win = window.open(mailtoLink, '_blank');

                    // 4. Fallback: If client didn't open (or user uses Webmail), show text to copy
                    if (!win || win.closed || typeof win.closed == 'undefined') {
                        // Use a prompt so the text is selectable/copyable
                        prompt(
                            "Database Updated!\n\nIt looks like your computer didn't open an email client automatically.\n\nCopy this message to send to them manually:",
                            bodyText
                        );
                    }
                }
            }
        });
}

function revokePremiumByEmail() {
    const email = prompt("Enter the User's Email to revoke Premium:");
    if (!email) return;

    // 1. Find the User ID (UID) based on the email
    db.ref('users').orderByChild('email').equalTo(email.trim()).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                // Loop through results (should only be one)
                snapshot.forEach(childSnap => {
                    const uid = childSnap.key;
                    const userData = childSnap.val();

                    if (userData.isPremium) {
                        // 2. Remove the isPremium field
                        db.ref(`users/${uid}/isPremium`).remove()
                            .then(() => {
                                alert(`SUCCESS: Premium removed for ${email}.`);
                                console.log(`[ADMIN] Revoked premium for UID: ${uid}`);
                            })
                            .catch(err => alert("Error updating DB: " + err.message));
                    } else {
                        alert(`User ${email} does not have Premium status.`);
                    }
                });
            } else {
                alert("User not found. Make sure they have logged in at least once.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Database Error: Check console for details. (Requires email indexing rules in larger apps)");
        });
}

function enableDebugMode() {
    const debugContainer = document.getElementById('debug-controls');
    const list = document.getElementById('debug-event-list');
    const logOverlay = document.getElementById('debug-log-overlay');

    // Reveal UI
    debugContainer.style.display = 'block';
    logOverlay.style.display = 'flex';
    if (document.getElementById('btn-admin-open')) document.getElementById('btn-admin-open').style.display = 'block'; // SHOW ADMIN MAILBOX
    list.innerHTML = '';

    // 1. ADMIN TOGGLE
    const adminBtn = document.createElement('button');
    adminBtn.className = 'debug-btn';
    adminBtn.innerHTML = `TOGGLE ADMIN MODE <span>(${isAdminMode ? 'ON' : 'OFF'})</span>`;
    adminBtn.style.borderColor = '#ef4444';
    adminBtn.style.backgroundColor = isAdminMode ? '#7f1d1d' : '#333';
    adminBtn.onclick = () => {
        isAdminMode = !isAdminMode;
        adminBtn.innerHTML = `TOGGLE ADMIN MODE <span>(${isAdminMode ? 'ON' : 'OFF'})</span>`;
        adminBtn.style.backgroundColor = isAdminMode ? '#7f1d1d' : '#333';
        if (document.getElementById('lobby-screen').style.display !== 'none') LOBBY.refreshList();
        addLog(`Admin Mode: ${isAdminMode}`);
    };
    list.appendChild(adminBtn);

    // 2. GLOBAL UPDATE
    const updateBtn = document.createElement('button');
    updateBtn.className = 'debug-btn';
    updateBtn.innerHTML = `ADMIN: POST GLOBAL UPDATE <span>📝</span>`;
    updateBtn.style.borderColor = '#3b82f6';
    updateBtn.style.color = '#3b82f6';
    updateBtn.onclick = () => {
        const text = prompt("Enter the Global Update text (Use \\n for new lines):");
        if (text && text.trim().length > 0) {
            const formatted = text.replace(/\\n/g, '\n');
            db.ref('system/update').set({
                text: formatted,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                alert("Global Update Posted!");
                localStorage.removeItem('sys_update_read_time');
            }).catch((error) => {
                console.warn("Failed to post global update:", error);
                alert("Permission denied: You need admin access to post global updates.");
            });
        }
    };
    list.appendChild(updateBtn);

    // 3. WIPE GAMES
    const clearGamesBtn = document.createElement('button');
    clearGamesBtn.className = 'debug-btn';
    clearGamesBtn.innerHTML = `ADMIN: WIPE ALL GAMES <span>⚠</span>`;
    clearGamesBtn.style.borderColor = '#ef4444';
    clearGamesBtn.style.color = '#ef4444';
    clearGamesBtn.onclick = () => {
        if (confirm("WARNING: Delete ALL active games?")) {
            if (confirm("Really sure?")) {
                db.ref('games').remove().then(() => alert("All games cleared."));
            }
        }
    };
    list.appendChild(clearGamesBtn);

    // 4. FREE STORE TOGGLE
    const freeStoreBtn = document.createElement('button');
    freeStoreBtn.className = 'debug-btn';
    freeStoreBtn.innerHTML = `TEST: FREE STORE MODE <span>(${isStoreTestMode ? 'ON' : 'OFF'})</span>`;
    freeStoreBtn.style.borderColor = '#10b981';
    freeStoreBtn.onclick = () => {
        isStoreTestMode = !isStoreTestMode;
        freeStoreBtn.innerHTML = `TEST: FREE STORE MODE <span>(${isStoreTestMode ? 'ON' : 'OFF'})</span>`;
        alert(`Store Test Mode: ${isStoreTestMode ? "ON. Open Store to see Sim Button." : "OFF"}`);
    };
    list.appendChild(freeStoreBtn);

    // 5. REVOKE SELF
    const revokeBtn = document.createElement('button');
    revokeBtn.className = 'debug-btn';
    revokeBtn.innerHTML = `TEST: REVOKE MY PREMIUM <span>⚠</span>`;
    revokeBtn.style.borderColor = '#ef4444';
    revokeBtn.onclick = () => {
        if (confirm("Remove 'isPremium' from your account and reload?")) {
            db.ref(`users/${currentUser.uid}/isPremium`).remove().then(() => {
                window.location.reload();
            });
        }
    };
    list.appendChild(revokeBtn);

    // 6. REVOKE BY EMAIL
    const revokeEmailBtn = document.createElement('button');
    revokeEmailBtn.className = 'debug-btn';
    revokeEmailBtn.innerHTML = `ADMIN: RemoveAdPurchase <span>🚫</span>`;
    revokeEmailBtn.style.borderColor = '#f59e0b';
    revokeEmailBtn.onclick = revokePremiumByEmail;
    list.appendChild(revokeEmailBtn);

    // 7. GRANT BY EMAIL
    const grantEmailBtn = document.createElement('button');
    grantEmailBtn.className = 'debug-btn';
    grantEmailBtn.innerHTML = `ADMIN: GrantAdFree <span>🎁</span>`;
    grantEmailBtn.style.borderColor = '#10b981';
    grantEmailBtn.onclick = grantPremiumByEmail;
    list.appendChild(grantEmailBtn);

    // 8. FORCE END TURN
    const fixBtn = document.createElement('button');
    fixBtn.className = 'debug-btn';
    fixBtn.innerHTML = `EMERGENCY: FORCE END TURN <span>FIX</span>`;
    fixBtn.style.borderColor = '#f59e0b';
    fixBtn.onclick = () => {
        debugLog("Force Ending Turn...");
        gameState = 'END';
        turnProcessing = false;
        if (activeEvent && activeEvent.mesh) scene.remove(activeEvent.mesh);
        document.getElementById('card-modal').classList.remove('active');
        endTurn();
    };
    list.appendChild(fixBtn);

    // 9. DRAW TREASURE (New)
    const treasBtn = document.createElement('button');
    treasBtn.className = 'debug-btn';
    treasBtn.innerHTML = `🛠 DRAW TREASURE <span>LOOT</span>`;
    treasBtn.style.borderColor = '#ffd700'; // Gold border
    treasBtn.style.color = '#ffd700';
    treasBtn.onclick = () => {
        const card = DECK_TREASURE[Math.floor(Math.random() * DECK_TREASURE.length)];
        showEncounter(players[myPlayerId], card, null, 'loot');
        toggleSettingsModal();
    };
    // 10. TELEPORT TO TILE (New)
    const tpBtn = document.createElement('button');
    tpBtn.className = 'debug-btn';
    tpBtn.innerHTML = `✈ TELEPORT TO TILE <span>MOVE</span>`;
    tpBtn.style.borderColor = '#0ea5e9'; // Sky Blue
    tpBtn.style.color = '#0ea5e9';
    tpBtn.onclick = () => {
        const m = document.getElementById('card-modal');
        document.getElementById('enc-title').innerText = "Select Destination";
        document.getElementById('enc-desc').innerText = "Choose a tile to teleport to:";
        document.getElementById('enc-header').className = 'card-header';
        const l = document.getElementById('choice-list');
        l.innerHTML = '';
        document.getElementById('dice-result').innerHTML = '';

        // --- NEW: SCROLL & SCALE LOGIC ---
        // Make the list scrollable and fit within the view
        l.style.maxHeight = "60vh";
        l.style.overflowY = "auto";
        l.style.display = "block"; // Ensure block layout for scrolling
        l.style.paddingRight = "10px";

        // Cleanup helper to reset styles when closing
        const cleanup = () => {
            m.classList.remove('active');
            l.style.maxHeight = '';
            l.style.overflowY = '';
            l.style.display = '';
            l.style.paddingRight = '';
        };

        LOCATIONS.forEach((loc, i) => {
            const btn = document.createElement('div');
            btn.className = 'choice-btn';
            btn.style.textAlign = 'left';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'space-between';

            // Highlight Dungeon Entrances
            if (loc.isDungeonEntrance) {
                btn.style.border = '1px solid #ef4444';
                btn.style.color = '#ef4444';
                btn.innerHTML = `<b>${i}. ${loc.name}</b> <span>[DUNGEON]</span>`;
            } else {
                btn.innerHTML = `${i}. ${loc.name}`;
            }

            btn.onclick = () => {
                const p = players[myPlayerId];
                p.pos = i;

                // Teleport Visuals
                if (tiles[i]) p.mesh.position.copy(tiles[i].position);

                // Multiplayer Sync
                if (isMultiplayer && gameId && db) {
                    db.ref(`games/${gameId}/players/${p.id}/pos`).set(i);
                    db.ref(`games/${gameId}/teleportLog`).push({
                        pid: p.id, targetPos: i, timestamp: firebase.database.ServerValue.TIMESTAMP
                    });
                }

                // Trigger Logic
                addLog(`Debug Teleport to ${loc.name}`, "log-rare");
                cleanup(); // Close teleport list FIRST
                toggleSettingsModal(); // Close settings menu
                resolveLanding(p); // THEN trigger new event (which opens modal)
            };
            l.appendChild(btn);
        });

        // Add Close Button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'choice-btn';
        closeBtn.innerText = "Cancel";
        closeBtn.onclick = () => cleanup(); // Use cleanup
        l.appendChild(closeBtn);

        m.classList.add('active');
    };
    list.appendChild(tpBtn);

    // 9. DYNAMIC EVENTS LIST
    MAP_EVENTS.forEach((ev, index) => {
        const btn = document.createElement('button');
        btn.className = 'debug-btn';

        // Custom styling for Dungeons
        if (ev.type === 'dungeon') {
            btn.innerHTML = `🏰 ${ev.name}`;
            btn.style.borderColor = '#a855f7'; // Purple Border
            btn.style.color = '#d8b4fe';       // Light Purple Text
            btn.style.fontWeight = 'bold';
        } else {
            btn.innerHTML = `${ev.name} <span>INPUT</span>`;
        }

        btn.onclick = () => {
            forceTriggerEvent(index);
            toggleSettingsModal();
        };
        list.appendChild(btn);
    });

    debugLog("Debug Mode Enabled.");
}
function disableDebugMode() {
    // 1. Hide Debug UI elements
    document.getElementById('debug-controls').style.display = 'none';
    document.getElementById('debug-log-overlay').style.display = 'none';
    if (document.getElementById('btn-admin-open')) document.getElementById('btn-admin-open').style.display = 'none'; // HIDE ADMIN BUTTON

    // 2. Close Settings modal if open (to hide the debug controls inside it)
    document.getElementById('settings-modal').style.display = 'none';

    // 3. Reset Admin Mode to False
    isAdminMode = false;

    // 4. Refresh Lobby list to remove red "Delete" buttons if currently in lobby
    if (document.getElementById('lobby-screen').style.display !== 'none') {
        LOBBY.refreshList();
    }

    addLog("Debug Mode Deactivated.", "log-fail");
}

// 3. Logic to Force a Specific Event (Modified triggerRandomEvent)
function forceTriggerEvent(index) {
    // 1. Validate Input
    const evData = MAP_EVENTS[index];
    if (!evData) return;

    // Mapping Event Names to Dungeon Types
    const dungeonMap = {
        "Void Edge": "Void Edge",
        "Vampire Manor": "Vampire Manor",
        "Demon Gate": "Demon Gate",
        "Wyvern Peak": "Wyvern Peak"
    };

    // 2. Multiplayer Logic (Host pushes to DB)
    if (isMultiplayer && db && gameId) {
        // Push the event to the active list
        db.ref(`games/${gameId}/activeEvents`).push({
            idx: index,
            turns: evData.duration,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // NEW: Check if this is a Dungeon Event and activate the dungeon globally
        if (dungeonMap[evData.name]) {
            db.ref(`games/${gameId}/dungeonActive`).set({ type: dungeonMap[evData.name] });
        }

        addLog(`DEBUG: Broadcasted ${evData.name}`, "log-rare");
    }
    // 3. Single Player Logic (Local Push)
    else {
        // Create the event object
        const localEvent = {
            id: Date.now() + Math.random(),
            data: evData,
            turnsLeft: evData.duration,
            playerRef: null
        };

        // Temporarily set global activeEvent so spawn functions work
        activeEvent = localEvent;

        // Run Start Logic (Spawns bosses, sets weather particles)
        if (evData.onStart) evData.onStart();

        // NEW: Explicitly trigger visual spawn for Single Player if it's a dungeon
        if (dungeonMap[evData.name]) {
            spawnDungeonVisuals(dungeonMap[evData.name]);
        }

        // Push to the array
        activeEvents.push(localEvent);

        // Clear the temp global
        activeEvent = null;

        addLog(`DEBUG: Force Started ${evData.name}`, "log-epic");
        addLog(evData.desc, "log-rare");
        updateHUD();
    }

    AUDIO.playSound('sfx_transition');
}

function toggleDebugLog() {
    const overlay = document.getElementById('debug-log-overlay');
    const btn = document.getElementById('btn-min-log');

    // Toggle the class
    overlay.classList.toggle('minimized');

    // Change Button Icon based on state
    if (overlay.classList.contains('minimized')) {
        btn.innerText = "□"; // Square icon to represent "Maximize"
        // Optional: Scroll log to bottom just in case when minimizing
    } else {
        btn.innerText = "_"; // Underscore to represent "Minimize"

        // Auto-scroll to bottom when maximizing so you see latest logs
        const content = document.getElementById('debug-log-content');
        if (content) content.scrollTop = 0; // Since it uses flex-reverse, 0 is bottom
    }
}

function copyDebugLog() {
    const content = document.getElementById('debug-log-content');
    if (!content) return;

    // Get text content (preserves newlines usually)
    const text = content.innerText;

    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const btn = document.getElementById('btn-copy-log');
        const originalText = btn.innerText;
        btn.innerText = "COPIED!";
        setTimeout(() => {
            btn.innerText = originalText;
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy log:', err);
        alert("Failed to copy log. Check console permissions.");
    });
}

function handleTimeoutAction(p) {
    // 1. Increment Strikes
    p.afkStrikes = (p.afkStrikes || 0) + 1;

    // 2. Identify UI Context
    const arrivalModal = document.getElementById('arrival-modal');
    const cardModal = document.getElementById('card-modal');
    const isArrivalOpen = arrivalModal && arrivalModal.classList.contains('active');
    const isEncounterOpen = cardModal && cardModal.classList.contains('active');

    // CONTEXT A: Space Card (Arrival) is Open
    if (isArrivalOpen) {
        addLog(`${p.name} timed out. Auto-continuing.`, "log-entry");
        // Reset timer implicitly happens in next step, but doing it here prevents double firing
        lastInteractionTime = Date.now();
        continueFromArrival();
    }
    // CONTEXT B: Encounter/Shop Card is Open
    else if (isEncounterOpen) {
        addLog(`${p.name} timed out. Encounter FAILED.`, "log-fail");
        lastInteractionTime = Date.now();
        // Force fail/leave logic
        closeEnc();
    }
    // CONTEXT C: Main Board (Needs to Roll or End Turn)
    else {
        addLog(`${p.name} timed out. Turn Skipped.`, "log-fail");
        lastInteractionTime = Date.now();
        endTurn();
    }

    // 3. Sync Strikes (Host handles DB updates for strikes)
    if (isMultiplayer && (myPlayerId === 0 || p.id === myPlayerId)) {
        db.ref(`games/${gameId}/players/${p.id}`).update({ afkStrikes: p.afkStrikes });
    }

    // 4. Check Elimination
    if (p.afkStrikes >= 3) {
        addLog(`${p.name} kicked for AFK (3 Strikes).`, "log-fail");
        eliminatePlayer(p);

        // If MP Host, sync the death to DB
        if (isMultiplayer && myPlayerId === 0) {
            db.ref(`games/${gameId}/players/${p.id}`).update({ isDead: true, gold: 0 });
            // Clear their board properties in DB
            tiles.forEach(t => {
                if (t.userData.owner === p.id) {
                    db.ref(`games/${gameId}/board/${t.userData.id}`).set({
                        owner: null, level: 0, guardCount: 0
                    });
                }
            });
        }
    }
}

// Start Engine
init();

// --- OVERWORLD HEALTH BAR HOOK ---
function updateHealthBar() {
    const p = players.find(pl => pl.id === myPlayerId);
    const bar = document.getElementById('overworld-health-bar');
    if (!p || !bar) return;

    // Use calculated maxHealth stat
    recalcStats(p);
    const maxHealth = p.stats.maxHealth || (10 + (p.stats.str || 0));

    if (typeof p.hp === 'undefined') {
        p.hp = maxHealth;
        p.maxHp = maxHealth;
    }

    const fill = document.getElementById('health-fill');
    const text = document.getElementById('health-text');
    const pct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
    if (fill) fill.style.width = pct + '%';
    if (text) text.innerText = p.hp + ' / ' + p.maxHp;
    bar.style.display = 'block';
}

if (typeof updateHUD === 'function') {
    const _origUpdateHUD = updateHUD;
    updateHUD = function () {
        _origUpdateHUD();
        updateHealthBar();
    };
} else {
    console.warn('updateHUD not found for hooking, defining fallback.');
    window.updateHUD = function () { updateHealthBar(); };
}

// --- MOBILE BATTLE QUEUE TOGGLE ---
function toggleQueue() {
    const q = document.getElementById('battle-queue');
    const t = document.getElementById('queue-toggle');
    if (q) {
        q.classList.toggle('open');
        if (t) {
            t.classList.toggle('open');
            // Update Arrow
            if (q.classList.contains('open')) t.innerText = "▶";
            else t.innerText = "◀";
        }
    }
}

// --- SETTINGS & AI SIMULATION ---
window.watchAiBattles = false; // DEFAULT: FALSE

function openSettings() {
    const m = document.getElementById('settings-modal');
    if (m) {
        m.style.display = 'flex';
        const chk = document.getElementById('chk-watch-ai');
        if (chk) chk.checked = window.watchAiBattles;
    }
}

function openHelpModal() {
    const m = document.getElementById('help-modal');
    if (m) m.style.display = 'flex';
}

function toggleWatchAi(checked) {
    window.watchAiBattles = checked;
}

// --- FREE CAMERA MODE ---
window.freeCamMode = false;
let isRightMouseDown = false;
let lastMousePos = null;
let currentMousePos = { x: 0, y: 0 };

function toggleFreeCam(val) {
    window.freeCamMode = val;
    addLog(`Free Camera: ${val ? 'ENABLED' : 'DISABLED'}`, "log-info");
    if (!val) updateCamera(); // Reset to default view
}

document.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
        isRightMouseDown = true;
        lastMousePos = { x: e.clientX, y: e.clientY };
    }
});

document.addEventListener('mousemove', (e) => {
    currentMousePos = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) {
        isRightMouseDown = false;
        lastMousePos = null;
    }
});

// Disable context menu for right-click dragging while in free cam
document.addEventListener('contextmenu', (e) => {
    if (window.freeCamMode) e.preventDefault();
});

function simulateAiBattle(battle) {
    const p = battle.player;
    addLog(`AI ${p.name} is resolving combat...`, "neutral");

    // Simple 60/40 Win Chance (Harder for Bosses)
    let winChance = 0.6;
    if (battle.isBoss) winChance = 0.4;

    setTimeout(() => {
        if (Math.random() < winChance) {
            activeBattle.opponents.forEach(o => o.hp = 0);
            endBattle(true);
        } else {
            activeBattle.pHp = 0;
            endBattle(false);
        }
    }, 1000);
}

// --- AI BATTLE AUTOMATION ---
function automateActiveAiTurn() {
    if (!activeBattle) return;
    const p = activeBattle.player;
    const stats = p.stats || { str: 1, dex: 1, int: 1 };

    // --- NEW: AI SKILL USAGE (40% Chance) ---
    // Check if we have an active skill, it's a battle skill, and not on cooldown
    if (p.activeSkillId && Math.random() < 0.4) {
        // Ensure cooldown object exists
        if (!p.battleCooldowns) p.battleCooldowns = {};

        // Check Cooldown
        if (!p.battleCooldowns[p.activeSkillId]) {
            const skill = ABILITY_LIBRARY[p.activeSkillId];
            if (skill && skill.dungeonFn) {
                // Try to use it
                console.log(`[AI] ${p.name} decides to use Skill: ${skill.name}`);
                useBattleSkill(p.activeSkillId);
                return; // Skill usage handles turn end
            }
        }
    }

    const choices = ['str', 'dex', 'int'];
    const best = choices.sort((a, b) => stats[b] - stats[a])[0];
    let pick = best;
    if (Math.random() < 0.2) pick = choices[Math.floor(Math.random() * 3)];
    resolveBattleRound(pick);
}

function automateAiDefense() {
    if (!activeBattle) return;
    const choices = ['str', 'dex', 'int'];
    const pick = choices[Math.floor(Math.random() * 3)];
    resolveBattleRound(pick);
}

// --- HELP FILTER ---
function filterHelp() {
    const term = document.getElementById('help-search-input').value.toLowerCase();
    const sections = document.querySelectorAll('.help-section');
    sections.forEach(sec => {
        const text = sec.innerText.toLowerCase();
        sec.style.display = text.includes(term) ? 'block' : 'none';
    });
}

// --- TUTORIAL SYSTEM ---
const TUTORIAL = {

    active: false,
    activeArrows: 0,
    seen: { battle: false, dungeon: false, encounter: false },

    start: function () {
        if (typeof isMultiplayer !== 'undefined' && isMultiplayer) return;
        this.active = true;
        this.setupBackdrop();

        // Wait for Loading Screen to fade
        setTimeout(() => {
            addLog("TUTORIAL: Welcome! Click yellow arrows to dismiss them.", "log-info");
            this.showIntro();
        }, 1500);
    },

    setupBackdrop: function () {
        if (!document.getElementById('tut-backdrop')) {
            const bd = document.createElement('div');
            bd.id = 'tut-backdrop';
            // We moved styles to CSS, but ensure click blocking here just in case
            document.body.appendChild(bd);
        }
    },

    showBackdrop: function () {
        const bd = document.getElementById('tut-backdrop');
        if (bd) bd.style.display = 'block';
    },

    hideBackdrop: function () {
        const bd = document.getElementById('tut-backdrop');
        if (bd) bd.style.display = 'none';
    },

    createArrow: function (targetId, text, side = "bottom") {
        const target = document.getElementById(targetId);
        if (!target || target.offsetParent === null) return;

        this.activeArrows++;
        this.showBackdrop();

        const rect = target.getBoundingClientRect();
        const arrow = document.createElement('div');
        arrow.className = 'tut-arrow';

        // Calculate Position
        let top = 0, left = 0;

        if (side === 'bottom') {
            top = rect.bottom + 10;
            left = rect.left + (rect.width / 2);
            arrow.innerHTML = `<div class="tut-point">⬆</div><div class="tut-text">${text}</div>`;
        } else if (side === 'top') {
            top = rect.top - 80;
            left = rect.left + (rect.width / 2);
            arrow.innerHTML = `<div class="tut-text">${text}</div><div class="tut-point">⬇</div>`;
        } else if (side === 'right') {
            top = rect.top + (rect.height / 2) - 20;
            left = rect.right + 10;
            arrow.innerHTML = `<div class="tut-point">⬅</div><div class="tut-text">${text}</div>`;
            arrow.style.flexDirection = 'row';
        } else if (side === 'left') {
            top = rect.top + (rect.height / 2) - 20;
            left = rect.left - 200;
            arrow.innerHTML = `<div class="tut-text">${text}</div><div class="tut-point">➡</div>`;
            arrow.style.flexDirection = 'row';
        }

        arrow.style.top = top + 'px';
        arrow.style.left = left + 'px';

        // Center alignment adjustment
        if (side === 'top' || side === 'bottom') {
            arrow.style.transform = 'translateX(-50%)';
        }

        document.body.appendChild(arrow);

        // Interaction
        const cleanup = () => {
            if (arrow.parentNode) {
                arrow.style.opacity = '0';
                setTimeout(() => arrow.remove(), 500);

                this.activeArrows--;
                if (this.activeArrows <= 0) this.hideBackdrop();
            }
        };

        arrow.onclick = cleanup;
    },

    showIntro: function () {
        this.createArrow('p1-sheet', 'Stats, Inventory & Gold', 'right');
        this.createArrow('skill-bar', 'Your Skills & Items', 'top');
        this.createArrow('btn-action', 'Roll Dice / End Turn', 'top');
        this.createArrow('utility-stack', 'Menu, Help & Leaderboard', 'left');
    },

    showBattle: function (isDungeon) {
        if (!this.active) return;

        setTimeout(() => {
            this.createArrow('battle-skills', 'Click to use Abilities', 'top');
            if (!isDungeon) this.createArrow('battle-flee-btn', 'Escape (-Gold)', 'left');
            this.createArrow('battle-player-name', 'Your Health', 'bottom');
        }, 1200);

        if (isDungeon) this.seen.dungeon = true;
        else this.seen.battle = true;
    },

    showEncounter: function () {
        if (!this.active || this.seen.encounter) return;

        setTimeout(() => {
            this.createArrow('enc-title', 'Event Name', 'top');
            this.createArrow('choice-list', 'Make your choice / Roll dice', 'bottom');
        }, 800);
        this.seen.encounter = true;
    }
};

// --- TOOLTIP SYSTEM ---
function showTooltip(data, isSkillId) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    let tooltipData = null;
    let isItem = false;

    // Handle skill ID strings
    if (isSkillId && typeof data === 'string') {
        tooltipData = ABILITY_LIBRARY[data];
    }
    // Handle skill or item objects
    else if (typeof data === 'object' && data !== null) {
        tooltipData = data;
        // Detect if this is an item (has rarity, slot, or type but no dungeonFn)
        isItem = data.rarity || data.slot || (data.type && !data.dungeonFn);
    }

    if (!tooltipData) {
        tooltip.style.display = 'none';
        return;
    }

    // Build tooltip content based on type
    let html = '';

    if (isItem) {
        // ITEM TOOLTIP
        const rarityColors = {
            common: '#9d9d9d',
            rare: '#0070dd',
            epic: '#a335ee',
            legendary: '#ff8000'
        };
        const rarityColor = rarityColors[tooltipData.rarity] || '#fff';

        html = `
            ${tooltipData.img ? `<img src="${tooltipData.img}" style="width:50px; height:50px; float:left; margin-right:10px; border-radius:4px; border:2px solid ${rarityColor};">` : ''}
            <div style="font-weight:bold; color:${rarityColor}; margin-bottom:5px;">${tooltipData.name || 'Unknown Item'}</div>
            ${tooltipData.slot ? `<div style="font-size:0.75em; color:#888; margin-bottom:3px;">${tooltipData.slot.toUpperCase()}</div>` : ''}
        `;

        // Add stat bonuses if present
        if (tooltipData.bonus) {
            html += `<div style="margin-top:3px; font-size:0.85em; color:#10b981;">`;
            Object.entries(tooltipData.bonus).forEach(([stat, val]) => {
                html += `+${val} ${stat.toUpperCase()}<br>`;
            });
            html += `</div>`;
        }

        // Add secondary stats
        const secondaryStats = [];
        if (tooltipData.moveBonus) secondaryStats.push(`+${tooltipData.moveBonus} Movement`);
        if (tooltipData.goldFind) secondaryStats.push(`+${tooltipData.goldFind} Gold Find`);
        if (tooltipData.resistance) secondaryStats.push(`+${tooltipData.resistance} Resistance`);

        if (secondaryStats.length > 0) {
            html += `<div style="margin-top:3px; font-size:0.85em; color:#3b82f6;">`;
            html += secondaryStats.join('<br>');
            html += `</div>`;
        }

        // Add ability if present
        if (tooltipData.ability && tooltipData.ability.desc) {
            const abilityIcon = tooltipData.ability.img || (tooltipData.ability.id && ABILITY_LIBRARY[tooltipData.ability.id]?.img) || '';
            html += `<div style="margin-top:5px; font-size:0.8em; color:#fbbf24; font-style:italic;">`;
            if (abilityIcon) {
                html += `<img src="${abilityIcon}" style="width:20px; height:20px; vertical-align:middle; margin-right:5px; border-radius:3px;">`;
            }
            html += `${tooltipData.ability.desc}</div>`;
        }

        // Show description only if it actually exists
        if (tooltipData.desc || tooltipData.description) {
            html += `<div style="margin-top:3px; font-size:0.85em; color:#ccc;">${tooltipData.desc || tooltipData.description}</div>`;
        }
    } else {
        // SKILL TOOLTIP
        html = `
            ${tooltipData.img ? `<img src="${tooltipData.img}" style="width:50px; height:50px; float:left; margin-right:10px; border-radius:4px; border:2px solid var(--gold-main);">` : ''}
            <div style="font-weight:bold; color:var(--gold-main); margin-bottom:5px;">${tooltipData.name || 'Unknown'}</div>
            <div style="font-size:0.85em; color:#ccc;">${tooltipData.desc || 'No description available.'}</div>
        `;
    }

    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
}
