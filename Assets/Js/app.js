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
    btn.style.right = '16px';
    btn.style.bottom = '16px';
    btn.style.zIndex = '99998';
    btn.style.padding = '10px 12px';
    btn.style.borderRadius = '999px';
    btn.style.border = '1px solid rgba(255,255,255,0.2)';
    btn.style.background = 'rgba(0,0,0,0.7)';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.display = 'none';
    btn.style.fontSize = '14px';
    btn.innerHTML = '↑ Top';

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

  document.addEventListener('DOMContentLoaded', () => {
    initScrollToTop();
    initReveal();

    // About page store UI
    initStoreCards();
    initScrollHighlight();

    // Enquiry page form UI
    initEnquiryForm();
  });

})();

