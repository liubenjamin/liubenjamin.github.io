// Theme toggle
const t = document.getElementById('theme');
const h = document.documentElement;
if (t) {
    const getTheme = () => h.getAttribute('data-theme') || 'dark';
    const update = () => {
        t.textContent = getTheme() === 'light' ? 'switch to dark' : 'switch to light';
    };
    update();
    t.onclick = () => {
        const newTheme = getTheme() === 'light' ? 'dark' : 'light';
        h.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        update();
    };
}

// Cursor trail (osu disjoint trail - time-based spawn, linear fade)
// Only on devices with hover (mouse/trackpad), not touch
if (window.matchMedia('(hover: hover)').matches) {
    const trailPool = [];
    const maxTrails = 50;
    const fadeDuration = 150;
    const trailInterval = 1000 / 60;
    let lastTrailTime = 0;
    let mouseX = 0, mouseY = 0;
    let hasMoved = false;

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
        trail.el.style.left = x - 28 + 'px';
        trail.el.style.top = y - 28 + 'px';
        trail.el.style.opacity = 1;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        hasMoved = true;
    });

    function animateTrail() {
        const now = performance.now();

        if (hasMoved && now - lastTrailTime >= trailInterval) {
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
