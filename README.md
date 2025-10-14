# Basic Slot Machine

A web-based slot machine game built with vanilla JavaScript.

## Game Rules

- **3 matching symbols**: Jackpot (probability-based payout)
- **2 matching symbols**: 150% of bet returned
- **No matches**: 50% of bet returned
- **Minimum bet**: 5 credits
- **Starting credits**: 100

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
- `controller.js` - Game logic and controls
- `models.js` - Data models and display functions
- `style.css` - Styling and animations
- `assets/lose.png` - Game over image (add your own)

## Setup

1. Clone the repository
2. Add `lose.png` to the `assets/` folder (optional)
3. Open `index.html` in a web browser