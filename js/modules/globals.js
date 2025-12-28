let scene, camera, renderer;
let tiles = [], players = [], turnIndex = 0, gameState = 'SETUP', treasuryGold = 0;
let worldLevel = 0;
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
        length: 12,
        floorImg: "https://static.wixstatic.com/media/b16479_1bf7a0ceaf804ac78737b10e95be3471~mv2.jpg",
        bg: "https://static.wixstatic.com/media/b16479_73a25efd79af4354ac8c0f4e0abfd9e5~mv2.jpg",
        bossName: "Void Leviathan",
        bossStats: { hp: 20, str: 6, dex: 4, int: 8, img: "https://placehold.co/250x250/4c1d95/ffffff?text=BOSS+Leviathan" },
        spawnStyle: "float_up",
        encounters: [
            { name: "Void Wisp", hp: 8, str: 1, dex: 4, int: 5, img: "https://placehold.co/250x250/333333/ffffff?text=Wisp" },
            { name: "Shadow Stalker", hp: 10, str: 3, dex: 6, int: 2, img: "https://placehold.co/250x250/000000/ffffff?text=Stalker" },
            { name: "Mind Flayer", hp: 12, str: 2, dex: 3, int: 7, img: "https://placehold.co/250x250/4c1d95/00ff00?text=Flayer" },
            { name: "Abyssal Guard", hp: 15, str: 6, dex: 2, int: 2, img: "https://placehold.co/250x250/333333/888888?text=Guard" },
            { name: "Null Zone", hp: 8, str: 2, dex: 2, int: 6, img: "https://placehold.co/250x250/111111/444444?text=Null+Zone" }
        ]
    },
    "Vampire Manor": {
        length: 10,
        floorImg: "https://static.wixstatic.com/media/b16479_dcd16c13cf2c44cfa9d3819f7d688030~mv2.jpg",
        bg: "https://static.wixstatic.com/media/b16479_192e6d09a9dc45c7ba3e1afede14a7c6~mv2.jpg",
        bossName: "Countess Crimson",
        bossStats: { hp: 18, str: 5, dex: 7, int: 6, img: "https://placehold.co/250x250/991b1b/ffffff?text=Countess" },
        spawnStyle: "fade_mist",
        encounters: [
            { name: "Thrall Guard", hp: 10, str: 4, dex: 3, int: 1, img: "https://placehold.co/250x250/555555/ff0000?text=Thrall" },
            { name: "Blood Bat", hp: 6, str: 2, dex: 5, int: 1, img: "https://placehold.co/250x250/333333/ff0000?text=Bat" },
            { name: "Gargoyle", hp: 14, str: 6, dex: 1, int: 2, img: "https://placehold.co/250x250/777777/ffffff?text=Gargoyle" },
            { name: "Illusion Trap", hp: 8, str: 1, dex: 4, int: 6, img: "https://placehold.co/250x250/222222/aa00aa?text=Illusion" },
            { name: "Vampire Spawn", hp: 12, str: 4, dex: 5, int: 3, img: "https://placehold.co/250x250/550000/ffffff?text=Vampire" }
        ]
    },
    "Demon Gate": {
        length: 14,
        floorImg: "https://static.wixstatic.com/media/b16479_eeee26deb4a5420cbaf505abfef44fcd~mv2.jpg",
        bg: "https://static.wixstatic.com/media/b16479_b25f7ae13fa542208757fed18efd4a5d~mv2.jpg",
        bossName: "Balrog Prime",
        bossStats: { hp: 25, str: 9, dex: 3, int: 5, img: "https://placehold.co/250x250/ff4500/000000?text=BALROG" },
        spawnStyle: "rise_lava",
        encounters: [
            { name: "Hellhound", hp: 10, str: 5, dex: 4, int: 1, img: "https://placehold.co/250x250/aa3300/ffff00?text=Hound" },
            { name: "Imp Swarm", hp: 6, str: 1, dex: 5, int: 4, img: "https://placehold.co/250x250/cc5500/ffffff?text=Imps" },
            { name: "Lava Golem", hp: 16, str: 7, dex: 1, int: 1, img: "https://placehold.co/250x250/552200/ffaa00?text=Golem" },
            { name: "Succubus", hp: 12, str: 2, dex: 4, int: 6, img: "https://placehold.co/250x250/ff0055/ffffff?text=Succubus" },
            { name: "Fire Giant", hp: 20, str: 8, dex: 2, int: 2, img: "https://placehold.co/250x250/aa4400/ffffff?text=Giant" }
        ]
    },
    "Wyvern Peak": {
        length: 12,
        floorImg: "https://static.wixstatic.com/media/b16479_108b4b0733674ad3a2d9456f3f841204~mv2.jpg",
        bg: "https://static.wixstatic.com/media/b16479_0ab6b09892dc4645bf584c41bdad63f5~mv2.jpg",
        bossName: "Storm Monarch",
        bossStats: { hp: 22, str: 6, dex: 8, int: 6, img: "https://placehold.co/250x250/0ea5e9/ffffff?text=Storm+King" },
        spawnStyle: "fall_sky",
        encounters: [
            { name: "Gust Spirit", hp: 8, str: 2, dex: 6, int: 4, img: "https://placehold.co/250x250/ccfbf1/000000?text=Gust" },
            { name: "Storm Elemental", hp: 12, str: 3, dex: 5, int: 7, img: "https://placehold.co/250x250/38bdf8/ffffff?text=Elemental" },
            { name: "Rock Golem", hp: 15, str: 6, dex: 1, int: 1, img: "https://placehold.co/250x250/78716c/ffffff?text=Rock" },
            { name: "Harpy", hp: 10, str: 3, dex: 7, int: 2, img: "https://placehold.co/250x250/a8a29e/ffffff?text=Harpy" },
            { name: "Young Wyvern", hp: 14, str: 6, dex: 5, int: 2, img: "https://placehold.co/250x250/0284c7/ffffff?text=Wyvern" }
        ]
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
