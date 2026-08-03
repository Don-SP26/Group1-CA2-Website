const nowPlayingToastEl = document.getElementById('nowPlayingToast');
const nowPlayingText = document.getElementById('nowPlayingText');

const nowPlayingToast = nowPlayingToastEl
    ? new bootstrap.Toast(nowPlayingToastEl, { delay: 3000 })
    : null;

function showNowPlaying(title) {
    if (!nowPlayingToast) return;

    nowPlayingText.textContent = title;
    nowPlayingToast.show();
}