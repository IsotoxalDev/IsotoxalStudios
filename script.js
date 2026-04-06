/* =========================================
   Isotoxal Studios — Landing Page Scripts
   ========================================= */

(function () {
  'use strict';

  // === Global Time (FIXED BUG) ===
  let time = 0;

  // === Mouse Tracking ===
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
      blob.style.transform =
        `translate(${ux * speed}px, ${uy * speed - (scrollY * scrollFactor)}px)`;
    });

    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 50;
      const scrollFactor = (i + 1) * 0.15;
      const rotation = (time * 0.1) + (i * 45);

      shape.style.transform =
        `translate(${ux * speed}px, ${uy * speed - (scrollY * scrollFactor)}px) rotate(${rotation}deg)`;
    });

    time++;
    requestAnimationFrame(animateDecorations);
  }

  animateDecorations();

  // === Animated Grid / Wave Canvas ===
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas?.getContext('2d');

  let gridW, gridH;
  const spacing = 40;

  function resizeCanvas() {
    if (!canvas) return;
    gridW = canvas.width = window.innerWidth;
    gridH = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawGrid() {
    if (!ctx) return;

    ctx.clearRect(0, 0, gridW, gridH);

    const cols = Math.ceil(gridW / spacing) + 1;
    const rows = Math.ceil(gridH / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;

        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;

        const wave =
          Math.sin(time * 0.02 + i * 0.3 + j * 0.3) * 0.5 + 0.5;

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
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(initReveal);
  });

  // === Navbar Scroll Behavior (FIXED + IMPROVED) ===
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener(
    'scroll',
    () => {
      if (!navbar) return;

      const currentScroll = window.scrollY;

      // Add background blur when scrolled
      navbar.classList.toggle('scrolled', currentScroll > 20);

      // Hide on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }

      lastScroll = currentScroll;
    },
    { passive: true }
  );

  // === Smooth Anchor Scrolling ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

})();