// Game Logic - Handle core game mechanics (spinning, results, wins)

class GameLogic {
    constructor(gameController) {
        this.game = gameController;
    }

    async spin() {
        if (this.game.isSpinning || this.game.credits < this.game.bet) return;

        this.game.isSpinning = true;
        this.game.credits -= this.game.bet;
        this.game.totalSpins++;
        this.game.saveSpinCount();
        this.game.winDisplay.textContent = '';
        this.game.updateDisplay();

        // Clean up any existing intervals first
        [this.game.reel1, this.game.reel2, this.game.reel3].forEach(reel => {
            reel.classList.remove('reel-spinning');
            if (reel.spinInterval) {
                clearInterval(reel.spinInterval);
                reel.spinInterval = null;
            }
        });

        // Play spin sound effect
        try {
            this.game.spinSound.currentTime = 0;
            this.game.spinSound.play();
        } catch (e) {
            console.log('Sound not available');
        }

        // Start spinning animation
        this.startSpinAnimation();

        // Generate results with probability-based 2 matches
        const results = this.generateResults();

        // Stop reels one by one with delay
        await this.stopReel(this.game.reel1, results[0], 1500);
        await this.stopReel(this.game.reel2, results[1], 1800);
        await this.stopReel(this.game.reel3, results[2], 2100);

        // Check for wins
        this.checkWin(results);

        this.game.isSpinning = false;
        
        // Check and update status effects AFTER spin is complete
        this.game.statusEffects.updateStatusEffects();
        
        this.game.updateDisplay();

        // Check if player can still continue playing after this spin
        this.checkGameOver();
    }

    startSpinAnimation() {
        const reels = [this.game.reel1, this.game.reel2, this.game.reel3];

        reels.forEach((reel, index) => {
            reel.classList.add('reel-spinning');

            // Create rapid symbol cycling during spin
            let symbolIndex = 0;
            reel.spinInterval = setInterval(() => {
                const symbol = reel.querySelector('.slot-symbol');
                if (symbol) {
                    symbol.textContent = this.game.gameData.symbols[symbolIndex % this.game.gameData.symbols.length];
                    symbolIndex++;

                    // Add flash effect occasionally
                    if (Math.random() < 0.3) {
                        symbol.classList.add('symbol-flash');
                        setTimeout(() => {
                            symbol.classList.remove('symbol-flash');
                        }, 80);
                    }
                }
            }, 50); // Very fast cycling for spinning effect
        });
    }

