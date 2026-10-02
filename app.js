/**
 * AK FITNESS (एक फिटनेस) - 24/7 MODERN GYM APP
 * Core Frontend Interactivity & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileDrawer();
    init24HourDial();
    initStatsCounter();
    initBusyHoursChart();
    initBeforeAfterSlider();
    initReviewsSlider();
    initGalleryFilterAndLightbox();
    initFAQAccordion();
    initTrialForms();
    initModals();
    updateCurrentYear();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & ACTIVE LINK SPY
   -------------------------------------------------------------------------- */
function initNavbar() {
    const header = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy
        let currentSectionId = '';
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const closeBtn = document.getElementById('close-drawer');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('backdrop-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* --------------------------------------------------------------------------
   3. 24/7 INTERACTIVE TIME DIAL & VIBE ENGINE
   -------------------------------------------------------------------------- */
const TIME_VIBE_DATA = {
    0: {
        badge: 'MIDNIGHT WARRIOR',
        title: 'Peaceful & Uninterrupted',
        desc: 'Pure focus lifting. The entire dumbbell rack and cable towers are completely free. Cool AC breeze and high-energy playlist.',
        crowd: 'Super Quiet (4% capacity)',
        bestfor: 'Deep focus, heavy lifts, introverts',
        staff: 'Safe Security & Facility Staff'
    },
    3: {
        badge: 'NIGHT OWL LIFTER',
        title: 'Zero Waiting. Total Focus.',
        desc: 'Work late or prefer complete privacy? Hit your heavy squats and barbell deadlifts with 100% equipment availability.',
        crowd: 'Very Quiet (5-10% capacity)',
        bestfor: 'Deep focus, night owls, shift workers',
        staff: 'Assistance & Safe 24/7 Security'
    },
    6: {
        badge: 'EARLY MORNING CRUSH',
        title: 'Sunrise Energy & Fresh Vibes',
        desc: 'Start your workday with explosive endorphins. Clean sanitized stations and energizing morning trainers ready to spot.',
        crowd: 'Moderate Energy (35-50% capacity)',
        bestfor: 'Productive start, cardio conditioning',
        staff: 'Senior Morning Coaches on Floor'
    },
    7: {
        badge: 'MORNING POWER RUSH',
        title: 'High-Motivation Morning Community',
        desc: 'Great community vibe of motivated professionals and lifters conquering the day before corporate hours.',
        crowd: 'Brisk & Upbeat (60-70% capacity)',
        bestfor: 'Strength circuits, group motivation',
        staff: 'Certified Coaches & Spotters Active'
    },
    10: {
        badge: 'MID-MORNING FLOW',
        title: 'Spacious & Relaxed Pace',
        desc: 'Great window for freelancers, flexible workers, and beginners wanting leisurely machine guidance.',
        crowd: 'Light (20-30% capacity)',
        bestfor: 'Form mastery, leisurely circuits',
        staff: 'Available for 1-on-1 Consultations'
    },
    14: {
        badge: 'LUNCH BREAK QUICK PUMP',
        title: 'Fast-Track Midday Sessions',
        desc: 'Quick 45-minute superset workout during lunch breaks. Zero queues on bench press and leg extensions.',
        crowd: 'Light & Breezy (15-25% capacity)',
        bestfor: 'Working professionals, quick HIIT',
        staff: 'Floor Trainers on Duty'
    },
    17: {
        badge: 'PRE-EVENING RAMP UP',
        title: 'Energy Rising for the Evening',
        desc: 'Early evening crowd rolling in. Music tempo increases, cardio deck lights up with runners and lifters.',
        crowd: 'Moderate (45-55% capacity)',
        bestfor: 'Full body hypertrophy, functional turf',
        staff: 'Evening Coaches on Floor'
    },
    19: {
        badge: 'PRIME ENERGY HOURS',
        title: 'Peak Atmosphere & High Energy',
        desc: 'The heart of South Delhi gym enthusiasm! Electric music, community spotters, and raw motivational energy.',
        crowd: 'High Energy Peak (75-85% capacity)',
        bestfor: 'Social motivation, heavy compound lifts',
        staff: 'Full Team of Coaches & Spotters'
    },
    21: {
        badge: 'POST-DINNER PUMP',
        title: 'Decompress & Burn Calories',
        desc: 'De-stress from daily workload. Hit high-intensity treadmill intervals or upper body workouts in comfort.',
        crowd: 'Moderate to Light (40-50% capacity)',
        bestfor: 'Stress relief, cardio & mobility',
        staff: 'Evening Shift Trainers'
    },
    23: {
        badge: 'LATE SHIFT WARRIORS',
        title: 'Late Night Calm & Pure Iron',
        desc: 'Crowds thin out while lights remain bright. Perfect for hospitality staff, doctors, and night enthusiasts.',
        crowd: 'Quiet & Calm (10-15% capacity)',
        bestfor: 'Uninterrupted supersets, late risers',
        staff: '24/7 Security & Active Facility Care'
    }
};

function init24HourDial() {
    const slider = document.getElementById('hour-range-slider');
    const clockText = document.getElementById('clock-display-text');
    const clockHand = document.getElementById('clock-hand');
    const presetBtns = document.querySelectorAll('.time-preset-btn');

    const badgeEl = document.getElementById('vibe-badge');
    const titleEl = document.getElementById('vibe-title');
    const descEl = document.getElementById('vibe-desc');
    const crowdEl = document.getElementById('vibe-crowd');
    const bestForEl = document.getElementById('vibe-bestfor');
    const staffEl = document.getElementById('vibe-staff');

    function updateVibe(hour) {
        hour = parseInt(hour, 10);

        // Format hour string
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedTime = `${String(displayHour).padStart(2, '0')}:00 ${period}`;
        clockText.textContent = formattedTime;

        // Rotate clock hand (360 deg / 12 hours)
        const angle = (hour % 12) * 30;
        clockHand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;

        // Find closest vibe key
        const vibeKeys = Object.keys(TIME_VIBE_DATA).map(Number).sort((a, b) => a - b);
        let matchedKey = vibeKeys[0];
        for (let k of vibeKeys) {
            if (hour >= k) {
                matchedKey = k;
            }
        }
        const data = TIME_VIBE_DATA[matchedKey];

        // Smooth update content
        badgeEl.textContent = data.badge;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        crowdEl.textContent = data.crowd;
        bestForEl.textContent = data.bestfor;
        staffEl.textContent = data.staff;

        // Highlight matching preset button if exact
        presetBtns.forEach(btn => {
            const btnHour = parseInt(btn.getAttribute('data-hour'), 10);
            if (btnHour === hour) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
    }

    slider.addEventListener('input', (e) => {
        updateVibe(e.target.value);
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const hour = btn.getAttribute('data-hour');
            slider.value = hour;
            updateVibe(hour);
        });
    });

    // Init with default (3 AM)
    updateVibe(slider.value);
}

/* --------------------------------------------------------------------------
   4. ANIMATED STATS COUNTER ON SCROLL
   -------------------------------------------------------------------------- */
function initStatsCounter() {
    const counters = document.querySelectorAll('.count-up');
    let started = false;

    function countUp(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1800; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = decimals > 0 ? target.toFixed(decimals) : Math.floor(target);
                clearInterval(timer);
            } else {
                el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
            }
        }, stepTime);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(counter => countUp(counter));
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.hero-stats-card');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* --------------------------------------------------------------------------
   5. BUSY HOURS INTERACTIVE CROWD METER
   -------------------------------------------------------------------------- */
const BUSY_HOURLY_DATA = {
    weekday: [
        { hour: 0, crowd: 8, label: '12 AM' },
        { hour: 1, crowd: 6, label: '1 AM' },
        { hour: 2, crowd: 5, label: '2 AM' },
        { hour: 3, crowd: 7, label: '3 AM' },
        { hour: 4, crowd: 12, label: '4 AM' },
        { hour: 5, crowd: 25, label: '5 AM' },
        { hour: 6, crowd: 58, label: '6 AM' },
        { hour: 7, crowd: 85, label: '7 AM' },
        { hour: 8, crowd: 80, label: '8 AM' },
        { hour: 9, crowd: 55, label: '9 AM' },
        { hour: 10, crowd: 32, label: '10 AM' },
        { hour: 11, crowd: 24, label: '11 AM' },
        { hour: 12, crowd: 20, label: '12 PM' },
        { hour: 13, crowd: 18, label: '1 PM' },
        { hour: 14, crowd: 16, label: '2 PM' },
        { hour: 15, crowd: 20, label: '3 PM' },
        { hour: 16, crowd: 35, label: '4 PM' },
        { hour: 17, crowd: 50, label: '5 PM' },
        { hour: 18, crowd: 78, label: '6 PM' },
        { hour: 19, crowd: 95, label: '7 PM' },
        { hour: 20, crowd: 88, label: '8 PM' },
        { hour: 21, crowd: 65, label: '9 PM' },
        { hour: 22, crowd: 38, label: '10 PM' },
        { hour: 23, crowd: 18, label: '11 PM' }
    ],
    weekend: [
        { hour: 0, crowd: 12, label: '12 AM' },
        { hour: 1, crowd: 9, label: '1 AM' },
        { hour: 2, crowd: 8, label: '2 AM' },
        { hour: 3, crowd: 6, label: '3 AM' },
        { hour: 4, crowd: 10, label: '4 AM' },
        { hour: 5, crowd: 18, label: '5 AM' },
        { hour: 6, crowd: 35, label: '6 AM' },
        { hour: 7, crowd: 65, label: '7 AM' },
        { hour: 8, crowd: 85, label: '8 AM' },
        { hour: 9, crowd: 90, label: '9 AM' },
        { hour: 10, crowd: 80, label: '10 AM' },
        { hour: 11, crowd: 60, label: '11 AM' },
        { hour: 12, crowd: 45, label: '12 PM' },
        { hour: 13, crowd: 30, label: '1 PM' },
        { hour: 14, crowd: 22, label: '2 PM' },
        { hour: 15, crowd: 25, label: '3 PM' },
        { hour: 16, crowd: 38, label: '4 PM' },
        { hour: 17, crowd: 55, label: '5 PM' },
        { hour: 18, crowd: 72, label: '6 PM' },
        { hour: 19, crowd: 82, label: '7 PM' },
        { hour: 20, crowd: 70, label: '8 PM' },
        { hour: 21, crowd: 48, label: '9 PM' },
        { hour: 22, crowd: 28, label: '10 PM' },
        { hour: 23, crowd: 16, label: '11 PM' }
    ]
};

function initBusyHoursChart() {
    const container = document.getElementById('busy-bars-grid');
    const dayTabs = document.querySelectorAll('.chart-tab');
    if (!container) return;

    function renderChart(dayType) {
        const data = BUSY_HOURLY_DATA[dayType];
        container.innerHTML = '';

        data.forEach(item => {
            const col = document.createElement('div');
            col.className = 'busy-bar-col';
            col.title = `${item.label}: ~${item.crowd}% Capacity`;

            const fill = document.createElement('div');
            fill.className = 'busy-bar-fill';
            if (item.crowd >= 75) {
                fill.classList.add('peak');
            } else if (item.crowd >= 40) {
                fill.classList.add('moderate');
            }

            fill.style.height = `${item.crowd}%`;

            const label = document.createElement('span');
            label.className = 'busy-hour-label';
            // Only display label every 3 hours on small mobile to avoid crowding
            if (item.hour % 3 === 0) {
                label.textContent = item.label.replace(' ', '');
            }

            col.appendChild(fill);
            col.appendChild(label);
            container.appendChild(col);
        });
    }

    dayTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dayTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const day = tab.getAttribute('data-day');
            renderChart(day);
        });
    });

    renderChart('weekday');
}

