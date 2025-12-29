// --- MONSTER DATABASE ---
const OVERWORLD_MONSTERS = [
    // --- SINGLE MONSTERS (Standard) ---
    { id: 'ogre', name: "Ogre", type: 'single', stats: { str: 6, dex: 2, int: 1 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_cf0d09aaaa16415a823eec39cc7cff8e~mv2.png" },
    { id: 'troll', name: "Bridge Troll", type: 'single', stats: { str: 7, dex: 3, int: 2 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_8161216e6b304b82ab3d91ac4aa92af8~mv2.png" },
    { id: 'bandit_lord', name: "Bandit Lord", type: 'single', stats: { str: 5, dex: 6, int: 4 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_7b803f2b04684288bb98c9d017e057de~mv2.png" },
    { id: 'griffin', name: "Griffin", type: 'single', stats: { str: 6, dex: 7, int: 4 }, hp: 7, img: "https://static.wixstatic.com/media/b16479_b45bac3a3d6e48bdba4f40b6f454e04c~mv2.png" },
    { id: 'manticore', name: "Manticore", type: 'single', stats: { str: 7, dex: 5, int: 3 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_1e9c5b893f05412ea2b7b608b459c930~mv2.png" },
    { id: 'hydra', name: "Lesser Hydra", type: 'single', stats: { str: 6, dex: 4, int: 3 }, hp: 9, img: "https://static.wixstatic.com/media/b16479_6acf9b29598f439d9fc17905e6e5cdde~mv2.png" },
    { id: 'cyclops', name: "Cyclops", type: 'single', stats: { str: 8, dex: 1, int: 2 }, hp: 8, img: "https://static.wixstatic.com/media/b16479_72645fe0b75842dd83d223b014f10751~mv2.png" },
    { id: 'minotaur', name: "Minotaur", type: 'single', stats: { str: 7, dex: 4, int: 2 }, hp: 7, img: "https://static.wixstatic.com/media/b16479_ae2138654a46479ab598b01cea28a15a~mv2.png" },
    { id: 'lich', name: "Lich", type: 'single', stats: { str: 2, dex: 3, int: 9 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_c9ce345fabbc4040b464ef2d14fc9eb5~mv2.png" },
    { id: 'wraith', name: "Wraith", type: 'single', stats: { str: 3, dex: 6, int: 7 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_73d72a82558441128c881d9a6801a7d8~mv2.png" },
    { id: 'treant', name: "Treant", type: 'single', stats: { str: 8, dex: 1, int: 5 }, hp: 10, img: "https://static.wixstatic.com/media/b16479_339def2f961f41f19d30d81aaf7fce2f~mv2.png" },
    { id: 'golem_stone', name: "Stone Golem", type: 'single', stats: { str: 9, dex: 1, int: 1 }, hp: 12, img: "https://static.wixstatic.com/media/b16479_cda643cc806b48b09e88b3e9c21c7d6f~mv2.png" },

    // --- HORDE MONSTERS (Multi-Attack) ---
    // 'count' determines number of attacks per turn
    { id: 'goblin_horde', name: "Goblin Swarm", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 2 }, hp: 4, img: "https://static.wixstatic.com/media/b16479_bae81bd5d142499a92f5f528204b4a69~mv2.png" },
    { id: 'skeleton_army', name: "Skeleton Crew", type: 'horde', count: 3, stats: { str: 3, dex: 3, int: 1 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_e8a1316b06354c2796fcfd85803695b6~mv2.png" },
    { id: 'wolf_pack', name: "Dire Wolf Pack", type: 'horde', count: 2, stats: { str: 4, dex: 6, int: 2 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_d7bdaea4ed684f01ab478a0bffa2c2ea~mv2.png" },
    { id: 'kobold_clan', name: "Kobold Clan", type: 'horde', count: 4, stats: { str: 1, dex: 4, int: 2 }, hp: 3, img: "https://static.wixstatic.com/media/b16479_230b6b63224c4bc38a5a7db84f13b62f~mv2.png" },
    { id: 'bandit_gang', name: "Bandit Gang", type: 'horde', count: 2, stats: { str: 4, dex: 5, int: 3 }, hp: 6, img: "https://static.wixstatic.com/media/b16479_1f59bb08f24e43639c581727c8073ab4~mv2.png" },
    { id: 'rat_swarm', name: "Plague Rats", type: 'horde', count: 5, stats: { str: 1, dex: 6, int: 1 }, hp: 3, img: "https://static.wixstatic.com/media/b16479_50ccc483a71040898ec1bbcc9a0b2399~mv2.png" },
    { id: 'imp_flock', name: "Imp Flock", type: 'horde', count: 3, stats: { str: 2, dex: 5, int: 5 }, hp: 4, img: "https://static.wixstatic.com/media/b16479_360d27571fb847f1949b031fa6a9cbfc~mv2.png" },
    { id: 'spider_brood', name: "Spider Brood", type: 'horde', count: 4, stats: { str: 3, dex: 7, int: 2 }, hp: 5, img: "https://static.wixstatic.com/media/b16479_cae90d30085a4561ac9edf1a50c0861d~mv2.png" }
];
