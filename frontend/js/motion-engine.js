/**
 * THE SIGMA DEVELOPERS - MOTION ENGINE
 * Performance-focused IntersectionObserver for premium reveals
 */

document.addEventListener('DOMContentLoaded', () => {
    initMotionEngine();
    initHeroRefinements();
    initScrollProgressBar();
});

function initMotionEngine() {
    const motionElements = document.querySelectorAll('.motion-reveal');
    
    const observerOptions = {
        threshold: 0.2, // Trigger at 20% visibility
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add active class to trigger CSS animation
                element.classList.add('motion-active');
                
                // Handle staggered children if they exist
                const staggers = element.querySelectorAll('.motion-stagger');
                staggers.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 80}ms`;
                    child.classList.add('motion-active');
                });

                // Unobserve after animating once
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    motionElements.forEach(el => observer.observe(el));
}

function initHeroRefinements() {
    const heroCard = document.getElementById('heroCard');
    const hero = document.getElementById('hero');
    
    if (!heroCard) return;

    // Mouse Parallax Effect (Max 6px)
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const moveX = (clientX - innerWidth / 2) / (innerWidth / 2) * 6;
        const moveY = (clientY - innerHeight / 2) / (innerHeight / 2) * 6;
        
        // Portrait Tilt (Max 5deg)
        const tiltX = (clientY - innerHeight / 2) / (innerHeight / 2) * 5;
        const tiltY = (clientX - innerWidth / 2) / (innerWidth / 2) * -5;

        heroCard.style.transform = `perspective(1000px) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        heroCard.style.transform = `perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
    });

    // Magnetic CTA Buttons (Max 4px)
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });
}

function initScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}
