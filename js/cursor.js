// Starfield Galaxy background and interactive cursor
(() => {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  const stars = [];
  const STAR_COUNT = 220;
  const PARALLAX = 0.03;
  const colors = ['#cfd4ff', '#9ea8ff', '#7fbfff', '#bfa6ff'];
  const mouse = { x: 0, y: 0, vx: 0, vy: 0 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.5 + 0.3,
        c: colors[Math.floor(Math.random() * colors.length)],
        tw: Math.random() * 2 * Math.PI
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      s.tw += 0.02;
      const twinkle = (Math.sin(s.tw) + 1) * 0.25 + 0.5;
      const px = s.x + (mouse.x - width / 2) * (s.z * PARALLAX);
      const py = s.y + (mouse.y - height / 2) * (s.z * PARALLAX);
      ctx.beginPath();
      ctx.arc(px, py, s.r * twinkle, 0, Math.PI * 2);
      ctx.fillStyle = s.c;
      ctx.globalAlpha = 0.6 + 0.4 * twinkle;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });

  resize();
  createStars();
  draw();

  // Cursor and particle trail
  const cursor = document.querySelector('.cursor');
  const trail = document.querySelector('.cursor-trail');
  const particles = [];

  function spawnParticle(x, y) {
    particles.push({ x, y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6, life: 1, r: Math.random() * 2 + 1 });
  }

  function animateTrail() {
    const rect = trail.getBoundingClientRect();
    const off = document.createElement('canvas');
    off.width = rect.width; off.height = rect.height;
    const octx = off.getContext('2d');
    function step() {
      octx.clearRect(0, 0, off.width, off.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        octx.beginPath();
        octx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        octx.fillStyle = `rgba(140, 120, 255, ${p.life * 0.6})`;
        octx.fill();
      }
      trail.style.backgroundImage = `url(${off.toDataURL()})`;
      requestAnimationFrame(step);
    }
    step();
  }

  window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    for (let i = 0; i < 2; i++) spawnParticle(e.clientX, e.clientY);
  });

  animateTrail();
})();

