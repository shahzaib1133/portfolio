(() => {
  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('show');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section, .project-card, .timeline-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();

