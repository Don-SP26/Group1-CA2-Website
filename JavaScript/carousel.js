const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dots button');
let current = 0;
let autoplay;

// Put the first slide in position on load
slides[current].style.transform = 'translateX(0)';
slides[current].classList.add('active');

function getDirection(from, to, length) {
    const diff = to - from;
    if (diff === 1 || diff === -(length - 1)) return 1;   // moving forward
    if (diff === -1 || diff === (length - 1)) return -1;  // moving backward
    return diff > 0 ? 1 : -1; // fallback for multi-step jumps
}

function goToSlide(newIndex) {
    if (newIndex === current) return;

    const direction = getDirection(current, newIndex, slides.length);
    const outgoing = slides[current];
    const incoming = slides[newIndex];

    // Place incoming slide off-screen on the correct side, instantly (no transition)
    incoming.style.transition = 'none';
    incoming.style.transform = `translateX(${direction === 1 ? '100%' : '-100%'})`;
    incoming.offsetHeight; // force reflow so the browser applies the position above before animating
    incoming.style.transition = '';

    // Animate: outgoing slides out one way, incoming slides in from the other
    requestAnimationFrame(() => {
        outgoing.style.transform = `translateX(${direction === 1 ? '-100%' : '100%'})`;
        incoming.style.transform = 'translateX(0)';
    });

    outgoing.classList.remove('active');
    incoming.classList.add('active');

    dots[current].classList.remove('active');
    dots[newIndex].classList.add('active');

    current = newIndex;
}

function nextSlide() {
    goToSlide((current + 1) % slides.length);
}

function startAutoplay() {
    autoplay = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    clearInterval(autoplay);
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoplay();
        goToSlide(parseInt(dot.dataset.slide));
        startAutoplay();
    });
});

startAutoplay();