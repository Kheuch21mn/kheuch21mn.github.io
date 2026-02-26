// script.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const interactiveElements = document.querySelectorAll('a, button, .hover-effect');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Retard subtil pour le follower
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 80);
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('expand');
                cursorFollower.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('expand');
                cursorFollower.style.opacity = '1';
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.fade-up, .fade-in');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Ne joue l'animation qu'une fois
            }
        });
    };

    const revealOptions = {
        threshold: 0.1, // Déclenche quand 10% de l'élément est visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Matrix / Particles Background Effect on Canvas
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const initCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];

            // Créer les particules
            const numParticles = Math.floor(width * height / 15000);
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    color: Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6'
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.5;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = 1 - (dist / 120); // Fade out lines based on distance
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawParticles);
        };

        initCanvas();
        drawParticles();

        window.addEventListener('resize', initCanvas);
    }
});
