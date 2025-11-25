// Theme toggle
const t = document.getElementById('theme');
const h = document.documentElement;
const update = () => {
    const isLight = h.getAttribute('data-theme') === 'light';
    t.textContent = isLight ? 'switch to dark' : 'switch to light';
};
update();
t.onclick = () => {
    const current = h.getAttribute('data-theme') === 'light';
    h.setAttribute('data-theme', current ? 'dark' : 'light');
    localStorage.setItem('theme', current ? 'dark' : 'light');
    update();
};

// Cursor trail (osu disjoint trail - time-based spawn, linear fade)
// Only on devices with hover (mouse/trackpad), not touch
if (window.matchMedia('(hover: hover)').matches) {
    const trailPool = [];
    const maxTrails = 50;
    const fadeDuration = 150;
    const trailInterval = 1000 / 60;
    let lastTrailTime = 0;
    let mouseX = 0, mouseY = 0;

    function spawnTrail(x, y) {
        let trail = trailPool.find(t => !t.active);
        if (!trail) {
            if (trailPool.length >= maxTrails) return;
            const el = document.createElement('div');
            el.className = 'cursor-trail';
            document.body.appendChild(el);
            trail = { el, active: false };
            trailPool.push(trail);
        }
        trail.active = true;
        trail.spawnTime = performance.now();
        trail.el.style.left = x - 24 + 'px';
        trail.el.style.top = y - 24 + 'px';
        trail.el.style.opacity = 1;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        const now = performance.now();

        if (now - lastTrailTime >= trailInterval) {
            spawnTrail(mouseX, mouseY);
            lastTrailTime = now;
        }

        trailPool.forEach(trail => {
            if (trail.active) {
                const elapsed = now - trail.spawnTime;
                const progress = Math.min(elapsed / fadeDuration, 1);
                const opacity = 1 - progress;
                if (progress >= 1) {
                    trail.active = false;
                    trail.el.style.opacity = 0;
                } else {
                    trail.el.style.opacity = opacity;
                }
            }
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}
