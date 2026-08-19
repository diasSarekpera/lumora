const galerieImages = document.querySelectorAll('.galerie-image');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg && lightboxClose && galerieImages.length > 0) {
     let lastFocused = null;

     const openLightbox = (figure) => {
          const img = figure.querySelector('img');
          if (!img) return;

          lastFocused = document.activeElement;

          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || '';

          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.classList.add('scroll-locked');

          lightboxClose.focus();
     };

     const closeLightbox = () => {
          lightbox.classList.remove('active');
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('scroll-locked');

          // On vide l'image après la transition pour éviter un flash au prochain clic
          setTimeout(() => {
               if (!lightbox.classList.contains('active')) {
                    lightboxImg.src = '';
               }
          }, 300);

          if (lastFocused) {
               lastFocused.focus();
          }
     };

     galerieImages.forEach((figure) => {
          figure.addEventListener('click', () => openLightbox(figure));
          figure.addEventListener('keydown', (event) => {
               if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(figure);
               }
          });
     });

     lightboxClose.addEventListener('click', closeLightbox);

     // Fermeture au clic en dehors de l'image
     lightbox.addEventListener('click', (event) => {
          if (event.target === lightbox) {
               closeLightbox();
          }
     });

     // Fermeture avec la touche Échap
     document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && lightbox.classList.contains('active')) {
               closeLightbox();
          }
     });
}
