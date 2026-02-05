/**
 * Easter Eggs Handler
 * Manages Konami code, secret phrases, and special interactions
 */

const EasterEggs = {
    // Konami code sequence
    konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    konamiIndex: 0,

    // Secret phrases
    secretPhrases: {
        'grond': 'grond-mode',
        'isengard': 'isengard-mode',
        'precious': 'precious-mode',
        'mellon': 'mellon-mode'
    },

    currentPhrase: '',
    phraseTimeout: null,

    // State
    helmsDeepActive: false,
    hoverTimeout: null,

    init() {
        this.setupKonamiCode();
        this.setupSecretPhrases();
        this.setupHoverEffect();
        this.setupBeforeUnload();
        this.setupShakeDetection();
        this.setupSwipeGestures();
    },

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;

                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateHelmsDeep();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
                // Check if they started the sequence
                if (e.code === this.konamiCode[0]) {
                    this.konamiIndex = 1;
                }
            }
        });
    },

    setupSecretPhrases() {
        document.addEventListener('keydown', (e) => {
            // Only track letter keys
            if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
                this.currentPhrase += e.key.toLowerCase();

                // Clear phrase after 2 seconds of inactivity
                if (this.phraseTimeout) {
                    clearTimeout(this.phraseTimeout);
                }
                this.phraseTimeout = setTimeout(() => {
                    this.currentPhrase = '';
                }, 2000);

                // Check for secret phrases
                for (const [phrase, mode] of Object.entries(this.secretPhrases)) {
                    if (this.currentPhrase.includes(phrase)) {
                        this.activateSecretMode(mode);
                        this.currentPhrase = '';
                        break;
                    }
                }
            }
        });
    },

    setupHoverEffect() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        // Desktop: hover for 5+ seconds
        orcHead.addEventListener('mouseenter', () => {
            this.hoverTimeout = setTimeout(() => {
                orcHead.classList.add('precious-glow');
            }, 5000);
        });

        orcHead.addEventListener('mouseleave', () => {
            if (this.hoverTimeout) {
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = null;
            }
            orcHead.classList.remove('precious-glow');
        });

        // Mobile: long-press for 3+ seconds (shorter since it's intentional)
        let touchTimeout = null;

        orcHead.addEventListener('touchstart', (e) => {
            touchTimeout = setTimeout(() => {
                orcHead.classList.add('precious-glow');
                this.showNotification('My precious...');
            }, 3000);
        }, { passive: true });

        orcHead.addEventListener('touchend', () => {
            if (touchTimeout) {
                clearTimeout(touchTimeout);
                touchTimeout = null;
            }
            orcHead.classList.remove('precious-glow');
        });

        orcHead.addEventListener('touchcancel', () => {
            if (touchTimeout) {
                clearTimeout(touchTimeout);
                touchTimeout = null;
            }
            orcHead.classList.remove('precious-glow');
        });

        // Prevent context menu on long press (for mobile)
        orcHead.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },

    setupBeforeUnload() {
        window.addEventListener('beforeunload', (e) => {
            // 20% chance to trigger
            if (Math.random() < 0.2) {
                e.preventDefault();
                e.returnValue = 'ISILDUR!';
                return 'ISILDUR!';
            }
        });
    },

    activateHelmsDeep() {
        this.helmsDeepActive = !this.helmsDeepActive;
        document.body.classList.toggle('helms-deep', this.helmsDeepActive);

        // Show notification
        this.showNotification(this.helmsDeepActive ? 'HELM\'S DEEP MODE ACTIVATED!' : 'Returning to normal...');
    },

    activateSecretMode(mode) {
        const orcHead = document.getElementById('orc-head');

        switch (mode) {
            case 'grond-mode':
                this.activateGrond();
                break;
            case 'isengard-mode':
                this.activateIsengard();
                break;
            case 'precious-mode':
                this.activatePrecious();
                break;
            case 'mellon-mode':
                this.activateMellon();
                break;
        }
    },

    activateGrond() {
        document.body.classList.add('screen-shake');

        // Flood screen with GROND text
        const grondContainer = document.createElement('div');
        grondContainer.className = 'grond-flood';

        for (let i = 0; i < 20; i++) {
            const grond = document.createElement('div');
            grond.className = 'grond-text';
            grond.textContent = 'GROND!';
            grond.style.left = Math.random() * 100 + '%';
            grond.style.top = Math.random() * 100 + '%';
            grond.style.animationDelay = Math.random() * 0.5 + 's';
            grondContainer.appendChild(grond);
        }

        document.body.appendChild(grondContainer);

        setTimeout(() => {
            document.body.classList.remove('screen-shake');
            grondContainer.remove();
        }, 3000);
    },

    activateIsengard() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('isengard-bounce');
        this.showNotification('They\'re taking the hobbits to Isengard!');

        setTimeout(() => {
            orcHead.classList.remove('isengard-bounce');
        }, 5000);
    },

    activatePrecious() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('gollum-glow');
        this.showNotification('My precious...');

        setTimeout(() => {
            orcHead.classList.remove('gollum-glow');
        }, 5000);
    },

    activateMellon() {
        document.body.classList.add('mellon-reveal');
        this.showNotification('Speak friend and enter...');

        setTimeout(() => {
            document.body.classList.remove('mellon-reveal');
        }, 4000);
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'easter-egg-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    },

    // Mobile swipe gestures on the orc head
    // Swipe left = GROND, Swipe right = Isengard, Swipe up = Mellon, Swipe down = Precious
    setupSwipeGestures() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        let startX = 0;
        let startY = 0;
        const minSwipeDistance = 50;

        orcHead.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        orcHead.addEventListener('touchend', (e) => {
            if (!e.changedTouches[0]) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Determine if horizontal or vertical swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX < 0) {
                        // Swipe left = GROND (battering ram!)
                        this.activateGrond();
                    } else {
                        // Swipe right = Isengard
                        this.activateIsengard();
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY < 0) {
                        // Swipe up = Mellon (doors open)
                        this.activateMellon();
                    } else {
                        // Swipe down = Precious
                        this.activatePrecious();
                    }
                }
            }
        }, { passive: true });
    },

    // Mobile shake detection - shake phone to trigger GROND!
    setupShakeDetection() {
        if (!window.DeviceMotionEvent) return;

        let lastX = 0, lastY = 0, lastZ = 0;
        let lastShake = 0;
        const shakeThreshold = 15;
        const shakeCooldown = 3000;

        window.addEventListener('devicemotion', (e) => {
            const acc = e.accelerationIncludingGravity;
            if (!acc) return;

            const deltaX = Math.abs(acc.x - lastX);
            const deltaY = Math.abs(acc.y - lastY);
            const deltaZ = Math.abs(acc.z - lastZ);

            if ((deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold)) {
                const now = Date.now();
                if (now - lastShake > shakeCooldown) {
                    lastShake = now;
                    this.activateGrond();
                }
            }

            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
        });
    }
};

// Export for use in other modules
window.EasterEggs = EasterEggs;
