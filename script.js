/* ─── Particle Network Background ───────────────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  const N         = 70;
  const MAX_DIST  = 130;
  const MOUSE_R   = 160;   // mouse influence radius
  const MOUSE_F   = 0.012; // attraction strength

  let W, H, particles;
  let mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Dot {
    constructor() { this.spawn(); }

    spawn() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.2 + 0.4;
    }

    update() {
      // Subtle mouse attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_R && d > 0) {
        this.vx += (dx / d) * MOUSE_F;
        this.vy += (dy / d) * MOUSE_F;
      }

      // Speed cap
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 0.8) { this.vx *= 0.8 / speed; this.vy *= 0.8 / speed; }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -5)  this.x = W + 5;
      if (this.x > W+5) this.x = -5;
      if (this.y < -5)  this.y = H + 5;
      if (this.y > H+5) this.y = -5;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.45)';
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, () => new Dot());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => p.spawn());
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  init();
  draw();
})();

/* ─── Typing Animation ───────────────────────────────────────────── */
(function () {
  const phrases = [
    'computational chemist.',
    'ML for drug discovery.',
    'PhD student @ Oxford.',
  ];

  const el      = document.getElementById('typed');
  let   pi      = 0;   // phrase index
  let   ci      = 0;   // char index
  let   deleting = false;
  const SPEED_TYPE = 55;
  const SPEED_DEL  = 30;
  const PAUSE_END  = 1800;
  const PAUSE_START = 400;

  function tick() {
    const phrase = phrases[pi];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
    }

    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }

  setTimeout(tick, 800);
})();

/* ─── Scroll Fade-in (Intersection Observer) ────────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => obs.observe(el));
})();

/* ─── Active nav link on scroll ─────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('#nav ul a');

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const match = document.querySelector(`#nav ul a[href="#${e.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => obs.observe(s));
})();
