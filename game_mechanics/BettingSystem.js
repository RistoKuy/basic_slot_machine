// Betting System - Handle all betting-related functionality

class BettingSystem {
    constructor(gameController) {
        this.game = gameController;
    }

    changeBet(amount) {
        const newBet = this.game.bet + amount;
        // Allow decreasing bet even when credits are low, but ensure minimum bet is 5
        // Allow increasing bet only if player has enough credits
        if (amount < 0) {
            // Decreasing bet - only check minimum limit
            if (newBet >= 5) {
                this.game.bet = newBet;
                this.game.updateDisplay();
            }
        } else {
            // Increasing bet - check both maximum limit and available credits
            if (newBet <= this.game.credits && newBet >= 5) {
                this.game.bet = newBet;
                this.game.updateDisplay();
            }
        }
    }

    changeBet10x(multiplier) {
        let newBet;

        if (multiplier < 0) {
            // Decreasing bet: try to divide by 10, if not possible, go to minimum (5)
            newBet = Math.floor(this.game.bet / 10);
            if (newBet < 5) {
                newBet = 5; // Max out to minimum possible bet
            }
            this.game.bet = newBet;
            this.game.updateDisplay();
        } else {
            // Increasing bet: try to multiply by 10, if not possible due to credits, max out to available credits
            newBet = this.game.bet * 10;
            if (newBet > this.game.credits) {
                newBet = this.game.credits; // Max out to available credits
            }
            // Ensure minimum bet is still respected
            if (newBet >= 5) {
                this.game.bet = newBet;
                this.game.updateDisplay();
            }
        }
    }

    updateBettingButtonStates() {
        // Update button states
        this.game.decreaseBetBtn.disabled = this.game.bet <= 5;
        this.game.increaseBetBtn.disabled = this.game.bet >= this.game.credits || this.game.credits < this.game.bet + 5;
        
        // Update 10x button states
        // Decrease 10x disabled only when already at minimum bet (5)
        this.game.decreaseBet10xBtn.disabled = this.game.bet <= 5;
        // Increase 10x disabled only when already at maximum possible bet (equals credits)
        this.game.increaseBet10xBtn.disabled = this.game.bet >= this.game.credits;
    }

    bindBettingEvents() {
        // Regular betting buttons
        this.game.decreaseBetBtn.addEventListener('click', () => this.changeBet(-5));
        this.game.increaseBetBtn.addEventListener('click', () => this.changeBet(5));
        
        // 10x betting buttons
        this.game.decreaseBet10xBtn.addEventListener('click', () => this.changeBet10x(-1));
        this.game.increaseBet10xBtn.addEventListener('click', () => this.changeBet10x(1));
    }

    handleKeyboardBetting(e) {
        if (this.game.isSpinning) return false;

        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (e.shiftKey) {
                this.changeBet10x(-1); // Shift + Down: 10x decrease
            } else {
                this.changeBet(-5); // Down: normal decrease
            }
            return true;
        } else if (e.code === 'ArrowUp') {
            e.preventDefault();
            if (e.shiftKey) {
                this.changeBet10x(1); // Shift + Up: 10x increase
            } else {
                this.changeBet(5); // Up: normal increase
            }
            return true;
        }
        return false;
    }
}