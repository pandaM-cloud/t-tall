(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  // -------------------- Toasts --------------------
  function toast(message, { timeout = 3200 } = {}) {
    const host = document.createElement('div');
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    host.style.position = 'fixed';
    host.style.left = '50%';
    host.style.bottom = '28px';
    host.style.transform = 'translateX(-50%)';
    host.style.zIndex = '99999';
    host.style.background = 'rgba(20,20,20,0.95)';
    host.style.color = '#fff';
    host.style.border = '1px solid rgba(255,255,255,0.18)';
    host.style.padding = '12px 16px';
    host.style.borderRadius = '12px';
    host.style.maxWidth = '92vw';
    host.style.fontFamily = 'inherit';
    host.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
    host.textContent = message;
    document.body.appendChild(host);

    window.setTimeout(() => {
      host.style.transition = 'opacity 200ms ease';
      host.style.opacity = '0';
      window.setTimeout(() => host.remove(), 220);
    }, timeout);
  }

  // -------------------- Scroll to top --------------------
  function initScrollToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.position = 'fixed';
    btn.style.right = '0px';
    btn.style.bottom = '16px';
    btn.style.zIndex = '98';
    btn.style.padding = '0px 3px';
    btn.style.borderRadius = '9px';
    btn.style.border = '1px solid rgba(255,255,255,0.2)';
    btn.style.background = 'rgba(255, 255, 255, 0.33)';
    btn.style.color = '#fcfcfc';
    btn.style.cursor = 'pointer';
    btn.style.display = 'none';
    btn.style.fontSize = '14px';
    btn.innerHTML = 'Scroll to Top';

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    document.body.appendChild(btn);

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      btn.style.display = y > 600 ? 'block' : 'none';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -------------------- Reveal on scroll --------------------
  function initReveal() {
    const candidates = $all('main > section, section, .containerP, .glass-section, .glass-section2, .team, .reviews-container, .services-whole, .contact-whole, .enquiry-whole');
    if (!candidates.length) return;

    candidates.forEach((el) => {
      // Avoid double-initialization
      if (el.dataset.revealInit) return;
      el.dataset.revealInit = '1';

      el.style.willChange = 'transform, opacity';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = prefersReducedMotion ? 'none' : 'opacity 600ms ease, transform 600ms ease';
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      candidates.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'none';
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    candidates.forEach((el) => obs.observe(el));
  }

  // -------------------- About page (stores) UX --------------------
  function initStoreCards() {
    const cards = $all('.card-about');
    if (!cards.length) return;

    const STORAGE_KEY = 'ttall_about_store_ui_v2';

    const safeParse = (json, fallback) => {
      try {
        return JSON.parse(json);
      } catch (_) {
        return fallback;
      }
    };

    const state = safeParse(localStorage.getItem(STORAGE_KEY), {});

    cards.forEach((card, idx) => {
      const btn = card.querySelector('button');
      const address = card.querySelector('.address-about');
      if (!btn || !address) return;

      address.style.display = (typeof state[idx] === 'boolean') ? (state[idx] ? 'block' : 'none') : 'none';

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
        if (e && e.preventDefault) e.preventDefault();
        const next = !(btn.getAttribute('aria-expanded') === 'true');
        btn.setAttribute('aria-expanded', String(next));
        render();
      };

      btn.addEventListener('click', (e) => {
        const anchor = btn.querySelector('a');
        if (anchor && e && e.preventDefault) e.preventDefault();
        toggle(e);
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(e);
        }
      });

      render();
    });
  }

  function initScrollHighlight() {
    const cards = $all('.card-about');
    if (!cards.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (!el) return;
          if (entry.isIntersecting) {
            el.style.outline = '2px solid rgba(255,255,255,0.25)';
            setTimeout(() => {
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

  // -------------------- Enquiry form UX --------------------
  function initEnquiryForm() {
    const form = document.querySelector('form.form-equiry');
    if (!form) return;

    const nameEl = $('#fullName', form);
    const emailEl = $('#email', form);
    const phoneEl = $('#phone', form);
    const serviceEl = $('#service', form);
    const messageEl = $('#message', form);
    const submitBtn = form.querySelector('button[type="submit"], .form-submit-btn-equiry');

    if (!submitBtn) return;

    // Create an error container per field (once)
    const fieldMap = [
      { el: nameEl, label: 'Full name' },
      { el: emailEl, label: 'Email' },
      { el: phoneEl, label: 'Phone number' },
      { el: serviceEl, label: 'Service' },
      { el: messageEl, label: 'Message' },
    ].filter((x) => x.el);

    const ensureErrorEl = (fieldEl) => {
      const existing = fieldEl.parentElement && fieldEl.parentElement.querySelector('.field-error');
      if (existing) return existing;
      const e = document.createElement('div');
      e.className = 'field-error';
      e.style.color = '#ffb4b4';
      e.style.fontSize = '12px';
      e.style.marginTop = '6px';
      e.style.display = 'none';
      if (fieldEl.parentElement) fieldEl.parentElement.appendChild(e);
      return e;
    };

    const validateOne = (fieldEl, label) => {
      const errorEl = ensureErrorEl(fieldEl);

      // Use native validity when possible
      const isValid = fieldEl.checkValidity ? fieldEl.checkValidity() : true;
      if (isValid) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        fieldEl.style.borderColor = '';
        return true;
      }

      // Provide nicer messages for common cases
      let msg = `Please enter a valid ${label}.`;
      const v = fieldEl.validity;

      if (v) {
        if (v.valueMissing) msg = `${label} is required.`;
        else if (v.tooShort) msg = `${label} is too short.`;
        else if (fieldEl.type === 'email' && v.typeMismatch) msg = `Enter a valid email address.`;
      }

      errorEl.textContent = msg;
      errorEl.style.display = 'block';
      fieldEl.style.borderColor = 'rgba(255,180,180,0.9)';
      return false;
    };

    const validateAll = () => {
      let ok = true;
      for (const f of fieldMap) ok = validateOne(f.el, f.label) && ok;
      submitBtn.disabled = !ok;
      submitBtn.style.opacity = ok ? '1' : '0.6';
      submitBtn.style.cursor = ok ? 'pointer' : 'not-allowed';
      return ok;
    };

    // Restore previous values (optional)
    const KEY = 'ttall_enquiry_form_v1';
    const saved = (() => {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    if (saved && typeof saved === 'object') {
      if (saved.fullName && nameEl) nameEl.value = saved.fullName;
      if (saved.email && emailEl) emailEl.value = saved.email;
      if (saved.phone && phoneEl) phoneEl.value = saved.phone;
      if (saved.service && serviceEl) serviceEl.value = saved.service;
      if (saved.message && messageEl) messageEl.value = saved.message;
    }

    // Initial validation state
    validateAll();

    // Live validation
    fieldMap.forEach(({ el, label }) => {
      el.addEventListener('input', () => {
        validateOne(el, label);
        validateAll();
      });
      el.addEventListener('blur', () => validateAll());
    });

    // Save values as user types
    const saveTimer = { t: null };
    const saveNow = () => {
      const payload = {
        fullName: nameEl ? nameEl.value : '',
        email: emailEl ? emailEl.value : '',
        phone: phoneEl ? phoneEl.value : '',
        service: serviceEl ? serviceEl.value : '',
        message: messageEl ? messageEl.value : '',
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(payload));
      } catch (_) {
        // ignore
      }
    };

    form.addEventListener('input', () => {
      window.clearTimeout(saveTimer.t);
      saveTimer.t = window.setTimeout(saveNow, 350);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAll()) {
        toast('Please fix the highlighted fields and try again.');
        return;
      }

      // No backend action in this project, so simulate success
      toast('Enquiry submitted successfully! We’ll get back to you soon.');
      try {
        localStorage.removeItem(KEY);
      } catch (_) {
        // ignore
      }
      form.reset();
      validateAll();
    });
  }

  // -------------------- Global text animations --------------------
  function isMeaningfulText(node) {
    if (!node) return false;
    const txt = (node.textContent || '').replace(/\s+/g, ' ').trim();
    if (!txt) return false;
    // skip if it is basically only punctuation
    if (/^[\W_]+$/u.test(txt)) return false;
    return true;
  }

  function splitTextIntoLetters(el) {
    if (!el || !isMeaningfulText(el)) return;
    if (el.dataset.ttallLetterSplit === '1') return;

    // Skip if already contains our wrapped spans
    if (el.querySelector('.ttall-letter')) return;

    const raw = el.textContent || '';
    // Keep spaces as normal text nodes -> convert to non-breaking spaces for layout stability
    const chars = Array.from(raw);

    const frag = document.createDocumentFragment();
    chars.forEach((ch) => {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode('\u00A0'));
        return;
      }
      const span = document.createElement('span');
      span.className = 'ttall-letter';
      span.textContent = ch;
      frag.appendChild(span);
    });

    // Wrap container class and replace text
    el.classList.add('ttall-text-reveal');
    el.textContent = '';
    el.appendChild(frag);

    el.dataset.ttallLetterSplit = '1';
  }

  function initGlobalTextReveal() {
    const reduced = prefersReducedMotion;

    const candidates = [
      'h1', 'h2', 'h3', 'p',
      '.price-price',
      '.f1-about',
      '.last-rev',
      '.end-message-service',
      '.services-preview-title',
      '.services-preview-subtitle',
      '.banner',
      '.black-end',
      '.quote',
    ];

    const nodes = [];
    candidates.forEach((sel) => {
      $all(sel).forEach((n) => nodes.push(n));
    });

    // De-dup
    const seen = new Set();
    const uniq = nodes.filter((n) => {
      if (!n || seen.has(n)) return false;
      seen.add(n);
      return true;
    });

    if (!uniq.length) return;

    uniq.forEach((el) => {
      splitTextIntoLetters(el);
    });

    const revealEls = $all('.ttall-text-reveal');
    if (!revealEls.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => {
        el.classList.add('is-revealed');
        const letters = $all('.ttall-letter', el);
        letters.forEach((letter, idx) => {
          letter.style.animationDelay = `${Math.min(idx * 12, 800)}ms`;
        });
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('is-revealed');

          const letters = $all('.ttall-letter', el);
          letters.forEach((letter, idx) => {
            // Stagger reveal with a capped delay for performance
            letter.style.animationDelay = `${Math.min(idx * 12, 800)}ms`;
          });

          obs.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollToTop();
    initReveal();

    // About page store UI
    initStoreCards();
    initScrollHighlight();

    // Enquiry page form UI
    initEnquiryForm();

    // Global text animations across pages
    initGlobalTextReveal();
  });

})();


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


// MAP
(function () {
    // Lebowakgomo coordinates from existing Google Maps URL in this file
    const stores = [
      {
        id: 'lebowakgomo',
        name: 'Lebowakgomo',
        lat: -24.3145867,
        lng: 29.4792675,
        address: '24 BA, Dihlabakela st, Lebowakgomo, 0737, South Africa',
        googleMapsUrl:
          "https://www.google.com/maps/place/Deni+Dee%E2%80%99s+Shisanyama/" +
          "@-24.3145867,29.3268322,26997m/data=!3m1!1e3!4m10!1m2!2m1!1s24+BA,+Dihlabakela+st,+Lebowakgomo,+0737,South+Africa!3m6!1s0x1ec127d8a9357dd7:0x4a94b0fe6dede002!8m2!3d-24.3145867!4d29.4792675!15sCjUyNCBCQSwgRGlobGFiYWtlbGEgc3QsIExlYm93YWtnb21vLCAwNzM3LFNvdXRoIEFmcmljYVo0IjIyNCBiYSBkaWhsYWJha2VsYSBzdCBsZWJvd2FrZ29tbyAwNzM3IHNvdXRoIGFmcmljYZIBCnJlc3RhdXJhbnSaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUktMVzlRUldWUklkVBReABAPoBBAgAEDU!16s%2Fg%2F11rcdkyr99?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
      }
    ];

    function init() {
      const mapEl = document.getElementById('store-map');
      if (!mapEl || !window.L) return;

      // South Africa / Limpopo region
      const map = L.map('store-map', { scrollWheelZoom: true }).setView(
        [-24.3145867, 29.4792675],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const bounds = [];

      stores.forEach((s) => {
        const marker = L.marker([s.lat, s.lng]).addTo(map);

        const popupHtml = `
          <div style="font-family: Poppins, sans-serif;">
            <h3 style="margin:0 0 6px; font-size:16px; color:#000;">${s.name}</h3>
            <div style="font-size:13px; color:#333; line-height:1.3;">${s.address}</div>
            <div style="margin-top:10px;">
              <a target="_blank" rel="noopener" href="${s.googleMapsUrl}" style="color:#0b57d0; font-weight:600;">Open in Google Maps</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        bounds.push([s.lat, s.lng]);

        // Optional: clicking the existing card (by title text) pans to marker
        const card = Array.from(document.querySelectorAll('.card-about'))
          .find((c) => (c.querySelector('h2')?.textContent || '').trim() === s.name);
        if (card) {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => {
            map.setView([s.lat, s.lng], 14, { animate: true });
            marker.openPopup();
          });
        }
      });

      if (bounds.length) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();