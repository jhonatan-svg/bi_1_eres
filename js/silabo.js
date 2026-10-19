const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir navegación' : 'Cerrar navegación');
  menuToggle.innerHTML = `<i class="bi ${expanded ? 'bi-list' : 'bi-x-lg'}" aria-hidden="true"></i>`;
  navLinks.classList.toggle('is-open', !expanded);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir navegación');
    menuToggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
    navLinks.classList.remove('is-open');
  });
});

const searchInput = document.querySelector('#syllabus-search');
const searchableItems = [...document.querySelectorAll('.searchable')];
const searchCount = document.querySelector('#search-count');
const searchEmpty = document.querySelector('#search-empty');
const clearSearch = document.querySelector('#clear-search');

function filterSyllabus() {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  let matches = 0;

  searchableItems.forEach((item) => {
    const found = !query || item.textContent.toLocaleLowerCase('es').includes(query);
    item.classList.toggle('is-filtered-out', !found);
    if (found) matches += 1;
  });

  searchCount.textContent = query ? `${matches} ${matches === 1 ? 'resultado' : 'resultados'}` : '';
  searchEmpty.hidden = !query || matches > 0;
}

searchInput.addEventListener('input', filterSyllabus);
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  filterSyllabus();
  searchInput.focus();
});

const progressStorageKey = 'datavision-syllabus-reading';
let savedProgress = {};

try {
  savedProgress = JSON.parse(window.localStorage.getItem(progressStorageKey) || '{}');
} catch {
  savedProgress = {};
}

function updateUnitProgress(card) {
  const topics = [...card.querySelectorAll('.topic-toggle')];
  const completed = topics.filter((topic) => topic.getAttribute('aria-pressed') === 'true').length;
  const track = card.querySelector('.reading-track');
  const value = card.querySelector('.progress-value');
  const progress = Math.round((completed / topics.length) * 100);
  track.setAttribute('aria-valuenow', String(completed));
  track.setAttribute('aria-valuemax', String(topics.length));
  track.querySelector('span').style.width = `${progress}%`;
  value.textContent = `${completed} / ${topics.length} temas`;
}

document.querySelectorAll('.unit-card').forEach((card) => {
  const unitId = card.dataset.unit;
  const savedTopics = new Set(savedProgress[unitId] || []);
  card.querySelectorAll('.topic-toggle').forEach((button, index) => {
    const isRead = savedTopics.has(index);
    button.setAttribute('aria-pressed', String(isRead));
    button.addEventListener('click', () => {
      const nextRead = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(nextRead));
      const selectedTopics = [...card.querySelectorAll('.topic-toggle')]
        .map((topic, topicIndex) => topic.getAttribute('aria-pressed') === 'true' ? topicIndex : null)
        .filter((topicIndex) => topicIndex !== null);
      savedProgress[unitId] = selectedTopics;
      try {
        window.localStorage.setItem(progressStorageKey, JSON.stringify(savedProgress));
      } catch {
        // Reading progress remains available until the page is closed.
      }
      updateUnitProgress(card);
    });
  });
  updateUnitProgress(card);
});

document.querySelectorAll('.unit-details, .resource-category').forEach((details) => {
  details.addEventListener('toggle', () => {
    const summaryIcon = details.querySelector('summary > i');
    if (summaryIcon) summaryIcon.className = `bi ${details.open ? 'bi-dash-lg' : 'bi-plus-lg'}`;
  });
});

const conceptDialog = document.querySelector('#concept-dialog');
document.querySelectorAll('.concept-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelector('#dialog-title').textContent = card.dataset.concept;
    document.querySelector('#dialog-description').textContent = card.dataset.description;
    document.querySelector('#dialog-source').textContent = card.dataset.source;
    conceptDialog.showModal();
  });
});

conceptDialog.addEventListener('click', (event) => {
  if (event.target === conceptDialog) conceptDialog.close();
});

function updateCountdowns() {
  const now = new Date();
  document.querySelectorAll('.evaluation-card').forEach((card) => {
    const deadline = new Date(card.dataset.deadline);
    const output = card.querySelector('.countdown');
    output.classList.remove('is-past', 'is-today');

    if (deadline <= now) {
      output.textContent = 'Fecha cumplida';
      output.classList.add('is-past');
      return;
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const deadlineStart = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const daysLeft = Math.round((deadlineStart - todayStart) / 86400000);
    if (daysLeft === 0) {
      output.textContent = 'Hoy · hasta las 23:59:59';
      output.classList.add('is-today');
    } else {
      output.textContent = `Faltan ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`;
    }
  });
}

updateCountdowns();
const backToTop = document.querySelector('#back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 420);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});