const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobileMenu');
const progress = document.querySelector('#pageProgress');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

function syncScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? y / scrollable : 0;
  if (progress) progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

syncScrollUI();
window.addEventListener('scroll', syncScrollUI, { passive: true });

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}

function openMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Fechar menu');
  mobileMenu.hidden = false;
  document.body.classList.add('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMenu() : openMenu();
});

mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

reveals.forEach(el => {
  const delay = Number(el.dataset.delay || 0);
  el.style.setProperty('--delay', `${delay}ms`);
});

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

// Evita que âncoras fiquem escondidas atrás do header fixo.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});