    async stopReel(reel, finalSymbol, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Clear the spinning interval
                if (reel.spinInterval) {
                    clearInterval(reel.spinInterval);
                    reel.spinInterval = null;
                }

                // Remove spinning class
                reel.classList.remove('reel-spinning');

                // Set final symbol with landing animation
                const symbol = reel.querySelector('.slot-symbol');
                if (symbol) {
                    // Quick final spin sequence before landing
                    let finalSpinCount = 0;
                    const finalSpinInterval = setInterval(() => {
                        symbol.textContent = this.game.gameData.symbols[Math.floor(Math.random() * this.game.gameData.symbols.length)];
                        finalSpinCount++;

                        if (finalSpinCount >= 8) {
                            clearInterval(finalSpinInterval);

                            // Set the actual final symbol
                            symbol.textContent = finalSymbol;

                            // Add landing effect
                            symbol.style.transform = 'scale(1.2)';
                            symbol.style.transition = 'transform 0.3s ease';

                            setTimeout(() => {
                                symbol.style.transform = 'scale(1)';
                                setTimeout(() => {
                                    symbol.style.transition = '';
                                    resolve();
                                }, 300);
                            }, 100);
                        }
                    }, 80);
                }
            }, delay);
        });
    }

    generateResults() {
        const twoMatchChance = this.game.statusEffects.getTwoMatchChance();

        // Check if we should force a 2-match result
        if (Math.random() < twoMatchChance) {
            // Generate a 2-match result
            const matchingSymbol = this.game.gameData.getRandomSymbol();
            const thirdSymbol = this.game.gameData.getRandomSymbol();

            // Ensure the third symbol is different to avoid 3 matches
            let differentSymbol = thirdSymbol;
            while (differentSymbol === matchingSymbol) {
                differentSymbol = this.game.gameData.getRandomSymbol();
            }

            // Randomly place the matching symbols
            const positions = [0, 1, 2];
            const matchPositions = positions.sort(() => Math.random() - 0.5).slice(0, 2);

            const results = [differentSymbol, differentSymbol, differentSymbol];
            results[matchPositions[0]] = matchingSymbol;
            results[matchPositions[1]] = matchingSymbol;

            return results;
        }

        // Generate normal random results
        return [
            this.game.gameData.getRandomSymbol(),
            this.game.gameData.getRandomSymbol(),
            this.game.gameData.getRandomSymbol()
        ];
    }

    checkWin(results) {
        const [symbol1, symbol2, symbol3] = results;

        // Determine if this is a first 3 spins bonus
        const isFirstThreeSpins = this.game.totalSpins <= 3;

        // Get jackpot chance with status bonuses
        const jackpotChance = this.game.statusEffects.getJackpotChance();

        let winAmount = 0;
        let isWin = false;

        // Check for three of a kind (jackpot) with probability
        if (symbol1 === symbol2 && symbol2 === symbol3 && Math.random() < jackpotChance) {
            const payout = this.game.gameData.getPayout(symbol1) * this.game.bet;
            this.game.credits += payout;
            winAmount = payout;
            isWin = true;
            this.game.showWin(payout, symbol1, 'JACKPOT');
            this.game.consecutiveLosses = 0; // Reset loss streak on win
            this.game.consecutiveWins++; // Track consecutive wins
        } 
        // Check for two matching symbols - ALWAYS gives bonus payout
        else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
            const matchingSymbol = symbol1 === symbol2 ? symbol1 : (symbol2 === symbol3 ? symbol2 : symbol1);
            const bonusPayout = Math.floor(this.game.bet * 1.5); // Always 150% of bet
            this.game.credits += bonusPayout;
            winAmount = bonusPayout;
            isWin = true;
            this.game.showWin(bonusPayout, matchingSymbol, 'TWO MATCH');
            this.game.consecutiveLosses = 0; // Reset loss streak on win
            this.game.consecutiveWins++; // Track consecutive wins
        }
        // Random bonus for first 3 spins (only if no matches)
        else if (isFirstThreeSpins && Math.random() < 0.3) {
            const bonusPayout = this.game.bet * 2;
            this.game.credits += bonusPayout;
            winAmount = bonusPayout;
            isWin = true;
            this.game.showWin(bonusPayout, '🍀', 'BONUS');
            this.game.consecutiveLosses = 0; // Reset loss streak on win
            this.game.consecutiveWins++; // Track consecutive wins
        }
        // No matching symbols - return 50% of bet
        else {
            const consolationPayout = Math.floor(this.game.bet * 0.5); // 50% of bet back
            this.game.credits += consolationPayout;
            this.game.showWin(consolationPayout, '💰', 'CONSOLATION');

            // Track consecutive losses (consolation counts as a loss)
            this.game.consecutiveLosses++;
            this.game.consecutiveWins = 0; // Reset win streak on loss
            this.checkLossStreak();

            winAmount = consolationPayout;
        }

        // Apply privilege status penalty (10% deduction on wins)
        if (isWin) {
            this.game.statusEffects.applyPrivilegePenalty();
        }

        return winAmount;
    }

    checkLossStreak() {
        if (this.game.consecutiveLosses === 4) {
            this.showLossStreak();
            this.game.consecutiveLosses = 0; // Reset after showing the message
        }
    }

    showLossStreak() {
        // Create loss streak modal with sound and GIF
        const lossModal = document.createElement('div');
        lossModal.className = 'fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4';
        lossModal.innerHTML = `
            <div class="bg-black rounded-lg p-4 sm:p-8 border-4 border-red-500 max-w-md w-full text-center">
                <h3 class="text-2xl sm:text-3xl font-bold text-red-400 mb-4">OUCH! 💀</h3>
                <img src="assets/444.gif" alt="Loss Streak!" class="mx-auto mb-4 max-w-full h-auto rounded-lg" 
                     onerror="this.style.display='none'; document.getElementById('lossGifText').style.display='block';">
                <div id="lossGifText" class="text-6xl mb-4" style="display:none;">💀💀💀💀</div>
                <div class="text-white mb-4">
                    <p class="text-lg font-bold text-red-400 mb-2">Did you just lose 4 times in a row?</p>
                    <p class="text-base">Your life must be suck</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-lg w-full min-h-[44px] touch-manipulation">
                    😢 OKAY, I GET IT
                </button>
            </div>
        `;

        document.body.appendChild(lossModal);

        // Play flashbang sound effect
        try {
            const flashbangAudio = new Audio('assets/Flashbang.mp3');
            flashbangAudio.volume = 0.7; // Slightly lower volume
            flashbangAudio.play();
        } catch (e) {
            console.log('Flashbang sound not available');
        }

        // Auto-close after 8 seconds
        setTimeout(() => {
            if (document.body.contains(lossModal)) {
                document.body.removeChild(lossModal);
            }
        }, 8000);
    }

    checkGameOver() {
        // Check if player can still play (has enough credits for minimum bet of 5)
        if (this.game.credits < 5) {
            this.showGameOver();
            return true;
        }
        return false;
    }

    showGameOver() {
        // Disable all game controls
        this.game.spinButton.disabled = true;
        this.game.decreaseBetBtn.disabled = true;
        this.game.increaseBetBtn.disabled = true;
        this.game.decreaseBet10xBtn.disabled = true;
        this.game.increaseBet10xBtn.disabled = true;

        // Create game over modal
        const gameOverModal = document.createElement('div');
        gameOverModal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
        gameOverModal.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-4 sm:p-8 border-4 border-red-500 max-w-md w-full text-center">
                <h3 class="text-2xl sm:text-3xl font-bold text-red-400 mb-4">GAME OVER!</h3>
                <img src="assets/lose.png" alt="You Lost!" class="mx-auto mb-4 max-w-full h-auto rounded-lg" 
                     onerror="this.style.display='none'; document.getElementById('loseText').style.display='block';">
                <div id="loseText" class="text-6xl mb-4" style="display:none;">😵</div>
                <div class="text-yellow-300 mb-4">
                    <p class="mb-2">You ran out of credits!</p>
                    <p class="text-sm">Refresh the page to start a new game</p>
                </div>
                <button onclick="window.location.reload()" 
                        class="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3 px-6 rounded-lg w-full min-h-[44px] touch-manipulation">
                    🔄 RESTART GAME
                </button>
            </div>
        `;

        document.body.appendChild(gameOverModal);
    }
}