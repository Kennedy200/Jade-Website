// script.js
// Valentine's Website for Jade/Angel
// Optimized for mobile with Three.js, smooth animations, and love

class ValentineSite {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 6;
        this.isScrolling = false;
        this.hearts = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.reasonsShown = 0;
        this.lovePercentage = 0;
        
        this.reasonsList = [
            "Your smile", "Your laugh", "Your kindness", "Your eyes",
            "Your heart", "Your hugs", "Your kisses", "Your voice",
            "Your strength", "Your beauty", "Your intelligence", "Your humor",
            "Your patience", "Your support", "Your honesty", "Your dreams",
            "Your passion", "Your gentleness", "Your courage", "Your love",
            "The way you care", "Your positivity", "Your warmth", "Your touch",
            "Your presence", "Your energy", "Your style", "Your grace",
            "Your giggle", "Your hand-holding", "Your morning texts", "Your goodnight wishes",
            "Your cooking", "Your dancing", "Your singing", "Your creativity",
            "Your loyalty", "Your trust", "Your forgiveness", "Your understanding",
            "Your advice", "Your listening", "Your surprises", "Your thoughtfulness",
            "Your generosity", "Your ambitions", "Your values", "Your faith",
            "Your culture", "Your language", "Your stories", "Your memories",
            "Your future plans", "Your commitment", "Your respect", "Your admiration",
            "Your protection", "Your comfort", "Your home", "Your family",
            "Your friends", "Your pets", "Your plants", "Your hobbies",
            "Your books", "Your movies", "Your music", "Your art",
            "Your photos", "Your travels", "Your adventures", "Your explorations",
            "Your cooking", "Your baking", "Your coffee", "Your tea",
            "Your wine", "Your chocolate", "Your flowers", "Your colors",
            "Your pink", "Your sparkles", "Your glitter", "Your shine",
            "Your magic", "Your mystery", "Your depth", "Your soul",
            "Your spirit", "Your essence", "Your being", "Your existence",
            "Your everything", "Your infinity", "Your eternity", "Your forever"
        ];

