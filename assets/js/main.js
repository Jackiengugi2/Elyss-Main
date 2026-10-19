/* =========================================================
   ELYSS SCHOOL — LANDING PAGE BEHAVIOUR
   No dependencies. Everything degrades gracefully without JS.
   ========================================================= */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '254711650405';           // 0711 650 405 in international format
  var ANNOUNCE_KEY = 'elyss.announce.dismissed';  // per-browser, resets if storage is blocked

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Announcement bar ---------- */
  var announce = document.getElementById('announce');
  if (announce) {
    var dismissed = false;
    try { dismissed = localStorage.getItem(ANNOUNCE_KEY) === '1'; } catch (e) { /* storage blocked */ }
    if (!dismissed) announce.hidden = false;

    var closeBtn = announce.querySelector('.announce__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        announce.hidden = true;
        try { localStorage.setItem(ANNOUNCE_KEY, '1'); } catch (e) { /* ignore */ }
      });
    }
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqButtons = document.querySelectorAll('.faq__q');
  Array.prototype.forEach.call(faqButtons, function (btn) {
    var panel = btn.parentElement.nextElementSibling;
    if (!panel) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close the others so the list stays scannable.
      Array.prototype.forEach.call(faqButtons, function (other) {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        var otherPanel = other.parentElement.nextElementSibling;
        if (otherPanel) otherPanel.hidden = true;
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ---------- Scroll reveal ---------- */
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    var targets = document.querySelectorAll('.qa__item, .card, .step, .section__head, .ticks li');
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    var show = function (el) {
      el.classList.add('is-in');
      io.unobserve(el);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    /* Safety net: hidden content is worse than a missed animation. If the
       observer never reports an element the reader has already scrolled to,
       reveal it on scroll anyway. */
    var ticking = false;
    var sweep = function () {
      ticking = false;
      var limit = window.innerHeight * 0.95;
      var pending = document.querySelectorAll('.reveal:not(.is-in)');
      if (!pending.length) {
        window.removeEventListener('scroll', onMove);
        window.removeEventListener('resize', onMove);
        return;
      }
      Array.prototype.forEach.call(pending, function (el) {
        if (el.getBoundingClientRect().top < limit) show(el);
      });
    };
    var onMove = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove);
    window.addEventListener('load', onMove);
    onMove();

    /* Printing must never produce blank sections. */
    if (window.matchMedia) {
      var printQuery = window.matchMedia('print');
      var revealAll = function () {
        Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
          el.classList.add('is-in');
        });
      };
      window.addEventListener('beforeprint', revealAll);
      if (printQuery.addEventListener) {
        printQuery.addEventListener('change', function (e) { if (e.matches) revealAll(); });
      }
    }
  }

  /* ---------- Inquiry form ---------- */
  var form = document.getElementById('inquiryForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  var setStatus = function (msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form__status' + (kind ? ' is-' + kind : '');
  };

  var setStatusLink = function (msg, linkText, href, kind) {
    if (!status) return;
    setStatus(msg, kind);
    var link = document.createElement('a');
    link.href = href; link.target = '_blank'; link.rel = 'noopener';
    link.textContent = linkText;
    status.appendChild(link);
  };

  var clearError = function (field) {
    field.removeAttribute('aria-invalid');
    var existing = field.parentElement.querySelector('.err');
    if (existing) existing.remove();
  };

  var showError = function (field, msg) {
    clearError(field);
    field.setAttribute('aria-invalid', 'true');
    var span = document.createElement('span');
    span.className = 'err';
    span.textContent = msg;
    field.parentElement.appendChild(span);
  };

  // Kenyan mobile numbers: 07XX/01XX, +2547XX/+2541XX, or 2547XX/2541XX.
  var isValidPhone = function (value) {
    var digits = value.replace(/[\s()\-.]/g, '');
    return /^(?:\+?254|0)[17]\d{8}$/.test(digits);
  };

  var validate = function () {
    var ok = true;
    var required = [
      { el: form.parentName, msg: 'Please add your name.' },
      { el: form.phone,      msg: 'We need a number to reply on.' },
      { el: form.childClass, msg: "Please add your child's age or class." }
    ];

    required.forEach(function (item) {
      if (!item.el) return;
      clearError(item.el);
      if (!item.el.value.trim()) {
        showError(item.el, item.msg);
        ok = false;
      }
    });

    if (ok && !isValidPhone(form.phone.value)) {
      showError(form.phone, 'Please check the number, e.g. 0711 650 405.');
      ok = false;
    }

    return ok;
  };

  var collect = function () {
    return {
      parentName: form.parentName.value.trim(),
      phone:      form.phone.value.trim(),
      childClass: form.childClass.value.trim(),
      campus:     form.campus.value
    };
  };

  var buildWhatsAppText = function (d) {
    return [
      'Hello Elyss School, I would like to book a visit.',
      '',
      'Name: ' + d.parentName,
      'Phone: ' + d.phone,
      "Child's age / class: " + d.childClass,
      'Campus: ' + d.campus
    ].join('\n');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: silently accept and discard bot submissions.
    if (form.website && form.website.value) {
      setStatus('Thank you — we have your details.', 'ok');
      form.reset();
      return;
    }

    if (!validate()) {
      setStatus('Please check the boxes marked above.', 'err');
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    var data = collect();
    var endpoint = form.getAttribute('data-endpoint');
    var submitBtn = form.querySelector('button[type="submit"]');

    var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildWhatsAppText(data));

    // Hosted on Netlify → store the enquiry in Netlify Forms, then offer WhatsApp.
    if (!endpoint && form.hasAttribute('data-netlify')) {
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      setStatus('Sending…');
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          form.reset();
          setStatusLink('Thank you — we will call or WhatsApp you within one working day. ', 'Chat with us on WhatsApp now', whatsappUrl, 'ok');
        })
        .catch(function () {
          // Opening a window after an async call is popup-blocked, so offer a link instead.
          setStatusLink('That did not go through. ', 'Send your details on WhatsApp instead', whatsappUrl, 'err');
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send my details'; }
        });
      return;
    }

    // No endpoint configured → hand the inquiry to WhatsApp, pre-filled.
    if (!endpoint) {
      window.open(whatsappUrl, '_blank', 'noopener');
      setStatus('Opening WhatsApp with your details — just press send.', 'ok');
      return;
    }

    // Endpoint configured → post the inquiry directly.
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    setStatus('Sending…');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        form.reset();
        setStatus('Thank you — we will call or WhatsApp you within one working day.', 'ok');
      })
      .catch(function () {
        setStatus('That did not go through. Please call or WhatsApp 0711 650 405 and we will help you.', 'err');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send my details'; }
      });
  });
})();
