/* ============================================
   DANIEL D'SOUZA — GAMIFIED PORTFOLIO JS
   ============================================ */

// === PARTICLE STARFIELD ===
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,245,255,0.03)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// === CURSOR TRAIL ===
(function initCursorTrail() {
  const canvas = document.getElementById('cursor-trail');
  const ctx = canvas.getContext('2d');
  let trail = [];
  const MAX = 20;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > MAX) trail.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, i) => {
      p.life -= 0.03;
      if (p.life <= 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.life * 0.5})`;
      ctx.fill();
    });
    trail = trail.filter(p => p.life > 0);
    requestAnimationFrame(draw);
  }
  draw();
})();

// === TYPING EFFECT ===
(function initTyping() {
  const el = document.getElementById('typing-text');
  const titles = ['Full Stack Developer', 'AI/ML Engineer', 'MERN Stack Builder'];
  let ti = 0, ci = 0, deleting = false;

  function type() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
})();

// === XP BAR ANIMATION ===
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('xp-fill').style.width = '79%';
  }, 500);
});

// === MOBILE NAV TOGGLE ===
document.getElementById('nav-toggle').addEventListener('click', function () {
  document.querySelector('.nav-links').classList.toggle('open');
  this.classList.toggle('active');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
    document.getElementById('nav-toggle').classList.remove('active');
  });
});

// === ACTIVE NAV TRACKING ===
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.dataset.section === current) l.classList.add('active');
  });
});

// === GSAP SCROLL ANIMATIONS ===
gsap.registerPlugin(ScrollTrigger);

// Stat cards
gsap.utils.toArray('.stat-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
    y: 60, opacity: 0, duration: 0.6, delay: i * 0.1,
    onComplete: () => card.classList.add('visible')
  });
});

// Stat counter animation
function animateCounters() {
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
    });
  });
}
animateCounters();

// Mission cards
gsap.utils.toArray('.mission-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    y: 80, opacity: 0, duration: 0.7, delay: i * 0.1
  });
});

// Skill branches
gsap.utils.toArray('.skill-branch').forEach((branch, i) => {
  gsap.from(branch, {
    scrollTrigger: {
      trigger: branch, start: 'top 85%',
      onEnter: () => branch.classList.add('visible')
    },
    x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 0.7, delay: i * 0.15
  });
});

// Achievement cards
gsap.utils.toArray('.achievement-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    scale: 0.8, opacity: 0, duration: 0.5, delay: i * 0.1
  });
});

// Live deployment cards
gsap.utils.toArray('.deploy-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    y: 70, opacity: 0, duration: 0.7, delay: i * 0.12
  });
});

// Terminal form
gsap.from('.terminal-form', {  scrollTrigger: { trigger: '.terminal-form', start: 'top 85%' },
  y: 60, opacity: 0, duration: 0.8
});

// === CONTACT FORM (Formspree) ===
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const resp = document.getElementById('form-response');
  const form = this;

  btn.querySelector('.btn-text').textContent = '[ TRANSMITTING... ]';
  btn.style.boxShadow = '0 0 30px rgba(0,245,255,0.5)';
  btn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(r => {
    btn.querySelector('.btn-text').textContent = '[ SEND TRANSMISSION ]';
    btn.style.boxShadow = '';
    btn.disabled = false;
    if (r.ok) {
      resp.textContent = '> MESSAGE TRANSMITTED SUCCESSFULLY ✓';
      resp.style.color = '#00ff88';
      form.reset();
    } else {
      resp.textContent = '> TRANSMISSION FAILED — TRY AGAIN ✗';
      resp.style.color = '#ff5f57';
    }
    resp.style.display = 'block';
    setTimeout(() => { resp.style.display = 'none'; }, 4000);
  })
  .catch(() => {
    btn.querySelector('.btn-text').textContent = '[ SEND TRANSMISSION ]';
    btn.style.boxShadow = '';
    btn.disabled = false;
    resp.textContent = '> COMMS ERROR — CHECK CONNECTION ✗';
    resp.style.color = '#ff5f57';
    resp.style.display = 'block';
    setTimeout(() => { resp.style.display = 'none'; }, 4000);
  });
});


// === CERTIFICATES CAROUSEL ===
(function initCertificates() {
  const track = document.getElementById('cert-track');
  const viewport = document.getElementById('cert-viewport');
  const dotsWrap = document.getElementById('cert-dots');
  const prevBtn = document.getElementById('cert-prev');
  const nextBtn = document.getElementById('cert-next');
  if (!track) return;

  // Certificate files (in /Certificate folder) with display names
  const certs = [
    { file: 'DANIEL – Hackathon Certificate.pdf', name: 'Hackathon Certificate' },
    { file: 'Colloquium25_231029 (1).pdf', name: 'Colloquium 2025' },
    { file: 'Colloquium25_231029 (2).pdf', name: 'Colloquium 2025' },
    { file: 'bWqaecPDbYAwSDqJy_Sj7temL583QAYpHXD_6a2ac24d47a1e24579b1e4da_1781262752507_completion_certificate.pdf', name: 'Course Completion' },
    { file: 'io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_6a2ac24d47a1e24579b1e4da_1781259811907_completion_certificate.pdf', name: 'Course Completion' },
    { file: 'Certificate(1).pdf', name: 'Certificate' },
    { file: 'certificate.pdf', name: 'Certificate' },
    { file: '1VDpRY.pdf', name: 'Certificate' },
    { file: '2mN9as (2).pdf', name: 'Certificate' },
    { file: '3y8yB.pdf', name: 'Certificate' },
    { file: 'AsDeY.pdf', name: 'Certificate' },
    { file: 'cfFWv.pdf', name: 'Certificate' },
    { file: 'DmFcn.pdf', name: 'Certificate' },
    { file: 'Z25ozL7 (3).pdf', name: 'Certificate' },
    { file: 'Z2e0CFN.pdf', name: 'Certificate' },
    { file: 'Z58CrS.pdf', name: 'Certificate' }
  ];

  // Build cards
  certs.forEach((c, i) => {
    const url = 'Certificate/' + c.file;
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(c.file);
    const card = document.createElement('div');
    card.className = 'cert-card';
    const id = String(i + 1).padStart(2, '0');
    const previewInner = isImage
      ? `<img src="${url}" alt="${c.name}" loading="lazy">`
      : `<iframe data-src="${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH" title="${c.name}" scrolling="no"></iframe>
         <span class="cert-placeholder">LOADING PREVIEW…</span>`;
    card.innerHTML = `
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <div class="cert-preview">
          ${previewInner}
          <div class="cert-overlay"><span class="cert-view-btn">[ VIEW ]</span></div>
        </div>
        <div class="cert-meta">
          <div class="cert-id">CERT-${id}</div>
          <div class="cert-name">${c.name}</div>
        </div>
      </a>`;
    track.appendChild(card);
  });

  const cards = Array.from(track.children);
  let index = 0;

  // Dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to certificate ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function step() {
    if (!cards[0]) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function maxIndex() {
    const perView = Math.max(1, Math.floor(viewport.clientWidth / step()));
    return Math.max(0, cards.length - perView);
  }

  // Lazy-load PDF iframes near the active index
  function loadNear() {
    cards.forEach((card, i) => {
      if (Math.abs(i - index) <= 3) {
        const frame = card.querySelector('iframe[data-src]');
        if (frame) {
          frame.src = frame.dataset.src;
          frame.removeAttribute('data-src');
          frame.addEventListener('load', () => {
            const ph = card.querySelector('.cert-placeholder');
            if (ph) ph.remove();
          });
        }
      }
    });
  }

  function update() {
    index = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(${-index * step()}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex();
    loadNear();
  }

  function goTo(i) { index = i; update(); }
  prevBtn.addEventListener('click', () => { index--; update(); });
  nextBtn.addEventListener('click', () => { index++; update(); });

  // Drag / swipe support
  let startX = 0, dragging = false, moved = 0;
  function pointerDown(x) { dragging = true; startX = x; moved = 0; track.classList.add('dragging'); }
  function pointerMove(x) {
    if (!dragging) return;
    moved = x - startX;
    track.style.transform = `translateX(${-index * step() + moved}px)`;
  }
  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    const threshold = step() * 0.2;
    if (moved < -threshold) index++;
    else if (moved > threshold) index--;
    update();
  }

  viewport.addEventListener('mousedown', e => { e.preventDefault(); pointerDown(e.clientX); });
  window.addEventListener('mousemove', e => pointerMove(e.clientX));
  window.addEventListener('mouseup', pointerUp);
  viewport.addEventListener('touchstart', e => pointerDown(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchmove', e => pointerMove(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchend', pointerUp);

  // Prevent link navigation right after a drag
  track.addEventListener('click', e => { if (Math.abs(moved) > 5) e.preventDefault(); }, true);

  window.addEventListener('resize', update);
  update();

  // GSAP entrance
  if (window.gsap) {
    gsap.from('.cert-carousel', {
      scrollTrigger: { trigger: '#certificates', start: 'top 80%' },
      y: 60, opacity: 0, duration: 0.8
    });
  }
})();
