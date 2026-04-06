/* =========================================
   Isotoxal Studios — Landing Page Scripts
   ========================================= */

(function () {
  'use strict';

  // === Mouse Tracking (for grid background) ===
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // === Parallax for Background Decorations ===
  const blobs = document.querySelectorAll('.blob');
  const shapes = document.querySelectorAll('.shape');

  function animateDecorations() {
    const ux = (mouseX / window.innerWidth) - 0.5;
    const uy = (mouseY / window.innerHeight) - 0.5;
    const scrollY = window.scrollY;

    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 30;
      const scrollFactor = (i + 1) * 0.05;
      blob.style.transform = `translate(${ux * speed}px, ${uy * speed - (scrollY * scrollFactor)}px)`;
    });

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 50;
      const scrollFactor = (i + 1) * 0.15;
      // We use a local rotation or just keep it subtle
      const rotation = (time * 0.1) + (i * 45);
      shape.style.transform = `translate(${ux * speed}px, ${uy * speed - (scrollY * scrollFactor)}px) rotate(${rotation}deg)`;
    });

    requestAnimationFrame(animateDecorations);
  }
  animateDecorations();

  // === Animated Grid / Wave Canvas ===
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');
  let gridW, gridH;
  const spacing = 40;
  let time = 0;

  function resizeCanvas() {
    gridW = canvas.width = window.innerWidth;
    gridH = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawGrid() {
    ctx.clearRect(0, 0, gridW, gridH);

    const cols = Math.ceil(gridW / spacing) + 1;
    const rows = Math.ceil(gridH / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;

        // Distance from mouse
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;

        // Wave offset
        const wave = Math.sin(time * 0.02 + i * 0.3 + j * 0.3) * 0.5 + 0.5;

        // Proximity glow
        let alpha = 0.04 + wave * 0.03;
        if (dist < maxDist) {
          alpha += (1 - dist / maxDist) * 0.12;
        }

        const size = 1.2 + wave * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 216, 109, ${alpha})`;
        ctx.fill();
      }
    }

    time++;
    requestAnimationFrame(drawGrid);
  }

  drawGrid();

  // === Scroll Reveal ===
  function initReveal() {
    const elements = document.querySelectorAll(
      '.project-card, .film-card, .section-header, .about-text, .about-logo'
    );
    elements.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // Delay init to let page paint
  requestAnimationFrame(() => {
    requestAnimationFrame(initReveal);
  });

  // === Navbar scroll effect ===
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener(
    'scroll',
    () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        navbar.style.background = 'rgba(26, 26, 26, 0.92)';
      } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.7)';
      }
      lastScroll = currentScroll;
    },
    { passive: true }
  );

  // === Smooth anchor scrolling (fallback) ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
