class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '🔔', '🍀', '🎰'];
        this.payouts = {
            '🍒': 50,
            '🍋': 30,
            '🍊': 20,
            '⭐': 100,
            '💎': 200,
            '🔔': 75,
            '🍀': 40,
            '🎰': 500
        };
        
        this.credits = 100;
        this.bet = 10;
        this.isSpinning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
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
        this.spinSound = document.getElementById('spinSound');
    }
    
    bindEvents() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.decreaseBetBtn.addEventListener('click', () => this.changeBet(-5));
        this.increaseBetBtn.addEventListener('click', () => this.changeBet(5));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }
    
    updateDisplay() {
        this.creditsDisplay.textContent = this.credits;
        this.betDisplay.textContent = this.bet;
        
        // Update button states
        this.spinButton.disabled = this.isSpinning || this.credits < this.bet;
        this.decreaseBetBtn.disabled = this.bet <= 5;
        this.increaseBetBtn.disabled = this.bet >= this.credits || this.bet >= 50;
        
        // Update button appearance based on state
        if (this.spinButton.disabled) {
            this.spinButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.spinButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    changeBet(amount) {
        const newBet = this.bet + amount;
        if (newBet >= 5 && newBet <= 50 && newBet <= this.credits) {
            this.bet = newBet;
            this.updateDisplay();
        }
    }
    
    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }
    
    async spin() {
        if (this.isSpinning || this.credits < this.bet) return;
        
        this.isSpinning = true;
        this.credits -= this.bet;
        this.winDisplay.textContent = '';
        this.updateDisplay();
        
        // Play spin sound effect
        try {
            this.spinSound.currentTime = 0;
            this.spinSound.play().catch(() => {}); // Ignore audio errors
        } catch (e) {
            // Audio not supported or blocked
        }
        
        // Start spinning animation
        this.startSpinAnimation();
        
        // Generate results
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];
        
        // Stop reels one by one with delay
        await this.stopReel(this.reel1, results[0], 2000);
        await this.stopReel(this.reel2, results[1], 2200);
        await this.stopReel(this.reel3, results[2], 2400);
        
        // Check for wins
        this.checkWin(results);
        
        this.isSpinning = false;
        this.updateDisplay();
    }
    
    startSpinAnimation() {
        const reels = [this.reel1, this.reel2, this.reel3];
        
        reels.forEach((reel, index) => {
            reel.classList.add('reel-spinning', `reel-${index + 1}`);
            
            // Create spinning effect by rapidly changing symbols
            const spinInterval = setInterval(() => {
                const symbol = reel.querySelector('.slot-symbol');
                symbol.textContent = this.getRandomSymbol();
            }, 100);
            
            // Store interval for cleanup
            reel.spinInterval = spinInterval;
        });
    }
    
    async stopReel(reel, finalSymbol, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Clear spinning interval
                clearInterval(reel.spinInterval);
                
                // Set final symbol
                const symbol = reel.querySelector('.slot-symbol');
                symbol.textContent = finalSymbol;
                
                // Remove spinning animation
                reel.classList.remove('reel-spinning');
                
                // Add landing effect
                reel.classList.add('animate-bounce');
                setTimeout(() => {
                    reel.classList.remove('animate-bounce');
                }, 600);
                
                resolve();
            }, delay);
        });
    }
    
    checkWin(results) {
        const [symbol1, symbol2, symbol3] = results;
        
        // Check for three of a kind
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            const winAmount = this.payouts[symbol1] * this.bet;
            this.credits += winAmount;
            this.showWin(winAmount, symbol1);
            this.celebrateWin();
        } else {
            this.winDisplay.textContent = 'Try Again!';
            this.winDisplay.className = 'text-center text-2xl font-bold text-red-400 h-8 mb-4';
        }
    }
    
    showWin(amount, symbol) {
        this.winDisplay.textContent = `🎉 WIN! ${amount} CREDITS! 🎉`;
        this.winDisplay.className = 'text-center text-2xl font-bold text-green-400 h-8 mb-4 animate-pulse';
        
        // Add winning glow to symbols
        const symbols = document.querySelectorAll('.slot-symbol');
        symbols.forEach(symbolEl => {
            if (symbolEl.textContent === symbol) {
                symbolEl.classList.add('winning-symbol');
                setTimeout(() => {
                    symbolEl.classList.remove('winning-symbol');
                }, 3000);
            }
        });
    }
    
    celebrateWin() {
        // Add glow effect to slot machine
        const slotMachine = document.querySelector('.slot-machine');
        slotMachine.classList.add('pulse-gold');
        
        // Create coin drop animation
        this.createCoinAnimation();
        
        setTimeout(() => {
            slotMachine.classList.remove('pulse-gold');
        }, 3000);
    }
    
    createCoinAnimation() {
        const container = document.querySelector('.slot-machine');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const coin = document.createElement('div');
                coin.textContent = '🪙';
                coin.className = 'coin-animation absolute text-4xl pointer-events-none';
                coin.style.left = Math.random() * 80 + 10 + '%';
                coin.style.top = '20%';
                coin.style.zIndex = '1000';
                
                container.style.position = 'relative';
                container.appendChild(coin);
                
                setTimeout(() => {
                    coin.remove();
                }, 800);
            }, i * 100);
        }
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
            konamiCode = konamiCode.slice(-10);
            
            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.credits += 1000;
                this.updateDisplay();
                this.winDisplay.textContent = '🎮 CHEAT ACTIVATED! +1000 CREDITS! 🎮';
                this.winDisplay.className = 'text-center text-2xl font-bold text-purple-400 h-8 mb-4 animate-bounce';
                setTimeout(() => {
                    this.winDisplay.textContent = '';
                }, 3000);
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
            if (!this.isSpinning && this.credits >= this.bet && remainingSpins > 0) {
                this.spin();
                remainingSpins--;
                this.spinButton.textContent = `AUTO (${remainingSpins})`;
            }
            
            if (remainingSpins <= 0 || this.credits < this.bet) {
                clearInterval(this.autoSpinInterval);
                this.autoSpinInterval = null;
                this.spinButton.textContent = '🎰 SPIN 🎰';
            }
        }, 3000);
    }
}

