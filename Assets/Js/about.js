// T-tall Stores page enhancements (about.html)
// Single-file JS module: keep in sync with DOM classes in about.html.
(function () {
  'use strict';

  const STORAGE_KEY = 'ttall_about_store_ui_v2';

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch (_) {
      return fallback;
    }
  }

  function initStoreCards() {
    const cards = document.querySelectorAll('.card-about');
    if (!cards.length) return;

    const state = safeParse(localStorage.getItem(STORAGE_KEY), {});

    cards.forEach((card, idx) => {
      const btn = card.querySelector('button');
      const address = card.querySelector('.address-about');
      if (!btn || !address) return;

      // If address contains multiple lines/BRs, keep display toggling only.
      address.style.display = (typeof state[idx] === 'boolean') ? (state[idx] ? 'block' : 'none') : 'none';

      // Accessibility
      btn.setAttribute('type', 'button');
      btn.setAttribute('role', 'button');

      const expanded = address.style.display !== 'none';
      btn.setAttribute('aria-expanded', String(expanded));

      if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent.trim();

      const render = () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.textContent = isOpen ? 'Hide Store Info' : (btn.dataset.originalText || btn.textContent);
        address.style.display = isOpen ? 'block' : 'none';
        state[idx] = isOpen;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      };

      const toggle = (e) => {
        // Prevent anchor navigation for buttons that contain <a>
        if (e && e.preventDefault) e.preventDefault();

        const next = !(btn.getAttribute('aria-expanded') === 'true');
        btn.setAttribute('aria-expanded', String(next));
        render();
      };

      // Click
      btn.addEventListener('click', (e) => {
        // If button contains a link, stop navigation.
        const anchor = btn.querySelector('a');
        if (anchor) e.preventDefault();
        toggle(e);
      });

      // Keyboard
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(e);
        }
      });

      // Initial label sync
      render();
    });
  }

  function initScrollHighlight() {
    const cards = document.querySelectorAll('.card-about');
    if (!cards.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (!el) return;
          if (entry.isIntersecting) {
            el.style.outline = '2px solid rgba(255,255,255,0.25)';
            setTimeout(() => {
              // Keep outline if still intersecting; otherwise remove.
              if (!el.getBoundingClientRect) return;
              el.style.outline = 'none';
            }, 650);
          }
        });
      },
      { threshold: 0.25 }
    );

    cards.forEach((c) => obs.observe(c));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStoreCards();
    initScrollHighlight();
  });
})();

