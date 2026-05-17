// ─── INTRO ENTRANCE ──────────────────────────────────
const intro = document.getElementById('intro');
if (intro && document.documentElement.classList.contains('intro-pending')) {
  sessionStorage.setItem('introSeen', '1');
  document.body.style.overflow = 'hidden';
  const introLogo = intro.querySelector('.intro__logo');
  const introGlow = intro.querySelector('.intro__glow');
  const navLogo = document.querySelector('#nav .brand img');

  // after the reveal + hold, fly the logo up into the nav's center slot
  setTimeout(() => {
    const from = introLogo.getBoundingClientRect();
    const to = navLogo.getBoundingClientRect();
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    const scale = to.width / from.width;

    // drop the keyframe animation, pin to its settled state, then transition
    introLogo.style.animation = 'none';
    introLogo.style.opacity = '1';
    introLogo.style.transform = 'none';
    void introLogo.offsetWidth;
    introLogo.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    introLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    if (introGlow) {
      introGlow.style.transition = 'opacity 0.6s ease';
      introGlow.style.opacity = '0';
    }
    intro.style.transition = 'background-color 0.8s ease 0.15s';
    intro.style.backgroundColor = 'transparent';
    intro.style.pointerEvents = 'none';

    // logo has landed — reveal the real nav logo and clean up
    setTimeout(() => {
      document.documentElement.classList.remove('intro-pending');
      document.body.style.overflow = '';
      intro.remove();
    }, 1050);
  }, 2900);
}

// ─── HERO WORD ROTATOR ───────────────────────────────
const rotator = document.querySelector('.rotator');
if (rotator) {
  const words = ['visualization', 'design', 'rendering', 'animation'];
  let ri = 0;
  setInterval(() => {
    rotator.classList.add('rotator--out');
    setTimeout(() => {
      ri = (ri + 1) % words.length;
      rotator.textContent = words[ri];
      rotator.classList.remove('rotator--out');
    }, 380);
  }, 2600);
}

// ─── NAV: scrolled state + mobile menu ───────────────
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');

const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (burger) {
  burger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(document.body.classList.contains('menu-open')));
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── SCROLL REVEAL ───────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.08 + 's';
  io.observe(el);
});
// Failsafe: never leave in-viewport content hidden if the observer
// hasn't fired (slow JS, headless capture, IO quirks).
const sweep = () => {
  revealEls.forEach(el => {
    if (el.classList.contains('in')) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('in');
    }
  });
};
window.addEventListener('load', () => setTimeout(sweep, 250));

// ─── COUNT-UP METRICS ───────────────────────────────
const countEls = document.querySelectorAll('.js-count');
const animateCount = (el) => {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1400;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  countEls.forEach(el => countObserver.observe(el));
}

// ─── WORK GALLERY: category filter ───────────────────
const catBtns = document.querySelectorAll('.cat-btn');
const shots = document.querySelectorAll('.shot');
const packageCards = document.querySelectorAll('.package-card');
if (catBtns.length) {
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      shots.forEach(s => {
        s.classList.toggle('hide', cat !== 'all' && s.dataset.cat !== cat);
      });
      packageCards.forEach(card => {
        card.classList.toggle('hide', cat !== 'all' && card.dataset.cat !== cat);
      });
    });
  });
}

// ─── ORBIT SERVICES (constellation tabs) ─────────────
const orbit = document.querySelector('.orbit-services');
if (orbit) {
  const nodes = [...orbit.querySelectorAll('.orbit-node')];
  const panels = [...orbit.querySelectorAll('.orbit-panel')];
  let idx = Math.max(0, nodes.findIndex(n => n.classList.contains('is-active')));
  let timer = null;
  let paused = false;
  const INTERVAL = 4200;

  const activate = (i) => {
    idx = (i + nodes.length) % nodes.length;
    nodes.forEach((n, ni) => {
      const on = ni === idx;
      n.classList.toggle('is-active', on);
      const btn = n.querySelector('button');
      if (btn) btn.setAttribute('aria-selected', String(on));
    });
    panels.forEach((p, pi) => p.classList.toggle('is-active', pi === idx));
  };

  const tick = () => { if (!paused) activate(idx + 1); };
  const start = () => { if (timer) return; timer = setInterval(tick, INTERVAL); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  nodes.forEach((n, i) => {
    const btn = n.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => { activate(i); stop(); start(); });
  });

  orbit.addEventListener('mouseenter', () => { paused = true; });
  orbit.addEventListener('mouseleave', () => { paused = false; });
  orbit.addEventListener('focusin', () => { paused = true; });
  orbit.addEventListener('focusout', () => { paused = false; });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0.25 });
  io.observe(orbit);
}

// ─── PACKAGE ACCORDION + VIEWER ──────────────────────
const packageDetails = document.querySelectorAll('details.package-card');
if (packageDetails.length) {
  // Single-open accordion: opening one closes the rest.
  packageDetails.forEach(d => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      packageDetails.forEach(o => { if (o !== d) o.open = false; });
      d.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Transform each gallery into a big main image + tiny thumbnail strip.
  packageDetails.forEach(detail => {
    const gallery = detail.querySelector('.gallery.package-gallery');
    if (!gallery) return;
    const sourceShots = [...gallery.querySelectorAll('.shot')];
    if (!sourceShots.length) return;

    const viewer = document.createElement('div');
    viewer.className = 'package-viewer';

    const main = document.createElement('div');
    main.className = 'package-viewer__main';
    const mainImg = document.createElement('img');
    mainImg.decoding = 'async';
    const firstImg = sourceShots[0].querySelector('img');
    mainImg.src = firstImg.src;
    mainImg.alt = firstImg.alt;
    main.appendChild(mainImg);

    const thumbs = document.createElement('div');
    thumbs.className = 'package-viewer__thumbs';
    thumbs.setAttribute('role', 'tablist');

    sourceShots.forEach((shot, i) => {
      const src = shot.querySelector('img');
      const label = shot.querySelector('.shot__name')?.textContent?.trim() || `Image ${i + 1}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'package-thumb' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      const tImg = document.createElement('img');
      tImg.src = src.src;
      tImg.alt = '';
      tImg.decoding = 'async';
      tImg.loading = 'lazy';
      btn.appendChild(tImg);
      thumbs.appendChild(btn);

      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-active')) return;
        mainImg.src = src.src;
        mainImg.alt = src.alt;
        thumbs.querySelectorAll('.package-thumb').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
      });
    });

    viewer.appendChild(main);
    viewer.appendChild(thumbs);
    gallery.replaceWith(viewer);
  });
}

// ─── CONTACT FORM ───────────────────────────────────
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector('[data-form-status]');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    if (status) {
      status.textContent = '';
      status.removeAttribute('data-state');
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        if (status) {
          status.textContent = 'Thanks. Your message is on its way and we will reply shortly.';
          status.setAttribute('data-state', 'success');
        }
      } else {
        const payload = await response.json().catch(() => ({}));
        const detail = Array.isArray(payload.errors)
          ? payload.errors.map(e => e.message).filter(Boolean).join(', ')
          : '';
        if (status) {
          status.textContent = detail || 'Something went wrong. Please try again or email info@archnimations.com.';
          status.setAttribute('data-state', 'error');
        }
      }
    } catch (err) {
      if (status) {
        status.textContent = 'Network error. Please try again or email info@archnimations.com.';
        status.setAttribute('data-state', 'error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

// ─── YEAR ────────────────────────────────────────────
document.querySelectorAll('.js-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
