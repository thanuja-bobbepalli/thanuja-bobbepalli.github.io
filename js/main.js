/**
 * Main JavaScript for THANUJA BOBBEPALLI Portfolio
 * Interactive features, animations, and functionality
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initPreloader();
    initCustomCursor();
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initTerminalTyping();
    initSmoothScroll();
    initProjectCards();
    initScrollProgress();
    initBackToTop();
    initTextScramble();
    initFloatingElements();
    initMatrixRain();
    initClipboard();
    // Initializers
    initGitHubGraph();
    fetchGitHubProfile();
    initExperience();
    updateAboutStats();
});

/**
 * Fetch Real GitHub Profile Data
 */
async function fetchGitHubProfile() {
    try {
        const username = 'thanuja-bobbepalli';
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) throw new Error('GitHub API failed');

        const data = await response.json();

        // Update DOM elements with real data
        updateStat('gh-repos', data.public_repos);
        updateStat('gh-followers', data.followers);
        updateStat('gh-following', data.following);

    } catch (error) {
        console.log('Using fallback data');
        // Fallback to static values if API fails
        updateStat('gh-repos', '25+');
        updateStat('gh-followers', '15+');
        updateStat('gh-following', '10+');
    }
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) {
        // Animate the number
        el.textContent = value;
        el.classList.add('fade-in');
    }
}

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Minimum display time for preloader
    const minDisplayTime = 2000;
    const startTime = Date.now();

    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';

            // Remove preloader from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, remainingTime);
    });
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || window.matchMedia('(hover: none)').matches) return;

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Ring follows with delay (smooth)
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .tech-badge');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    // Click effect
    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));
}

/**
 * Theme Toggle
 */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update neural network colors
        updateNeuralNetworkTheme(newTheme);
    });
}

function updateNeuralNetworkTheme(theme) {
    // This will be handled by the particles.js if needed
    const event = new CustomEvent('themeChange', { detail: { theme } });
    window.dispatchEvent(event);
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);
    }

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Text Scramble Effect
 */
function initTextScramble() {
    const elements = document.querySelectorAll('.scramble-text');

    elements.forEach(el => {
        const originalText = el.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#________';

        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                el.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        });
    });
}

/**
 * Floating Social Links and Email
 */
function initFloatingElements() {
    // Create floating socials
    const floatingSocials = document.createElement('div');
    floatingSocials.className = 'floating-socials';
    floatingSocials.innerHTML = `
        <a href="https://github.com/thanuja-bobbepalli" target="_blank" aria-label="GitHub">
            <i class="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/thanuja-bobbepalli-289651253/" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
        </a>
        <a href="mailto:thanujabobbepalli@gmail.com" aria-label="Email">
            <i class="fas fa-envelope"></i>
        </a>
    `;
    document.body.appendChild(floatingSocials);

    // Create floating email
    const floatingEmail = document.createElement('div');
    floatingEmail.className = 'floating-email';
    floatingEmail.innerHTML = `
        <a href="mailto:thanujabobbepalli@gmail.com">thanujabobbepalli@gmail.com</a>
    `;
    document.body.appendChild(floatingEmail);
}

/**
 * Matrix Rain Effect (Optional - runs in background)
 */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height / fontSize;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff8830';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Run at lower framerate for performance
    setInterval(draw, 50);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger skill bars animation
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }

                // Trigger counter animation
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-content, .skill-category, .project-card, ' +
        '.timeline-item, .cert-card, .stat-card, .contact-content'
    );

    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Skill bars animation
 */
function initSkillBars() {
    // This is handled by scroll observer
}

function animateSkillBars(container) {
    const skillItems = container.querySelectorAll('.skill-item');

    skillItems.forEach((item, index) => {
        const progress = item.querySelector('.skill-progress');
        const skillLevel = item.getAttribute('data-skill');

        setTimeout(() => {
            progress.style.width = `${skillLevel}%`;
        }, index * 100);
    });
}

/**
 * Counter animation
 */
function initCounters() {
    // This is handled by scroll observer
}

function animateCounter(element) {
    if (!element || element.classList.contains('counted')) return;

    element.classList.add('counted');
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            // Add + sign for large numbers
            if (target >= 100) {
                element.textContent = target + '+';
            }
        }
    };

    updateCounter();
}

/**
 * Terminal typing effect
 */