/* --------------------------------------------------------------------------
   6. BEFORE / AFTER COMPARISON SLIDER
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
    const container = document.getElementById('ba-slider');
    const beforeLayer = document.getElementById('ba-before-layer');
    const handle = document.getElementById('ba-handle');
    if (!container || !beforeLayer || !handle) return;

    let isDragging = false;

    function setSliderPosition(x) {
        const rect = container.getBoundingClientRect();
        let posX = x - rect.left;
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;

        const percentage = (posX / rect.width) * 100;
        beforeLayer.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        setSliderPosition(touch.clientX);
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        setSliderPosition(e.clientX);
    }

    // Mouse Events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        setSliderPosition(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', handleMouseMove);

    // Touch Events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
}

/* --------------------------------------------------------------------------
   7. REVIEWS & TESTIMONIALS SLIDER
   -------------------------------------------------------------------------- */
function initReviewsSlider() {
    const track = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');
    const dotsContainer = document.getElementById('reviews-dots');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    // Build dots
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function updateDots() {
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = totalCards - 1;
        if (index >= totalCards) index = 0;
        currentIndex = index;

        // On mobile/tablet, scroll card into view
        cards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
}

/* --------------------------------------------------------------------------
   8. GALLERY FILTER & FULLSCREEN LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryFilterAndLightbox() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;
    let visibleItems = Array.from(galleryItems);

    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        });
    });

    // Lightbox Open
    function openLightbox(index) {
        if (!visibleItems[index]) return;
        currentGalleryIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.textContent || 'AK Fitness 24/7';
        const sub = item.querySelector('.gallery-sub')?.textContent || '';

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = `${title} • ${sub}`;

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const idx = visibleItems.indexOf(item);
            if (idx !== -1) {
                openLightbox(idx);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIdx = currentGalleryIndex - 1;
            if (nextIdx < 0) nextIdx = visibleItems.length - 1;
            openLightbox(nextIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIdx = currentGalleryIndex + 1;
            if (nextIdx >= visibleItems.length) nextIdx = 0;
            openLightbox(nextIdx);
        });
    }

    // Close on backdrop click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* --------------------------------------------------------------------------
   10. TRIAL BOOKING FORMS & WHATSAPP REDIRECTION
   -------------------------------------------------------------------------- */
function initTrialForms() {
    const mainForm = document.getElementById('trial-form');
    const mainSuccessBox = document.getElementById('form-success-box');
    const resetBtn = document.getElementById('reset-form-btn');

    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const goalInput = document.getElementById('form-goal');
            const timeInput = document.getElementById('form-time');

            const nameError = document.getElementById('name-error');
            const phoneError = document.getElementById('phone-error');

            let isValid = true;
            nameError.textContent = '';
            phoneError.textContent = '';

            if (!nameInput.value.trim()) {
                nameError.textContent = 'Please enter your full name';
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameInput.classList.remove('error');
            }

            const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
            if (phoneVal.length < 10) {
                phoneError.textContent = 'Please enter a valid 10-digit phone number';
                phoneInput.classList.add('error');
                isValid = false;
            } else {
                phoneInput.classList.remove('error');
            }

            if (isValid) {
                const name = nameInput.value.trim();
                const goal = goalInput.value;
                const time = timeInput.value;

                // Show success state
                mainForm.style.display = 'none';
                mainSuccessBox.style.display = 'flex';
                showToast(`🎉 1-Day Pass Confirmed for ${name}! Welcome to AK Fitness.`, 'success');

                // Optional WhatsApp prefill redirect link update
                const encodedText = encodeURIComponent(
                    `Hi AK Fitness Bhogal! I just claimed my Free 1-Day Workout Pass on the website.\nName: ${name}\nPhone: ${phoneVal}\nGoal: ${goal}\nPreferred Time: ${time}`
                );
                const waLink = mainSuccessBox.querySelector('.btn-whatsapp');
                if (waLink) {
                    waLink.href = `https://wa.me/919810441563?text=${encodedText}`;
                }
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                mainForm.reset();
                mainForm.style.display = 'flex';
                mainSuccessBox.style.display = 'none';
            });
        }
    }
}

