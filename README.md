# Basic Slot Machine

A web-based slot machine game built with vanilla JavaScript.

## Architecture

The codebase has been refactored from a single monolithic `controller.js` (500+ lines) into a modular architecture with separate responsibilities:

- **Separation of Concerns**: Each system has its own dedicated file
- **Maintainability**: Easier to find, modify, and debug specific features  
- **Scalability**: Simple to add new features without bloating existing files
- **Code Organization**: Logical grouping of related functionality

## Game Rules

- **3 matching symbols**: Jackpot (probability-based payout)
- **2 matching symbols**: 150% of bet returned
- **No matches**: 50% of bet returned
- **Minimum bet**: 5 credits
- **Starting credits**: 100

## Status Effects

### 💙 Pity Status
- **Activation**: After losing 4 times in a row AND having <50 credits
- **Effect**: Every 10 credits bet increases:
  - Jackpot chance by +1%
  - Two-match chance by +5%
- **Duration**: Until you have >50 credits

### 👑 Privilege Status
- **Activation**: After winning 3 times in a row AND having >1000 credits
- **Effect**: Every 50 credits bet increases:
  - Jackpot chance by +1%
  - Two-match chance by +5%
- **Penalty**: Lose 10% of total credits on each win (2 or 3 matches)
- **Duration**: Until you lose 3 times in a row

## Controls

- Click **SPIN** or press **Spacebar** to play
- Use **BET +/-** buttons to adjust bet amount by 5
- Use **BET +10x/-10x** buttons for smart betting:
  - **+10x**: Multiplies bet by 10, or maxes out to your total credits if insufficient
  - **-10x**: Divides bet by 10, or drops to minimum bet (5) if result would be too low
- **Keyboard shortcuts**:
  - **Spacebar**: Spin
  - **↑/↓ Arrow keys**: Adjust bet by 5
  - **Shift + ↑/↓ Arrow keys**: Smart 10x betting (max out when insufficient credits)
- Double-click **SPIN** for auto-play (10 spins)
- Press **S** to view statistics
- Konami Code (↑↑↓↓←→←→BA) for bonus credits

## Files

- `index.html` - Main game interface
- `models.js` - Data models and display functions
- `style.css` - Styling and animations
- `game_mechanics/` - Modular game logic:
  - `GameController.js` - Main game orchestrator
  - `StatusEffects.js` - Pity and Privilege status system
  - `BettingSystem.js` - All betting-related functionality
  - `GameLogic.js` - Core game mechanics (spinning, wins, results)
  - `GameFeatures.js` - Additional features (cheat codes, auto-spin)
- `assets/lose.png` - Game over image (add your own)

## Setup

1. Clone the repository
2. Add `lose.png` to the `assets/` folder (optional)
3. Open `index.html` in a web browser