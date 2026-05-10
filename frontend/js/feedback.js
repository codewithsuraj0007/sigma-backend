/* feedback.js - Feedback Section Logic */

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const starContainer = document.querySelector('.fdbk-stars');
    const stars = document.querySelectorAll('.fdbk-star');
    const ratingInput = document.getElementById('feedbackRating');
    const submitBtn = document.getElementById('feedbackSubmit');
    const loader = submitBtn.querySelector('.fdbk-loader');
    const btnText = submitBtn.querySelector('.fdbk-btn-text');
    const successMsg = document.getElementById('feedbackSuccess');

    // Star Rating Logic
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            highlightStars(val);
        });

        star.addEventListener('mouseleave', () => {
            const currentVal = parseInt(ratingInput.value || 0);
            highlightStars(currentVal);
        });

        star.addEventListener('click', () => {
            const val = parseInt(star.dataset.value);
            ratingInput.value = val;
            highlightStars(val);
        });
    });

    function highlightStars(val) {
        stars.forEach(s => {
            const sVal = parseInt(s.dataset.value);
            if (sVal <= val) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    // Form Submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic Validation
            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const rating = ratingInput.value;
            const message = document.getElementById('feedbackText').value.trim();

            if (!name || !rating || !message) {
                alert('Please fill in all required fields and provide a rating.');
                return;
            }

            // Set Loading State
            submitBtn.disabled = true;
            loader.style.display = 'inline-block';
            btnText.style.display = 'none';

            try {
                const response = await fetch(`${CONFIG.API_URL}/api/send-feedback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email: email || 'Not Provided',
                        rating: parseInt(rating),
                        message,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Check for warning from server
                    if (result.warning === 'EMAIL_PASS_MISSING') {
                        alert('⚠️ Warning: EMAIL_PASS is missing in your .env file. The feedback was logged to your terminal, but no email was sent.');
                    }

                    // Show Success
                    feedbackForm.style.display = 'none';
                    successMsg.style.display = 'block';

                    // Reset Form
                    feedbackForm.reset();
                    ratingInput.value = '';
                    highlightStars(0);
                } else {
                    throw new Error(result.error || `Server responded with ${response.status}`);
                }
            } catch (err) {
                console.error('Feedback submission error:', err);

                if (window.location.port === '5500') {
                    alert('Developer Tip: You are running on port 5500 (Live Server). For the feedback form to work locally, please run "node server.js" and visit http://localhost:3000');
                } else {
                    alert(`Submission Error: ${err.message}. Please check if your backend server is running.`);
                }
            } finally {
                // Reset Button State
                submitBtn.disabled = false;
                loader.style.display = 'none';
                btnText.style.display = 'inline-block';
            }
        });
    }

    // Scroll Animations
    const fdbkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elements = entry.target.querySelectorAll('.fdbk-left, .fdbk-right, .fdbk-animate-up');
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('fdbk-visible');
                    }, index * 100);
                });
                fdbkObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const fdbkSection = document.querySelector('.fdbk-section');
    if (fdbkSection) {
        fdbkObserver.observe(fdbkSection);
    }
});
