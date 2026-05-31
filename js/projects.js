/* ── PROJECTS LOADER ── */
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res  = await fetch('/projetos.json');
    const data = await res.json();

    grid.innerHTML = '';

    data.forEach((proj, i) => {
      const card = document.createElement('div');
      card.className = 'project-card' + (proj.destaque ? ' featured' : '');
      card.style.animationDelay = `${i * 0.1}s`;

      // Usa imagem real se existir, senão placeholder
      const imgHTML = proj.imagem
        ? `<div class="project-img-wrap">
            <img
              class="project-img"
              src="${proj.imagem}"
              alt="${proj.titulo}"
              loading="lazy"
              onerror="this.parentElement.innerHTML=\`<div class='project-img-placeholder'><svg width='48' height='48' viewBox='0 0 48 48' fill='none'><rect x='4' y='10' width='40' height='28' rx='4' stroke='#9D6FF0' stroke-width='1.5'/><circle cx='17' cy='21' r='4' stroke='#9D6FF0' stroke-width='1.5'/><path d='M4 32l9-7 7 6 6-5 10 9' stroke='#9D6FF0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg></div>\`"
            />
            ${proj.destaque ? '<span class="project-badge">✦ Destaque</span>' : ''}
           </div>`
        : `<div class="project-img-wrap">
            <div class="project-img-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="10" width="40" height="28" rx="4" stroke="#9D6FF0" stroke-width="1.5"/>
                <circle cx="17" cy="21" r="4" stroke="#9D6FF0" stroke-width="1.5"/>
                <path d="M4 32l9-7 7 6 6-5 10 9" stroke="#9D6FF0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            ${proj.destaque ? '<span class="project-badge">✦ Destaque</span>' : ''}
           </div>`;

      const tagsHTML = proj.tags
        .map(t => `<span class="project-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        ${imgHTML}
        <div class="project-body">
          <div class="project-title">${proj.titulo}</div>
          <div class="project-desc">${proj.descricao}</div>
          <div class="project-tags">${tagsHTML}</div>
        </div>`;

      grid.appendChild(card);
    });

    /* Animate cards on scroll */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.project-card').forEach(c => obs.observe(c));

  } catch (err) {
    console.error('Erro ao carregar projetos:', err);
    grid.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem">Erro ao carregar projetos.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);