/* --------------------------------------------------------------------------
   11. MODALS & POPUP TRIAL PASS
   -------------------------------------------------------------------------- */
function initModals() {
    const modal = document.getElementById('trial-modal');
    const closeBtn = document.getElementById('modal-close');
    const triggerBtns = document.querySelectorAll('.open-trial-modal');
    const modalForm = document.getElementById('popup-trial-form');
    const modalSuccess = document.getElementById('modal-success-view');

    function openModal(goal, plan) {
        if (modalForm) {
            modalForm.style.display = 'flex';
            modalSuccess.style.display = 'none';
            modalForm.reset();

            if (goal) {
                const goalSelect = document.getElementById('modal-goal');
                if (goalSelect) goalSelect.value = goal;
            }
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    triggerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const goal = btn.getAttribute('data-goal');
            const plan = btn.getAttribute('data-plan');
            openModal(goal, plan);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Modal Form Submission
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('modal-name');
            const phoneInput = document.getElementById('modal-phone');
            const goalInput = document.getElementById('modal-goal');

            const nameErr = document.getElementById('modal-name-error');
            const phoneErr = document.getElementById('modal-phone-error');

            let isValid = true;
            nameErr.textContent = '';
            phoneErr.textContent = '';

            if (!nameInput.value.trim()) {
                nameErr.textContent = 'Please enter your name';
                isValid = false;
            }

            const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
            if (phoneVal.length < 10) {
                phoneErr.textContent = 'Please enter a valid 10-digit number';
                isValid = false;
            }

            if (isValid) {
                const name = nameInput.value.trim();
                modalForm.style.display = 'none';
                modalSuccess.style.display = 'flex';
                showToast(`⚡ Pass generated for ${name}!`, 'success');

                const waLink = modalSuccess.querySelector('.btn-whatsapp');
                if (waLink) {
                    const encoded = encodeURIComponent(
                        `Hi AK Fitness! I just claimed my Free Trial Pass on your website.\nName: ${name}\nPhone: ${phoneVal}\nGoal: ${goalInput.value}`
                    );
                    waLink.href = `https://wa.me/919810441563?text=${encoded}`;
                }
            }
        });
    }
}

/* --------------------------------------------------------------------------
   12. TOAST NOTIFICATIONS HELPER
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span class="toast-msg">${message}</span>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* --------------------------------------------------------------------------
   13. FOOTER CURRENT YEAR
   -------------------------------------------------------------------------- */
function updateCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
