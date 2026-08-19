const menuBtn = document.getElementById('menu-btn');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavLinks = mobileNavOverlay ? mobileNavOverlay.querySelectorAll('a') : [];

const openMenu = () => {
     mobileNavOverlay.classList.add('active');
     menuBtn.classList.add('active');
     menuBtn.setAttribute('aria-expanded', 'true');
     menuBtn.setAttribute('aria-label', 'Fermer le menu');
     document.body.classList.add('scroll-locked'); // classe partagée avec la lightbox galerie
};

const closeMenu = () => {
     mobileNavOverlay.classList.remove('active');
     menuBtn.classList.remove('active');
     menuBtn.setAttribute('aria-expanded', 'false');
     menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
     document.body.classList.remove('scroll-locked');
};

if (menuBtn && mobileNavOverlay) {
     menuBtn.addEventListener('click', () => {
          const isActive = mobileNavOverlay.classList.contains('active');
          isActive ? closeMenu() : openMenu();
     });

     // Fermeture au clic en dehors des liens (sur le fond de l'overlay)
     mobileNavOverlay.addEventListener('click', (event) => {
          if (event.target === mobileNavOverlay) {
               closeMenu();
          }
     });

     // Fermeture après le clic sur un lien de navigation
     mobileNavLinks.forEach((link) => {
          link.addEventListener('click', closeMenu);
     });

     // Fermeture avec la touche Échap
     document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
               closeMenu();
          }
     });
}