        this.init();
    }

    init() {
        this.setupLoader();
        this.setupThreeJS();
        this.setupNavigation();
        this.setupEnvelope();
        this.setupTimeline();
        this.setupReasons();
        this.setupLoveMeter();
        this.setupFinale();
        this.setupProgressBar();
        this.setupMusicToggle();
        this.handleResize();
        
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Start animation loop
        this.animate();
        
        // Hide loader
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 500);
        }, 1500);
    }

    setupLoader() {
        // Loader is handled in CSS and init
    }

    setupThreeJS() {
        const canvas = document.getElementById('hearts-canvas');
        
        // Mobile optimization: reduce pixel ratio
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: false,
            powerPreference: "low-power"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setClearColor(0x000000, 0);

        // Create heart particles
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        
        // Heart shape path
        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const geometry = new THREE.ShapeGeometry(heartShape);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFF1493, 
            transparent: true, 
            opacity: 0.6,
            side: THREE.DoubleSide
        });

        // Create fewer particles on mobile
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 15 : 25;

        for (let i = 0; i < particleCount; i++) {
            const mesh = new THREE.Mesh(geometry, material.clone());
            
            mesh.position.x = (Math.random() - 0.5) * 50;
            mesh.position.y = (Math.random() - 0.5) * 50;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            mesh.scale.setScalar(0.1 + Math.random() * 0.2);
            mesh.rotation.z = Math.random() * Math.PI;
            
            mesh.userData = {
                speedY: 0.02 + Math.random() * 0.03,
                speedRot: 0.01 + Math.random() * 0.02,
                wobble: Math.random() * Math.PI * 2
            };
            
            // Random pink shades
            const colors = [0xFF1493, 0xFF69B4, 0xFFB6C1, 0xFFC0CB, 0xFFD700];
            mesh.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
            
            this.hearts.push(mesh);
            this.scene.add(mesh);
        }

        // Touch events for mobile interaction
        let touchY = 0;
        canvas.addEventListener('touchstart', (e) => {
            touchY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - touchY;
            this.hearts.forEach(heart => {
                heart.position.y -= deltaY * 0.01;
            });
            touchY = e.touches[0].clientY;
        }, { passive: true });
    }

    setupNavigation() {
        const dots = document.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.scrollToSection(index);
            });
        });

        // Scroll detection with IntersectionObserver
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(sections).indexOf(entry.target);
                    this.updateActiveDot(index);
                    this.currentSection = index;
                    this.triggerSectionAnimations(index);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                this.scrollToSection(Math.min(this.currentSection + 1, this.totalSections - 1));
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                this.scrollToSection(Math.max(this.currentSection - 1, 0));
            }
        });

        // Touch swipe support
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartY, touchEndY);
        }, { passive: true });
    }

    handleSwipe(startY, endY) {
        const threshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && this.currentSection < this.totalSections - 1) {
                // Swipe up - next section
                this.scrollToSection(this.currentSection + 1);
            } else if (diff < 0 && this.currentSection > 0) {
                // Swipe down - previous section
                this.scrollToSection(this.currentSection - 1);
            }
        }
    }

    scrollToSection(index) {
        const sections = document.querySelectorAll('.section');
        sections[index].scrollIntoView({ behavior: 'smooth' });
    }

    updateActiveDot(index) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    triggerSectionAnimations(index) {
        switch(index) {
            case 1: // Love Letter
                this.animateLetter();
                break;
            case 2: // Timeline
                this.animateTimeline();
                break;
            case 3: // Reasons
                this.animateReasons();
                break;
            case 4: // Love Meter
                this.resetLoveMeter();
                break;
            case 5: // Finale
                this.animateFinale();
                break;
        }
    }

    setupEnvelope() {
        const envelope = document.getElementById('envelope');
        let isOpen = false;

        envelope.addEventListener('click', () => {
            isOpen = !isOpen;
            envelope.classList.toggle('open', isOpen);
            
            if (isOpen) {
                setTimeout(() => this.animateLetter(), 600);
                this.createConfetti(envelope);
            }
        });
    }

    animateLetter() {
        const texts = document.querySelectorAll('.typewriter-text');
        texts.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('visible');
            }, index * 800);
        });
    }

    setupTimeline() {
        // Timeline animation triggered by intersection
    }

    animateTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 300);
        });
    }

    setupReasons() {
        const grid = document.getElementById('reasonsGrid');
        grid.innerHTML = '';
        
        this.reasonsList.forEach((reason, index) => {
            const card = document.createElement('div');
            card.className = 'reason-card';
            card.innerHTML = `
                <span class="reason-emoji">${this.getEmoji(index)}</span>
                <span class="reason-text">${reason}</span>
            `;
            card.style.transitionDelay = `${index * 0.05}s`;
            grid.appendChild(card);
        });

        // Scroll listener for infinite feel
        grid.addEventListener('scroll', () => {
            this.updateReasonCounter(grid);
        });
    }

    getEmoji(index) {
        const emojis = ['💖', '✨', '🌸', '💕', '🎀', '💗', '🌺', '💝', '💖', '✨'];
        return emojis[index % emojis.length];
    }

    animateReasons() {
        const cards = document.querySelectorAll('.reason-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }

    updateReasonCounter(grid) {
        const cards = grid.querySelectorAll('.reason-card');
        let visible = 0;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                visible++;
            }
        });
        document.getElementById('reasonCount').textContent = visible;
    }

    setupLoveMeter() {
        const hearts = document.querySelectorAll('.meter-hearts span');
        const percentage = document.getElementById('lovePercentage');
        const hiddenMessage = document.getElementById('hiddenMessage');
        
        hearts.forEach((heart, index) => {
            heart.addEventListener('click', () => {
                // Activate this heart and all before it
                hearts.forEach((h, i) => {
                    h.classList.toggle('active', i <= index);
                });
                
                this.lovePercentage = (index + 1) * 20;
                percentage.textContent = `${this.lovePercentage}%`;
                
                // Pulse animation
                heart.style.transform = 'scale(1.4)';
                setTimeout(() => {
                    heart.style.transform = '';
                }, 300);

                if (this.lovePercentage === 100) {
                    setTimeout(() => {
                        hiddenMessage.classList.add('show');
                        this.createConfetti(document.querySelector('.meter-container'));
                    }, 500);
                }
            });
        });
    }

    resetLoveMeter() {
        const hearts = document.querySelectorAll('.meter-hearts span');
        const percentage = document.getElementById('lovePercentage');
        const hiddenMessage = document.getElementById('hiddenMessage');
        
        hearts.forEach(h => h.classList.remove('active'));
        percentage.textContent = '0%';
        hiddenMessage.classList.remove('show');
        this.lovePercentage = 0;
    }

    setupFinale() {
        const restartBtn = document.getElementById('restartBtn');
        restartBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    animateFinale() {
        const explosion = document.getElementById('heartExplosion');
        explosion.innerHTML = '';
        
        // Create explosion of hearts
        for (let i = 0; i < 30; i++) {
            const heart = document.createElement('div');
            heart.className = 'explosion-heart';
            heart.textContent = ['💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
            
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 200 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.animationDelay = `${Math.random() * 0.5}s`;
            
            explosion.appendChild(heart);
        }
    }

    setupProgressBar() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        }, { passive: true });
    }

    setupMusicToggle() {
        const toggle = document.getElementById('musicToggle');
        let isPlaying = false;
        
        // Create audio context for potential sound effects
        // Note: Browsers require user interaction before playing audio
        toggle.addEventListener('click', () => {
            isPlaying = !isPlaying;
            toggle.classList.toggle('playing', isPlaying);
            toggle.textContent = isPlaying ? '🔇' : '🎵';
            
            // Visual feedback only - actual audio would need a file
            if (isPlaying) {
                this.showToast('Music would play here 💕 (Add your song file)');
            }
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            font-family: 'Dancing Script', cursive;
            color: var(--pink-hot);
            z-index: 10000;
            animation: fadeInUp 0.5s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFD700', '#FFF'];
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 5;
            const tx = Math.cos(angle) * 100 * velocity;
            const ty = Math.sin(angle) * 100 * velocity;
            
            confetti.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1500);
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.prefersReducedMotion) return;
        
        // Animate Three.js hearts
        const time = Date.now() * 0.001;
        
        this.hearts.forEach((heart, index) => {
            // Gentle floating motion
            heart.position.y += Math.sin(time + heart.userData.wobble) * 0.02;
            heart.rotation.y += heart.userData.speedRot;
            heart.rotation.z += Math.sin(time * 0.5) * 0.01;
            
            // Reset if too high/low
            if (heart.position.y > 25) heart.position.y = -25;
            if (heart.position.y < -25) heart.position.y = 25;
            
            // Gentle scale breathing
            const scale = heart.scale.x + Math.sin(time * 2 + index) * 0.0005;
            heart.scale.setScalar(Math.max(0.05, scale));
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ValentineSite();
});

// Service Worker for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript,').catch(() => {
        // Silent fail - not critical for Valentine's site
    });
}