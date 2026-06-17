/* ============================================================
   main.js — Mohamad Meerasa P Portfolio
   Enhanced with GSAP + ScrollTrigger for Framer Motion-like feel
   ============================================================ */

/* ── DYNAMIC EXPERIENCE CALCULATION ───────────────────────── */
function calcExperience() {
  const start = new Date(2022, 8);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  let label = '';
  if (years > 0) label += `${years} Year${years > 1 ? 's' : ''}`;
  if (months > 0) label += (label ? ' & ' : '') + `${months} Month${months > 1 ? 's' : ''}`;
  return {
    label: label || '3+ Years',
    years, months, totalMonths,
    statLabel: months >= 6 ? `${years}.5` : `${years}`,
    statSuffix: '+'
  };
}

function applyExperience() {
  const exp = calcExperience();
  const codeExpEl = document.getElementById('codeExp');
  if (codeExpEl) codeExpEl.textContent = `${exp.statLabel}+ years`;
  const expTextEl = document.getElementById('expText');
  if (expTextEl) expTextEl.textContent = exp.label;
  const expYearsEl = document.getElementById('expYearsNum');
  if (expYearsEl) { expYearsEl.dataset.target = exp.years; expYearsEl.dataset.suffix = exp.statSuffix; }
}

/* ── CURSOR ──────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0, overwrite: true });
    gsap.to(ring, { x: mx, y: my, duration: 0.18, ease: 'power2.out', overwrite: true });
  });

  // Override cursor CSS to use transform instead of left/top
  cursor.style.left = '0'; cursor.style.top = '0';
  cursor.style.transform = 'none';
  ring.style.left = '0'; ring.style.top = '0';
  ring.style.transform = 'none';
  gsap.set([cursor, ring], { xPercent: -50, yPercent: -50 });

  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { width: 18, height: 18, duration: 0.2, ease: 'back.out(2)' });
      gsap.to(ring, { width: 52, height: 52, opacity: 0.7, duration: 0.3, ease: 'back.out(1.5)' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { width: 12, height: 12, duration: 0.2, ease: 'back.out(2)' });
      gsap.to(ring, { width: 36, height: 36, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
    });
  });
}

/* ── NAVBAR ──────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initSmoothScroll() {
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('navBurger');

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 70 },
          ease: 'power3.inOut'
        });
        navLinks.classList.remove('open');
        burger.classList.remove('active');
      }
    });
  });
}

/* ── HERO ENTRANCE — GSAP TIMELINE ──────────────────────── */
function initHeroAnimation() {
  const isMobile = window.innerWidth <= 900;

  // All elements GSAP animates on every screen size
  const allEls = [
    '.hero-eyebrow', '.hero-name', '.hero-title',
    '.hero-desc', '.hero-socials', '.hero-actions', '.hero-scroll',
  ];
  allEls.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.style.animation = 'none'; el.style.opacity = '0'; }
  });

  // Desktop-only (code card + badges hidden on mobile via CSS)
  if (!isMobile) {
    ['.hero-visual'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) { el.style.animation = 'none'; el.style.opacity = '0'; }
    });
  }

  const tl = gsap.timeline({ delay: 0.2 });

  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 20, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }
  )
  .fromTo('.hero-name',
    { opacity: 0, y: 40, skewY: 2 },
    { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'expo.out' }, '-=0.3'
  )
  .fromTo('.hero-title',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5'
  )
  .fromTo('.hero-desc',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
  )
  // Socials animate on ALL screens
  .fromTo('.hero-socials',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3'
  )
  .fromTo('.hero-actions',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3'
  )
  .fromTo('.hero-scroll',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power1.out' }, '-=0.2'
  );

  // Code card + badges: desktop only
  if (!isMobile) {
    tl.fromTo('.hero-visual',
      { opacity: 0, x: 60, filter: 'blur(12px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out' }, '-=0.8'
    );
    tl.fromTo('.tech-badge',
      { opacity: 0, scale: 0.7, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.1 }, '-=0.5'
    );
  }
}

