// --- FIREBASE CONFIG (PASTE YOURS HERE) ---
const firebaseConfig = {
  apiKey: "AIzaSyBkx1gRLTNqO2kXrqopf0mkLOjzIrV8ftY",
  authDomain: "questopoly-507b9.firebaseapp.com",
  databaseURL: "https://questopoly-507b9-default-rtdb.firebaseio.com",
  projectId: "questopoly-507b9",
  storageBucket: "questopoly-507b9.firebasestorage.app",
  messagingSenderId: "943879074552",
  appId: "1:943879074552:web:5a74588c83cc40a297010d",
  measurementId: "G-H66SGB22EH"
};

// Initialize Firebase
let app, db, auth;
let isStoreTestMode = false;
if (firebaseConfig.apiKey) {
  app = firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
} else {
  console.error("FIREBASE CONFIG MISSING! Multiplayer will not work.");
}

// --- MULTIPLAYER GLOBALS ---
let isMultiplayer = false;
let myPlayerId = 0;
let gameId = null;
let currentUser = null;
let currentRoomData = null; // Stores real-time room data
let pendingJoinId = null;
let isAdminMode = false;
let listenersActive = false;
let currentGraphMode = 'gold';

// --- TIMER GLOBALS ---
let turnTimerValue = 15; // Seconds
let lastInteractionTime = 0;
let afkCheckInterval = null;
const TURN_TIME_LIMIT = 15; // 15 Seconds

let worldTrees = [];

// (Moved to ui_common.js)
