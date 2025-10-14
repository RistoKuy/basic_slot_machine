// Game Features - Handle additional features like cheat codes and auto-spin

class GameFeatures {
    constructor(gameController) {
        this.game = gameController;
        this.autoSpinInterval = null;
    }

    // Cheat codes for demo purposes
    addCheatCodes() {
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
            'KeyB', 'KeyA'
        ];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }

            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.game.credits += 1000;
                this.game.updateDisplay();
                this.game.showWin(1000, '🎊', 'CHEAT CODE ACTIVATED!');
                konamiCode = [];
            }
        });
    }

    // Auto-spin feature
    startAutoSpin(spins = 10) {
        if (this.autoSpinInterval) {
            clearInterval(this.autoSpinInterval);
            this.autoSpinInterval = null;
            this.game.spinButton.textContent = '🎰 SPIN 🎰';
            return;
        }

        let remainingSpins = spins;
        this.game.spinButton.textContent = `AUTO (${remainingSpins})`;

        this.autoSpinInterval = setInterval(() => {
            if (remainingSpins <= 0 || this.game.credits < this.game.bet) {
                clearInterval(this.autoSpinInterval);
                this.autoSpinInterval = null;
                this.game.spinButton.textContent = '🎰 SPIN 🎰';
                return;
            }

            if (!this.game.isSpinning) {
                this.game.gameLogic.spin();
                remainingSpins--;
                this.game.spinButton.textContent = `AUTO (${remainingSpins})`;
            }
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Handle spin (spacebar)
        if (e.code === 'Space' && !this.game.isSpinning) {
            e.preventDefault();
            this.game.gameLogic.spin();
            return true;
        }

        // Handle stats display (S key)
        if (e.key.toLowerCase() === 's' && !this.game.isSpinning) {
            e.preventDefault();
            // This will be handled by the main controller
            return true;
        }

        return false;
    }

    bindFeatureEvents() {
        // Add double-click for auto-spin
        this.game.spinButton.addEventListener('dblclick', () => {
            this.startAutoSpin(10);
        });
    }
}