/* ── SCROLL-TRIGGERED REVEALS (GSAP ScrollTrigger) ─────── */
function initScrollReveal() {
  // Generic reveal
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, filter: 'blur(4px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.85,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Section titles — slide up with stagger
  gsap.utils.toArray('.section-title, .section-eyebrow').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 36, skewY: 1 },
      {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });

  // Stat items — spring stagger
  gsap.fromTo('.stat-item',
    { opacity: 0, y: 40, scale: 0.9 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      ease: 'back.out(1.7)',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.stats-bar',
        start: 'top 85%',
        onEnter: () => initStats()
      }
    }
  );

  // Skill cards — cascade
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 60, rotateX: 8 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.9, ease: 'expo.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%' },
        onStart: () => animateSkillBars(card)
      }
    );
  });

  // Experience items — slide from left
  gsap.utils.toArray('.exp-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 0.8, ease: 'expo.out',
        delay: i * 0.15,
        scrollTrigger: { trigger: item, start: 'top 88%' }
      }
    );
  });

  // Education cards
  gsap.utils.toArray('.edu-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, ease: 'back.out(1.4)',
        delay: i * 0.15,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      }
    );
  });

  // Project cards — staggered grid
  animateProjectCards('#tab-dynamic .project-card');
}

function animateProjectCards(selector) {
  gsap.utils.toArray(selector).forEach((card, i) => {
    // Remove inline transition-delay since GSAP handles it
    card.style.transitionDelay = '0s';
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.93 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7, ease: 'back.out(1.3)',
        delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });
}

/* ── SKILL BARS ──────────────────────────────────────────── */
function animateSkillBars(card) {
  card.querySelectorAll('.skill-fill').forEach((bar, i) => {
    gsap.to(bar, {
      width: bar.dataset.width + '%',
      duration: 1.2,
      delay: i * 0.1,
      ease: 'expo.out'
    });
  });
}

/* ── STATS COUNTER ───────────────────────────────────────── */
function initStats() {
  const exp = calcExperience();
  const statDefs = [[exp.years, '+'], [20, '+'], [10, '+'], [5, '+']];

  document.querySelectorAll('.stat-num').forEach((el, i) => {
    const [val, sfx] = statDefs[i] ?? [0, ''];
    gsap.fromTo({ val: 0 }, { val },
      {
        duration: 1.5,
        ease: 'power2.out',
        delay: i * 0.1,
        onUpdate: function() {
          el.innerHTML = Math.floor(this.targets()[0].val) + `<span>${sfx}</span>`;
        },
        onComplete: function() {
          el.innerHTML = val + `<span>${sfx}</span>`;
        }
      }
    );
  });
}

/* ── PARALLAX EFFECTS ────────────────────────────────────── */
function initParallax() {
  // Hero grid subtle parallax
  gsap.to('.hero-grid', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  // Hero code card slow drift
  gsap.to('.hero-code-card', {
    y: -40,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });

  // About photo parallax
  gsap.to('.about-photo-frame img', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });

  // Glow ring pulse with scroll
  gsap.to('.hero-glow-ring', {
    scale: 1.4,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '50% top', scrub: true }
  });
}

