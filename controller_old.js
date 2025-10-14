// Game Controller - Main Game Logic and Controls

class SlotMachine {
    constructor() {
        this.gameData = new GameData();
        this.credits = 100;
        this.bet = 10;
        this.isSpinning = false;
        this.totalSpins = 0; // Track total spins for first 3 spin bonus
        this.consecutiveLosses = 0; // Track consecutive losses for special mechanic
        this.consecutiveWins = 0; // Track consecutive wins for privilege status
        this.pityStatus = false; // Pity status flag
        this.privilegeStatus = false; // Privilege status flag
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.loadSpinCount();
        this.createStatusDisplay();
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
        this.spinButton.addEventListener('click', () => this.spin());
        this.decreaseBetBtn.addEventListener('click', () => this.changeBet(-5));
        this.increaseBetBtn.addEventListener('click', () => this.changeBet(5));
        this.decreaseBet10xBtn.addEventListener('click', () => this.changeBet10x(-1));
        this.increaseBet10xBtn.addEventListener('click', () => this.changeBet10x(1));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            } else if (e.code === 'ArrowDown' && !this.isSpinning) {
                e.preventDefault();
                if (e.shiftKey) {
                    this.changeBet10x(-1); // Shift + Down: 10x decrease
                } else {
                    this.changeBet(-5); // Down: normal decrease
                }
            } else if (e.code === 'ArrowUp' && !this.isSpinning) {
                e.preventDefault();
                if (e.shiftKey) {
                    this.changeBet10x(1); // Shift + Up: 10x increase
                } else {
                    this.changeBet(5); // Up: normal increase
                }
            }
        });
    }
    
    updateDisplay() {
        this.creditsDisplay.textContent = this.credits;
        this.betDisplay.textContent = this.bet;
        
        // Update button states
        this.spinButton.disabled = this.isSpinning || this.credits < this.bet;
        this.decreaseBetBtn.disabled = this.bet <= 5;
        this.increaseBetBtn.disabled = this.bet >= this.credits || this.credits < this.bet + 5;
        
        // Update 10x button states
        // Decrease 10x disabled only when already at minimum bet (5)
        this.decreaseBet10xBtn.disabled = this.bet <= 5;
        // Increase 10x disabled only when already at maximum possible bet (equals credits)
        this.increaseBet10xBtn.disabled = this.bet >= this.credits;
        
        // Update button appearance based on state
        if (this.spinButton.disabled) {
            this.spinButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.spinButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Keep button text consistent - no bonus indicator
        this.spinButton.textContent = '🎰 SPIN 🎰';
        
        // Update status effects
        this.updateStatusEffects();
        this.updateStatusDisplay();
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
    
    changeBet(amount) {
        const newBet = this.bet + amount;
        // Fix: Allow decreasing bet even when credits are low, but ensure minimum bet is 5
        // Allow increasing bet only if player has enough credits
        if (amount < 0) {
            // Decreasing bet - only check minimum limit
            if (newBet >= 5) {
                this.bet = newBet;
                this.updateDisplay();
            }
        } else {
            // Increasing bet - check both maximum limit and available credits
            if (newBet <= this.credits && newBet >= 5) {
                this.bet = newBet;
                this.updateDisplay();
            }
        }
    }
    
    changeBet10x(multiplier) {
        let newBet;
        
        if (multiplier < 0) {
            // Decreasing bet: try to divide by 10, if not possible, go to minimum (5)
            newBet = Math.floor(this.bet / 10);
            if (newBet < 5) {
                newBet = 5; // Max out to minimum possible bet
            }
            this.bet = newBet;
            this.updateDisplay();
        } else {
            // Increasing bet: try to multiply by 10, if not possible due to credits, max out to available credits
            newBet = this.bet * 10;
            if (newBet > this.credits) {
                newBet = this.credits; // Max out to available credits
            }
            // Ensure minimum bet is still respected
            if (newBet >= 5) {
                this.bet = newBet;
                this.updateDisplay();
            }
        }
    }
    
    createStatusDisplay() {
        // Create status effect display container
        const creditsDisplay = document.querySelector('.bg-black.rounded-lg.p-3');
        const statusContainer = document.createElement('div');
        statusContainer.id = 'statusContainer';
        statusContainer.className = 'mt-2 text-center';
        creditsDisplay.appendChild(statusContainer);
    }
    
    updateStatusEffects() {
        // Check for Pity Status activation
        if (!this.pityStatus && this.consecutiveLosses >= 4 && this.credits < 50) {
            this.pityStatus = true;
            this.showStatusActivation('pity');
        }
        
        // Check for Pity Status deactivation
        if (this.pityStatus && this.credits >= 50) {
            this.pityStatus = false;
            this.showStatusDeactivation('pity');
        }
        
        // Check for Privilege Status activation
        if (!this.privilegeStatus && this.consecutiveWins >= 3 && this.credits > 1000) {
            this.privilegeStatus = true;
            this.showStatusActivation('privilege');
        }
        
        // Check for Privilege Status deactivation
        if (this.privilegeStatus && this.consecutiveLosses >= 3) {
            this.privilegeStatus = false;
            this.consecutiveWins = 0; // Reset win streak
            this.showStatusDeactivation('privilege');
        }
    }
    
    updateStatusDisplay() {
        const statusContainer = document.getElementById('statusContainer');
        if (!statusContainer) return;
        
        statusContainer.innerHTML = '';
        
        if (this.pityStatus) {
            const pityBonus = Math.floor(this.bet / 10);
            statusContainer.innerHTML = `
                <div class="pity-status relative bg-blue-900 border border-blue-400 rounded-lg p-2 animate-pulse">
                    <div class="text-blue-300 font-bold text-sm">💙 PITY STATUS ACTIVE 💙</div>
                    <div class="text-blue-200 text-xs">Jackpot: +${pityBonus}% | 2-Match: +${pityBonus * 5}%</div>
                </div>
            `;
        }
        
        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.bet / 50);
            statusContainer.innerHTML = `
                <div class="privilege-status relative bg-purple-900 border border-purple-400 rounded-lg p-2 animate-pulse">
                    <div class="text-purple-300 font-bold text-sm">👑 PRIVILEGE STATUS ACTIVE 👑</div>
                    <div class="text-purple-200 text-xs">Jackpot: +${privilegeBonus}% | 2-Match: +${privilegeBonus * 5}%</div>
                    <div class="text-red-300 text-xs">Warning: -10% credits on wins</div>
                </div>
            `;
        }
    }
    
    getJackpotChance() {
        const isFirstThreeSpins = this.totalSpins <= 3;
        let baseChance = isFirstThreeSpins ? 0.10 : 0.01; // 10% vs 1%
        
        // Apply status bonuses
        if (this.pityStatus) {
            const pityBonus = Math.floor(this.bet / 10) * 0.01; // +1% per 10 credits bet
            baseChance += pityBonus;
        }
        
        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.bet / 50) * 0.01; // +1% per 50 credits bet
            baseChance += privilegeBonus;
        }
        
        return Math.min(baseChance, 0.50); // Cap at 50%
    }
    
    getTwoMatchChance() {
        const isFirstThreeSpins = this.totalSpins <= 3;
        let baseChance = isFirstThreeSpins ? 0.50 : 0.25; // 50% vs 25%
        
        // Apply status bonuses
        if (this.pityStatus) {
            const pityBonus = Math.floor(this.bet / 10) * 0.05; // +5% per 10 credits bet
            baseChance += pityBonus;
        }
        
        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.bet / 50) * 0.05; // +5% per 50 credits bet
            baseChance += privilegeBonus;
        }
        
        return Math.min(baseChance, 0.85); // Cap at 85%
    }
    
    showStatusActivation(statusType) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
        
        if (statusType === 'pity') {
            modal.innerHTML = `
                <div class="bg-blue-900 rounded-lg p-4 sm:p-8 border-4 border-blue-400 max-w-md w-full text-center animate-pulse">
                    <h3 class="text-2xl sm:text-3xl font-bold text-blue-300 mb-4">💙 PITY STATUS ACTIVATED 💙</h3>
                    <div class="text-blue-200 mb-4">
                        <p class="text-lg font-bold mb-2">The universe feels sorry for you!</p>
                        <p class="text-sm">Every 10 credits bet increases:</p>
                        <p class="text-sm">• Jackpot chance by +1%</p>
                        <p class="text-sm">• Two-match chance by +5%</p>
                        <p class="text-xs mt-2 text-blue-300">Active until you have >50 credits</p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full">
                        💙 THANK YOU, UNIVERSE!
                    </button>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="bg-purple-900 rounded-lg p-4 sm:p-8 border-4 border-purple-400 max-w-md w-full text-center animate-pulse">
                    <h3 class="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">👑 PRIVILEGE STATUS ACTIVATED 👑</h3>
                    <div class="text-purple-200 mb-4">
                        <p class="text-lg font-bold mb-2">You're on fire!</p>
                        <p class="text-sm">Every 50 credits bet increases:</p>
                        <p class="text-sm">• Jackpot chance by +1%</p>
                        <p class="text-sm">• Two-match chance by +5%</p>
                        <p class="text-xs mt-2 text-red-300">But you lose 10% credits on each win!</p>
                        <p class="text-xs text-purple-300">Active until you lose 3 times in a row</p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg w-full">
                        👑 EMBRACE THE POWER!
                    </button>
                </div>
            `;
        }
        
        document.body.appendChild(modal);
        
        // Auto-close after 8 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 8000);
    }
    
    showStatusDeactivation(statusType) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
        
        if (statusType === 'pity') {
            modal.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-4 border-2 border-gray-400 max-w-sm w-full text-center">
                    <h3 class="text-lg font-bold text-gray-300 mb-2">💙 Pity Status Ended</h3>
                    <p class="text-sm text-gray-400">You've recovered! Back to normal odds.</p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">
                        OK
                    </button>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-4 border-2 border-gray-400 max-w-sm w-full text-center">
                    <h3 class="text-lg font-bold text-gray-300 mb-2">👑 Privilege Status Ended</h3>
                    <p class="text-sm text-gray-400">Your winning streak is over. Back to normal odds.</p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            class="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full">
                        OK
                    </button>
                </div>
            `;
        }
        
        document.body.appendChild(modal);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 5000);
    }
    
    async spin() {
        if (this.isSpinning || this.credits < this.bet) return;
        
        this.isSpinning = true;
        this.credits -= this.bet;
        this.totalSpins++;
        this.saveSpinCount();
        this.winDisplay.textContent = '';
        this.updateDisplay();
        
        // Clean up any existing intervals first
        [this.reel1, this.reel2, this.reel3].forEach(reel => {
            reel.classList.remove('reel-spinning');
            if (reel.spinInterval) {
                clearInterval(reel.spinInterval);
                reel.spinInterval = null;
            }
        });
        
        // Play spin sound effect
        try {
            this.spinSound.currentTime = 0;
            this.spinSound.play();
        } catch (e) {
            console.log('Sound not available');
        }
        
        // Start spinning animation
        this.startSpinAnimation();
        
        // Generate results with probability-based 2 matches
        const results = this.generateResults();
        
        // Stop reels one by one with delay
        await this.stopReel(this.reel1, results[0], 1500);
        await this.stopReel(this.reel2, results[1], 1800);
        await this.stopReel(this.reel3, results[2], 2100);
        
        // Check for wins
        this.checkWin(results);
        
        this.isSpinning = false;
        this.updateDisplay();
        
        // Check if player can still continue playing after this spin
        this.checkGameOver();
    }
    
    startSpinAnimation() {
        const reels = [this.reel1, this.reel2, this.reel3];
        
        reels.forEach((reel, index) => {
            reel.classList.add('reel-spinning');
            
            // Create rapid symbol cycling during spin
            let symbolIndex = 0;
            reel.spinInterval = setInterval(() => {
                const symbol = reel.querySelector('.slot-symbol');
                if (symbol) {
                    symbol.textContent = this.gameData.symbols[symbolIndex % this.gameData.symbols.length];
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
                        symbol.textContent = this.gameData.symbols[Math.floor(Math.random() * this.gameData.symbols.length)];
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
        const twoMatchChance = this.getTwoMatchChance();
        
        // Check if we should force a 2-match result
        if (Math.random() < twoMatchChance) {
            // Generate a 2-match result
            const matchingSymbol = this.gameData.getRandomSymbol();
            const thirdSymbol = this.gameData.getRandomSymbol();
            
            // Ensure the third symbol is different to avoid 3 matches
            let differentSymbol = thirdSymbol;
            while (differentSymbol === matchingSymbol) {
                differentSymbol = this.gameData.getRandomSymbol();
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
            this.gameData.getRandomSymbol(),
            this.gameData.getRandomSymbol(),
            this.gameData.getRandomSymbol()
        ];
    }
    
    checkWin(results) {
        const [symbol1, symbol2, symbol3] = results;
        
        // Determine if this is a first 3 spins bonus
        const isFirstThreeSpins = this.totalSpins <= 3;
        
        // Get jackpot chance with status bonuses
        const jackpotChance = this.getJackpotChance();
        
        let winAmount = 0;
        let isWin = false;
        
        // Check for three of a kind (jackpot) with probability
        if (symbol1 === symbol2 && symbol2 === symbol3 && Math.random() < jackpotChance) {
            const payout = this.gameData.getPayout(symbol1) * this.bet;
            this.credits += payout;
            winAmount = payout;
            isWin = true;
            this.showWin(payout, symbol1, 'JACKPOT');
            this.consecutiveLosses = 0; // Reset loss streak on win
            this.consecutiveWins++; // Track consecutive wins
        } 
        // Check for two matching symbols - ALWAYS gives bonus payout
        else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
            const matchingSymbol = symbol1 === symbol2 ? symbol1 : (symbol2 === symbol3 ? symbol2 : symbol1);
            const bonusPayout = Math.floor(this.bet * 1.5); // Always 150% of bet
            this.credits += bonusPayout;
            winAmount = bonusPayout;
            isWin = true;
            this.showWin(bonusPayout, matchingSymbol, 'TWO MATCH');
            this.consecutiveLosses = 0; // Reset loss streak on win
            this.consecutiveWins++; // Track consecutive wins
        }
        // Random bonus for first 3 spins (only if no matches)
        else if (isFirstThreeSpins && Math.random() < 0.3) {
            const bonusPayout = this.bet * 2;
            this.credits += bonusPayout;
            winAmount = bonusPayout;
            isWin = true;
            this.showWin(bonusPayout, '🍀', 'BONUS');
            this.consecutiveLosses = 0; // Reset loss streak on win
            this.consecutiveWins++; // Track consecutive wins
        }
        // No matching symbols - return 50% of bet
        else {
            const consolationPayout = Math.floor(this.bet * 0.5); // 50% of bet back
            this.credits += consolationPayout;
            this.showWin(consolationPayout, '💰', 'CONSOLATION');
            
            // Track consecutive losses (consolation counts as a loss)
            this.consecutiveLosses++;
            this.consecutiveWins = 0; // Reset win streak on loss
            this.checkLossStreak();
            
            winAmount = consolationPayout;
        }
        
        // Apply privilege status penalty (10% deduction on wins)
        if (isWin && this.privilegeStatus) {
            const penalty = Math.floor(this.credits * 0.1);
            this.credits -= penalty;
            // Show penalty notification
            setTimeout(() => {
                const penaltyDisplay = document.createElement('div');
                penaltyDisplay.className = 'fixed top-4 right-4 bg-red-900 border-2 border-red-400 rounded-lg p-3 z-50 animate-bounce';
                penaltyDisplay.innerHTML = `
                    <div class="text-red-300 font-bold text-sm">👑 PRIVILEGE TAX</div>
                    <div class="text-red-200 text-xs">-${penalty} credits (10%)</div>
                `;
                document.body.appendChild(penaltyDisplay);
                
                setTimeout(() => {
                    if (document.body.contains(penaltyDisplay)) {
                        document.body.removeChild(penaltyDisplay);
                    }
                }, 3000);
            }, 1000);
        }
        
        return winAmount;
    }
    
    showWin(amount, symbol, winType = 'WIN') {
        DisplayManager.showWin(amount, symbol, winType);
    }
    
    checkLossStreak() {
        if (this.consecutiveLosses === 4) {
            this.showLossStreak();
            this.consecutiveLosses = 0; // Reset after showing the message
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
        if (this.credits < 5) {
            this.showGameOver();
            return true;
        }
        return false;
    }
    
    showGameOver() {
        // Disable all game controls
        this.spinButton.disabled = true;
        this.decreaseBetBtn.disabled = true;
        this.increaseBetBtn.disabled = true;
        this.decreaseBet10xBtn.disabled = true;
        this.increaseBet10xBtn.disabled = true;
        
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
                this.credits += 1000;
                this.updateDisplay();
                this.showWin(1000, '🎊', 'CHEAT CODE ACTIVATED!');
                konamiCode = [];
            }
        });
    }
    
    // Auto-spin feature
    startAutoSpin(spins = 10) {
        if (this.autoSpinInterval) {
            clearInterval(this.autoSpinInterval);
            this.autoSpinInterval = null;
            this.spinButton.textContent = '🎰 SPIN 🎰';
            return;
        }
        
        let remainingSpins = spins;
        this.spinButton.textContent = `AUTO (${remainingSpins})`;
        
        this.autoSpinInterval = setInterval(() => {
            if (remainingSpins <= 0 || this.credits < this.bet) {
                clearInterval(this.autoSpinInterval);
                this.autoSpinInterval = null;
                this.spinButton.textContent = '🎰 SPIN 🎰';
                return;
            }
            
            if (!this.isSpinning) {
                this.spin();
                remainingSpins--;
                this.spinButton.textContent = `AUTO (${remainingSpins})`;
            }
        }, 3000);
    }
}

// Game Initialization and Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    const slotMachine = new SlotMachine();
    const progressiveJackpot = new ProgressiveJackpot(slotMachine);
    const gameStats = new GameStats();
    
    // Add cheat codes
    slotMachine.addCheatCodes();
    
    // Override the checkWin method to include jackpot and stats
    const originalCheckWin = slotMachine.checkWin.bind(slotMachine);
    slotMachine.checkWin = function(results) {
        // Check progressive jackpot first
        if (progressiveJackpot.checkJackpot(results)) {
            gameStats.recordSpin(this.bet, progressiveJackpot.jackpot);
            return progressiveJackpot.jackpot;
        }
        
        // Check regular wins
        const winAmount = originalCheckWin(results);
        gameStats.recordSpin(this.bet, winAmount);
        
        return winAmount;
    };
    
    // Add double-click for auto-spin
    slotMachine.spinButton.addEventListener('dblclick', () => {
        slotMachine.startAutoSpin(10);
    });
    
    // Add stats display toggle (press 'S' key)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's' && !slotMachine.isSpinning) {
            showStatsModal(gameStats);
        }
    });
    
    // Show instructions on first load
    if (!localStorage.getItem('slotMachineInstructions')) {
        setTimeout(() => showInstructions(), 1000);
    }
});