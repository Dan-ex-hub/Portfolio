/* ============================================================
   AETHER — interactions
   ============================================================ */

/* ---------- THEME ---------- */
(function theme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('aether-theme');
  if (saved) root.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('aether-theme', next);
  });
})();

/* ---------- MOBILE MENU ---------- */
(function menu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const toggle = () => { btn.classList.toggle('open'); menu.classList.toggle('open'); };
  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', toggle));
})();

/* ---------- NAV + SCROLL PROGRESS ---------- */
(function scrollUI() {
  const nav = document.getElementById('nav');
  const bar = document.getElementById('scroll-progress');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- CUSTOM CURSOR + MAGNETIC ---------- */
(function cursor() {
  if (window.matchMedia('(hover:none)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,[data-magnetic],.work-item,.cert-slide')) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,[data-magnetic],.work-item,.cert-slide')) ring.classList.remove('hover');
  });
  // magnetic pull
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ---------- REVEAL ON SCROLL ---------- */
(function reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ---------- HERO WORD REVEAL ---------- */
window.addEventListener('load', () => {
  if (window.gsap) {
    gsap.to('.hero-title .word', { y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
  } else {
    document.querySelectorAll('.hero-title .word').forEach(w => w.style.transform = 'none');
  }
});

/* ---------- COUNTERS ---------- */
(function counters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-count]').forEach(el => io.observe(el));
})();

/* ---------- WORK LIST ---------- */
(function work() {
  const list = document.getElementById('work-list');
  if (!list) return;
  const projects = [
    { name: 'World Impact Monitor', tag: 'AI · Geospatial', desc: 'Real-time 3D/2D platform tracking global events across markets, geopolitics and environment, with AI news summarization.', tags: ['TypeScript', 'Three.js', 'AI'], link: 'https://github.com/Dan-ex-hub/world_imapct_monitor', img: 'screenshots/world-impact-monitor.jpg' },
    { name: 'Futures Predictor', tag: 'Machine Learning', desc: 'AI-driven futures trade prediction for GC, ES, NQ & CL — ICT price-action, HMM regime detection and a stacked XGBoost/LightGBM/CatBoost ensemble.', tags: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'HMM'], link: 'https://github.com/Dan-ex-hub/Futures_EQ_CL_GC-predictor' },
    { name: 'StudyBot', tag: 'Gen AI', desc: 'AI study assistant with secure auth, persistent chat history and streaming Groq-powered responses that remember context.', tags: ['Python', 'LangChain', 'FastAPI', 'Gen AI'], link: 'https://github.com/Dan-ex-hub/study-bot', img: 'screenshots/study-bot.jpg' },
    { name: 'Interviewer AI', tag: 'Real-time AI', desc: 'A screen-capture-invisible AI co-pilot for technical interviews — real-time Groq Whisper transcription and multi-provider LLM reasoning.', tags: ['TypeScript', 'Groq', 'LLM'], link: 'https://github.com/Dan-ex-hub/interviewer-ai-' },
    { name: 'Edu Cycle', tag: 'Full Stack', desc: 'Educational resource sharing platform enabling a circular economy of learning materials.', tags: ['Next.js', 'PostgreSQL', 'React', 'Tailwind'], link: 'https://github.com/Dan-ex-hub/Educycle', img: 'screenshots/educycle.jpg' },
    { name: 'GRID', tag: 'ML Platform', desc: 'A grid-based layout system and management platform with applied machine learning for modern web apps.', tags: ['React', 'Machine Learning', 'XGBoost', 'LightGBM'], link: 'https://github.com/vinitgirdhar/GRID_', img: 'screenshots/grid.jpg' },
    { name: 'Sahaayak', tag: 'MERN', desc: 'Community assistance platform connecting volunteers with people in need for social good.', tags: ['MERN', 'Socket.io', 'Maps API'], link: 'https://github.com/vinitgirdhar/Sahaayak' },
    { name: 'Smart DL Services', tag: 'GovTech', desc: 'A G2C platform simplifying RTO tasks like DL and Learner\u2019s License applications, reducing paperwork for citizens.', tags: ['HTML', 'Python', 'JavaScript', 'CSS'], link: 'https://github.com/Dan-ex-hub/smart-dl-services' },
    { name: 'SleepEase', tag: 'Health ML', desc: 'Sleep tracking and optimization app using ML to analyze and improve sleep patterns.', tags: ['React Native', 'MongoDB', 'Node.js'], link: 'https://sleep-ease-three.vercel.app/', img: 'screenshots/sleepease.jpg' }
  ];
  const grads = ['linear-gradient(135deg,#FF5C38,#7C5CFF)', 'linear-gradient(135deg,#7C5CFF,#27c2a0)', 'linear-gradient(135deg,#27c2a0,#FF5C38)', 'linear-gradient(135deg,#ff8a5c,#7C5CFF)'];

  projects.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'work-item reveal';
    a.href = p.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.dataset.img = p.img || '';
    a.dataset.grad = grads[i % grads.length];
    a.innerHTML = `
      <span class="work-index">0${i + 1}</span>
      <div class="work-main">
        <h3 class="work-name">${p.name}</h3>
        <p class="work-desc">${p.desc}</p>
        <div class="work-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
      <span class="work-arrow">↗</span>`;
    list.appendChild(a);
  });

  // floating preview
  const preview = document.createElement('div');
  preview.className = 'work-preview';
  preview.innerHTML = '<img alt="">';
  document.body.appendChild(preview);
  const pimg = preview.querySelector('img');
  let raf;
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (item.dataset.img) { pimg.style.display = 'block'; pimg.src = item.dataset.img; preview.style.background = ''; }
      else { pimg.style.display = 'none'; preview.style.background = item.dataset.grad; }
      preview.classList.add('show');
    });
    item.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
  // reveal injected items
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  list.querySelectorAll('.reveal').forEach(el => io.observe(el));
  window.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      preview.style.left = e.clientX + 'px';
      preview.style.top = e.clientY + 'px';
    });
  });
})();

