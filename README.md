# 🎰 Basic Slot Machine

A feature-rich, web-based slot machine game built with vanilla JavaScript. Experience dynamic gameplay with status effects, paytable-based jackpots, and strategic risk/reward mechanics!

## 🎮 Game Overview

This isn't your average slot machine! The game features a sophisticated probability system, adaptive status effects that help struggling players and challenge successful ones, and pure paytable-based rewards with no hidden mechanics.

## ✨ Key Features

### 🎯 Smart Payout System
- **3 Matching Symbols (Jackpot)**: Win big with multipliers ranging from 20x to 500x your bet!
- **2 Matching Symbols**: Get 150% of your bet back
- **No Matches**: Get 50% of your bet back (consolation prize) - except during Privilege Status
- **Paytable-Based**: All wins calculated directly from symbol multipliers - what you see is what you get!

###  Game Statistics
- Track your performance with detailed statistics
- View total spins, win rate, net profit, biggest win, and win streaks
- Press **'S'** to open the stats dashboard anytime
- All stats are saved locally and persist across sessions

### 🎲 Dynamic Status Effects

#### 💙 **Pity Status** - Help When You Need It
The game notices when you're struggling and gives you a helping hand!

- **Activates**: When your credits drop below 50
- **Benefits**: 
  - Every 10 credits you bet increases jackpot chance by +1%
  - Every 10 credits you bet increases two-match chance by +5%
  - Maximum bonuses: 50% jackpot chance, 85% two-match chance
- **Visual Indicator**: Blue pulsing border with bonus percentages displayed
- **Deactivates**: When you recover to 50+ credits
- **Purpose**: Helps struggling players get back in the game without making it too easy

#### 👑 **Privilege Status** - High Risk, High Reward
You're rich, so the house wants its cut - and it gets greedier!

- **Activates**: When credits reach 1000 or more
- **Benefits**:
  - Every 50 credits you bet increases jackpot chance by +1% (capped at +30%)
  - Every 50 credits you bet increases two-match chance by +5% (capped at +60%)
  - Enhanced win probabilities for big payouts
- **Penalties**:
  - **Progressive Tax**: Starts at 10% on ALL wins, increases by +10% every jackpot, max 99%!
  - **No Consolation**: Total loss on non-matches - you get NOTHING back
  - Tax resets when status deactivates
- **Visual Indicator**: Purple pulsing border showing current tax rate and bonus caps
- **Deactivates**: When credits drop below 1000
- **Purpose**: Extreme risk/reward - the wealthier you are, the more you pay!

### 🎁 First-Time Player Bonuses
- **First 3 Spins**: Enhanced win chances to help you learn the game
  - 10% jackpot chance (vs normal 1%)
  - 50% two-match chance (vs normal 25%)
  - 30% chance for random 2x bonus even without matches!

### 😢 Loss Streak Protection
- If you lose 4 times in a row, see a special encouragement message
- Includes animated GIF and sound effect (if available)
- Consecutive loss counter resets after the message
- Keeps players motivated during tough runs

### 🎊 Special Features
- **Help Button**: Click the "?" button anytime to view comprehensive game guidelines
- **Auto-Play**: Double-click the SPIN button to automatically play 10 spins
- **Cheat Code**: Enter the Konami Code (↑↑↓↓←→←→BA) for 1000 bonus credits
- **Animations**: Coin drops, symbol glows, pulsing effects, and more
- **Sound Effects**: Spin sounds and special event audio
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🎰 Symbol Payouts

| Symbol | 3 Matches | Multiplier |
|--------|-----------|------------|
| 🎰 | MEGA JACKPOT | 500x |
| 💎 | DIAMOND | 200x |
| ⭐ | STAR | 100x |
| 🔔 | BELL | 75x |
| 🍒 | CHERRY | 50x |
| 🍀 | CLOVER | 40x |
| 🍋 | LEMON | 30x |
| 🍊 | ORANGE | 20x |

**Example**: Bet 10 credits, hit 💎💎💎 → Win 2000 credits!

## 🎮 How to Play

### Basic Controls
1. **Adjust Your Bet**:
   - Click `BET +` or `BET -` to adjust by 5 credits
   - Click `BET +10x` or `BET -10x` for smart betting (multiply/divide by 10)
   - Minimum bet: 5 credits
   - Maximum bet: Your current credits

