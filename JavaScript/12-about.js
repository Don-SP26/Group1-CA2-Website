/* ================================================================
   Sections:
   1. Setup — grab elements, bail out if the page has no playlist
   2. Shuffle button click handler
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. SETUP */
  const shuffleBtn = document.getElementById("shuffleBtn");
  const playlistRow = document.getElementById("playlistRow");

  // Guard clause: skip everything below if this page has no shuffle
  // button or no playlist row to shuffle
  if (!shuffleBtn || !playlistRow) return;


  /* 2. SHUFFLE BUTTON CLICK HANDLER */
  shuffleBtn.addEventListener("click", () => {
    const items = Array.from(playlistRow.querySelectorAll(".playlist-item"));

    // Fisher-Yates shuffle: walks the array backwards, swapping each
    // item with a random earlier (or same) item, so every possible
    // order is equally likely
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Re-append in the new random order — physically moves each element
    // node within its parent (this is why appendChild is used here rather
    // than a CSS order/transform trick — appendChild on a node that's
    // already in the DOM moves it instead of duplicating it)
    items.forEach(item => playlistRow.appendChild(item));

    // Brief pulse so the reorder is visible even to someone not tracking
    // the layout change closely
    playlistRow.classList.add("shuffle-pulse");
    setTimeout(() => playlistRow.classList.remove("shuffle-pulse"), 300);
  });
});