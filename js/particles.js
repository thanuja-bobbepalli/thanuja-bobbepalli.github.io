/**
 * Neural Network Particle Background
 * Creates an animated network of connected particles
 */

class NeuralNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        
        // Configuration
        this.config = {
            particleCount: 80,
            particleSize: { min: 1, max: 3 },
            particleSpeed: 0.5,
            connectionDistance: 150,
            mouseInteraction: true,
            colors: {
                particle: '#00ff88',
                connection: 'rgba(0, 255, 136, 0.15)',
                connectionHover: 'rgba(0, 212, 255, 0.3)'
            }
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const count = this.config.particleCount;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                speedX: (Math.random() - 0.5) * this.config.particleSpeed,
                speedY: (Math.random() - 0.5) * this.config.particleSpeed,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        if (this.config.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
                
                // Update cursor glow position
                const cursorGlow = document.querySelector('.cursor-glow');
                if (cursorGlow) {
                    cursorGlow.style.left = e.x + 'px';
                    cursorGlow.style.top = e.y + 'px';
                }
            });
            
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.colors.particle;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    
                    // Check if near mouse
                    let isNearMouse = false;
                    if (this.mouse.x && this.mouse.y) {
                        const mouseDistI = Math.sqrt(
                            Math.pow(this.particles[i].x - this.mouse.x, 2) +
                            Math.pow(this.particles[i].y - this.mouse.y, 2)
                        );
                        const mouseDistJ = Math.sqrt(
                            Math.pow(this.particles[j].x - this.mouse.x, 2) +
                            Math.pow(this.particles[j].y - this.mouse.y, 2)
                        );
                        isNearMouse = mouseDistI < this.mouse.radius || mouseDistJ < this.mouse.radius;
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = isNearMouse 
                        ? this.config.colors.connectionHover 
                        : this.config.colors.connection;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.lineWidth = isNearMouse ? 1.5 : 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    updateParticles() {
        for (let particle of this.particles) {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Mouse interaction - push particles away
            if (this.mouse.x && this.mouse.y) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.x += Math.cos(angle) * force * 2;
                    particle.y += Math.sin(angle) * force * 2;
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        
        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
        
        this.updateParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork('neural-bg');
});




