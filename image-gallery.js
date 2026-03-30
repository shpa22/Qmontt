(function () {
  function setupMarquee(section) {
    const track = section.querySelector('.image-marquee-track');
    if (!track || track.dataset.ready === 'true') return;

    const originals = Array.from(track.children).filter(function (node) {
      return node.classList && node.classList.contains('image-marquee-item');
    });

    if (!originals.length) return;

    const cloneCount = originals.length;
    originals.forEach(function (item, index) {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = 'true';
      clone.alt = item.alt ? item.alt + ' duplicate ' + (index + 1) : 'Gallery image duplicate';
      track.appendChild(clone);
    });

    function updateMetrics() {
      const gap = parseFloat(window.getComputedStyle(track).gap || '0');
      let width = 0;
      originals.forEach(function (item, index) {
        width += item.getBoundingClientRect().width;
        if (index < originals.length - 1) width += gap;
      });
      const seconds = Math.max(18, originals.length * 4.6);
      track.style.setProperty('--scroll-distance', width + 'px');
      track.style.setProperty('--marquee-duration', seconds + 's');
    }

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    track.dataset.ready = 'true';
  }

  function ensureLightbox() {
    let lightbox = document.getElementById('globalImageLightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'globalImageLightbox';
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = [
      '<div class="image-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Expanded image">',
      '  <button type="button" class="image-lightbox-close" aria-label="Close image">×</button>',
      '  <img class="image-lightbox-img" src="" alt="Expanded gallery image">',
      '</div>'
    ].join('');

    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox || event.target.classList.contains('image-lightbox-close')) {
        lightbox.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        lightbox.classList.remove('is-open');
      }
    });

    return lightbox;
  }

  function bindLightbox() {
    const lightbox = ensureLightbox();
    const image = lightbox.querySelector('.image-lightbox-img');

    document.querySelectorAll('.image-marquee-item').forEach(function (item) {
      item.addEventListener('click', function () {
        image.src = item.getAttribute('src');
        image.alt = item.getAttribute('alt') || 'Expanded gallery image';
        lightbox.classList.add('is-open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.image-marquee').forEach(setupMarquee);
    bindLightbox();
  });
})();
