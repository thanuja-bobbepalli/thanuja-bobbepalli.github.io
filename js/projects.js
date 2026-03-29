let projectsData = [];

const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'ai-agents', name: 'AI Agents & RAG' },
    { id: 'dl-cv', name: 'Deep Learning & CV' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'web-dev', name: 'Web Dev' },
    { id: 'resources', name: 'Resources' }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
});

async function initializeProjects() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Fetch failed');
        projectsData = await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        const grid = document.querySelector('.projects-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--accent);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to load projects locally.</p>
                    <small>Browsers block data fetching when opening HTML as a file. <br> 
                    Please run <code>python3 -m http.server</code> in this folder and visit <code>localhost:8000</code></small>
                </div>
            `;
        }
        return;
    }

    // 1. Create Filter Container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filters';
    filterContainer.innerHTML = categories.map(cat =>
        `<button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-filter="${cat.id}">
            ${cat.name}
        </button>`
    ).join('');

    // Insert after the section title
    const sectionTitle = projectsSection.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.after(filterContainer);
    }

    const existingGrid = projectsSection.querySelector('.projects-grid');
    if (existingGrid) {
        existingGrid.id = 'projects-grid';
    }

    // 3. Render Initial State
    renderProjects('all');

    // 4. Component Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            renderProjects(filter);
        });
    });
}

function renderProjects(filter) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = '';

    let projectsToShow = [];

    if (filter === 'all') {
        // Show all projects (sync script already sorts featured first)
        projectsToShow = projectsData;
    } else {
        // Show everything matching category
        projectsToShow = projectsData.filter(p => {
            const cat = Array.isArray(p.category) ? p.category[0] : p.category;
            return cat === filter;
        });
    }

    // Generate HTML
    projectsToShow.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });

    if (projectsToShow.length === 0) {
        grid.innerHTML = `<div class="no-projects" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No projects in this category yet.</div>`;
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    // Add 'featured' class if the project is marked as featured
    card.className = `project-card fade-in ${project.featured ? 'featured' : ''}`;

    const techHtml = project.tech ? project.tech.map(t => `<span class="tech">${t}</span>`).join('') : '';
    const linksHtml = `
        <a href="${project.github}" target="_blank" class="project-link">
            <i class="fab fa-github"></i>
        </a>
        ${project.demo ? `
        <a href="${project.demo}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i>
        </a>` : ''}
    `;

    // Icon mapping based on category (handles string or array)
    const catStr = Array.isArray(project.category) ? project.category[0] : project.category;
    let icon = 'fa-code';
    if (catStr === 'ai-agents') icon = 'fa-robot';
    if (catStr === 'dl-cv') icon = 'fa-eye';
    if (catStr === 'data-science') icon = 'fa-chart-bar';
    if (catStr === 'web-dev') icon = 'fa-laptop-code';
    if (catStr === 'resources') icon = 'fa-book';

    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="project-links">
                ${linksHtml}
            </div>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
            ${techHtml}
        </div>
    `;

    // Add interactive 3D effect after card is created
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });

    return card;
}
