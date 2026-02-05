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
        'mellon': 'mellon-mode',
        'gandalf': 'gandalf-mode',
        'ring': 'ring-mode',
        'death': 'death-mode',
        'theoden': 'death-mode',
        'balrog': 'balrog-mode',
        'eagles': 'eagles-mode',
        'potatoes': 'potatoes-mode',
        'taters': 'potatoes-mode',
        'mordor': 'mordor-mode',
        'aragorn': 'aragorn-mode',
        'fool': 'fool-mode',
        'nazgul': 'nazgul-mode',
        'boromir': 'boromir-mode',
        'legolas': 'legolas-mode',
        'gimli': 'gimli-mode',
        'axe': 'gimli-mode',
        'sam': 'sam-mode',
        'frodo': 'frodo-mode',
        'gollum': 'gollum-mode',
        'smeagol': 'gollum-mode',
        'shire': 'shire-mode',
        'breakfast': 'breakfast-mode',
        'elevenses': 'breakfast-mode',
        'second': 'breakfast-mode',
        'meat': 'meat-mode',
        'menu': 'meat-mode',
        'toss': 'toss-mode',
        'gondor': 'gondor-mode',
        'rohan': 'rohan-mode',
        'one': 'one-ring-mode',
        'sauron': 'sauron-mode',
        'party': 'party-mode',
        'pippin': 'pippin-mode',
        'took': 'pippin-mode',
        'palantir': 'palantir-mode',
        'beacon': 'beacon-mode',
        'tomato': 'tomato-mode',
        'denethor': 'denethor-mode',
        'intelligence': 'intelligence-mode',
        'moria': 'moria-mode'
    },

    currentPhrase: '',
    phraseTimeout: null,

    // State
    helmsDeepActive: false,
    hoverTimeout: null,

    // Rapid click tracking
    clickTimes: [],
    idleTimeout: null,

    init() {
        this.setupKonamiCode();
        this.setupSecretPhrases();
        this.setupHoverEffect();
        this.setupBeforeUnload();
        this.setupShakeDetection();
        this.setupSwipeGestures();
        this.setupRapidClick();
        this.setupIdleTimer();
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
            case 'gandalf-mode':
                this.activateGandalf();
                break;
            case 'ring-mode':
                this.activateRing();
                break;
            case 'death-mode':
                this.activateDeath();
                break;
            case 'balrog-mode':
                this.activateBalrog();
                break;
            case 'eagles-mode':
                this.activateEagles();
                break;
            case 'potatoes-mode':
                this.activatePotatoes();
                break;
            case 'mordor-mode':
                this.activateMordor();
                break;
            case 'aragorn-mode':
                this.activateAragorn();
                break;
            case 'fool-mode':
                this.activateFool();
                break;
            case 'nazgul-mode':
                this.activateNazgul();
                break;
            case 'boromir-mode':
                this.activateBoromir();
                break;
            case 'legolas-mode':
                this.activateLegolas();
                break;
            case 'gimli-mode':
                this.activateGimli();
                break;
            case 'sam-mode':
                this.activateSam();
                break;
            case 'frodo-mode':
                this.activateFrodo();
                break;
            case 'gollum-mode':
                this.activateGollum();
                break;
            case 'shire-mode':
                this.activateShire();
                break;
            case 'breakfast-mode':
                this.activateBreakfast();
                break;
            case 'meat-mode':
                this.activateMeat();
                break;
            case 'toss-mode':
                this.activateToss();
                break;
            case 'gondor-mode':
                this.activateGondor();
                break;
            case 'rohan-mode':
                this.activateRohan();
                break;
            case 'one-ring-mode':
                this.activateOneRing();
                break;
            case 'sauron-mode':
                this.activateSauronEaster();
                break;
            case 'party-mode':
                this.activateParty();
                break;
            case 'pippin-mode':
                this.activatePippin();
                break;
            case 'palantir-mode':
                this.activatePalantir();
                break;
            case 'beacon-mode':
                this.activateBeacon();
                break;
            case 'tomato-mode':
                this.activateTomato();
                break;
            case 'denethor-mode':
                this.activateDenethor();
                break;
            case 'intelligence-mode':
                this.activateIntelligence();
                break;
            case 'moria-mode':
                this.activateMoria();
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

        // Show video after a short delay
        setTimeout(() => {
            this.showIsengardVideo();
        }, 800);

        setTimeout(() => {
            orcHead.classList.remove('isengard-bounce');
        }, 5000);
    },

    showIsengardVideo() {
        const modal = document.getElementById('isengard-modal');
        const container = document.getElementById('isengard-video-container');
        const closeBtn = document.getElementById('isengard-close');

        if (!modal || !container) return;

        // Insert the iframe with autoplay
        container.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/uE-1RPDqJAY?si=ssC57roBHfcMLIbO&start=2&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

        modal.classList.add('visible');

        // Close button handler
        const closeModal = () => {
            modal.classList.remove('visible');
            container.innerHTML = ''; // Stop the video
            closeBtn.removeEventListener('click', closeModal);
            modal.removeEventListener('click', handleBackdropClick);
            document.removeEventListener('keydown', handleEscape);
        };

        const handleBackdropClick = (e) => {
            if (e.target === modal) closeModal();
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', handleBackdropClick);
        document.addEventListener('keydown', handleEscape);
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

    activateGandalf() {
        document.body.classList.add('gandalf-flash');
        this.showNotification('YOU SHALL NOT PASS!');

        setTimeout(() => {
            document.body.classList.remove('gandalf-flash');
        }, 1500);
    },

    activateRing() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('ring-invisible');
        this.showNotification('The ring has taken him...');

        setTimeout(() => {
            orcHead.classList.remove('ring-invisible');
        }, 3000);
    },

    activateDeath() {
        document.body.classList.add('death-charge');
        this.showNotification('DEATH!!!');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('uruk-rage');
            setTimeout(() => orcHead.classList.remove('uruk-rage'), 500);
        }

        setTimeout(() => {
            document.body.classList.remove('death-charge');
        }, 2000);
    },

    activateBalrog() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('balrog-fire');
        document.body.classList.add('balrog-bg');
        this.showNotification('What is this new devilry?');

        setTimeout(() => {
            orcHead.classList.remove('balrog-fire');
            document.body.classList.remove('balrog-bg');
        }, 4000);
    },

    activateEagles() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('eagles-fly');
        this.showNotification('The Eagles are coming!');

        setTimeout(() => {
            orcHead.classList.remove('eagles-fly');
        }, 2000);
    },

    activatePotatoes() {
        this.showNotification('PO-TA-TOES! Boil \'em, mash \'em, stick \'em in a stew!');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('potatoes-bounce');
            setTimeout(() => orcHead.classList.remove('potatoes-bounce'), 2000);
        }
    },

    activateMordor() {
        document.body.classList.add('mordor-mode');
        this.showNotification('One does not simply walk into Mordor...');

        setTimeout(() => {
            document.body.classList.remove('mordor-mode');
        }, 5000);
    },

    activateAragorn() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('aragorn-crown');
        this.showNotification('You bow to no one.');

        setTimeout(() => {
            orcHead.classList.remove('aragorn-crown');
        }, 4000);
    },

    activateFool() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('fool-fall');
        this.showNotification('Fly, you fools!');

        setTimeout(() => {
            orcHead.classList.remove('fool-fall');
        }, 2000);
    },

    activateNazgul() {
        document.body.classList.add('nazgul-mode');
        this.showNotification('I see you...');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('nazgul-flicker');
        }

        setTimeout(() => {
            document.body.classList.remove('nazgul-mode');
            if (orcHead) orcHead.classList.remove('nazgul-flicker');
        }, 4000);
    },

    activateBoromir() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('boromir-arrows');
        this.showNotification('One does not simply walk into Mordor...');

        setTimeout(() => {
            this.showNotification('They have a cave troll.');
        }, 2000);

        setTimeout(() => {
            orcHead.classList.remove('boromir-arrows');
        }, 5000);
    },

    activateLegolas() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('legolas-surf');
        this.showNotification('That still only counts as one!');

        setTimeout(() => {
            orcHead.classList.remove('legolas-surf');
        }, 3000);
    },

    activateGimli() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        document.body.classList.add('gimli-shake');
        this.showNotification('AND MY AXE!');

        setTimeout(() => {
            document.body.classList.remove('gimli-shake');
        }, 1500);
    },

    activateSam() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.classList.add('sam-carry');
        this.showNotification('I can\'t carry it for you... but I can carry you!');

        setTimeout(() => {
            orcHead.classList.remove('sam-carry');
        }, 3000);
    },

    activateFrodo() {
        document.body.classList.add('frodo-charge');
        this.showNotification('For Frodo.');

        setTimeout(() => {
            document.body.classList.remove('frodo-charge');
        }, 3000);
    },

    activateGollum() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        // Personality split effect
        let count = 0;
        const interval = setInterval(() => {
            orcHead.classList.toggle('gollum-glow');
            orcHead.classList.toggle('smeagol-normal');
            count++;
            if (count >= 8) {
                clearInterval(interval);
                orcHead.classList.remove('gollum-glow', 'smeagol-normal');
            }
        }, 400);

        this.showNotification('We wants it, we needs it. Must have the precious!');
    },

    activateShire() {
        document.body.classList.add('shire-mode');
        this.showNotification('The Shire... home.');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('shire-peace');
        }

        setTimeout(() => {
            document.body.classList.remove('shire-mode');
            if (orcHead) orcHead.classList.remove('shire-peace');
        }, 5000);
    },

    activateBreakfast() {
        this.showNotification('What about second breakfast?');

        setTimeout(() => {
            this.showNotification('I don\'t think he knows about second breakfast, Pip.');
        }, 2500);

        setTimeout(() => {
            this.showNotification('What about elevenses? Luncheon? Afternoon tea?');
        }, 5000);
    },

    activateMeat() {
        document.body.classList.add('meat-mode');
        this.showNotification('LOOKS LIKE MEAT\'S BACK ON THE MENU, BOYS!');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('uruk-rage');
            setTimeout(() => orcHead.classList.remove('uruk-rage'), 500);
        }

        setTimeout(() => {
            document.body.classList.remove('meat-mode');
        }, 3000);
    },

    activateToss() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        this.showNotification('Nobody tosses a dwarf!');

        setTimeout(() => {
            orcHead.classList.add('dwarf-toss');
            setTimeout(() => {
                this.showNotification('Not a word.');
            }, 1000);
        }, 1000);

        setTimeout(() => {
            orcHead.classList.remove('dwarf-toss');
        }, 3000);
    },

    activateGondor() {
        document.body.classList.add('gondor-mode');
        this.showNotification('The beacons are lit! Gondor calls for aid!');

        setTimeout(() => {
            this.showNotification('And Rohan will answer.');
        }, 2500);

        setTimeout(() => {
            document.body.classList.remove('gondor-mode');
        }, 5000);
    },

    activateRohan() {
        document.body.classList.add('rohan-mode');
        this.showNotification('Arise, arise, Riders of Théoden!');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('rohan-charge');
        }

        setTimeout(() => {
            this.showNotification('Forth Eorlingas!');
        }, 2000);

        setTimeout(() => {
            document.body.classList.remove('rohan-mode');
            if (orcHead) orcHead.classList.remove('rohan-charge');
        }, 4000);
    },

    activateOneRing() {
        document.body.classList.add('one-ring-mode');
        const orcHead = document.getElementById('orc-head');

        this.showNotification('One Ring to rule them all...');

        setTimeout(() => {
            this.showNotification('One Ring to find them...');
        }, 2000);

        setTimeout(() => {
            this.showNotification('One Ring to bring them all, and in the darkness bind them.');
        }, 4000);

        if (orcHead) {
            orcHead.classList.add('ring-pulse');
        }

        setTimeout(() => {
            document.body.classList.remove('one-ring-mode');
            if (orcHead) orcHead.classList.remove('ring-pulse');
        }, 7000);
    },

    activateSauronEaster() {
        document.body.classList.add('sauron-mode');
        this.showNotification('THE EYE OF SAURON SEES ALL');

        const orcHead = document.getElementById('orc-head');
        if (orcHead) {
            orcHead.classList.add('possessed-spin');
        }

        setTimeout(() => {
            document.body.classList.remove('sauron-mode');
            if (orcHead) orcHead.classList.remove('possessed-spin');
        }, 5000);
    },

    activateParty() {
        // MAXIMUM PARTY MODE - ABSOLUTE CHAOS
        const orcHead = document.getElementById('orc-head');
        document.body.classList.add('party-mode');

        // Play horn sound
        const hornSound = document.getElementById('horn-sound');
        if (hornSound) {
            hornSound.currentTime = 0;
            hornSound.play().catch(() => {});
        }

        // Spawn confetti
        this.spawnConfetti();

        // Spawn floating quotes
        const quotes = [
            'PARTY!', 'GROND!', 'PO-TA-TOES!', 'DEATH!',
            'FOR FRODO!', 'MY PRECIOUS!', 'ISENGARD!', 'MEAT!'
        ];
        let quoteIndex = 0;
        const quoteInterval = setInterval(() => {
            this.spawnFloatingText(quotes[quoteIndex % quotes.length]);
            quoteIndex++;
        }, 400);

        // Cycle through notifications
        const notifications = [
            'PARTY IN THE SHIRE!',
            'LOOKS LIKE PARTY\'S BACK ON THE MENU!',
            'THEY\'RE TAKING THE PARTY TO ISENGARD!',
            'ONE PARTY TO RULE THEM ALL!'
        ];
        let notifIndex = 0;
        const notifInterval = setInterval(() => {
            this.showNotification(notifications[notifIndex % notifications.length]);
            notifIndex++;
        }, 1500);

        // Orc head goes absolutely wild
        if (orcHead) {
            orcHead.classList.add('party-orc-wild');
        }

        // Spawn extra orc heads
        this.spawnPartyOrcs();

        // End the madness after 8 seconds
        setTimeout(() => {
            clearInterval(quoteInterval);
            clearInterval(notifInterval);
            document.body.classList.remove('party-mode');
            if (orcHead) {
                orcHead.classList.remove('party-orc-wild');
            }
            // Clean up party elements
            document.querySelectorAll('.confetti, .floating-text, .party-orc-clone').forEach(el => el.remove());
        }, 8000);
    },

    spawnConfetti() {
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffd700'];
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 8000);
    },

    spawnFloatingText(text) {
        const floating = document.createElement('div');
        floating.className = 'floating-text';
        floating.textContent = text;
        floating.style.left = Math.random() * 80 + 10 + '%';
        floating.style.top = Math.random() * 60 + 20 + '%';
        floating.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        floating.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        document.body.appendChild(floating);

        setTimeout(() => floating.remove(), 2000);
    },

    spawnPartyOrcs() {
        const originalOrc = document.getElementById('orc-head');
        if (!originalOrc) return;

        for (let i = 0; i < 6; i++) {
            const clone = document.createElement('img');
            clone.src = originalOrc.src;
            clone.className = 'party-orc-clone';
            clone.style.left = Math.random() * 80 + 10 + '%';
            clone.style.top = Math.random() * 60 + 20 + '%';
            clone.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(clone);
        }
    },

    // =========================================
    // PIPPIN TOOK EASTER EGGS
    // =========================================

    activatePippin() {
        // Fool of a Took!
        document.body.classList.add('moria-rumble');
        this.showNotification('Fool of a Took!');

        // Drop the bucket
        this.dropBucket();

        setTimeout(() => {
            this.showNotification('Throw yourself in next time and rid us of your stupidity!');
        }, 2000);

        setTimeout(() => {
            this.showNotification('...Drums. Drums in the deep.');
            this.playDrums();
        }, 4500);

        setTimeout(() => {
            this.showNotification('They are coming.');
        }, 6500);

        setTimeout(() => {
            document.body.classList.remove('moria-rumble');
            this.stopDrums();
        }, 8000);
    },

    dropBucket() {
        const bucket = document.createElement('div');
        bucket.className = 'falling-bucket';
        bucket.innerHTML = '🪣';
        document.body.appendChild(bucket);

        // Add skeleton and chain
        setTimeout(() => {
            const skeleton = document.createElement('div');
            skeleton.className = 'falling-skeleton';
            skeleton.innerHTML = '💀⛓️';
            document.body.appendChild(skeleton);
            setTimeout(() => skeleton.remove(), 3000);
        }, 300);

        setTimeout(() => bucket.remove(), 3000);
    },

    activatePalantir() {
        const orcHead = document.getElementById('orc-head');
        document.body.classList.add('palantir-mode');

        this.showNotification('I see you...');

        if (orcHead) {
            orcHead.classList.add('palantir-gaze');
        }

        // Sauron's eye appears
        const eye = document.createElement('div');
        eye.className = 'sauron-eye';
        document.body.appendChild(eye);

        setTimeout(() => {
            this.showNotification('There is no life in the void... only death.');
        }, 2000);

        setTimeout(() => {
            this.showNotification('Tell me... where is the Ring?');
        }, 4000);

        setTimeout(() => {
            document.body.classList.remove('palantir-mode');
            if (orcHead) orcHead.classList.remove('palantir-gaze');
            eye.remove();
        }, 6000);
    },

    activateBeacon() {
        document.body.classList.add('beacon-mode');
        this.showNotification('*Pippin climbs to the beacon*');

        // Spawn multiple beacons lighting up
        const beaconContainer = document.createElement('div');
        beaconContainer.className = 'beacon-container';
        document.body.appendChild(beaconContainer);

        const beaconPositions = [
            { left: '10%', top: '20%', delay: 0 },
            { left: '25%', top: '15%', delay: 500 },
            { left: '40%', top: '10%', delay: 1000 },
            { left: '55%', top: '12%', delay: 1500 },
            { left: '70%', top: '18%', delay: 2000 },
            { left: '85%', top: '25%', delay: 2500 }
        ];

        beaconPositions.forEach((pos, i) => {
            setTimeout(() => {
                const beacon = document.createElement('div');
                beacon.className = 'beacon-fire';
                beacon.style.left = pos.left;
                beacon.style.top = pos.top;
                beaconContainer.appendChild(beacon);

                if (i === 0) {
                    this.showNotification('The beacon! The beacon of Amon Dîn is lit!');
                }
            }, pos.delay);
        });

        setTimeout(() => {
            this.showNotification('Hope is kindled!');
        }, 3500);

        setTimeout(() => {
            document.body.classList.remove('beacon-mode');
            beaconContainer.remove();
        }, 6000);
    },

    activateTomato() {
        const orcHead = document.getElementById('orc-head');
        document.body.classList.add('tomato-mode');

        // Tomato juice dripping effect
        this.showNotification('*disturbing eating sounds*');

        if (orcHead) {
            orcHead.classList.add('tomato-splatter');
        }

        // Spawn tomatoes
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const tomato = document.createElement('div');
                tomato.className = 'flying-tomato';
                tomato.innerHTML = '🍅';
                tomato.style.left = Math.random() * 80 + 10 + '%';
                document.body.appendChild(tomato);
                setTimeout(() => tomato.remove(), 2000);
            }, i * 300);
        }

        setTimeout(() => {
            this.showNotification('Bring him some food. And wine.');
        }, 2000);

        setTimeout(() => {
            document.body.classList.remove('tomato-mode');
            if (orcHead) orcHead.classList.remove('tomato-splatter');
        }, 5000);
    },

    activateDenethor() {
        document.body.classList.add('denethor-mode');
        const orcHead = document.getElementById('orc-head');

        if (orcHead) {
            orcHead.classList.add('denethor-sad');
        }

        // Show video after a short delay
        setTimeout(() => {
            this.showDenethorVideo();
        }, 300);

        setTimeout(() => {
            document.body.classList.remove('denethor-mode');
            if (orcHead) orcHead.classList.remove('denethor-sad');
        }, 13000);
    },

    showDenethorVideo() {
        const modal = document.getElementById('denethor-modal');
        const container = document.getElementById('denethor-video-container');
        const closeBtn = document.getElementById('denethor-close');

        if (!modal || !container) return;

        // Insert the iframe with autoplay
        container.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/5DPEfwXA9MY?si=hu0PEBexTpBqzLw1&start=9&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

        modal.classList.add('visible');

        // Close button handler
        const closeModal = () => {
            modal.classList.remove('visible');
            container.innerHTML = ''; // Stop the video
            closeBtn.removeEventListener('click', closeModal);
            modal.removeEventListener('click', handleBackdropClick);
            document.removeEventListener('keydown', handleEscape);
        };

        const handleBackdropClick = (e) => {
            if (e.target === modal) closeModal();
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', handleBackdropClick);
        document.addEventListener('keydown', handleEscape);
    },

    activateIntelligence() {
        const orcHead = document.getElementById('orc-head');

        this.showNotification('It\'s a dangerous business, Frodo, going out your door.');

        setTimeout(() => {
            this.showNotification('You need people of intelligence on this sort of... mission... quest... thing.');
        }, 2500);

        setTimeout(() => {
            this.showNotification('Well, that rules you out, Pip.');
        }, 5500);

        if (orcHead) {
            orcHead.classList.add('pippin-confused');
            setTimeout(() => orcHead.classList.remove('pippin-confused'), 7000);
        }
    },

    activateMoria() {
        document.body.classList.add('moria-mode');
        const orcHead = document.getElementById('orc-head');

        this.showNotification('The Mines of Moria...');

        setTimeout(() => {
            this.showNotification('We cannot get out...');
        }, 2000);

        setTimeout(() => {
            this.showNotification('They have taken the bridge and Second Hall.');
        }, 4000);

        setTimeout(() => {
            document.body.classList.add('moria-drums');
            this.showNotification('DRUMS... DRUMS IN THE DEEP.');
            this.playDrums();
        }, 6000);

        if (orcHead) {
            orcHead.classList.add('moria-dread');
        }

        setTimeout(() => {
            document.body.classList.remove('moria-mode', 'moria-drums');
            if (orcHead) orcHead.classList.remove('moria-dread');
            this.stopDrums();
        }, 9000);
    },

    playDrums() {
        const drumsSound = document.getElementById('drums-sound');
        if (drumsSound) {
            drumsSound.currentTime = 0;
            drumsSound.play().catch(() => {});
        }
    },

    stopDrums() {
        const drumsSound = document.getElementById('drums-sound');
        if (drumsSound) {
            drumsSound.pause();
            drumsSound.currentTime = 0;
        }
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

    // Rapid clicking (10 clicks in 2 seconds) = Berserker mode
    setupRapidClick() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        orcHead.addEventListener('click', () => {
            const now = Date.now();
            this.clickTimes.push(now);

            // Keep only clicks from last 2 seconds
            this.clickTimes = this.clickTimes.filter(t => now - t < 2000);

            // 10 clicks in 2 seconds = berserker mode
            if (this.clickTimes.length >= 10) {
                this.activateBerserker();
                this.clickTimes = [];
            }
        });
    },

    activateBerserker() {
        const orcHead = document.getElementById('orc-head');
        if (!orcHead) return;

        document.body.classList.add('berserker-mode');
        orcHead.classList.add('berserker-shake');
        this.showNotification('BERSERKER RAGE!!!');

        setTimeout(() => {
            document.body.classList.remove('berserker-mode');
            orcHead.classList.remove('berserker-shake');
        }, 3000);
    },

    // Idle for 30 seconds = spooky message
    setupIdleTimer() {
        const resetIdle = () => {
            if (this.idleTimeout) clearTimeout(this.idleTimeout);
            this.idleTimeout = setTimeout(() => {
                this.showIdleMessage();
            }, 30000);
        };

        ['click', 'mousemove', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdle, { passive: true });
        });

        resetIdle();
    },

    showIdleMessage() {
        const messages = [
            'Is it secret? Is it safe?',
            'The eye is always watching...',
            'What do your elf eyes see?',
            'Even the smallest orc head can change the course of the future.',
            'All we have to decide is what to do with the time that is given us.',
            'The orc head grows restless...'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showNotification(message);

        // Reset the idle timer
        this.setupIdleTimer();
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