2. **Spin the Reels**:
   - Click the `🎰 SPIN 🎰` button
   - Or press **Spacebar** for quick spins
   - Watch the reels spin and stop one by one!

3. **Check Your Results**:
   - Win messages appear below the reels
   - Credits and bet amount update automatically
   - Status effects activate/deactivate as conditions change

### Keyboard Shortcuts
- **Space**: Spin the reels
- **↑ Arrow**: Increase bet by 5
- **↓ Arrow**: Decrease bet by 5
- **Shift + ↑**: Increase bet by 10x (smart)
- **Shift + ↓**: Decrease bet by 10x (smart)
- **S**: View statistics dashboard
- **? Button**: Show game guidelines (top-right corner)
- **Konami Code**: Get bonus credits (↑↑↓↓←→←→BA)

### Advanced Features
- **Help Access**: Click "?" button anytime for full game guidelines
- **Auto-Play**: Double-click SPIN to run 10 automatic spins
- **Statistics**: Press 'S' anytime to view your complete game stats
- **Status Effects**: Monitor the status indicator above the credits display
- **Status Activation**: Effects only activate AFTER your first spin (not during betting or cheats)

## 🎯 Game Strategy Tips

1. **Start Conservative**: Begin with minimum bets (5 credits) to learn the game
2. **Watch Your Credits**: Keep an eye on the 50 credit threshold for Pity Status
3. **Leverage Status Effects**: Use Pity Status bonuses to recover from low credits
4. **Beware Privilege Status**: The progressive tax can reach 99% - know when to cash out!
5. **No Safety Net in Privilege**: Remember - no consolation prize means total losses are possible
6. **Use Smart Betting**: The 10x buttons help you adjust bets quickly
7. **Track Statistics**: Press 'S' regularly to monitor your win rate and adjust strategy
8. **First Spins Matter**: Take advantage of enhanced odds in your first 3 spins!
9. **Tax Management**: Each jackpot increases your tax by 10% during Privilege - plan accordingly

## 📁 Project Structure

### Architecture

The codebase has been refactored from a single monolithic `controller.js` (500+ lines) into a modular architecture with separate responsibilities:

- **Separation of Concerns**: Each system has its own dedicated file
- **Maintainability**: Easier to find, modify, and debug specific features  
- **Scalability**: Simple to add new features without bloating existing files
- **Code Organization**: Logical grouping of related functionality

### File Structure

```
basic_slot_machine/
├── index.html              # Main game interface
├── controller.js           # Module loader and game initializer
├── models.js              # Data models and display functions
├── style.css              # Styling and animations
├── game_mechanics/        # Modular game logic
│   ├── GameController.js  # Main game orchestrator
│   ├── StatusEffects.js   # Pity and Privilege status system
│   ├── BettingSystem.js   # Betting controls and logic
│   ├── GameLogic.js       # Core mechanics (spinning, wins, results)
│   └── GameFeatures.js    # Additional features (auto-spin, cheats)
└── assets/                # Game assets
    ├── 444.gif           # Loss streak animation
    ├── lose.png          # Game over image
    └── Flashbang.mp3     # Loss streak sound effect
```

### Module Responsibilities

**controller.js**: 
- Dynamically loads all game mechanics modules
- Initializes game after DOM is ready
- Handles loading errors gracefully

**models.js**:
- `GameData`: Symbol definitions and payout tables
- `GameStats`: Statistics tracking and persistence
- `DisplayManager`: Win animations and visual effects
- Modal functions for stats and instructions

**game_mechanics/GameController.js**:
- `SlotMachine`: Main game class
- Initializes all subsystems
- Manages game state (credits, bet, spins)
- Coordinates between different modules

**game_mechanics/StatusEffects.js**:
- Pity Status logic and activation
- Privilege Status logic with progressive tax system
- Status display and modals
- Probability modifiers with caps (30% jackpot, 60% two-match)
- Tax rate tracking (10% → 99%)
- Consolation prize control

**game_mechanics/BettingSystem.js**:
- Bet adjustment controls
- Button state management
- Keyboard betting shortcuts
- Smart 10x betting logic

**game_mechanics/GameLogic.js**:
- Spin mechanics and animations
- Result generation with probabilities
- Win checking with guaranteed jackpot on 3 matches
- Conditional consolation prizes (disabled during Privilege)
- Loss streak detection
- Game over handling

