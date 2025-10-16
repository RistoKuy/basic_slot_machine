// Main Controller - Connects and initializes all game mechanics modules

// Dynamically load all game mechanics modules
function loadGameMechanics() {
    return new Promise((resolve, reject) => {
        const mechanicsPath = 'game_mechanics/';
        const modules = [
            'StatusEffects.js',
            'BettingSystem.js',
            'GameLogic.js',
            'GameFeatures.js',
            'JumpscareSystem.js',
            'GameController.js'
        ];

        let loadedCount = 0;
        const scriptsToLoad = modules.length;

        // Load each module
        modules.forEach(module => {
            const script = document.createElement('script');
            script.src = mechanicsPath + module;
            script.async = false; // Maintain order
            
            script.onload = () => {
                loadedCount++;
                console.log(`✓ Loaded: ${module}`);
                
                if (loadedCount === scriptsToLoad) {
                    console.log('✓ All game mechanics loaded successfully!');
                    resolve();
                }
            };
            
            script.onerror = () => {
                console.error(`✗ Failed to load: ${module}`);
                reject(new Error(`Failed to load ${module}`));
            };
            
            document.body.appendChild(script);
        });
    });
}

// Initialize the game once all mechanics are loaded
async function initializeGame() {
    try {
        console.log('Loading game mechanics...');
        await loadGameMechanics();
        console.log('Game mechanics loaded. Initializing game...');
        
        // Manually trigger game initialization
        // Since DOM is already loaded, we need to call the initialization code directly
        const slotMachine = new SlotMachine();
        const gameStats = new GameStats();

        // Override the checkWin method to include stats tracking
        const originalCheckWin = slotMachine.gameLogic.checkWin.bind(slotMachine.gameLogic);
        slotMachine.gameLogic.checkWin = function(results) {
            // Check regular wins and record stats
            const winAmount = originalCheckWin(results);
            gameStats.recordSpin(slotMachine.bet, winAmount);

            return winAmount;
        };

        // Add stats display toggle (press 'S' key)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 's' && !slotMachine.isSpinning) {
                showStatsModal(gameStats);
            }
        });

        // Add help button click handler
        const helpButton = document.getElementById('helpButton');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                showInstructions();
            });
        }

        // Always show instructions on game start
        setTimeout(() => showInstructions(), 1000);
        
        console.log('✓ Game initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-red-900 bg-opacity-90 flex items-center justify-center z-50 p-4';
        errorDiv.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-8 border-4 border-red-500 max-w-md w-full text-center">
                <h3 class="text-2xl font-bold text-red-400 mb-4">⚠️ ERROR ⚠️</h3>
                <p class="text-yellow-300 mb-4">Failed to load game mechanics.</p>
                <p class="text-sm text-gray-400 mb-4">${error.message}</p>
                <button onclick="window.location.reload()" 
                        class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg w-full">
                    🔄 RELOAD PAGE
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    // DOM already loaded
    initializeGame();
}
