// --- MONSTER DATABASE ---
const OVERWORLD_MONSTERS = [
    // --- SINGLE MONSTERS (Standard) ---
    { id: 'ogre', name: "Ogre", type: 'single', stats: { str: 6, dex: 2, int: 1 }, hp: 6, img: "https://placehold.co/250x250/553311/ffffff?text=Ogre" },
    { id: 'troll', name: "Bridge Troll", type: 'single', stats: { str: 7, dex: 3, int: 2 }, hp: 8, img: "https://placehold.co/250x250/225522/ffffff?text=Troll" },
    { id: 'bandit_lord', name: "Bandit Lord", type: 'single', stats: { str: 5, dex: 6, int: 4 }, hp: 6, img: "https://placehold.co/250x250/333333/ffffff?text=Bandit+Lord" },
    { id: 'griffin', name: "Griffin", type: 'single', stats: { str: 6, dex: 7, int: 4 }, hp: 7, img: "https://placehold.co/250x250/aa8800/ffffff?text=Griffin" },
    { id: 'manticore', name: "Manticore", type: 'single', stats: { str: 7, dex: 5, int: 3 }, hp: 8, img: "https://placehold.co/250x250/aa4400/ffffff?text=Manticore" },
    { id: 'hydra', name: "Lesser Hydra", type: 'single', stats: { str: 6, dex: 4, int: 3 }, hp: 9, img: "https://placehold.co/250x250/004400/ffffff?text=Hydra" },
    { id: 'cyclops', name: "Cyclops", type: 'single', stats: { str: 8, dex: 1, int: 2 }, hp: 8, img: "https://placehold.co/250x250/665544/ffffff?text=Cyclops" },
    { id: 'minotaur', name: "Minotaur", type: 'single', stats: { str: 7, dex: 4, int: 2 }, hp: 7, img: "https://placehold.co/250x250/442211/ffffff?text=Minotaur" },
    { id: 'lich', name: "Lich", type: 'single', stats: { str: 2, dex: 3, int: 9 }, hp: 5, img: "https://placehold.co/250x250/220044/00ff00?text=Lich" },
    { id: 'wraith', name: "Wraith", type: 'single', stats: { str: 3, dex: 6, int: 7 }, hp: 5, img: "https://placehold.co/250x250/111111/999999?text=Wraith" },
    { id: 'treant', name: "Treant", type: 'single', stats: { str: 8, dex: 1, int: 5 }, hp: 10, img: "https://placehold.co/250x250/335522/ffffff?text=Treant" },
    { id: 'golem_stone', name: "Stone Golem", type: 'single', stats: { str: 9, dex: 1, int: 1 }, hp: 12, img: "https://placehold.co/250x250/777777/ffffff?text=Stone+Golem" },

    // --- HORDE MONSTERS (Multi-Attack) ---
    // 'count' determines number of attacks per turn
    { id: 'goblin_horde', name: "Goblin Swarm", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 2 }, hp: 4, img: "https://placehold.co/250x250/00aa00/ffffff?text=Goblin+Swarm" },
    { id: 'skeleton_army', name: "Skeleton Crew", type: 'horde', count: 3, stats: { str: 3, dex: 3, int: 1 }, hp: 5, img: "https://placehold.co/250x250/eeeeee/000000?text=Skeletons" },
    { id: 'wolf_pack', name: "Dire Wolf Pack", type: 'horde', count: 2, stats: { str: 4, dex: 6, int: 2 }, hp: 5, img: "https://placehold.co/250x250/555555/ffffff?text=Wolf+Pack" },
    { id: 'kobold_clan', name: "Kobold Clan", type: 'horde', count: 4, stats: { str: 1, dex: 4, int: 2 }, hp: 3, img: "https://placehold.co/250x250/aa4400/ffffff?text=Kobolds" },
    { id: 'bandit_gang', name: "Bandit Gang", type: 'horde', count: 2, stats: { str: 4, dex: 5, int: 3 }, hp: 6, img: "https://placehold.co/250x250/332211/ffffff?text=Bandits" },
    { id: 'rat_swarm', name: "Plague Rats", type: 'horde', count: 5, stats: { str: 1, dex: 6, int: 1 }, hp: 3, img: "https://placehold.co/250x250/222222/888888?text=Rats" },
    { id: 'imp_flock', name: "Imp Flock", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 5 }, hp: 4, img: "https://placehold.co/250x250/ff0000/000000?text=Imps" },
    { id: 'spider_brood', name: "Spider Brood", type: 'horde', count: 4, stats: { str: 3, dex: 7, int: 2 }, hp: 5, img: "https://placehold.co/250x250/111111/ff0000?text=Spiders" }
];
