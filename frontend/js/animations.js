// animations.js
/* ==========================================
   ANIMATIONS.JS - IntersectionObserver & Scroll
   ========================================== */

(function () {
  'use strict';

  // Scroll reveal using IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars when visible
        var fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(function (fill) {
          var width = fill.getAttribute('data-width');
          if (width) {
            fill.style.setProperty('--fill-width', width + '%');
            fill.classList.add('animated');
            fill.style.width = width + '%';
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Export observer globally for other scripts
  window.observer = observer;

  // Observe all animate-on-scroll elements
  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });

  // Navbar show/hide on scroll
  var navbar = document.getElementById('navbar');
  var lastScrollY = 0;
  var ticking = false;

  function updateNavbar() {
    var currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Hero card 3D tilt effect
  var heroCard = document.getElementById('heroCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', function (e) {
      var rect = heroCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg)';
    });

    heroCard.addEventListener('mouseleave', function () {
      heroCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  }

  // Subtle parallax for flagship section decorative layers
  var parallaxLayers = Array.prototype.slice.call(document.querySelectorAll('.flagship-parallax-layer'));
  var canAnimateParallax = parallaxLayers.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxTicking = false;

  function updateFlagshipParallax() {
    var viewportH = window.innerHeight || 1;
    parallaxLayers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute('data-parallax-speed') || '0.08');
      var rect = layer.getBoundingClientRect();
      var centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      var movement = centerOffset * speed * -1;
      layer.style.transform = 'translate3d(0,' + movement.toFixed(2) + 'px,0)';
    });
    parallaxTicking = false;
  }

  if (canAnimateParallax) {
    updateFlagshipParallax();
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateFlagshipParallax);
        parallaxTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateFlagshipParallax);
        parallaxTicking = true;
      }
    });
  }
})();
