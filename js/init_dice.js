
// ================= DICE ROLLER INITIALIZATION =================
// Initialize the 3D Dice Roller when the page loads
if (typeof window.DICE_ROLLER !== 'undefined') {
    window.DICE_ROLLER.init();
    console.log("✓ DICE_ROLLER initialized successfully");
} else {
    console.warn("⚠ DICE_ROLLER not found - dice animations will not work");
}
