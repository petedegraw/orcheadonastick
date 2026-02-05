/**
 * Main initialization script for orcheadonastick.lol
 * The most gloriously silly LOTR tribute site
 */

const OrcHead = {
    // LOTR Quotes
    quotes: [
        "LOOKS LIKE MEAT'S BACK ON THE MENU, BOYS!",
        "They're taking the hobbits to Isengard!",
        "PO-TA-TOES! Boil 'em, mash 'em, stick 'em in a stew!",
        "GROND! GROND! GROND!",
        "One does not simply walk into Mordor.",
        "That still only counts as one!",
        "Nobody tosses a dwarf!",
        "Keep it secret. Keep it safe.",
        "YOU SHALL NOT PASS!",
        "What about second breakfast?",
        "The beacons are lit! Gondor calls for aid!",
        "A wizard is never late, nor is he early.",
        "DEATH!",
        "I would have followed you, my brother. My captain. My king.",
        "For Frodo.",
        "My precious...",
        "Fly, you fools!",
        "The age of men is over. The time of the orc has come."
    ],

    // State
    killCount: 0,
    visitorCount: 0,
    sauronMode: false,
    quoteTimeout: null,

    init() {
        this.orcHead = document.getElementById('orc-head');
        this.killCounterEl = document.getElementById('kill-counter');
        this.visitorCounterEl = document.getElementById('visitor-counter');
        this.quoteOverlay = document.getElementById('quote-overlay');

        this.loadStats();
        this.setupClickHandler();
        this.setupQuoteSystem();
        this.setupButtons();
        this.incrementVisitorCount();

        // Initialize other modules
        if (window.ChaosEngine) {
            window.ChaosEngine.init(this.orcHead);
        }
        if (window.EasterEggs) {
            window.EasterEggs.init();
        }

        console.log('%c🗡️ ORCHEADONASTICK.LOL 🗡️', 'font-size: 24px; font-weight: bold; color: #ff8000;');
        console.log('%cThe orc head welcomes you, traveler.', 'font-size: 14px; color: #8b4513;');
    },

    loadStats() {
        this.killCount = parseInt(localStorage.getItem('orchead_kills') || '0');
        this.visitorCount = parseInt(localStorage.getItem('orchead_visitors') || '0');
        this.updateKillDisplay();
    },

    saveStats() {
        localStorage.setItem('orchead_kills', this.killCount.toString());
        localStorage.setItem('orchead_visitors', this.visitorCount.toString());
    },

    setupClickHandler() {
        if (!this.orcHead) return;

        this.orcHead.addEventListener('click', () => {
            this.killCount++;
            this.updateKillDisplay();
            this.saveStats();

            // Trigger random animation
            if (window.ChaosEngine) {
                window.ChaosEngine.triggerRandomAnimation();
            }

            // Check for special milestones
            this.checkMilestones();
        });
    },

    updateKillDisplay() {
        if (this.killCounterEl) {
            this.killCounterEl.textContent = this.killCount.toLocaleString();
        }
    },

    checkMilestones() {
        // Every 10 kills: Eye of Sauron pulse
        if (this.killCount % 10 === 0) {
            document.body.classList.add('sauron-pulse');
            setTimeout(() => {
                document.body.classList.remove('sauron-pulse');
            }, 1000);
        }

        // 69 kills: Nice easter egg
        if (this.killCount === 69) {
            this.showQuote('Nice.');
        }

        // 100 kills: Sauron Mode
        if (this.killCount === 100 && !this.sauronMode) {
            this.activateSauronMode();
        }
    },

    activateSauronMode() {
        this.sauronMode = true;
        document.body.classList.add('sauron-mode');
        this.showQuote('THE EYE OF SAURON SEES ALL');

        if (window.ChaosEngine) {
            window.ChaosEngine.triggerRandomAnimation('possessed-spin');
        }
    },

    setupQuoteSystem() {
        this.scheduleNextQuote();
    },

    scheduleNextQuote() {
        // Random delay between 15-45 seconds
        const delay = Math.random() * 30000 + 15000;

        this.quoteTimeout = setTimeout(() => {
            this.showRandomQuote();
            this.scheduleNextQuote();
        }, delay);
    },

    showRandomQuote() {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.showQuote(quote);
    },

    showQuote(text) {
        if (!this.quoteOverlay) return;

        this.quoteOverlay.textContent = text;
        this.quoteOverlay.classList.add('visible');

        setTimeout(() => {
            this.quoteOverlay.classList.remove('visible');
        }, 3000);
    },

    incrementVisitorCount() {
        // Check if this is a new session
        if (!sessionStorage.getItem('orchead_counted')) {
            this.visitorCount++;
            sessionStorage.setItem('orchead_counted', 'true');
            this.saveStats();
        }

        if (this.visitorCounterEl) {
            this.visitorCounterEl.textContent = this.visitorCount.toString().padStart(6, '0');
        }
    },

    setupButtons() {
        const summonBtn = document.getElementById('btn-summon');
        const hornBtn = document.getElementById('btn-horn');
        const chaosBtn = document.getElementById('btn-chaos');

        if (summonBtn) {
            summonBtn.addEventListener('click', () => {
                this.showQuote('An Uruk-hai approaches...');
                if (window.ChaosEngine) {
                    window.ChaosEngine.triggerRandomAnimation('uruk-rage');
                }
            });
        }

        if (hornBtn) {
            hornBtn.addEventListener('click', () => {
                this.showQuote('The Horn of Helm Hammerhand shall sound in the deep!');
                document.body.classList.add('horn-blast');
                setTimeout(() => {
                    document.body.classList.remove('horn-blast');
                }, 1500);
            });
        }

        if (chaosBtn) {
            chaosBtn.addEventListener('click', () => {
                if (window.ChaosEngine) {
                    const isRunning = window.ChaosEngine.toggle();
                    chaosBtn.textContent = isRunning ? 'Disable Chaos' : 'Enable Chaos';
                    this.showQuote(isRunning ? 'CHAOS UNLEASHED!' : 'Peace... for now.');
                }
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    OrcHead.init();
});