// Progressive Jackpot Feature
class ProgressiveJackpot {
    constructor(slotMachine) {
        this.slotMachine = slotMachine;
        this.jackpot = 10000;
        this.createJackpotDisplay();
        this.startJackpotTicker();
    }
    
    createJackpotDisplay() {
        const header = document.querySelector('h1');
        const jackpotDisplay = document.createElement('div');
        jackpotDisplay.id = 'jackpotDisplay';
        jackpotDisplay.className = 'text-2xl font-bold text-yellow-300 mt-2 animate-pulse';
        jackpotDisplay.textContent = `JACKPOT: ${this.jackpot}`;
        header.parentNode.insertBefore(jackpotDisplay, header.nextSibling);
    }
    
    startJackpotTicker() {
        setInterval(() => {
            this.jackpot += Math.floor(Math.random() * 10) + 1;
            document.getElementById('jackpotDisplay').textContent = `JACKPOT: ${this.jackpot}`;
        }, 5000);
    }
    
    checkJackpot(results) {
        // Very rare jackpot condition (0.1% chance with 🎰🎰🎰)
        if (results.every(symbol => symbol === '🎰') && Math.random() < 0.001) {
            this.slotMachine.credits += this.jackpot;
            this.slotMachine.winDisplay.textContent = `🎰 JACKPOT! ${this.jackpot} CREDITS! 🎰`;
            this.slotMachine.winDisplay.className = 'text-center text-3xl font-bold text-yellow-400 h-8 mb-4 animate-bounce';
            this.jackpot = 10000; // Reset jackpot
            return true;
        }
        return false;
    }
}

// Statistics Tracker
class GameStats {
    constructor() {
        this.stats = {
            totalSpins: 0,
            totalWins: 0,
            totalCreditsWon: 0,
            totalCreditsSpent: 0,
            biggestWin: 0,
            winStreak: 0,
            currentStreak: 0
        };
        this.loadStats();
    }
    
    recordSpin(bet, win = 0) {
        this.stats.totalSpins++;
        this.stats.totalCreditsSpent += bet;
        
        if (win > 0) {
            this.stats.totalWins++;
            this.stats.totalCreditsWon += win;
            this.stats.currentStreak++;
            this.stats.winStreak = Math.max(this.stats.winStreak, this.stats.currentStreak);
            this.stats.biggestWin = Math.max(this.stats.biggestWin, win);
        } else {
            this.stats.currentStreak = 0;
        }
        
        this.saveStats();
    }
    
