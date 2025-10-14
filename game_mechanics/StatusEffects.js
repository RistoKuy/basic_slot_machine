// Status Effects System - Pity and Privilege Status Management

class StatusEffects {
    constructor(gameController) {
        this.game = gameController;
        this.pityStatus = false;
        this.privilegeStatus = false;
        this.createStatusDisplay();
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
        if (!this.pityStatus && this.game.credits < 50) {
            this.pityStatus = true;
            this.showStatusActivation('pity');
        }

        // Check for Pity Status deactivation
        if (this.pityStatus && this.game.credits >= 50) {
            this.pityStatus = false;
            this.showStatusDeactivation('pity');
        }

        // Check for Privilege Status activation
        if (!this.privilegeStatus && this.game.consecutiveWins >= 3 && this.game.credits > 1000) {
            this.privilegeStatus = true;
            this.showStatusActivation('privilege');
        }

        // Check for Privilege Status deactivation
        if (this.privilegeStatus && this.game.consecutiveLosses >= 3) {
            this.privilegeStatus = false;
            this.game.consecutiveWins = 0; // Reset win streak
            this.showStatusDeactivation('privilege');
        }
    }

    updateStatusDisplay() {
        const statusContainer = document.getElementById('statusContainer');
        if (!statusContainer) return;

        statusContainer.innerHTML = '';

        if (this.pityStatus) {
            const pityBonus = Math.floor(this.game.bet / 10);
            statusContainer.innerHTML = `
                <div class="pity-status relative bg-blue-900 border border-blue-400 rounded-lg p-2 animate-pulse">
                    <div class="text-blue-300 font-bold text-sm">💙 PITY STATUS ACTIVE 💙</div>
                    <div class="text-blue-200 text-xs">Jackpot: +${pityBonus}% | 2-Match: +${pityBonus * 5}%</div>
                </div>
            `;
        }

        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.game.bet / 50);
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
        const isFirstThreeSpins = this.game.totalSpins <= 3;
        let baseChance = isFirstThreeSpins ? 0.10 : 0.01; // 10% vs 1%

        // Apply status bonuses
        if (this.pityStatus) {
            const pityBonus = Math.floor(this.game.bet / 10) * 0.01; // +1% per 10 credits bet
            baseChance += pityBonus;
        }

        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.game.bet / 50) * 0.01; // +1% per 50 credits bet
            baseChance += privilegeBonus;
        }

        return Math.min(baseChance, 0.50); // Cap at 50%
    }

    getTwoMatchChance() {
        const isFirstThreeSpins = this.game.totalSpins <= 3;
        let baseChance = isFirstThreeSpins ? 0.50 : 0.25; // 50% vs 25%

        // Apply status bonuses
        if (this.pityStatus) {
            const pityBonus = Math.floor(this.game.bet / 10) * 0.05; // +5% per 10 credits bet
            baseChance += pityBonus;
        }

        if (this.privilegeStatus) {
            const privilegeBonus = Math.floor(this.game.bet / 50) * 0.05; // +5% per 50 credits bet
            baseChance += privilegeBonus;
        }

        return Math.min(baseChance, 0.85); // Cap at 85%
    }

    applyPrivilegePenalty() {
        if (this.privilegeStatus) {
            const penalty = Math.floor(this.game.credits * 0.1);
            this.game.credits -= penalty;
            
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
}