/* =====================================================
   RÉVÉLATION AU SCROLL
   =====================================================
   Anime chaque section marquée .section-animated une seule fois,
   lorsqu'elle devient visible (voir styles/animation.css pour les
   classes .section-animated / .section-visible). Ce script est
   chargé en `type="module"`, donc déjà différé : le DOM est garanti
   prêt au moment de son exécution, sans avoir besoin d'écouter
   DOMContentLoaded. */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section-animated');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          observer.unobserve(entry.target); // On anime une seule fois
        }
      });
    },
    { threshold: 0.15 } // 15% visible = animation
  );

  sections.forEach((section) => observer.observe(section));
}

/* =====================================================
   CARROUSEL TÉMOIGNAGES — fondus de bord
   =====================================================
   Le carrousel est un simple scroll horizontal natif (voir
   styles/temoignages.css). On ajoute seulement ce qu'un scroll natif
   ne peut pas exprimer seul : un fondu qui s'efface une fois qu'il n'y
   a plus rien à découvrir de ce côté, et une indication textuelle qui
   disparaît une fois le dernier témoignage atteint. */
function initTemoignagesScrollFade() {
  const track = document.querySelector('.temoignages-second-content');
  const hint = document.querySelector('.tmg-scroll-hint');
  if (!track) return;

  const updateEdges = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 1;
    const atEnd = maxScroll <= 1 || track.scrollLeft >= maxScroll - 1;

    track.classList.toggle('scroll-at-start', atStart);
    track.classList.toggle('scroll-at-end', atEnd);
    hint?.classList.toggle('scroll-hint-done', atEnd && !atStart);
  };

  track.addEventListener('scroll', updateEdges, { passive: true });
  window.addEventListener('resize', updateEdges);
  updateEdges();
}

/* =====================================================
   FORMULAIRE DE CONTACT
   =====================================================
   Validation native avant envoi, retour visuel sur les champs
   invalides, puis envoi via EmailJS avec un état de chargement
   clair sur le bouton. */
function initContactForm() {
  const form = document.getElementById('form');
  const submitBtn = document.getElementById('contact-btn');
  if (!form || !submitBtn) return;

  const SERVICE_ID = 'default_service';
  const TEMPLATE_ID = 'template_n8qus5l';
  const SUBMIT_LABEL_DEFAULT = 'Envoyer le message';
  const SUBMIT_LABEL_PENDING = 'Envoi en cours…';

  // Affiche l'état "erreur" sur un champ (secousse + bordure rouge,
  // voir styles/contact.css) et le retire dès que l'utilisateur corrige.
  const markFieldInvalid = (field) => {
    const wrapper = field.closest('.form-wrapper, .form-consent');
    if (!wrapper) return;

    // Force le navigateur à "oublier" l'animation précédente pour
    // pouvoir la rejouer si l'utilisateur soumet à nouveau un champ
    // resté invalide.
    wrapper.classList.remove('field-invalid');
    void wrapper.offsetWidth;
    wrapper.classList.add('field-invalid');

    const clearInvalid = () => wrapper.classList.remove('field-invalid');
    field.addEventListener('input', clearInvalid, { once: true });
    field.addEventListener('change', clearInvalid, { once: true });
  };

  const setSubmitting = (isSubmitting) => {
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? SUBMIT_LABEL_PENDING : SUBMIT_LABEL_DEFAULT;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Validation native (required, type="email", etc.) : si un champ
    // n'est pas valide, on le signale et on s'arrête là, sans jamais
    // envoyer un formulaire incomplet.
    if (!form.checkValidity()) {
      const invalidFields = form.querySelectorAll(':invalid');
      invalidFields.forEach(markFieldInvalid);
      invalidFields[0]?.focus();
      return;
    }

    setSubmitting(true);

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form).then(
      () => {
        setSubmitting(false);
        alert('Sent!');
      },
      (err) => {
        setSubmitting(false);
        alert(JSON.stringify(err));
      }
    );
  });
}

initScrollReveal();
initTemoignagesScrollFade();
initContactForm();
