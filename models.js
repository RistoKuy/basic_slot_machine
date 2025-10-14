// Game Data Models and Display Functions

// Game Configuration and Data
class GameData {
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
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    getPayout(symbol) {
        return this.payouts[symbol] || 0;
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
        jackpotDisplay.className = 'text-lg sm:text-2xl font-bold text-yellow-300 mt-2 animate-pulse';
        jackpotDisplay.textContent = `JACKPOT: ${this.jackpot}`;
        header.parentNode.insertBefore(jackpotDisplay, header.nextSibling);
    }
    
    startJackpotTicker() {
        setInterval(() => {
            this.jackpot += Math.floor(Math.random() * 50) + 10;
            document.getElementById('jackpotDisplay').textContent = `JACKPOT: ${this.jackpot}`;
        }, 5000);
    }
    
    checkJackpot(results) {
        // Very rare jackpot condition (0.1% chance with 🎰🎰🎰)
        if (results[0] === '🎰' && results[1] === '🎰' && results[2] === '🎰') {
            if (Math.random() < 0.001) {
                this.slotMachine.credits += this.jackpot;
                this.slotMachine.showWin(this.jackpot, '🎰', 'PROGRESSIVE JACKPOT!');
                this.jackpot = 10000; // Reset jackpot
                return true;
            }
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
        return this.stats.totalSpins > 0 ? ((this.stats.totalWins / this.stats.totalSpins) * 100).toFixed(1) : 0;
    }
    
    getNetProfit() {
        return this.stats.totalCreditsWon - this.stats.totalCreditsSpent;
    }
}

// Display and Animation Functions
class DisplayManager {
    static showWin(amount, symbol, winType = 'WIN') {
        const winDisplay = document.getElementById('winDisplay');
        
        if (winType === 'BONUS' || winType === 'BONUS MATCH') {
            winDisplay.innerHTML = `<div class="text-blue-400 animate-bounce">${winType}! +${amount} CREDITS!</div>`;
            DisplayManager.celebrateBonusWin();
        } else {
            winDisplay.innerHTML = `<div class="text-green-400 animate-pulse">🎉 ${winType}! ${symbol} +${amount} CREDITS! 🎉</div>`;
            DisplayManager.celebrateWin();
        }
        
        // Add winning glow to symbols
        const symbols = document.querySelectorAll('.slot-symbol');
        symbols.forEach(symbolEl => {
            symbolEl.classList.add('winning-symbol');
            setTimeout(() => {
                symbolEl.classList.remove('winning-symbol');
            }, 3000);
        });
    }
    
    static celebrateWin() {
        // Add glow effect to slot machine
        const slotMachine = document.querySelector('.slot-machine');
        slotMachine.classList.add('pulse-gold');
        
        // Create coin drop animation
        DisplayManager.createCoinAnimation();
        
        setTimeout(() => {
            slotMachine.classList.remove('pulse-gold');
        }, 3000);
    }
    
    static celebrateBonusWin() {
        // Add blue glow effect for bonus wins
        const slotMachine = document.querySelector('.slot-machine');
        slotMachine.classList.add('pulse-blue');
        
        // Create smaller bonus animation
        DisplayManager.createBonusAnimation();
        
        setTimeout(() => {
            slotMachine.classList.remove('pulse-blue');
        }, 2000);
    }
    
    static createCoinAnimation() {
        const container = document.querySelector('.slot-machine');
        
        for (let i = 0; i < 10; i++) {
            const coin = document.createElement('div');
            coin.textContent = '💰';
            coin.className = 'absolute text-2xl coin-animation';
            coin.style.left = Math.random() * 100 + '%';
            coin.style.top = '10%';
            coin.style.animationDelay = i * 0.1 + 's';
            
            container.appendChild(coin);
            
            setTimeout(() => {
                container.removeChild(coin);
            }, 1000);
        }
    }
    
    static createBonusAnimation() {
        const container = document.querySelector('.slot-machine');
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.className = 'absolute text-xl bonus-animation';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = '20%';
            star.style.animationDelay = i * 0.1 + 's';
            
            container.appendChild(star);
            
            setTimeout(() => {
                container.removeChild(star);
            }, 800);
        }
    }
}

// Modal Display Functions
function showStatsModal(gameStats) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-4 sm:p-8 border-4 border-yellow-500 max-w-md w-full max-h-full overflow-y-auto">
            <h3 class="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 text-center">GAME STATISTICS</h3>
            <div class="text-yellow-300 space-y-2 text-sm sm:text-base">
                <div>Total Spins: <span class="text-white">${gameStats.stats.totalSpins}</span></div>
                <div>Total Wins: <span class="text-green-400">${gameStats.stats.totalWins}</span></div>
                <div>Win Rate: <span class="text-blue-400">${gameStats.getWinRate()}%</span></div>
                <div>Credits Won: <span class="text-green-400">${gameStats.stats.totalCreditsWon}</span></div>
                <div>Credits Spent: <span class="text-red-400">${gameStats.stats.totalCreditsSpent}</span></div>
                <div>Net Profit: <span class="${gameStats.getNetProfit() >= 0 ? 'text-green-400' : 'text-red-400'}">${gameStats.getNetProfit()}</span></div>
                <div>Biggest Win: <span class="text-yellow-400">${gameStats.stats.biggestWin}</span></div>
                <div>Win Streak: <span class="text-purple-400">${gameStats.stats.winStreak}</span></div>
            </div>
            <button id="closeStats" class="mt-6 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-black font-bold py-3 px-6 rounded-lg w-full min-h-[44px] touch-manipulation">
                CLOSE
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeStats').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showInstructions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-4 sm:p-8 border-4 border-yellow-500 max-w-lg w-full max-h-full overflow-y-auto">
            <h3 class="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 text-center">🎰 HOW TO PLAY 🎰</h3>
            <div class="text-yellow-300 space-y-3 text-xs sm:text-sm">
                <div>• Tap <strong>SPIN</strong> or press <strong>SPACEBAR</strong> to play</div>
                <div>• Use <strong>BET +/-</strong> buttons to adjust your bet (5-50)</div>
                <div>• Match 3 symbols to win credits!</div>
                <div>• <strong>Double-tap SPIN</strong> for auto-play (10 spins)</div>
                <div>• Press <strong>'S'</strong> to view statistics</div>
                <div>• Try the <strong>Konami Code</strong> for bonus credits! ↑↑↓↓←→←→BA</div>
                <div class="border-t border-yellow-600 pt-3 mt-3">
                    <div class="text-center text-yellow-400 font-bold">STATUS EFFECTS!</div>
                    <div class="text-center text-xs">💙 <strong>Pity Status</strong>: Activated when credits &lt; 50</div>
                    <div class="text-center text-xs">👑 <strong>Privilege Status</strong>: Activated when you're on fire</div>
                </div>
                <div class="border-t border-yellow-600 pt-3 mt-3">
                    <div class="text-center text-yellow-400 font-bold">JACKPOT CHANCE!</div>
                    <div class="text-center">Get 🎰🎰🎰 for a chance at the progressive jackpot!</div>
                </div>
            </div>
            <button id="closeInstructions" class="mt-6 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-black font-bold py-3 px-6 rounded-lg w-full min-h-[44px] touch-manipulation">
                LET'S PLAY!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeInstructions').addEventListener('click', () => {
        document.body.removeChild(modal);
        localStorage.setItem('slotMachineInstructions', 'shown');
    });
}