const modalBackdrop = document.querySelector('.artist-modal-backdrop');
const modalClose = document.querySelector('.artist-modal-close');
const modalImage = document.querySelector('.artist-modal-image');
const modalName = document.querySelector('.artist-modal-name');
const modalDescription = document.querySelector('.artist-modal-description');
const modalSongList = document.querySelector('.artist-modal-song-list');
const modalPlayer = document.querySelector('.artist-modal-player');

const artistCards = document.querySelectorAll('.genre-artist-card');

artistCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

function openModal(card) {
    const name = card.dataset.name;
    const image = card.dataset.image;
    const description = card.dataset.description;
    const songs = JSON.parse(card.dataset.songs);

    modalImage.src = image;
    modalImage.alt = name;
    modalName.textContent = name;
    modalDescription.innerHTML = description
    .split('\\n\\n')
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('');

    // Rebuild the song list for this artist
    modalSongList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.addEventListener('click', () => playSong(song.embed, li));
        modalSongList.appendChild(li);

        // Auto-select the first song so the modal isn't empty on open
        if (index === 0) {
            playSong(song.embed, li);
        }
    });

    modalBackdrop.classList.add('open');
}

function playSong(embedUrl, li) {
    document.querySelectorAll('.artist-modal-song-list li').forEach(item => {
        item.classList.remove('playing');
    });

    li.classList.add('playing');
    modalPlayer.src = embedUrl;

    showNowPlaying(li.textContent);
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    modalPlayer.src = '';
}

modalClose.addEventListener('click', closeModal);

// Close if clicking the dark backdrop itself (not the modal box)
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});