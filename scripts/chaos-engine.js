/**
 * Chaos Animation Engine
 * Randomly triggers animations on the orc head every 3-15 seconds
 */

const ChaosEngine = {
    animations: [
        'possessed-spin',
        'sauron-zoom',
        'wind-wobble',
        'uruk-rage',
        'spirit-float',
        'ring-pulse'
    ],

    reducedMotionAnimations: ['subtle-pulse'],

    isRunning: false,
    timeoutId: null,
    orcHead: null,
    prefersReducedMotion: false,

    init(orcHeadElement) {
        this.orcHead = orcHeadElement;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Listen for preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
        });

        this.start();
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.scheduleNextAnimation();
    },

    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    },

    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
        return this.isRunning;
    },

    scheduleNextAnimation() {
        if (!this.isRunning) return;

        // Random delay between 3-15 seconds
        const delay = Math.random() * 12000 + 3000;

        this.timeoutId = setTimeout(() => {
            if (!this.isRunning) return;
            this.triggerRandomAnimation();
            this.scheduleNextAnimation();
        }, delay);
    },

    triggerRandomAnimation(specificAnimation = null) {
        if (!this.orcHead) return;

        // Remove any existing animation classes
        this.clearAnimations();

        // Choose animation based on reduced motion preference
        let animationPool = this.prefersReducedMotion
            ? this.reducedMotionAnimations
            : this.animations;

        const animation = specificAnimation || animationPool[Math.floor(Math.random() * animationPool.length)];

        // Trigger reflow to restart animation
        void this.orcHead.offsetWidth;

        // Add animation class
        this.orcHead.classList.add(animation);

        // Remove class after animation completes
        const duration = this.getAnimationDuration(animation);
        setTimeout(() => {
            this.orcHead.classList.remove(animation);
        }, duration);

        return animation;
    },

    clearAnimations() {
        const allAnimations = [...this.animations, ...this.reducedMotionAnimations];
        allAnimations.forEach(anim => {
            this.orcHead.classList.remove(anim);
        });
    },

    getAnimationDuration(animation) {
        const durations = {
            'possessed-spin': 1000,
            'sauron-zoom': 800,
            'wind-wobble': 2000,
            'uruk-rage': 500,
            'spirit-float': 2000,
            'ring-pulse': 1500,
            'subtle-pulse': 2000
        };
        return durations[animation] || 1000;
    }
};

// Export for use in other modules
window.ChaosEngine = ChaosEngine;
