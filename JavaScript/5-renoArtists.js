const artists = [
  {
    name: "Regina Song",
    initials: "RS",
    meta: "Pop / Indie Pop · Singapore · Since 2021",
    bio: "A Singaporean singer-songwriter who began classical piano training as a child and studied at the School of the Arts, Singapore before debuting in 2021, building an international fanbase through songs like \"the cutest pair\" from her debut album, fangirl."
  },
  {
    name: "IU",
    initials: "IU",
    meta: "K-Pop / Ballad · South Korea · Since 2008",
    bio: "Debuted as a young solo artist in Korea's idol system and grew into one of the country's most respected singer-songwriters, moving fluidly between ballads, pop, and acting."
  },
  {
    name: "Bruno Mars",
    initials: "BM",
    meta: "Pop / Funk / R&B · USA · Since 2004",
    bio: "A Hawaii-raised multi-instrumentalist who started writing hits for other artists before stepping into the spotlight, blending funk, soul, and retro showmanship into his own sound."
  },
  {
    name: "Ado",
    initials: "AD",
    meta: "J-Pop / Vocaloid · Japan · Since 2020",
    bio: "Emerged from Japan's Vocaloid and utaite online singing community, performing without showing her face, and quickly became a defining voice of a new generation of Japanese pop."
  },
  {
    name: "G-Dragon",
    initials: "GD",
    meta: "K-Pop / Hip-Hop · South Korea · Since 2006",
    bio: "As leader of a pioneering K-pop group, he became known as a producer and trendsetter as much as a performer, shaping the genre's sound and fashion well beyond his own releases."
  },
  {
    name: "Taylor Swift",
    initials: "TS",
    meta: "Pop / Country · USA · Since 2006",
    bio: "Started as a teenage country singer-songwriter in Nashville and grew into one of the best-selling recording artists of all time, known for narrative songwriting and reinventing her sound album to album."
  }
];

const grid = document.getElementById('grid');

artists.forEach((a, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="avatar" style="background: linear-gradient(160deg, ${i % 2 === 0 ? 'rgba(232,184,75,0.22)' : 'rgba(196,83,107,0.22)'}, rgba(28,25,31,0.9));">
      <div class="initials">${a.initials}</div>
    </div>
    <div class="perf"></div>
    <div class="stub-info">
      <div class="name">${a.name}</div>
      <div class="meta">${a.meta}</div>
    </div>
    <button class="expand-btn">
      <span>Expand</span><span class="chev">⌄</span>
    </button>
    <div class="bio"><strong>The journey:</strong> ${a.bio}</div>
  `;
  card.querySelector('.expand-btn').addEventListener('click', () => {
    card.classList.toggle('open');
  });
  grid.appendChild(card);
});