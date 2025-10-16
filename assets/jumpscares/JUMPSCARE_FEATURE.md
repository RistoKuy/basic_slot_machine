# 👻 Jumpscare Feature Documentation

## Overview
A new jumpscare system has been added to the slot machine game that triggers randomly when players experience a complete loss (no matching symbols).

## Feature Details

### Trigger Conditions
- **Activation**: When player gets no matches (all three symbols are different)
- **Probability**: 20% chance on each no-match loss
- **Timing**: Plays 1 second after the reels stop (gives player time to see the result)

### Implementation

#### New File: `game_mechanics/JumpscareSystem.js`
- **Class**: `JumpscareSystem`
- **Methods**:
  - `shouldTriggerJumpscare()`: Returns true 20% of the time
  - `getRandomJumpscareVideo()`: Randomly selects a video from the array
  - `triggerJumpscare()`: Creates fullscreen overlay and plays video
  - `checkForJumpscare(results)`: Checks if conditions are met for jumpscare

#### Video Assets
Located in `assets/jumpscares/`:
- `BlueLobster.mp4`
- `foxy jumpscare.mp4`

### User Experience

1. **Player spins** and gets no matches
2. **Consolation prize** is awarded (or not, during Privilege status)
3. **1 second delay** to let player see the result
4. **20% chance**: Jumpscare triggers
5. **Fullscreen video** plays automatically with 70% volume
6. **User can close** by:
   - Clicking anywhere on the screen
   - Waiting for video to end naturally
   - Automatic close after 10 seconds (safety timeout)

### Technical Features

- **Fullscreen overlay**: z-index 9999 to appear above everything
- **Black background**: Creates immersive scary atmosphere
- **Auto-play**: Video starts immediately
- **Object-fit cover**: Video scales to fill screen
- **Prevent multiple**: `isJumpscareActive` flag prevents overlapping jumpscares
- **Memory management**: Proper cleanup when closed

### Integration Points

1. **Controller.js**: Loads `JumpscareSystem.js` module
2. **GameController.js**: Initializes `jumpscareSystem` instance
3. **GameLogic.js**: Calls `checkForJumpscare()` after no-match results

### Code Changes

#### `controller.js`
```javascript
const modules = [
    'StatusEffects.js',
    'BettingSystem.js',
    'GameLogic.js',
    'GameFeatures.js',
    'JumpscareSystem.js',  // ← Added
    'GameController.js'
];
```

#### `game_mechanics/GameController.js`
```javascript
// Initialize game systems
this.statusEffects = new StatusEffects(this);
this.bettingSystem = new BettingSystem(this);
this.gameLogic = new GameLogic(this);
this.gameFeatures = new GameFeatures(this);
this.jumpscareSystem = new JumpscareSystem(this);  // ← Added
```

#### `game_mechanics/GameLogic.js`
```javascript
// No matching symbols - return 50% of bet (consolation prize)
else {
    // ... existing consolation logic ...
    
    this.game.consecutiveLosses++;
    this.game.consecutiveWins = 0;
    this.checkLossStreak();
    
    // Check for jumpscare on no match (20% chance)
    this.game.jumpscareSystem.checkForJumpscare(results);  // ← Added
}
```

## Customization Guide

### Adding More Jumpscare Videos

1. **Add video file** to `assets/jumpscares/` folder (must be `.mp4`)
2. **Update array** in `JumpscareSystem.js`:
```javascript
this.jumpscareVideos = [
    'assets/jumpscares/BlueLobster.mp4',
    'assets/jumpscares/foxy jumpscare.mp4',
    'assets/jumpscares/your-new-video.mp4'  // ← Add here
];
```

### Adjusting Probability

Change the `jumpscareChance` value in `JumpscareSystem.js`:
```javascript
this.jumpscareChance = 0.20; // 20% chance
// Change to 0.50 for 50% chance
// Change to 0.05 for 5% chance
```

### Adjusting Timing

Change the delay before jumpscare appears:
```javascript
// In checkForJumpscare method
setTimeout(() => this.triggerJumpscare(), 1000); // 1 second delay
// Change to 500 for 0.5 seconds
// Change to 2000 for 2 seconds
```

### Adjusting Video Volume

Change the volume in `triggerJumpscare()`:
```javascript
video.volume = 0.7; // 70% volume
// Change to 1.0 for 100% volume
// Change to 0.3 for 30% volume
```

### Adjusting Auto-Close Time

Change the safety timeout:
```javascript
setTimeout(closeJumpscare, 10000); // 10 seconds
// Change to 5000 for 5 seconds
// Change to 15000 for 15 seconds
```

## Testing

To test the jumpscare system:

1. **Guaranteed trigger** (for testing):
   - Temporarily change `jumpscareChance` to `1.0` (100%)
   - Spin until you get no matches
   - Jumpscare should trigger every time

2. **Video loading**:
   - Check browser console for video load errors
   - Ensure video files are accessible from the game

3. **Multiple triggers**:
   - Verify that `isJumpscareActive` prevents overlapping jumpscares
   - Try clicking rapidly during jumpscare

4. **Cleanup**:
   - Verify overlay is removed after closing
   - Check for memory leaks with multiple triggers

## Browser Compatibility

- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅ (may require user interaction for autoplay)
- **Mobile browsers**: Works on most modern mobile browsers

**Note**: Some browsers may block autoplay with sound. The game sets volume to 0.7, which should work in most cases.

## Future Enhancements

Possible improvements:
- Different jumpscares for different loss amounts
- Rare "mega jumpscare" with lower probability
- Sound effects before jumpscare appears
- Configurable jumpscare intensity settings
- Achievement for surviving X jumpscares
- Option to disable jumpscares in settings
