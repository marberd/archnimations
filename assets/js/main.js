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

// ─── LIGHTBOX ────────────────────────────────────────
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  let visible = [];
  let idx = 0;

  const collectVisible = () =>
    [...shots].filter(s => !s.classList.contains('hide') && s.getClientRects().length);

  const show = (i) => {
    visible = collectVisible();
    if (!visible.length) return;
    idx = (i + visible.length) % visible.length;
    const src = visible[idx].querySelector('img').src;
    lbImg.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const hide = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  shots.forEach(s => {
    s.addEventListener('click', () => {
      const vis = collectVisible();
      show(vis.indexOf(s));
    });
  });
  lb.querySelector('.lb-close').addEventListener('click', hide);
  lb.querySelector('.lb-nav.prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-nav.next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
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