function initTerminalTyping() {
    const terminalOutput = document.getElementById('terminal-output');
    const typingCmd = document.getElementById('typing-cmd');

    if (!terminalOutput || !typingCmd) return;

    // Hide output initially
    terminalOutput.style.opacity = '0';
    terminalOutput.style.transform = 'translateY(20px)';

    // Show output after typing animation
    setTimeout(() => {
        terminalOutput.style.transition = 'all 0.5s ease';
        terminalOutput.style.opacity = '1';
        terminalOutput.style.transform = 'translateY(0)';
    }, 2500);

    // Add interactive terminal commands (Easter egg)
    addTerminalInteractivity();
}

function addTerminalInteractivity() {
    // Easter egg: Press Ctrl+` to open interactive terminal
    let terminalActive = false;

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleInteractiveTerminal();
        }
    });
}

function toggleInteractiveTerminal() {
    let terminal = document.getElementById('interactive-terminal');

    if (!terminal) {
        // Create interactive terminal
        terminal = document.createElement('div');
        terminal.id = 'interactive-terminal';
        terminal.innerHTML = `
            <div class="interactive-terminal-window">
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span class="btn-close" onclick="closeInteractiveTerminal()"></span>
                        <span class="btn-minimize"></span>
                        <span class="btn-maximize"></span>
                    </div>
                    <span class="terminal-title">thanuja@portfolio:~ (interactive)</span>
                </div>
                <div class="terminal-body">
                    <div class="terminal-output-interactive" id="terminal-output-interactive">
                        <p>Welcome to Thanuja's interactive terminal!</p>
                        <p>Type 'help' for available commands.</p>
                    </div>
                    <div class="terminal-input-line">
                        <span class="prompt">thanuja@ai:~$</span>
                        <input type="text" id="terminal-input" autocomplete="off" autofocus>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #interactive-terminal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                width: 90%;
                max-width: 600px;
            }
            .interactive-terminal-window {
                background: #0a0a0f;
                border: 1px solid #2a2a3a;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
            }
            .terminal-output-interactive {
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
                color: #e0e0e0;
            }
            .terminal-output-interactive p {
                margin-bottom: 5px;
            }
            .terminal-input-line {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-top: 1px solid #2a2a3a;
            }
            #terminal-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #00d4ff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
                outline: none;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(terminal);

        // Add input handler
        const input = document.getElementById('terminal-input');
        input.addEventListener('keypress', handleTerminalCommand);
        input.focus();
    } else {
        terminal.style.display = terminal.style.display === 'none' ? 'block' : 'none';
        if (terminal.style.display === 'block') {
            document.getElementById('terminal-input').focus();
        }
    }
}

function closeInteractiveTerminal() {
    const terminal = document.getElementById('interactive-terminal');
    if (terminal) {
        terminal.style.display = 'none';
    }
}

function handleTerminalCommand(e) {
    if (e.key !== 'Enter') return;

    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output-interactive');
    const command = input.value.trim().toLowerCase();

    // Add command to output
    output.innerHTML += `<p><span style="color: #00ff88;">$</span> ${input.value}</p>`;

    // Process command
    let response = '';

    switch (command) {
        case 'help':
            response = `
                Available commands:<br>
                - whoami: About me<br>
                - skills: My tech stack<br>
                - projects: List projects<br>
                - contact: Contact info<br>
                - social: Social links<br>
                - clear: Clear terminal<br>
                - exit: Close terminal<br>
                - sudo hire: 😉
            `;
            break;
        case 'whoami':
            response = 'Thanuja Bobbepalli - AI/ML Engineer building intelligent systems';
            break;
        case 'skills':
            response = 'Python, PyTorch, LangChain, FastAPI, Qdrant, Livekit, Docker...';
            break;
        case 'projects':
            response = '1. RAG Chatbot<br>2. Pneumonia Detection CNN<br>3. Insurance API<br>4. Voice AI Backend';
            break;
        case 'contact':
            response = 'Email: thanujabobbepalli@gmail.com<br>Phone: +91 8977245422';
            break;
        case 'social':
            response = 'GitHub: github.com/thanuja-bobbepalli<br>LinkedIn: https://www.linkedin.com/in/thanuja-bobbepalli-289651253/';
            break;
        case 'clear':
            output.innerHTML = '';
            input.value = '';
            return;
        case 'exit':
            closeInteractiveTerminal();
            return;
        case 'sudo hire':
            response = '🎉 Great choice! Email me at thanujabobbepalli@gmail.com!';
            break;
        default:
            response = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    output.innerHTML += `<p style="color: #a0a0a0;">${response}</p>`;
    output.scrollTop = output.scrollHeight;
    input.value = '';
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Project cards interactive effects
 */
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
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
    });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add preloader


// Console Easter Egg
console.log(`
%c

████████╗██╗  ██╗ █████╗ ███╗   ██╗██╗   ██╗     ██╗ █████╗ 
╚══██╔══╝██║  ██║██╔══██╗████╗  ██║██║   ██║     ██║██╔══██╗
   ██║   ███████║███████║██╔██╗ ██║██║   ██║     ██║███████║
   ██║   ██╔══██║██╔══██║██║╚██╗██║██║   ██║██   ██║██╔══██║
   ██║   ██║  ██║██║  ██║██║ ╚████║╚██████╔╝╚█████╔╝██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝

Hey there, fellow developer! 👋
Curious about the code? Check out my GitHub!
Press Ctrl+\` for a fun surprise!

`, 'color: #00ff88; font-family: monospace;');


/**
 * Initialize GitHub Calendar
 */
function initGitHubGraph() {
    // wait for library to load
    if (typeof GitHubCalendar !== 'function') {
        setTimeout(initGitHubGraph, 500);
        return;
    }

    GitHubCalendar(".calendar", "thanuja-bobbepalli", {
        responsive: true,
        tooltips: true,
        global_stats: false // Hide text stats as we use our own
    }).then(function () {
        // Animation effect for cells
        const cells = document.querySelectorAll('.calendar rect.ContributionCalendar-day');
        cells.forEach((cell, index) => {
            cell.style.opacity = '0';
            setTimeout(() => {
                cell.style.opacity = '1';
                cell.style.transition = 'opacity 0.2s';
            }, index * 2);
        });
    }).catch(e => {
        console.error("Calendar failed to load", e);
        document.querySelector('.calendar').innerHTML =
            '<p style="color:var(--text-muted); text-align:center;">Graph unavailable (API proxy limit)</p>';
    });
}
/**
 * Initialize Clipboard Copy
 */
function initClipboard() {
    const emailBtns = document.querySelectorAll('.copy-email-btn');
    const email = 'thanujabobbepalli@gmail.com';
    const toast = document.getElementById('toast');

    emailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Allow default mailto action, but also copy

            navigator.clipboard.writeText(email).then(() => {
                showToast();
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });

    function showToast() {
        if (!toast) return;
        toast.className = "toast show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    }
}

/**
 * Dynamic Experience Loader
 */
async function initExperience() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();
        
        // Clear hardcoded content
        timeline.innerHTML = '';

        data.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${item.type === 'education' ? 'education' : ''} reveal`;
            
            let achievementsHtml = '';
            if (item.achievements) {
                achievementsHtml = `
                    <div class="achievements">
                        ${item.achievements.map(a => `<span class="achievement"><i class="fas fa-trophy"></i> ${a}</span>`).join('')}
                    </div>
                `;
            }

            let techHtml = '';
            if (item.tech) {
                techHtml = `
                    <div class="timeline-tech">
                        ${item.tech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                `;
            }

            timelineItem.innerHTML = `
                <div class="timeline-marker">
                    <i class="fas ${item.icon || 'fa-briefcase'}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">${item.title}</h3>
                        <span class="timeline-company">${item.company}</span>
                    </div>
                    <span class="timeline-date">${item.date}</span>
                    <p class="timeline-description">${item.description}</p>
                    ${techHtml}
                    ${achievementsHtml}
                </div>
            `;
            timeline.appendChild(timelineItem);
        });

        // Re-run scroll animations for new elements
        if (typeof initScrollAnimations === 'function') {
            initScrollAnimations();
        }

    } catch (error) {
        console.error('Error loading experience:', error);
        if (timeline) {
            timeline.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 20px; color: var(--accent);">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Experience data blocked by browser security.</p>
                </div>
            `;
        }
    }
}

/**
 * Dynamic Stats Loader for About Section
 */
async function updateAboutStats() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) return;
        const projects = await response.json();
        
        const projectCountEl = document.getElementById('projects-count');
        if (projectCountEl) {
            projectCountEl.setAttribute('data-target', projects.length);
            // If the animation already ran (showing 0), we re-trigger it
            projectCountEl.classList.remove('counted');
            animateCounter(projectCountEl);
        }

    } catch (error) {
        console.error('Error updating stats:', error);
    }
}
