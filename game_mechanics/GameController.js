// Game Controller - Main orchestrator with reduced responsibilities

class SlotMachine {
    constructor() {
        // Core game state
        this.gameData = new GameData();
        this.credits = 100;
        this.bet = 10;
        this.isSpinning = false;
        this.totalSpins = 0;
        this.consecutiveLosses = 0;
        this.consecutiveWins = 0;

        // Initialize DOM elements
        this.initializeElements();

        // Initialize game systems
        this.statusEffects = new StatusEffects(this);
        this.bettingSystem = new BettingSystem(this);
        this.gameLogic = new GameLogic(this);
        this.gameFeatures = new GameFeatures(this);

        // Setup the game
        this.bindEvents();
        this.updateDisplay();
        this.loadSpinCount();

        // Add cheat codes
        this.gameFeatures.addCheatCodes();
    }

    initializeElements() {
        this.creditsDisplay = document.getElementById('credits');
        this.betDisplay = document.getElementById('bet');
        this.reel1 = document.getElementById('reel1');
        this.reel2 = document.getElementById('reel2');
        this.reel3 = document.getElementById('reel3');
        this.spinButton = document.getElementById('spinButton');
        this.winDisplay = document.getElementById('winDisplay');
        this.decreaseBetBtn = document.getElementById('decreaseBet');
        this.increaseBetBtn = document.getElementById('increaseBet');
        this.decreaseBet10xBtn = document.getElementById('decreaseBet10x');
        this.increaseBet10xBtn = document.getElementById('increaseBet10x');
        this.spinSound = document.getElementById('spinSound');
    }

    bindEvents() {
        // Spin button
        this.spinButton.addEventListener('click', () => this.gameLogic.spin());

        // Betting system events
        this.bettingSystem.bindBettingEvents();

        // Feature events
        this.gameFeatures.bindFeatureEvents();

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Try betting system keyboard shortcuts first
            if (this.bettingSystem.handleKeyboardBetting(e)) {
                return;
            }

            // Try game features keyboard shortcuts
            if (this.gameFeatures.handleKeyboardShortcuts(e)) {
                return;
            }
        });
    }

    updateDisplay() {
        this.creditsDisplay.textContent = this.credits;
        this.betDisplay.textContent = this.bet;

        // Update button states
        this.spinButton.disabled = this.isSpinning || this.credits < this.bet;
        this.bettingSystem.updateBettingButtonStates();

        // Update button appearance based on state
        if (this.spinButton.disabled) {
            this.spinButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.spinButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // Keep button text consistent - no bonus indicator
        this.spinButton.textContent = '🎰 SPIN 🎰';

        // Only update status display (not check for activation/deactivation)
        this.statusEffects.updateStatusDisplay();
    }

    loadSpinCount() {
        const saved = localStorage.getItem('slotMachineSpinCount');
        if (saved) {
            this.totalSpins = parseInt(saved, 10);
        }
    }

    saveSpinCount() {
        localStorage.setItem('slotMachineSpinCount', this.totalSpins.toString());
    }

    showWin(amount, symbol, winType = 'WIN') {
        DisplayManager.showWin(amount, symbol, winType);
    }
}