**game_mechanics/GameFeatures.js**:
- Konami Code cheat
- Auto-spin functionality
- Keyboard shortcuts
- Special event handlers

## 🛠️ Technical Features

- **Pure Vanilla JavaScript**: No frameworks, no dependencies
- **Modern ES6+**: Classes, async/await, arrow functions
- **Modular Design**: Clean separation of concerns
- **Local Storage**: Persistent stats and preferences
- **Responsive CSS**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: CSS keyframes and transitions
- **Event-Driven**: Efficient event handling and state management

## 🚀 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RistoKuy/basic_slot_machine.git
   cd basic_slot_machine
   ```

2. **Add assets (optional)**
   - Place `lose.png` in the `assets/` folder for game over screen
   - Place `444.gif` in the `assets/` folder for loss streak animation
   - Place `Flashbang.mp3` in the `assets/` folder for loss streak sound

3. **Open and play**
   ```bash
   # Simply open index.html in your browser
   # No build process required!
   ```

4. **Or use a local server** (recommended for testing)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then visit http://localhost:8000
   ```

## 🎨 Customization

### Adjust Symbol Payouts
Edit `models.js` - `GameData` class:
```javascript
this.payouts = {
    '🍒': 50,  // Change these values
    '🍋': 30,
    // ... etc
};
```

### Modify Status Effect Thresholds
Edit `game_mechanics/StatusEffects.js`:
```javascript
// Pity Status threshold
if (!this.pityStatus && this.game.credits < 50) // Change 50

// Privilege Status threshold  
if (!this.privilegeStatus && this.game.consecutiveWins >= 3 
    && this.game.credits > 1000) // Change 3 and 1000
```

### Change Starting Credits
Edit `game_mechanics/GameController.js`:
```javascript
constructor() {
    this.credits = 100;  // Change starting credits
    this.bet = 10;       // Change default bet
    // ...
}
```

## 🎓 Learning Resources

This project demonstrates:
- **Class-based JavaScript architecture**
- **Module pattern and code organization**
- **Async/await for animations**
- **LocalStorage API for persistence**
- **DOM manipulation and event handling**
- **CSS animations and transitions**
- **Probability and game balance**
- **Responsive design principles**

Perfect for learning modern JavaScript game development!

## 📝 Game Rules Summary

- **Starting Credits**: 100
- **Minimum Bet**: 5 credits
- **Consolation Prize**: Get 50% back on losses (except during Privilege Status)
- **Two-Match Bonus**: 150% of bet (guaranteed win)
- **Jackpot**: Symbol multiplier × bet amount (always triggers on 3 matches!)
- **Pity Status**: Activates at <50 credits, bonus chances up to +50% jackpot
- **Privilege Status**: Activates at >=1000 credits
  - Bonuses capped at +30% jackpot, +60% two-match
  - Progressive tax: 10% → 99% (increases +10% per jackpot)
  - No consolation prize on losses
  - Deactivates when credits drop below 1000
- **Game Over**: When credits drop below 5 (minimum bet)
- **Status Effects**: Only activate after first spin (not during betting)

## 🤝 Contributing

Feel free to fork, modify, and create pull requests! Some ideas for enhancements:
- Additional symbol types
- More status effects
- Achievement system
- Sound settings panel
- Difficulty modes
- Daily challenges
- Leaderboard system
- Visual tax rate indicator
- Privilege tax history tracker

## 🐛 Recent Bug Fixes & Updates

### Latest Changes (October 2025)
- **Fixed**: 3 matching symbols now ALWAYS trigger jackpot (no probability roll needed)
- **Updated**: Privilege Status now has capped bonuses (30% jackpot, 60% two-match)
- **Added**: Progressive tax system for Privilege Status (10% → 99%)
- **Changed**: No consolation prize during Privilege Status (total loss on non-matches)
- **Removed**: Progressive Jackpot system (focus on paytable multipliers)
- **Added**: "?" Help button for game guidelines (top-right corner)
- **Improved**: Status effects only activate after first spin
- **Enhanced**: Game guidelines with complete rules and strategies

## 📄 License

This project is open source and available for educational purposes.

## 🎉 Have Fun!

Remember: This is a game for entertainment. The Privilege Status progressive tax can get brutal (up to 99%!), so know when to quit while you're ahead! 🎰✨