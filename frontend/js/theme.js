// theme.js - Dual Theme Engine (Optimized)

class ThemeEngine {
  constructor() {
    this.currentTheme = localStorage.getItem('portfolio-theme') || 'night';
    this.heroImage = null;
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.createTransitionOverlay();
    this.createScrollProgress();
    this.setupHeroThemeImage();
    this.attachEventListeners();
    requestAnimationFrame(() => this.initMagneticButtons());
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = `
      <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    `;
    const navInner = document.querySelector('#navbar .nav-inner');
    if (navInner) {
      const navMenuToggle = navInner.querySelector('#navToggle');
      if (navMenuToggle) {
        navInner.insertBefore(toggle, navMenuToggle);
      } else {
        navInner.appendChild(toggle);
      }
    } else {
      document.body.appendChild(toggle);
    }
    this.toggleButton = toggle;
  }

  createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);
    this.transitionOverlay = overlay;
  }

  createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progress);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const winScroll = document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  loadTheme() {
    // Theme already applied in HTML head, just sync state
    if (document.documentElement.getAttribute('data-theme') === 'day') {
      this.currentTheme = 'day';
    } else {
      this.currentTheme = 'night';
    }
    this.applyHeroImageByTheme();
  }

  toggleTheme() {
    const overlay = document.getElementById('themeOverlay');
    if (overlay) overlay.style.opacity = '1';

    setTimeout(() => {
      this.currentTheme = this.currentTheme === 'night' ? 'day' : 'night';
      if (this.currentTheme === 'day') {
        document.documentElement.setAttribute('data-theme', 'day');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      this.applyHeroImageByTheme();
      localStorage.setItem('portfolio-theme', this.currentTheme);
      this.triggerThemeEffects();

      setTimeout(() => {
        if (overlay) overlay.style.opacity = '0';
      }, 300);
    }, 200);
  }

  triggerThemeEffects() {
    // Text color wave effect
    this.animateTextColorWave();

    // Card re-glow effect
    this.animateCardReGlow();

    // Button re-light effect
    this.animateButtonReLight();
  }

  animateTextColorWave() {
    const headings = document.querySelectorAll('h1, h2, h3, .section-title');
    headings.forEach((heading, index) => {
      heading.style.transition = 'none';
      heading.style.opacity = '0.7';

      setTimeout(() => {
        heading.style.transition = 'opacity 0.4s ease-out';
        heading.style.opacity = '1';
      }, index * 50);
    });
  }

  animateCardReGlow() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transform = 'scale(1.01)';
        setTimeout(() => {
          card.style.transform = '';
        }, 200);
      }, index * 30);
    });
  }

  animateButtonReLight() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
      setTimeout(() => {
        btn.style.boxShadow = 'var(--shadow-glow)';
        setTimeout(() => {
          btn.style.boxShadow = '';
        }, 300);
      }, index * 40);
    });
  }

  attachEventListeners() {
    this.toggleButton.addEventListener('click', () => this.toggleTheme());
  }

  setupHeroThemeImage() {
    this.heroImage = document.querySelector('.hero-photo[data-day-src]');
    if (!this.heroImage) return;

    const nightSrc = this.heroImage.getAttribute('data-night-src') || this.heroImage.getAttribute('src');
    this.heroImage.setAttribute('data-night-src', nightSrc);

    this.heroImage.addEventListener('error', () => {
      if (this.currentTheme === 'day') {
        const safeNightSrc = this.heroImage.getAttribute('data-night-src');
        if (safeNightSrc) this.heroImage.setAttribute('src', safeNightSrc);
      }
    });
  }

  applyHeroImageByTheme() {
    if (!this.heroImage) return;

    const nightSrc = this.heroImage.getAttribute('data-night-src');
    const daySrc = this.heroImage.getAttribute('data-day-src');
    const targetSrc = this.currentTheme === 'day' && daySrc ? daySrc : nightSrc;

    if (targetSrc && this.heroImage.getAttribute('src') !== targetSrc) {
      this.heroImage.setAttribute('src', targetSrc);
    }
  }

  initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(btn => {
      btn.classList.add('btn-magnetic');

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.15;
        const moveY = y * 0.15;

        btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      }, { passive: true });
    });
  }
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', () => {
  const engine = new ThemeEngine();
  engine.loadTheme();

  // Cursor glow (desktop only)
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.getElementById('cursorGlow');
    if (glow) {
      let timeout;
      document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.classList.add('active');
        clearTimeout(timeout);
        timeout = setTimeout(() => glow.classList.remove('active'), 3000);
      }, { passive: true });
    }
  }

  // Parallax (throttled)
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          orbs.forEach((orb, i) => {
            orb.style.transform = `translateY(${scrolled * (0.3 + i * 0.1)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});