    saveStats() {
        localStorage.setItem('slotMachineStats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('slotMachineStats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    }
    
    getWinRate() {
        return this.stats.totalSpins > 0 ? (this.stats.totalWins / this.stats.totalSpins * 100).toFixed(1) : 0;
    }
    
    getNetProfit() {
        return this.stats.totalCreditsWon - this.stats.totalCreditsSpent;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slotMachine = new SlotMachine();
    const progressiveJackpot = new ProgressiveJackpot(slotMachine);
    const gameStats = new GameStats();
    
    // Add cheat codes
    slotMachine.addCheatCodes();
    
    // Override the checkWin method to include jackpot and stats
    const originalCheckWin = slotMachine.checkWin.bind(slotMachine);
    slotMachine.checkWin = function(results) {
        // Check for jackpot first
        if (progressiveJackpot.checkJackpot(results)) {
            gameStats.recordSpin(this.bet, progressiveJackpot.jackpot);
            this.updateDisplay();
            return;
        }
        
        // Regular win check
        originalCheckWin(results);
        
        // Record stats
        const [symbol1, symbol2, symbol3] = results;
        if (symbol1 === symbol2 && symbol2 === symbol3) {
            const winAmount = this.payouts[symbol1] * this.bet;
            gameStats.recordSpin(this.bet, winAmount);
        } else {
            gameStats.recordSpin(this.bet, 0);
        }
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
        setTimeout(() => {
            showInstructions();
            localStorage.setItem('slotMachineInstructions', 'shown');
        }, 1000);
    }
});

// Helper functions
function showStatsModal(gameStats) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-8 border-4 border-yellow-500 max-w-md">
            <h3 class="text-2xl font-bold text-yellow-400 mb-4 text-center">GAME STATISTICS</h3>
            <div class="text-yellow-300 space-y-2">
                <div>Total Spins: <span class="text-white">${gameStats.stats.totalSpins}</span></div>
                <div>Total Wins: <span class="text-green-400">${gameStats.stats.totalWins}</span></div>
                <div>Win Rate: <span class="text-blue-400">${gameStats.getWinRate()}%</span></div>
                <div>Credits Won: <span class="text-green-400">${gameStats.stats.totalCreditsWon}</span></div>
                <div>Credits Spent: <span class="text-red-400">${gameStats.stats.totalCreditsSpent}</span></div>
                <div>Net Profit: <span class="${gameStats.getNetProfit() >= 0 ? 'text-green-400' : 'text-red-400'}">${gameStats.getNetProfit()}</span></div>
                <div>Biggest Win: <span class="text-yellow-400">${gameStats.stats.biggestWin}</span></div>
                <div>Win Streak: <span class="text-purple-400">${gameStats.stats.winStreak}</span></div>
            </div>
            <button id="closeStats" class="mt-6 bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-6 rounded-lg w-full">
                CLOSE
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeStats').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showInstructions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-8 border-4 border-yellow-500 max-w-lg">
            <h3 class="text-2xl font-bold text-yellow-400 mb-4 text-center">🎰 HOW TO PLAY 🎰</h3>
            <div class="text-yellow-300 space-y-3 text-sm">
                <div>• Click <strong>SPIN</strong> or press <strong>SPACEBAR</strong> to play</div>
                <div>• Use <strong>BET +/-</strong> buttons to adjust your bet (5-50)</div>
                <div>• Match 3 symbols to win credits!</div>
                <div>• <strong>Double-click SPIN</strong> for auto-play (10 spins)</div>
                <div>• Press <strong>'S'</strong> to view statistics</div>
                <div>• Try the <strong>Konami Code</strong> for bonus credits! ↑↑↓↓←→←→BA</div>
                <div class="border-t border-yellow-600 pt-3 mt-3">
                    <div class="text-center text-yellow-400 font-bold">JACKPOT CHANCE!</div>
                    <div class="text-center">Get 🎰🎰🎰 for a chance at the progressive jackpot!</div>
                </div>
            </div>
            <button id="closeInstructions" class="mt-6 bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-6 rounded-lg w-full">
                LET'S PLAY!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeInstructions').addEventListener('click', () => {
        modal.remove();
    });
}