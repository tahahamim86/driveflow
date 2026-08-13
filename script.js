// =========================================================
// Menu mobile
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// Voiture animée le long de la route (défilement)
// =========================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const routeSection = document.querySelector('.route-wrap');
const routeLine = document.getElementById('routeLine');
const routeCar = document.getElementById('routeCar');

if (routeSection && routeLine && routeCar && !reduceMotion && window.innerWidth > 900) {
  const pathLength = routeLine.getTotalLength();

  const moveCarAlongRoute = () => {
    const rect = routeSection.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Progression du scroll à l'intérieur de la section (0 -> 1)
    const start = viewportH * 0.8;
    const end = -rect.height + viewportH * 0.2;
    const raw = (start - rect.top) / (start - end);
    const progress = Math.min(1, Math.max(0, raw));

    const point = routeLine.getPointAtLength(progress * pathLength);
    routeCar.setAttribute('transform', `translate(${point.x}, ${point.y})`);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        moveCarAlongRoute();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', moveCarAlongRoute);
  moveCarAlongRoute();
}

// =========================================================
// Apparition progressive des cartes "étapes"
// =========================================================
const revealTargets = document.querySelectorAll('.stop-card, .how-card');

if ('IntersectionObserver' in window && !reduceMotion) {
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealTargets.forEach(el => observer.observe(el));
}

// =========================================================
// Bouton de téléchargement du setup.exe
// =========================================================
// Remplacez INSTALLER_URL par le lien réel vers votre fichier .exe
// (hébergé sur votre serveur, un CDN, ou un release GitHub par exemple).
const INSTALLER_URL = 'downloads/DriveFlow_Setup.exe';

const downloadBtn = document.getElementById('downloadBtn');
const downloadNote = document.getElementById('downloadNote');

// Le lien pointe déjà vers le fichier réel : on laisse le navigateur
// gérer le téléchargement normalement et on affiche juste un message.
downloadBtn.setAttribute('href', INSTALLER_URL);
downloadBtn.setAttribute('download', 'DriveFlow_Setup.exe');

downloadBtn.addEventListener('click', () => {
  downloadNote.textContent = 'Téléchargement lancé — ouvrez le fichier une fois terminé pour installer AutoPilote.';

  window.setTimeout(() => {
    downloadNote.textContent = '';
  }, 6000);
});