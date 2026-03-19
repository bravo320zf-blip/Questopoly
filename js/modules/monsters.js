// --- MONSTER DATABASE ---
const OVERWORLD_MONSTERS = [
    // --- SINGLE MONSTERS (Standard) ---
    { id: 'ogre', name: "Ogre", type: 'single', stats: { str: 6, dex: 2, int: 1 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_7f07c96bb6a742759e23099d989f9dae~mv2.png" },
    { id: 'troll', name: "Bridge Troll", type: 'single', stats: { str: 7, dex: 3, int: 2 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_23aa5ddc37234e0e9ef697219e524dad~mv2.png" },
    { id: 'bandit_lord', name: "Bandit Lord", type: 'single', stats: { str: 5, dex: 6, int: 4 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_920868e19a074de89a45bd5d4b646093~mv2.png" },
    { id: 'griffin', name: "Griffin", type: 'single', stats: { str: 6, dex: 7, int: 4 }, hp: 7, img: "https://static.wixstatic.com/media/b16479_902b677bbff7468884f2c5f89f6a7050~mv2.png" },
    { id: 'manticore', name: "Manticore", type: 'single', stats: { str: 7, dex: 5, int: 3 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_50f89a6a462d465badd12b01161297fd~mv2.png" },
    { id: 'hydra', name: "Lesser Hydra", type: 'single', stats: { str: 6, dex: 4, int: 3 }, hp: 9, img: "https://static.wixstatic.com/media/b16479_3e17d42f6d1344099f60341169295dc0~mv2.png" },
    { id: 'cyclops', name: "Cyclops", type: 'single', stats: { str: 8, dex: 1, int: 2 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_a6d1aa19f0de4a7cbe3d81a079f9332c~mv2.png" },
    { id: 'minotaur', name: "Minotaur", type: 'single', stats: { str: 7, dex: 4, int: 2 }, hp: 7, img: "https://static.wixstatic.com/media/b16479_6dac917b72784a938a2d0fdb694b2ebd~mv2.png" },
    { id: 'lich', name: "Lich", type: 'single', stats: { str: 2, dex: 3, int: 9 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_d5d4dc22fbd64ceea87f1f267e8d9336~mv2.png" },
    { id: 'wraith', name: "Wraith", type: 'single', stats: { str: 3, dex: 6, int: 7 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_c92aee4d6bed41cc87c76acdad5ad2d3~mv2.png" },
    { id: 'treant', name: "Treant", type: 'single', stats: { str: 8, dex: 1, int: 5 }, hp: 10, img: "https://static.wixstatic.com/media/b16479_7bcac08d38c445199ce98ab5a459a2d0~mv2.png" },
    { id: 'golem_stone', name: "Stone Golem", type: 'single', stats: { str: 9, dex: 1, int: 1 }, hp: 12, img: "https://static.wixstatic.com/media/b16479_73130bfeb3954b2993adf492aa2e9c2b~mv2.png" },

    // --- HORDE MONSTERS (Multi-Attack) ---
    // 'count' determines number of attacks per turn
    { id: 'goblin_horde', name: "Goblin Swarm", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 2 }, hp: 4, img: "https://static.wixstatic.com/media/b16479_ba33d39cb11a45dfae54abfde3ab1de9~mv2.png" },
    { id: 'skeleton_army', name: "Skeleton Crew", type: 'horde', count: 3, stats: { str: 3, dex: 3, int: 1 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_1c98a1527a9a48a588f04a67651ef06c~mv2.png" },
    { id: 'wolf_pack', name: "Dire Wolf Pack", type: 'horde', count: 2, stats: { str: 4, dex: 6, int: 2 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_e8429801a0a349dab2048312762ba356~mv2.png" },
    { id: 'kobold_clan', name: "Kobold Clan", type: 'horde', count: 4, stats: { str: 1, dex: 4, int: 2 }, hp: 3, img: "https://static.wixstatic.com/media/b16479_50f01dd7d9e8461a8cb65784021a3f8e~mv2.png" },
    { id: 'bandit_gang', name: "Bandit Gang", type: 'horde', count: 2, stats: { str: 4, dex: 5, int: 3 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_5cbd23e6eff04a72a062327bba78436f~mv2.png" },
    { id: 'rat_swarm', name: "Plague Rats", type: 'horde', count: 5, stats: { str: 1, dex: 6, int: 1 }, hp: 3, img: "https://static.wixstatic.com/media/b16479_f487598333f4461bb2d97742dea33cd3~mv2.png" },
    { id: 'imp_flock', name: "Imp Flock", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 5 }, hp: 4, img: "https://static.wixstatic.com/media/b16479_25399d4899cc443f9d0859aa1304ebe4~mv2.png" },
    { id: 'spider_brood', name: "Spider Brood", type: 'horde', count: 4, stats: { str: 3, dex: 7, int: 2 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_66a1388b86324c7ba3197f34c0257ad1~mv2.png" }
];
