const modalBackdrop = document.querySelector('.album-modal-backdrop');
const modalClose = document.querySelector('.album-modal-close');
const modalCover = document.querySelector('.album-modal-cover');
const modalTitle = document.querySelector('.album-modal-title');
const modalArtist = document.querySelector('.album-modal-artist');
const modalDescription = document.querySelector('.album-modal-description');
const modalTrackList = document.querySelector('.album-modal-track-list');
const modalPlayer = document.querySelector('.album-modal-player');

const albumCards = document.querySelectorAll('.album-card');

albumCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

function openModal(card) {
    const title = card.dataset.title;
    const artist = card.dataset.artist;
    const cover = card.dataset.cover;
    const description = card.dataset.description;
    const tracks = JSON.parse(card.dataset.tracks);

    modalCover.src = cover;
    modalCover.alt = title;
    modalTitle.textContent = title;
    modalArtist.textContent = artist;

    modalDescription.innerHTML = description
        .split('\\n\\n')
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');

    // Build the tracklist with expandable info rows
    modalTrackList.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.classList.add('track-row');

        const backgroundHtml = (track.background || '')
            .split('\\n\\n')
            .map(p => `<p>${p}</p>`)
            .join('');

        const triviaHtml = (track.trivia || '')
            .split('\\n\\n')
            .map(p => `<p>${p}</p>`)
            .join('');

        li.innerHTML = `
            <div class="track-row-main">
                <span class="track-title">${track.title}</span>
                <button class="track-expand-btn" aria-label="Show song info">▾</button>
            </div>
            <div class="track-row-details">
                <div class="track-info-scroll">
                    ${track.background ? `<h6>Background</h6>${backgroundHtml}` : ''}
                    ${track.trivia ? `<h6>Trivia</h6>${triviaHtml}` : ''}
                    ${track.lyricsUrl ? `<a href="${track.lyricsUrl}" target="_blank" rel="noopener noreferrer" class="track-lyrics-link">View full lyrics on Genius ↗</a>` : ''}
                </div>
            </div>
        `;

        li.querySelector('.track-title').addEventListener('click', () => playTrack(track.embed, li));

        li.querySelector('.track-expand-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            li.classList.toggle('expanded');
        });

        modalTrackList.appendChild(li);

        if (index === 0) {
            playTrack(track.embed, li);
        }
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function playTrack(embedUrl, li) {
    document.querySelectorAll('.album-modal-track-list li').forEach(item => {
        item.classList.remove('playing');
    });

    li.classList.add('playing');
    modalPlayer.src = embedUrl;
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    modalPlayer.src = '';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});