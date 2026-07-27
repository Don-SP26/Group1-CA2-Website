const filterButtons = document.querySelectorAll('.genre-filter-btn');
const filterableCards = document.querySelectorAll('.album-card'); // renamed

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedGenre = btn.dataset.genre;

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        filterableCards.forEach(card => {
            const cardGenre = card.dataset.genre;

            if (selectedGenre === 'all' || cardGenre === selectedGenre) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});