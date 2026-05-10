// signals.js
/* ==========================================
   SIGNALS.JS - Dynamic Thought Cards System
   ========================================== */

(function () {
  'use strict';

  // Static signals data (can be replaced with Firestore/API later)
  const SIGNALS = [
    {
      text: "Good architecture is invisible until it fails.",
      category: "Systems"
    },
    {
      text: "AI doesn't replace developers, it replaces bad decisions.",
      category: "AI"
    },
    {
      text: "Most bugs are communication problems disguised as code problems.",
      category: "Engineering"
    },
    {
      text: "Shipping teaches more than planning ever will.",
      category: "Product"
    },
    {
      text: "Cloud is about trade-offs, not services.",
      category: "Cloud"
    },
    {
      text: "The best code is the code you don't write.",
      category: "Design"
    },
    {
      text: "Performance is a feature, not an optimization.",
      category: "Performance"
    },
    {
      text: "Documentation is a love letter to your future self.",
      category: "Process"
    },
    {
      text: "Every abstraction has a cost. Choose wisely.",
      category: "Architecture"
    }
  ];

  // Initialize signals on page load
  function initSignals() {
    const container = document.getElementById('signalsGrid');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Render signals
    SIGNALS.forEach((signal, index) => {
      const card = createSignalCard(signal, index);
      container.appendChild(card);
    });

    // Re-observe for scroll animations
    if (window.observer) {
      container.querySelectorAll('.signal-card').forEach(el => {
        window.observer.observe(el);
      });
    }
  }

  // Create signal card element
  function createSignalCard(signal, index) {
    const card = document.createElement('article');
    card.className = 'signal-card animate-on-scroll';
    card.setAttribute('data-signal-id', index);

    card.innerHTML = `
      <p class="signal-text">${signal.text}</p>
      <div class="signal-meta">
        <svg class="signal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span class="signal-category">${signal.category}</span>
      </div>
    `;

    return card;
  }

  // Optional: Load signals from Firestore (future enhancement)
  async function loadSignalsFromFirestore() {
    // Placeholder for future Firestore integration
    // const db = firebase.firestore();
    // const snapshot = await db.collection('signals').orderBy('timestamp', 'desc').limit(9).get();
    // return snapshot.docs.map(doc => doc.data());
    return SIGNALS;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignals);
  } else {
    initSignals();
  }

  // Export for potential external use
  window.SignalsSystem = {
    init: initSignals,
    data: SIGNALS
  };
})();
