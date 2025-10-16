// Jumpscare System - Randomly trigger jumpscares on losses

class JumpscareSystem {
    constructor(gameController) {
        this.game = gameController;
        this.jumpscareChance = 0.50; // 50% chance
        this.jumpscareVideos = [
            'assets/jumpscares/BlueLobster.mp4',
            'assets/jumpscares/foxy.mp4'
        ];
        this.isJumpscareActive = false;
    }

    shouldTriggerJumpscare() {
        // 50% chance when called
        return Math.random() < this.jumpscareChance;
    }

    getRandomJumpscareVideo() {
        const randomIndex = Math.floor(Math.random() * this.jumpscareVideos.length);
        return this.jumpscareVideos[randomIndex];
    }

    triggerJumpscare() {
        if (this.isJumpscareActive) return;
        
        this.isJumpscareActive = true;
        const videoSrc = this.getRandomJumpscareVideo();

        // Create fullscreen jumpscare overlay
        const jumpscareOverlay = document.createElement('div');
        jumpscareOverlay.id = 'jumpscareOverlay';
        jumpscareOverlay.className = 'fixed inset-0 bg-black z-[9999] flex items-center justify-center';
        jumpscareOverlay.style.cursor = 'pointer';

        const video = document.createElement('video');
        video.src = videoSrc;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.volume = 1.0;

        jumpscareOverlay.appendChild(video);
        document.body.appendChild(jumpscareOverlay);

        // Close jumpscare when video ends or on click
        const closeJumpscare = () => {
            if (jumpscareOverlay && jumpscareOverlay.parentNode) {
                jumpscareOverlay.remove();
            }
            this.isJumpscareActive = false;
        };

        video.addEventListener('ended', closeJumpscare);
        jumpscareOverlay.addEventListener('click', closeJumpscare);

        // Safety timeout - auto-close after 5 seconds
        setTimeout(closeJumpscare, 5000);
    }

    checkForJumpscare(results) {
        // Check if all three symbols are different (no match)
        const [symbol1, symbol2, symbol3] = results;
        const noMatch = symbol1 !== symbol2 && symbol2 !== symbol3 && symbol1 !== symbol3;

        if (noMatch && this.shouldTriggerJumpscare()) {
            // Delay jumpscare slightly to let player see the result first
            setTimeout(() => this.triggerJumpscare(), 300);
        }
    }
}
