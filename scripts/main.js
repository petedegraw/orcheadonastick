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
        this.setupAttribution();

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

            // Trigger random animation only if chaos is enabled
            if (window.ChaosEngine && window.ChaosEngine.isRunning) {
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

    setupAttribution() {
        const toggle = document.getElementById('credits-toggle');
        const content = document.getElementById('credits-content');

        if (toggle && content) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                content.classList.toggle('visible');
                toggle.textContent = content.classList.contains('visible')
                    ? 'Hide Credits'
                    : 'Credits & Attribution';
            });
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

                // Play horn sound
                const hornSound = document.getElementById('horn-sound');
                if (hornSound) {
                    hornSound.currentTime = 0;
                    hornSound.play().catch(() => {
                        // Audio play failed (e.g., no user interaction yet)
                    });
                }

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

        const speakBtn = document.getElementById('btn-speak');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                const input = prompt('Speak, friend, and enter:');
                if (input && window.EasterEggs) {
                    const phrase = input.toLowerCase().trim();
                    const mode = window.EasterEggs.secretPhrases[phrase];
                    if (mode) {
                        window.EasterEggs.activateSecretMode(mode);
                    } else {
                        this.showQuote('The doors remain shut...');
                    }
                }
            });
        }

        // GROND button - Battering ram breaks the page
        const grondBtn = document.getElementById('btn-grond');
        if (grondBtn) {
            grondBtn.addEventListener('click', () => this.actionGrondSmash());
        }

        // Second Breakfast button - Food rains from sky with meal counter
        const breakfastBtn = document.getElementById('btn-breakfast');
        if (breakfastBtn) {
            breakfastBtn.addEventListener('click', () => this.actionSecondBreakfast());
        }

        // Light Beacons button - Chain reaction beacon lighting
        const beaconsBtn = document.getElementById('btn-beacons');
        if (beaconsBtn) {
            beaconsBtn.addEventListener('click', () => this.actionLightBeacons());
        }

        // To Isengard button - Marching orcs across screen
        const isengardBtn = document.getElementById('btn-isengard');
        if (isengardBtn) {
            isengardBtn.addEventListener('click', () => this.actionMarchToIsengard());
        }

        // Party Mode button - Bilbo's birthday party with fireworks
        const partyBtn = document.getElementById('btn-party');
        if (partyBtn) {
            partyBtn.addEventListener('click', () => this.actionBilboParty());
        }

        // My Precious button - Ring vision wraith world
        const preciousBtn = document.getElementById('btn-precious');
        if (preciousBtn) {
            preciousBtn.addEventListener('click', () => this.actionRingVision());
        }

        // The Eagles button - Eagles swoop and carry orc head
        const eaglesBtn = document.getElementById('btn-eagles');
        if (eaglesBtn) {
            eaglesBtn.addEventListener('click', () => this.actionEagleRescue());
        }

        // Toss a Dwarf button - Physics toss of orc head
        const tossBtn = document.getElementById('btn-toss');
        if (tossBtn) {
            tossBtn.addEventListener('click', () => this.actionTossDwarf());
        }
    },

    // =========================================
    // NEW BUTTON ACTIONS
    // =========================================

    actionGrondSmash() {
        // Battering ram smashes and cracks appear on screen
        this.showQuote('GROND! GROND! GROND!');

        // Create crack overlay
        const crackOverlay = document.createElement('div');
        crackOverlay.className = 'grond-crack-overlay';
        document.body.appendChild(crackOverlay);

        // Add multiple cracks
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const crack = document.createElement('div');
                crack.className = 'grond-crack';
                crack.style.left = Math.random() * 100 + '%';
                crack.style.top = Math.random() * 100 + '%';
                crack.style.transform = `rotate(${Math.random() * 360}deg)`;
                crackOverlay.appendChild(crack);

                // Screen shake on each hit
                document.body.classList.add('grond-impact');
                setTimeout(() => document.body.classList.remove('grond-impact'), 100);
            }, i * 300);
        }

        // Ram appears and smashes
        const ram = document.createElement('div');
        ram.className = 'grond-ram';
        ram.textContent = '🪵';
        document.body.appendChild(ram);

        setTimeout(() => {
            crackOverlay.remove();
            ram.remove();
        }, 4000);
    },

    actionSecondBreakfast() {
        // Hobbit meal schedule with food rain
        const meals = ['Breakfast', 'Second Breakfast', 'Elevenses', 'Luncheon', 'Afternoon Tea', 'Dinner', 'Supper'];
        const foods = ['🍞', '🧀', '🍖', '🥧', '🍄', '🍎', '🥕', '🍺', '🥚', '🍇'];

        // Show meal schedule
        const schedule = document.createElement('div');
        schedule.className = 'meal-schedule';
        meals.forEach((meal, i) => {
            const item = document.createElement('div');
            item.className = 'meal-item';
            item.textContent = meal;
            item.style.animationDelay = (i * 0.2) + 's';
            schedule.appendChild(item);
        });
        document.body.appendChild(schedule);

        this.showQuote('What about second breakfast?');

        // Rain food
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const food = document.createElement('div');
                food.className = 'falling-food';
                food.textContent = foods[Math.floor(Math.random() * foods.length)];
                food.style.left = Math.random() * 100 + '%';
                food.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(food);
                setTimeout(() => food.remove(), 4000);
            }, i * 100);
        }

        setTimeout(() => schedule.remove(), 5000);
    },

    actionLightBeacons() {
        // Chain reaction beacon lighting across mountain range
        this.showQuote('The beacons are lit!');

        const beaconNames = ['Minas Tirith', 'Amon Dîn', 'Eilenach', 'Nardol', 'Erelas', 'Min-Rimmon', 'Calenhad', 'Halifirien'];
        const container = document.createElement('div');
        container.className = 'beacon-chain-container';
        document.body.appendChild(container);

        // Create mountain silhouette with beacons
        beaconNames.forEach((name, i) => {
            const beacon = document.createElement('div');
            beacon.className = 'chain-beacon';
            beacon.style.left = (10 + i * 11) + '%';
            beacon.style.bottom = (15 + Math.sin(i * 0.8) * 10) + '%';

            const label = document.createElement('span');
            label.className = 'beacon-label';
            label.textContent = name;
            beacon.appendChild(label);

            container.appendChild(beacon);

            // Light each beacon in sequence
            setTimeout(() => {
                beacon.classList.add('lit');
                if (i === beaconNames.length - 1) {
                    this.showQuote('And Rohan will answer!');
                }
            }, i * 500);
        });

        setTimeout(() => container.remove(), 6000);
    },

    actionMarchToIsengard() {
        // Marching orc army across screen
        this.showQuote("They're taking the hobbits to Isengard!");

        const container = document.createElement('div');
        container.className = 'march-container';
        document.body.appendChild(container);

        // Spawn marching orcs
        const orcEmojis = ['👹', '👺', '💀', '🧟'];
        for (let i = 0; i < 15; i++) {
            const orc = document.createElement('div');
            orc.className = 'marching-orc';
            orc.textContent = orcEmojis[Math.floor(Math.random() * orcEmojis.length)];
            orc.style.animationDelay = (i * 0.3) + 's';
            orc.style.bottom = (5 + Math.random() * 15) + '%';
            container.appendChild(orc);
        }

        // Add hobbits being carried
        setTimeout(() => {
            const hobbits = document.createElement('div');
            hobbits.className = 'carried-hobbits';
            hobbits.textContent = '🧑‍🦱🧑‍🦱';
            container.appendChild(hobbits);
        }, 1500);

        // Play drums if available
        if (window.EasterEggs) {
            window.EasterEggs.playDrums();
        }

        setTimeout(() => {
            container.remove();
            if (window.EasterEggs) {
                window.EasterEggs.stopDrums();
            }
        }, 8000);
    },

    actionBilboParty() {
        // Bilbo's 111th birthday party with Gandalf's fireworks
        this.showQuote("A hundred and eleven years is far too short a time to live among such excellent and admirable hobbits!");

        document.body.classList.add('party-night');

        // Create firework container
        const container = document.createElement('div');
        container.className = 'fireworks-container';
        document.body.appendChild(container);

        // Launch fireworks
        const launchFirework = () => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = (10 + Math.random() * 80) + '%';
            firework.style.setProperty('--hue', Math.random() * 360);
            container.appendChild(firework);

            // Create explosion particles
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'firework-particle';
                    particle.style.setProperty('--angle', (i * 30) + 'deg');
                    particle.style.setProperty('--hue', Math.random() * 360);
                    firework.appendChild(particle);
                }
            }, 600);

            setTimeout(() => firework.remove(), 2000);
        };

        // Launch multiple fireworks
        for (let i = 0; i < 10; i++) {
            setTimeout(launchFirework, i * 400);
        }

        // Dragon firework at the end!
        setTimeout(() => {
            const dragon = document.createElement('div');
            dragon.className = 'dragon-firework';
            dragon.textContent = '🐉';
            container.appendChild(dragon);
            this.showQuote('GANDALF\'S FIREWORKS!');
            setTimeout(() => dragon.remove(), 3000);
        }, 3000);

        setTimeout(() => {
            container.remove();
            document.body.classList.remove('party-night');
        }, 7000);
    },

    actionRingVision() {
        // Put on the ring - wraith world vision
        this.showQuote('The ring takes hold...');

        document.body.classList.add('ring-world');

        // Create wraith figures
        const container = document.createElement('div');
        container.className = 'wraith-container';
        document.body.appendChild(container);

        // Spawn nazgul shadows
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const wraith = document.createElement('div');
                wraith.className = 'wraith-figure';
                wraith.style.left = (10 + Math.random() * 80) + '%';
                wraith.style.animationDelay = (Math.random() * 0.5) + 's';
                container.appendChild(wraith);
            }, i * 300);
        }

        // Eye of Sauron appears
        setTimeout(() => {
            const eye = document.createElement('div');
            eye.className = 'ring-world-eye';
            container.appendChild(eye);
            this.showQuote('I SEE YOU...');
        }, 2000);

        // Hide orc head (invisible)
        if (this.orcHead) {
            this.orcHead.classList.add('ring-invisible');
        }

        setTimeout(() => {
            container.remove();
            document.body.classList.remove('ring-world');
            if (this.orcHead) {
                this.orcHead.classList.remove('ring-invisible');
            }
        }, 5000);
    },

    actionEagleRescue() {
        // Eagles swoop down and carry the orc head away
        this.showQuote('The Eagles are coming!');

        if (!this.orcHead) return;

        // Create eagle
        const eagle = document.createElement('div');
        eagle.className = 'rescue-eagle';
        eagle.textContent = '🦅';
        document.body.appendChild(eagle);

        // Eagle swoops down
        setTimeout(() => {
            eagle.classList.add('swooping');
        }, 100);

        // Grab orc head and fly away
        setTimeout(() => {
            this.orcHead.classList.add('being-carried');
            eagle.classList.remove('swooping');
            eagle.classList.add('carrying');
        }, 1000);

        // Return
        setTimeout(() => {
            this.showQuote('Not today, orc head!');
            eagle.classList.remove('carrying');
            eagle.classList.add('returning');
            this.orcHead.classList.remove('being-carried');
            this.orcHead.classList.add('being-dropped');
        }, 3000);

        setTimeout(() => {
            eagle.remove();
            this.orcHead.classList.remove('being-dropped');
        }, 4500);
    },

    actionTossDwarf() {
        // Physics-based toss of the orc head
        if (!this.orcHead) return;

        this.showQuote('Nobody tosses a dwarf!');

        setTimeout(() => {
            this.showQuote("...Don't tell the elf.");
            this.orcHead.classList.add('dwarf-tossed');
        }, 1500);

        setTimeout(() => {
            // Landing impact
            document.body.classList.add('toss-impact');
            setTimeout(() => document.body.classList.remove('toss-impact'), 200);
            this.orcHead.classList.remove('dwarf-tossed');
        }, 3500);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    OrcHead.init();
});