/* ── IMAGE HOVER TILT ────────────────────────────────────── */
function initImageTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    const img = card.querySelector('.project-img');
    if (!img) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      gsap.to(card, {
        rotateY: dx * 6,
        rotateX: -dy * 4,
        transformPerspective: 700,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0,
        duration: 0.6, ease: 'elastic.out(1, 0.6)'
      });
    });
  });

  // About photo tilt
  const photoWrap = document.querySelector('.about-photo-wrap');
  if (photoWrap) {
    photoWrap.addEventListener('mousemove', e => {
      const rect = photoWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(photoWrap, {
        rotateY: dx * 8, rotateX: -dy * 5,
        transformPerspective: 600,
        duration: 0.4, ease: 'power2.out'
      });
    });
    photoWrap.addEventListener('mouseleave', () => {
      gsap.to(photoWrap, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  }
}

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary-hero, .btn-outline-hero, .btn-send, .nav-cta');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, {
        x: dx * 0.25, y: dy * 0.25,
        duration: 0.35, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ── SCROLL PROGRESS BAR ─────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #6c63ff, #a78bfa);
    z-index: 9999; pointer-events: none;
    box-shadow: 0 0 10px rgba(108,99,255,0.5);
    transition: none;
  `;
  document.body.appendChild(bar);

  gsap.to(bar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
  });
}

/* ── SECTION TRANSITIONS — FADE + SLIDE ─────────────────── */
function initSectionTransitions() {
  // About section — text lines split-style
  gsap.utils.toArray('.about-text p').forEach((p, i) => {
    gsap.fromTo(p,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.7, ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: p, start: 'top 90%' }
      }
    );
  });

  // Info grid items
  gsap.utils.toArray('.info-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 24, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: 'back.out(1.5)',
        delay: i * 0.08,
        scrollTrigger: { trigger: '.info-grid', start: 'top 88%' }
      }
    );
  });

  // Contact details
  gsap.utils.toArray('.contact-detail').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0,
        duration: 0.6, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: item, start: 'top 90%' }
      }
    );
  });
}

/* ── PORTFOLIO TABS ──────────────────────────────────────── */
function initPortfolioTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.portfolio-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(c => {
        if (c.classList.contains('active')) {
          gsap.to(c, { opacity: 0, y: -12, duration: 0.2, ease: 'power2.in', onComplete: () => {
            c.classList.remove('active');
          }});
        }
      });

      setTimeout(() => {
        const panel = document.getElementById('tab-' + target);
        panel.classList.add('active');
        gsap.fromTo(panel, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });

        // Stagger cards in
        const cards = panel.querySelectorAll('.project-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.3)', stagger: 0.07 }
        );

        // Refresh ScrollTrigger for new cards
        ScrollTrigger.refresh();
      }, 220);
    });
  });
}

/* ── FLOATING BADGE PARALLAX ON MOUSE ───────────────────── */
function initBadgeParallax() {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    gsap.to('.tb1', { x: dx * 12, y: dy * 8, duration: 0.8, ease: 'power1.out', overwrite: 'auto' });
    gsap.to('.tb2', { x: dx * -10, y: dy * 12, duration: 0.9, ease: 'power1.out', overwrite: 'auto' });
    gsap.to('.tb3', { x: dx * 8, y: dy * -10, duration: 0.7, ease: 'power1.out', overwrite: 'auto' });
    gsap.to('.tb4', { x: dx * -14, y: dy * 6, duration: 1, ease: 'power1.out', overwrite: 'auto' });
  });
}

/* ── FOOTER ANIMATION ────────────────────────────────────── */
function initFooter() {
  gsap.fromTo('footer > *',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: 'footer', start: 'top 95%' }
    }
  );
}

/* ── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyExperience();

  // Wait for GSAP + plugins to be available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — falling back to CSS animations');
    // Fallback: re-enable original CSS animations
    document.querySelectorAll('[style*="animation: none"]').forEach(el => {
      el.style.animation = '';
    });
    initNavbar();
    initSmoothScroll();
    initPortfolioTabs();
    return;
  }

  // Register ScrollTrigger + ScrollTo plugins
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  const isMobile = window.innerWidth <= 900;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  initCursor();
  initNavbar();
  initSmoothScroll();
  initHeroAnimation();
  initHeroParticles();
  initScrollReveal();
  initSectionTransitions();
  initScrollProgress();
  initPortfolioTabs();
  initFooter();

  // Desktop / pointer-device only features
  if (!isMobile && !isTouch) {
    initParallax();
    initImageTilt();
    initMagneticButtons();
    initBadgeParallax();
  }

  // Refresh ScrollTrigger after everything is set
  setTimeout(() => ScrollTrigger && ScrollTrigger.refresh(), 500);
});

/* ── HERO PARTICLE CONSTELLATION ────────────────────────── */
function initHeroParticles() {
  const hero = document.getElementById('hero');
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;width:100%;height:100%;';
  hero.prepend(cv);
  const cx = cv.getContext('2d');
  let W, H;

  const mouse = { x: -999, y: -999 };
  hero.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  function resize() { W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  /* large glowing aurora orbs */
  const orbs = [
    { x:.75, y:.30, r:.38, col:'108,40,255',  a:.55 },
    { x:.15, y:.70, r:.28, col:'80,120,255',  a:.35 },
    { x:.50, y:.08, r:.22, col:'140,80,255',  a:.30 },
    { x:.88, y:.75, r:.20, col:'60,160,255',  a:.28 },
  ];
  orbs.forEach(o => { o.ox=0; o.oy=0; o.vx=(Math.random()-.5)*.0003; o.vy=(Math.random()-.5)*.0003; });

  /* nodes */
  const nodes = Array.from({ length: 55 }, () => ({
    x: Math.random()*1600, y: Math.random()*900,
    r: Math.random()*2.5+1.2,
    vx: (Math.random()-.5)*.22, vy: (Math.random()-.5)*.22,
    a: Math.random()*.7+.25,
    p: Math.random()*Math.PI*2, ps: .008+Math.random()*.015
  }));

  /* shooting stars */
  const stars = [];
  setInterval(() => {
    stars.push({ x: Math.random()*W, y: 0, len: 80+Math.random()*120, speed: 6+Math.random()*8, life: 1 });
  }, 1800);

  let t = 0;
  function draw() {
    t += .01;
    cx.clearRect(0, 0, W, H);

    /* orbs */
    for (const o of orbs) {
      o.ox += o.vx; o.oy += o.vy;
      if (Math.abs(o.ox) > .07) o.vx *= -1;
      if (Math.abs(o.oy) > .07) o.vy *= -1;
      const px=(o.x+o.ox)*W, py=(o.y+o.oy)*H, pr=o.r*Math.min(W,H);
      cx.save();
      cx.filter = `blur(${pr*.55}px)`;
      const g = cx.createRadialGradient(px,py,0,px,py,pr);
      g.addColorStop(0, `rgba(${o.col},${o.a})`);
      g.addColorStop(.45, `rgba(${o.col},${o.a*.35})`);
      g.addColorStop(1, `rgba(${o.col},0)`);
      cx.beginPath(); cx.arc(px,py,pr,0,Math.PI*2);
      cx.fillStyle = g; cx.fill();
      cx.restore();
    }

    /* grid */
    const GRID = 60;
    for (let x = 0; x < W; x += GRID) {
      const fa = Math.max(0, 1-Math.abs(x-W*.65)/(W*.5));
      cx.strokeStyle = `rgba(108,99,255,${.09*fa})`; cx.lineWidth = .6;
      cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x,H); cx.stroke();
    }
    for (let y = 0; y < H; y += GRID) {
      const fa = Math.max(0, 1-Math.abs(y-H*.5)/(H*.55));
      cx.strokeStyle = `rgba(108,99,255,${.09*fa})`; cx.lineWidth = .6;
      cx.beginPath(); cx.moveTo(0,y); cx.lineTo(W,y); cx.stroke();
    }

    /* nodes + connections */
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.p += n.ps; n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
      const dx=n.x-mouse.x, dy=n.y-mouse.y, d=Math.hypot(dx,dy);
      if (d < 150 && d > 0) { const f=(150-d)/150*1.2; n.x+=dx/d*f; n.y+=dy/d*f; }
      const al = n.a + Math.sin(n.p)*.2;
      const rl = n.r + Math.sin(n.p*.7)*.6;
      cx.save();
      cx.shadowBlur = 18; cx.shadowColor = `rgba(108,99,255,${al*.8})`;
      cx.beginPath(); cx.arc(n.x,n.y,rl,0,Math.PI*2);
      cx.fillStyle = `rgba(140,120,255,${al})`; cx.fill();
      cx.restore();
      for (let j = i+1; j < nodes.length; j++) {
        const m = nodes[j];
        const dist = Math.hypot(n.x-m.x, n.y-m.y);
        if (dist < 130) {
          const la = .22*(1-dist/130)*Math.min(al, m.a+Math.sin(m.p)*.2);
          const grad = cx.createLinearGradient(n.x,n.y,m.x,m.y);
          grad.addColorStop(0, `rgba(108,99,255,${la})`);
          grad.addColorStop(1, `rgba(167,139,250,${la*.5})`);
          cx.beginPath(); cx.moveTo(n.x,n.y); cx.lineTo(m.x,m.y);
          cx.strokeStyle = grad; cx.lineWidth = .8; cx.stroke();
        }
      }
    }

    /* shooting stars */
    for (let i = stars.length-1; i >= 0; i--) {
      const s = stars[i];
      s.x += s.speed*.7; s.y += s.speed; s.life -= .012;
      if (s.life <= 0 || s.y > H) { stars.splice(i,1); continue; }
      const g = cx.createLinearGradient(s.x,s.y,s.x-s.len*.5,s.y-s.len);
      g.addColorStop(0, `rgba(200,180,255,${s.life*.7})`);
      g.addColorStop(1, 'rgba(108,99,255,0)');
      cx.beginPath(); cx.moveTo(s.x,s.y); cx.lineTo(s.x-s.len*.5,s.y-s.len);
      cx.strokeStyle = g; cx.lineWidth = 1.5; cx.stroke();
    }

    /* vignette */
    const vig = cx.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,H);
    vig.addColorStop(0,'rgba(10,10,15,0)');
    vig.addColorStop(1,'rgba(10,10,15,.8)');
    cx.fillStyle = vig; cx.fillRect(0,0,W,H);

    requestAnimationFrame(draw);
  }
  draw();
}
