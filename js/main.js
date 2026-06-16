document.addEventListener('DOMContentLoaded', () => {
  // Recommended Brand Product Slider
  const grid = document.querySelector('.brand-product-grid');
  const cards = document.querySelectorAll('.brand-product-card');
  const dots = document.querySelectorAll('.recommended-brand-pagination .dot');

  if (!grid || cards.length === 0 || dots.length === 0) return;

  let activeIndex = 0;

  function updateSlider() {
    // If layout is desktop (width > 1200px) or mobile vertical (width <= 480px), reset transform
    if (window.innerWidth > 1200 || window.innerWidth <= 480) {
      grid.style.transform = '';
      return;
    }

    const cardWidth = cards[0].getBoundingClientRect().width;
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.gap) || 20;

    const offset = activeIndex * (cardWidth + gap);
    grid.style.transform = `translateX(-${offset}px)`;

    // Update pagination dots
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activeIndex = index;
      updateSlider();
    });
  });

  // Handle window resize to re-calculate offsets
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSlider, 100);
  });

  // Initial layout calculation
  updateSlider();

  // ABOUT US (Brand Story) Scroll Progress Indicator for Mobile
  const aboutGrid = document.querySelector('.about-us-grid');
  const aboutProgressBar = document.querySelector('.about-us-progress-bar');
  
  if (aboutGrid && aboutProgressBar) {
    aboutGrid.addEventListener('scroll', () => {
      const maxScroll = aboutGrid.scrollWidth - aboutGrid.clientWidth;
      if (maxScroll <= 0) return;
      const scrollPercentage = aboutGrid.scrollLeft / maxScroll;
      // Since the bar is 33.333% wide, left offset goes from 0% to 66.667%
      const leftOffset = scrollPercentage * 66.667;
      aboutProgressBar.style.left = `${leftOffset}%`;
    });
  }

  // Footer Business Info Accordion Toggle for Mobile
  const footerToggle = document.querySelector('.footer-company-toggle');
  const addressText = document.getElementById('footer-address');
  
  if (footerToggle && addressText) {
    footerToggle.addEventListener('click', () => {
      const isExpanded = footerToggle.getAttribute('aria-expanded') === 'true';
      footerToggle.setAttribute('aria-expanded', !isExpanded);
      footerToggle.classList.toggle('active');
      addressText.classList.toggle('active');
    });
  }
});