/* ---------- STACK ---------- */
(function stack() {
  const grid = document.getElementById('stack-grid');
  if (!grid) return;
  const cols = [
    { h: 'Frontend', items: [['React', '92'], ['Next.js', '88'], ['TypeScript', '78'], ['HTML / CSS', '96'], ['JavaScript', '90']] },
    { h: 'Backend', items: [['Node.js', '90'], ['Express', '85'], ['Python', '95'], ['FastAPI', '82'], ['Flask', '72']] },
    { h: 'AI / ML', items: [['Gen AI', '88'], ['LangChain', '85'], ['TensorFlow', '78'], ['PyTorch', '76'], ['Scikit-learn', '80']] },
    { h: 'Data', items: [['MongoDB', '90'], ['PostgreSQL', '82'], ['MySQL', '80'], ['Redis', '66'], ['Firebase', '72']] }
  ];
  cols.forEach(c => {
    const d = document.createElement('div');
    d.className = 'stack-col reveal';
    d.innerHTML = `<h3>${c.h}</h3><ul>${c.items.map(it => `<li><b>${it[0]}</b><i>${it[1]}</i></li>`).join('')}</ul>`;
    grid.appendChild(d);
  });
  // re-observe newly added reveals
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ---------- CERTIFICATES RAIL ---------- */
(function certs() {
  const rail = document.getElementById('cert-rail');
  if (!rail) return;
  const prevBtn = document.getElementById('cert-prev');
  const nextBtn = document.getElementById('cert-next');
  const data = [
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

  data.forEach((c, i) => {
    const url = 'Certificate/' + c.file;
    const isImg = /\.(png|jpe?g|webp|gif)$/i.test(c.file);
    const slide = document.createElement('a');
    slide.className = 'cert-slide';
    slide.href = url; slide.target = '_blank'; slide.rel = 'noopener noreferrer';
    const inner = isImg
      ? `<img src="${url}" alt="${c.name}" loading="lazy">`
      : `<iframe data-src="${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH" title="${c.name}" scrolling="no"></iframe><span class="cert-loading">opening…</span>`;
    slide.innerHTML = `<div class="cert-frame">${inner}</div>
      <div class="cert-cap"><b>${c.name}</b><span>${String(i + 1).padStart(2, '0')}</span></div>`;
    rail.appendChild(slide);
  });

  const slides = Array.from(rail.children);
  let index = 0;

  const step = () => {
    if (!slides[0]) return 0;
    const gap = parseFloat(getComputedStyle(rail).gap) || 0;
    return slides[0].getBoundingClientRect().width + gap;
  };
  const maxIndex = () => {
    const per = Math.max(1, Math.floor(rail.parentElement.clientWidth / step()));
    return Math.max(0, slides.length - per);
  };
  const loadNear = () => {
    slides.forEach((s, i) => {
      if (Math.abs(i - index) <= 3) {
        const f = s.querySelector('iframe[data-src]');
        if (f) {
          f.src = f.dataset.src; f.removeAttribute('data-src');
          f.addEventListener('load', () => { const l = s.querySelector('.cert-loading'); if (l) l.remove(); });
        }
      }
    });
  };
  const update = () => {
    index = Math.max(0, Math.min(index, maxIndex()));
    rail.style.transform = `translateX(${-index * step()}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex();
    loadNear();
  };
  prevBtn.addEventListener('click', () => { index--; update(); });
  nextBtn.addEventListener('click', () => { index++; update(); });

  // drag
  let startX = 0, dragging = false, moved = 0;
  const down = x => { dragging = true; startX = x; moved = 0; rail.classList.add('dragging'); };
  const move = x => { if (!dragging) return; moved = x - startX; rail.style.transform = `translateX(${-index * step() + moved}px)`; };
  const up = () => {
    if (!dragging) return; dragging = false; rail.classList.remove('dragging');
    const th = step() * 0.2;
    if (moved < -th) index++; else if (moved > th) index--;
    update();
  };
  rail.addEventListener('mousedown', e => { e.preventDefault(); down(e.clientX); });
  window.addEventListener('mousemove', e => move(e.clientX));
  window.addEventListener('mouseup', up);
  rail.addEventListener('touchstart', e => down(e.touches[0].clientX), { passive: true });
  rail.addEventListener('touchmove', e => move(e.touches[0].clientX), { passive: true });
  rail.addEventListener('touchend', up);
  rail.addEventListener('click', e => { if (Math.abs(moved) > 5) e.preventDefault(); }, true);

  window.addEventListener('resize', update);
  update();
})();

/* ---------- CONTACT FORM ---------- */
(function form() {
  const f = document.getElementById('contact-form');
  if (!f) return;
  const resp = document.getElementById('form-response');
  const btn = document.getElementById('submit-btn');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(r => {
        btn.textContent = original; btn.disabled = false;
        if (r.ok) { resp.textContent = '✓ Message sent — talk soon.'; resp.style.color = '#37d67a'; f.reset(); }
        else { resp.textContent = '✗ Something went wrong. Try again.'; resp.style.color = '#FF5C38'; }
      })
      .catch(() => {
        btn.textContent = original; btn.disabled = false;
        resp.textContent = '✗ Connection error. Try again.'; resp.style.color = '#FF5C38';
      });
  });
})();
