let scene, camera, renderer;
let tiles = [], players = [], turnIndex = 0, gameState = 'SETUP', treasuryGold = 0;
let normalDeck, skirmishDeck, treasureDeck;
let turnCount = 0, isNight = false;
let selRace = null, selClass = null, selColor = "#ef4444", selActiveId = null, selActiveId2 = null, selPassiveId = null;
let nightBoard = null;
let fogGroup = null;
let turnProcessing = false;
let lastMoveTimestamp = 0; // Tracks the last processed move ID
let activeSceneryParticles = []; // For Volcanic smoke and Void fog animation
let dungeonSceneryMesh = [];     // To track meshes for cleanup

// --- GUARD & ANIMATION GLOBALS ---
let activeGuards = []; // Tracks all guard objects for animation

// Call this inside your main animate() loop
function updateGuards() {
    const time = Date.now() * 0.001;
    activeGuards.forEach(g => {
        if (!g.mesh) return;

        // Logic: Move towards target
        const speed = 0.02;
        const dx = g.target.x - g.mesh.position.x;
        const dz = g.target.z - g.mesh.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.1) {
            // Pick new random target within the tile limits, avoiding the center (Tavern)
            // Tile is approx 3.8x3.8. Local coords: -1.5 to 1.5. Tavern radius approx 0.8
            let valid = false;
            let tries = 0;
            while (!valid && tries < 10) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 1.0 + Math.random() * 0.6; // Keep away from center
                g.target.x = Math.cos(angle) * radius;
                g.target.z = Math.sin(angle) * radius;
                valid = true;
                tries++;
            }
            // Face new target
            g.mesh.lookAt(g.target.x, g.mesh.position.y, g.target.z);
        } else {
            // Move
            g.mesh.position.x += (dx / dist) * speed;
            g.mesh.position.z += (dz / dist) * speed;

            // Bobbing animation
            g.mesh.position.y = 0.2 + Math.abs(Math.sin(time * 5)) * 0.1;
        }
    });
}

// --- CAMERA & ANIMATION GLOBALS ---
let isZoomed = false;
let cameraTarget = null;

const PLAYER_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#FFFFFF"];

// --- NEW: Map Hex to Human Names ---
const COLOR_NAMES = {
    "#ef4444": "Red",
    "#3b82f6": "Blue",
    "#10b981": "Green",
    "#f59e0b": "Gold",
    "#8b5cf6": "Purple",
    "#FFFFFF": "White"
};
const EQUIP_ORDER = ['head', 'body', 'hands', 'feet', 'ring_l', 'ring_r', 'amulet', 'back', 'main', 'off'];
const SECONDARY_STAT_VALUES = {
    common: 2,
    rare: 4,
    epic: 6,
    legendary: 8
};
let activePickerSlot = null; // Tracks which skill slot we are currently assigning



// --- DUNGEON GLOBALS ---
let activeDungeons = {}; // NOW AN OBJECT MAP: { "Void Edge": { ... }, "Demon Gate": { ... } }
let dungeonGroup = null; // Container for all dungeon meshes

// --- DUNGEON CONFIGURATION ---
const DUNGEON_DATA = {
    "Void Edge": {
        length: 12, // Longer for maze feel
        color: 0x1e1b4b,
        wallColor: 0x000000,
        floorImg: "https://static.wixstatic.com/media/b16479_1bf7a0ceaf804ac78737b10e95be3471~mv2.jpg",
        bossName: "Void Leviathan",
        bossColor: 0x4c1d95,
        spawnStyle: "float_up", // Tiles float up from abyss
        encounters: [ /* ... keep existing ... */]
    },
    "Vampire Manor": {
        length: 10,
        color: 0x450a0a,
        wallColor: 0x292524,
        floorImg: "https://static.wixstatic.com/media/b16479_dcd16c13cf2c44cfa9d3819f7d688030~mv2.jpg",
        bossName: "Countess Crimson",
        bossColor: 0x991b1b,
        spawnStyle: "fade_mist", // Tiles appear with red smoke
        encounters: [ /* ... keep existing ... */]
    },
    "Demon Gate": {
        length: 14,
        color: 0x7f1d1d,
        wallColor: 0x000000,
        floorImg: "https://static.wixstatic.com/media/b16479_eeee26deb4a5420cbaf505abfef44fcd~mv2.jpg",
        bossName: "Balrog Prime",
        bossColor: 0xff4500,
        spawnStyle: "rise_lava", // Tiles burst from ground
        encounters: [ /* ... keep existing ... */]
    },
    "Wyvern Peak": {
        length: 12,
        color: 0x0f172a,
        wallColor: 0xffffff,
        floorImg: "https://static.wixstatic.com/media/b16479_108b4b0733674ad3a2d9456f3f841204~mv2.jpg",
        bossName: "Storm Monarch",
        bossColor: 0x0ea5e9,
        spawnStyle: "fall_sky", // Tiles slam down from sky
        encounters: [ /* ... keep existing ... */]
    }
};



// --- REGION 2: DATA (Names, Races, Classes) ---
const NPC_NAMES = [
    "Aaelin", "Adran", "Aelar", "Aeron", "Alaric", "Aldric", "Amara", "Arin", "Asher", "Astrid",
    "Balthazar", "Bard", "Bran", "Caelum", "Caius", "Caspian", "Cedric", "Corin", "Cyrus", "Darian",
    "Eamon", "Elander", "Elara", "Eldrin", "Elric", "Emrys", "Faen", "Fenris", "Finn", "Galen",
    "Gideon", "Gorim", "Griffin", "Hadrian", "Haldor", "Ignis", "Imara", "Ion", "Jareth", "Jax",
    "Kael", "Kaiden", "Kian", "Kyra", "Leander", "Leo", "Lucian", "Magnus", "Marek", "Mathis",
    "Nael", "Nyx", "Orion", "Orin", "Osric", "Perrin", "Quinn", "Raen", "Ragnar", "Ravyn",
    "Remus", "Rian", "Roan", "Rurik", "Ryker", "Silas", "Soren", "Stig", "Storm", "Talis",
    "Thorne", "Torin", "Tristan", "Tybalt", "Uric", "Valen", "Varis", "Vesper", "Xander", "Zane"
];
