const exploreWrapper = document.querySelector('.nav-explore');
const exploreBtn = document.querySelector('.explore-btn');

exploreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exploreWrapper.classList.toggle('open');
});

// Close the menu if someone clicks anywhere else on the page
document.addEventListener('click', (e) => {
    if (!exploreWrapper.contains(e.target)) {
        exploreWrapper.classList.remove('open');
    }
});

// Close on Escape key, for keyboard users
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        exploreWrapper.classList.remove('open');
    }
});