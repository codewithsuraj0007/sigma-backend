// main.js
(function () {
  'use strict';

  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 600);
    }
  });

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Flagship section collapse toggle
  var flagshipShell = document.querySelector('.flagship-shell');
  var flagshipHeadline = document.querySelector('.flagship-shell-headline');
  var flagshipToggle = document.getElementById('flagshipToggle');
  var flagshipCollapsible = document.getElementById('flagshipCollapsible');
  var flagshipPreview = document.querySelector('.flagship-preview');
  if (flagshipShell && flagshipToggle && flagshipCollapsible) {
    function setFlagshipState(open) {
      flagshipCollapsible.classList.toggle('collapsed', !open);
      flagshipShell.classList.toggle('is-open', open);
      flagshipToggle.setAttribute('aria-expanded', String(open));
      flagshipToggle.textContent = open ? 'Close Project Experience' : 'Open Project Experience';
    }

    setFlagshipState(false);

    flagshipToggle.addEventListener('click', function () {
      var nextOpen = flagshipCollapsible.classList.contains('collapsed');
      setFlagshipState(nextOpen);
    });

    if (flagshipHeadline) {
      flagshipHeadline.style.cursor = 'pointer';
      flagshipHeadline.addEventListener('click', function () {
        if (flagshipCollapsible.classList.contains('collapsed')) {
          setFlagshipState(true);
        }
      });
    }

    if (flagshipPreview) {
      flagshipPreview.addEventListener('mousemove', function (e) {
        if (!flagshipShell.classList.contains('is-open')) return;
        var rect = flagshipPreview.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotY = x * 4.5;
        var rotX = y * -3.8;
        flagshipPreview.style.transform = 'translateY(-2px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) scale(1.01)';
      });

      flagshipPreview.addEventListener('mouseleave', function () {
        flagshipPreview.style.transform = '';
      });
    }
  }

  var projectData = {
    'ai-image': {
      title: 'AI Image Generator',
      problem: 'Creating unique, high-quality images from text descriptions is time-consuming for designers and content creators who need rapid visual prototyping.',
      solution: 'Built an AI-powered image generation platform that converts text prompts into creative visual outputs using modern AI APIs, with real-time preview and download capability.',
      tech: ['React.js', 'AI API Integration', 'CSS3', 'JavaScript', 'REST APIs'],
      features: [
        'Text-to-image generation with customizable prompts',
        'Real-time preview and one-click image download',
        'Responsive UI with modern glassmorphism design',
        'Robust API integration with error handling and loading states',
        'Prompt history and favorites management'
      ],
      github: '#',
      demo: '#'
    },
    'portfolio': {
      title: 'Developer Portfolio Website',
      problem: 'Most developer portfolios look generic and fail to showcase skills in a memorable, professional way that stands out to recruiters and clients.',
      solution: 'Designed a premium, animated portfolio with glassmorphism UI, advanced motion design, SEO optimization, and interactive case study presentations.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Firebase Hosting', 'SEO'],
      features: [
        'Advanced glassmorphism design system with gradient glow effects',
        'Scroll-driven animations using IntersectionObserver',
        '3D tilt effects and cursor-aware interactions',
        'SEO-optimized with semantic HTML and structured data',
        'Fully responsive across all devices with 95+ Lighthouse score'
      ],
      github: '#',
      demo: '#'
    },
    'fullstack': {
      title: 'MERN Full Stack Application',
      problem: 'Businesses need scalable web applications with robust backend architecture, secure authentication, and modern responsive frontends.',
      solution: 'Developed an enterprise-grade application using the MERN stack with JWT authentication, RESTful APIs, and a React frontend with clean architecture.',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth'],
      features: [
        'RESTful API with Express.js and proper route organization',
        'MongoDB with Mongoose ODM for data modeling',
        'JWT-based authentication and role-based authorization',
        'React.js frontend with state management and routing',
        'Input validation, error handling, and security best practices'
      ],
      github: '#',
      demo: '#'
    },
    'rana-computers': {
      title: 'Rana Computers - Modern Tech Store',
      problem: 'Growing computer retail brands need a modern digital storefront that communicates trust, showcases products clearly, and performs reliably on all devices.',
      solution: 'Built and deployed a production-ready storefront experience with responsive architecture, clean component flow, optimized rendering, and conversion-focused UX.',
      tech: ['React.js', 'Next.js', 'JavaScript', 'CSS3', 'Vercel'],
      features: [
        'Modern storefront UI with clear content hierarchy',
        'Responsive layout optimized for mobile, tablet, and desktop',
        'Fast page delivery and clean render behavior',
        'Scalable component structure for future feature expansion',
        'Production deployment pipeline on Vercel'
      ],
      github: 'https://github.com/codewithsuraj0007/rana-computers',
      demo: 'https://rana-computers.vercel.app/',
      linkedin: 'https://www.linkedin.com/posts/suraj-prajapati-0904b92b9_webdevelopment-reactjs-nextjs-activity-7391445851551723520-cNcq?utm_source=share&utm_medium=member_desktop&rcm=ACoAAExtOCwBfOY7fHbLSOOTCV0eBe3OCFsaLo8'
    }
  };

  var projectModal = document.getElementById('projectModal');
  var modalTitle = document.getElementById('modalTitle');
  var modalProblem = document.getElementById('modalProblem');
  var modalSolution = document.getElementById('modalSolution');
  var modalTech = document.getElementById('modalTech');
  var modalFeatures = document.getElementById('modalFeatures');
  var modalGithub = document.getElementById('modalGithub');
  var modalDemo = document.getElementById('modalDemo');
  var modalLinkedin = document.getElementById('modalLinkedin');

  function openProjectModal(projectKey) {
    var data = projectData[projectKey];
    if (!data || !projectModal) return;

    modalTitle.textContent = data.title;
    modalProblem.textContent = data.problem;
    modalSolution.textContent = data.solution;

    modalTech.innerHTML = '';
    data.tech.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      modalTech.appendChild(span);
    });

    modalFeatures.innerHTML = '';
    data.features.forEach(function (f) {
      var li = document.createElement('li');
      li.textContent = f;
      modalFeatures.appendChild(li);
    });

    modalGithub.href = data.github;
    modalDemo.href = data.demo;
    if (modalLinkedin) {
      if (data.linkedin) {
        modalLinkedin.href = data.linkedin;
        modalLinkedin.style.display = 'inline-flex';
      } else {
        modalLinkedin.style.display = 'none';
      }
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var key = card.getAttribute('data-project');
      openProjectModal(key);
    });
  });

  // Project filter
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(function (card) {
        var category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.indexOf(filter) !== -1) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Certificate Modal
  var certModal = document.getElementById('certModal');
  var certImage = document.getElementById('certImage');

  var certImages = {
    'aws': 'images/Screenshot 2026-02-05 230223.png',
    'google': 'images/Screenshot 2026-02-05 225646.png',
    'deloitte': 'images/Screenshot 2026-02-05 225847.png',
    'tata': 'images/Screenshot 2026-02-05 225739.png',
    'jpmorgan': 'images/Screenshot 2026-02-05 225527.png',
    'hindtech': 'images/Screenshot 2026-02-05 232207.png',
    'forage-career': 'images/Screenshot 2026-02-05 225613.png',
    'digicoders': 'images/certificate degecoders.jpeg',
    'bteup': 'images/Screenshot 2026-02-05 231810.png'
  };



  document.querySelectorAll('.cert-view-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var certKey = btn.getAttribute('data-cert');
      var imgUrl = certImages[certKey];
      if (imgUrl && certModal && certImage) {
        certImage.src = imgUrl;
        certImage.alt = btn.closest('.cert-card').querySelector('h3').textContent + ' Certificate';
        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(function (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-close, .modal-overlay').forEach(function (el) {
    el.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllModals();
  });

  // Button ripple effect
  document.querySelectorAll('.btn-ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  });

  // Cursor glow
  var cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    var glowActive = false;
    document.addEventListener('mousemove', function (e) {
      if (!glowActive) {
        cursorGlow.classList.add('active');
        glowActive = true;
      }
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('active');
      glowActive = false;
    });
  }

  // OS Module cursor-aware glow
  document.querySelectorAll('.os-module').forEach(function (module) {
    module.addEventListener('mousemove', function (e) {
      var rect = module.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      module.style.setProperty('--mouse-x', x + '%');
      module.style.setProperty('--mouse-y', y + '%');
    });
  });

  // Magnetic button effect
  document.querySelectorAll('.btn-magnetic, .btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      var distance = Math.sqrt(x * x + y * y);
      var maxDistance = 50;

      if (distance < maxDistance) {
        var strength = (maxDistance - distance) / maxDistance;
        var moveX = x * strength * 0.3;
        var moveY = y * strength * 0.3;
        btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      }
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

})();



