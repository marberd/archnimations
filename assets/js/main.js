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
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.body.classList.remove('menu-open'));
  });
}

// ─── SCROLL REVEAL ───────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.08 + 's';
  io.observe(el);
});

// ─── WORK GALLERY: category filter ───────────────────
const catBtns = document.querySelectorAll('.cat-btn');
const shots = document.querySelectorAll('.shot');
if (catBtns.length) {
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      shots.forEach(s => {
        s.classList.toggle('hide', cat !== 'all' && s.dataset.cat !== cat);
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
    [...shots].filter(s => !s.classList.contains('hide'));

  const show = (i) => {
    visible = collectVisible();
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

// ─── YEAR ────────────────────────────────────────────
document.querySelectorAll('.js-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
