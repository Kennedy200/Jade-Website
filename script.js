// script.js
class ValentineSite {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 6;
        this.hearts = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
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
        
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.animate();
        
        // Hide loader
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 500);
        }, 2000);
    }

    setupLoader() {
        // CSS handles the animation
    }

    setupThreeJS() {
        const canvas = document.getElementById('hearts-canvas');
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

        // Create heart shape
        const heartShape = new THREE.Shape();
        const x = 0, y = 0;
        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const geometry = new THREE.ShapeGeometry(heartShape);
        
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 12 : 20;

        for (let i = 0; i < particleCount; i++) {
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xFF1493, 
                transparent: true, 
                opacity: 0.4 + Math.random() * 0.3,
                side: THREE.DoubleSide
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 60;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 30;
            
            mesh.scale.setScalar(0.08 + Math.random() * 0.15);
            mesh.rotation.z = Math.random() * Math.PI;
            
            mesh.userData = {
                speedY: 0.01 + Math.random() * 0.02,
                speedRot: 0.005 + Math.random() * 0.01,
                wobble: Math.random() * Math.PI * 2,
                originalY: mesh.position.y
            };
            
            const colors = [0xFF1493, 0xFF69B4, 0xFFB6C1, 0xFFC0CB, 0xFFD700, 0xFF6B9D];
            mesh.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
            
            this.hearts.push(mesh);
            this.scene.add(mesh);
        }

        // Touch interaction
        let touchY = 0;
        canvas.addEventListener('touchstart', (e) => {
            touchY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - touchY;
            this.hearts.forEach(heart => {
                heart.position.y -= deltaY * 0.005;
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

        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4
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

        // Touch swipe
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
        const threshold = 80;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && this.currentSection < this.totalSections - 1) {
                this.scrollToSection(this.currentSection + 1);
            } else if (diff < 0 && this.currentSection > 0) {
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
            case 1:
                // Envelope section - wait for user interaction
                break;
            case 2:
                this.animateTimeline();
                break;
            case 3:
                this.animateReasons();
                break;
            case 4:
                this.resetLoveMeter();
                break;
            case 5:
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
                this.createConfetti(envelope, 15);
            }
        });
    }

    setupTimeline() {
        // Animation triggered by intersection
    }

    animateTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200);
        });
    }

    setupReasons() {
        const grid = document.getElementById('reasonsGrid');
        grid.innerHTML = '';
        
        this.reasonsList.forEach((reason, index) => {
            const card = document.createElement('div');
            card.className = 'reason-card';
            const emojis = ['💖', '✨', '🌸', '💕', '🎀', '💗', '🌺', '💝', '💖', '✨', '🌹', '💘'];
            card.innerHTML = `
                <span class="reason-emoji">${emojis[index % emojis.length]}</span>
                <span class="reason-text">${reason}</span>
            `;
            card.style.transitionDelay = `${index * 0.03}s`;
            grid.appendChild(card);
        });

        // Update counter on scroll
        const container = document.querySelector('.reasons-container');
        container.addEventListener('scroll', () => this.updateReasonCounter());
    }

    animateReasons() {
        const cards = document.querySelectorAll('.reason-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        cards.forEach(card => observer.observe(card));
        
        // Initial count
        setTimeout(() => this.updateReasonCounter(), 500);
    }

    updateReasonCounter() {
        const cards = document.querySelectorAll('.reason-card.visible');
        document.getElementById('reasonCount').textContent = cards.length;
    }

    setupLoveMeter() {
        const hearts = document.querySelectorAll('.meter-heart');
        const percentageDisplay = document.getElementById('percentageDisplay');
        const loveMessage = document.getElementById('loveMessage');
        
        hearts.forEach((heart, index) => {
            heart.addEventListener('click', () => {
                // Fill hearts up to clicked one
                hearts.forEach((h, i) => {
                    if (i <= index) {
                        h.classList.add('active');
                        h.textContent = '💖';
                    } else {
                        h.classList.remove('active');
                        h.textContent = '🤍';
                    }
                });
                
                const percentage = (index + 1) * 20;
                percentageDisplay.textContent = `${percentage}%`;
                
                // Animate percentage
                percentageDisplay.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    percentageDisplay.style.transform = 'scale(1)';
                }, 200);
                
                if (percentage === 100) {
                    setTimeout(() => {
                        loveMessage.classList.add('show');
                        this.createConfetti(document.querySelector('.meter-container'), 30);
                    }, 400);
                } else {
                    loveMessage.classList.remove('show');
                }
            });
        });
    }

    resetLoveMeter() {
        const hearts = document.querySelectorAll('.meter-heart');
        const percentageDisplay = document.getElementById('percentageDisplay');
        const loveMessage = document.getElementById('loveMessage');
        
        hearts.forEach(h => {
            h.classList.remove('active');
            h.textContent = '🤍';
        });
        percentageDisplay.textContent = '0%';
        loveMessage.classList.remove('show');
    }

    setupFinale() {
        const restartBtn = document.getElementById('restartBtn');
        restartBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                location.reload();
            }, 800);
        });
    }

    animateFinale() {
        const ring = document.getElementById('heartRing');
        ring.innerHTML = '';
        
        // Create orbiting hearts
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.className = 'ring-heart';
            heart.textContent = ['💖', '💕', '💗', '💝', '💘', '✨'][i % 6];
            heart.style.animationDelay = `${i * 0.8}s`;
            heart.style.animationDuration = `${8 + i * 0.5}s`;
            ring.appendChild(heart);
        }
        
        // Create explosion effect
        this.createConfetti(document.querySelector('.finale-container'), 50);
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
        
        toggle.addEventListener('click', () => {
            isPlaying = !isPlaying;
            toggle.classList.toggle('playing', isPlaying);
            toggle.textContent = isPlaying ? '🔇' : '🎵';
            
            // In a real implementation, you would toggle audio here
            // For now, just visual feedback
        });
    }

    createConfetti(element, count = 20) {
        const rect = element.getBoundingClientRect();
        const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFD700', '#FFF', '#FF6B9D'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${8 + Math.random() * 8}px;
                height: ${8 + Math.random() * 8}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 5;
            const tx = Math.cos(angle) * 150 * velocity;
            const ty = Math.sin(angle) * 150 * velocity;
            const rot = Math.random() * 720;
            
            confetti.animate([
                { 
                    transform: 'translate(0, 0) rotate(0deg) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });
            
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.prefersReducedMotion) return;
        
        const time = Date.now() * 0.001;
        
        this.hearts.forEach((heart, index) => {
            // Floating motion
            heart.position.y = heart.userData.originalY + Math.sin(time + heart.userData.wobble) * 3;
            heart.rotation.y += heart.userData.speedRot;
            heart.rotation.z = Math.sin(time * 0.5 + index) * 0.1;
            
            // Wrap around screen
            if (heart.position.y > 35) {
                heart.position.y = -35;
                heart.userData.originalY = heart.position.y;
            }
            
            // Gentle breathing scale
            const scale = (0.1 + Math.sin(time * 2 + index) * 0.02) * (heart.scale.x > 0.1 ? 1 : 1);
            heart.scale.setScalar(scale);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ValentineSite();
});

// Handle resize
window.addEventListener('resize', () => {
    if (window.valentineSite && window.valentineSite.camera && window.valentineSite.renderer) {
        window.valentineSite.camera.aspect = window.innerWidth / window.innerHeight;
        window.valentineSite.camera.updateProjectionMatrix();
        window.valentineSite.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});