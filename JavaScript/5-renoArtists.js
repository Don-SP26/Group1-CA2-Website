// 1. Artist Data
const artistData = {
  regina: {
    name: "REGINA SONG",
    meta: "POP / INDIE POP · SINGAPORE",
    description: "Singaporean singer-songwriter known for her intimate, viral melodies capturing modern girlhood and relationship experiences.",
    songs:[
    {
        title: "the cutest pair",
        background: "This is where the background of the song will go.",
        trivia: "This is where an interesting trivia fact will go.",
        spotify: "https://open.spotify.com/embed/track/0VVD95cRAppHSOGPYrfIG2?utm_source=generator&si=8cbcc59309fd4ddb"
    },

    {
        title: "fangirl",
        background: "This is where the background of the song will go.",
        trivia: "This is where an interesting trivia fact will go.",
        spotify: "YOUR-SPOTIFY-LINK-HERE"
    },

    {
        title: "Before i leave",
        background: "This is where the background of the song will go.",
        trivia: "This is where an interesting trivia fact will go.",
        spotify: "YOUR-SPOTIFY-LINK-HERE"
    },

    {
        title: "everland",
        background: "This is where the background of the song will go.",
        trivia: "This is where an interesting trivia fact will go.",
        spotify: "YOUR-SPOTIFY-LINK-HERE"
    }
]
  },
  iu: {
    name: "IU",
    meta: "K-POP / BALLAD · SOUTH KOREA",
    description: "Renowned South Korean singer, songwriter, and actress celebrated for her versatile vocal range, poetic lyrics, and chart-topping releases.",
    songs: ["BBIBBI", "Palette (feat. G-Dragon)", "Through the Night", "Celebrity"]
  },
  brunomars: {
    name: "BRUNO MARS",
    meta: "POP / R&B · USA",
    description: "Grammy award-winning singer-songwriter and producer famed for his retro showmanship, funk-infused rhythms, and worldwide hits.",
    songs: ["Uptown Funk", "Just the Way You Are", "Locked Out of Heaven", "24K Magic"]
  },
  ado: {
    name: "ADO",
    meta: "J-POP / UTAITE · JAPAN",
    description: "Japanese vocal phenomenon known for her powerful, dramatic vocal style and global hits across anime and J-pop charts.",
    songs: ["Usseewa", "New Genesis", "Odo", "Show", "Gira Gira"]
  },
  gdragon: {
    name: "G-DRAGON",
    meta: "K-POP / HIP-HOP · SOUTH KOREA",
    description: "Iconic leader of BIGBANG, rapper, and producer widely recognized as the 'King of K-Pop' and a global fashion icon.",
    songs: ["Untitled, 2014", "Crooked", "Crayon", "POWER", "One Of A Kind"]
  },
  taylorswift: {
    name: "TAYLOR SWIFT",
    meta: "POP / COUNTRY · USA",
    description: "Global superstar and multi-Grammy winner renowned for her narrative songwriting across country, pop, and indie folk genres.",
    songs: ["Cruel Summer", "Blank Space", "Anti-Hero", "Love Story", "All Too Well"]
  }
};

// 2. Inject Modal CSS dynamically via JS
const modalStyles = `
  .js-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 1000;
  }
  .js-modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .js-modal-card {
    background: #141318;
    border: 1px solid #2e2a3b;
    border-radius: 16px;
    width: 90%;
    max-width: 480px;
    padding: 28px;
    position: relative;
    transform: translateY(20px);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  }
  .js-modal-overlay.active .js-modal-card {
    transform: translateY(0);
  }
  .js-modal-close {
    position: absolute;
    top: 15px; right: 20px;
    background: none; border: none;
    color: #888; font-size: 1.8rem;
    cursor: pointer; transition: color 0.2s;
  }
  .js-modal-close:hover { color: #d4af37; }
  .js-modal-title { font-size: 1.4rem; color: #fff; letter-spacing: 2px; margin-bottom: 4px; }
  .js-modal-meta { font-size: 0.7rem; color: #d4af37; letter-spacing: 1px; margin-bottom: 18px; }
  .js-modal-section-title { font-size: 0.75rem; color: #aaa; letter-spacing: 1px; margin: 16px 0 8px; border-bottom: 1px solid #22202a; padding-bottom: 4px; }
  .js-modal-desc { font-size: 0.85rem; color: #ccc; line-height: 1.5; }
  .js-song-list { list-style: none; padding: 0; margin: 0; }
  .js-song-list li {
    font-size: 0.8rem; color: #e0e0e0;
    padding: 8px 12px; background: #1a1921;
    margin-bottom: 6px; border-radius: 6px;
    display: flex; align-items: center;
  }
  .js-song-list li::before { content: "▶"; font-size: 0.55rem; color: #d4af37; margin-right: 10px; }
`;

const styleElement = document.createElement("style");
styleElement.textContent = modalStyles;
document.head.appendChild(styleElement);

// 3. Create Modal Elements dynamically in DOM
const modalOverlay = document.createElement("div");
modalOverlay.className = "js-modal-overlay";
modalOverlay.innerHTML = `
  <div class="js-modal-card">
    <button class="js-modal-close">&times;</button>
    <h2 class="js-modal-title"></h2>
    <p class="js-modal-meta"></p>
    <div class="js-modal-section-title">ABOUT THE ARTIST</div>
    <p class="js-modal-desc"></p>
    <div class="js-modal-section-title">TOP TRACKS</div>
    <ul class="js-song-list"></ul>
  </div>
`;
document.body.appendChild(modalOverlay);

// 4. Modal References & Handlers
const closeBtn = modalOverlay.querySelector(".js-modal-close");
const titleEl = modalOverlay.querySelector(".js-modal-title");
const metaEl = modalOverlay.querySelector(".js-modal-meta");
const descEl = modalOverlay.querySelector(".js-modal-desc");
const songListEl = modalOverlay.querySelector(".js-song-list");

function openModal(artistKey) {
  const data = artistData[artistKey];
  if (!data) return;

  titleEl.textContent = data.name;
  metaEl.textContent = data.meta;
  descEl.textContent = data.description;

  songListEl.innerHTML = data.songs
    .map(song => {

        if (typeof song === "string") {
            return `<li>${song}</li>`;
        }

        return `<li>${song.title}</li>`;

    })
    .join("");

  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

// 5. Attach Click Events to Cards & Modal
document.querySelectorAll(".expand-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const artistKey = btn.getAttribute("data-artist");
    openModal(artistKey);
  });
});

closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});