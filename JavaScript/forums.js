// --- Small helpers ---
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Deterministic hash so the same text always produces the same colour
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return hash;
}

// Turns any seed string (song+artist, or a username) into a two-tone
// gradient, so every post gets a unique "album art" swatch with no
// image upload needed.
function artGradientFor(seed) {
  const hash = Math.abs(hashString(seed));
  const hue1 = hash % 360;
  const hue2 = (hue1 + 42) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 65% 42%), hsl(${hue2} 60% 28%))`;
}

function paintArt(el) {
  const seed = el.dataset.artSeed || "record room";
  el.style.background = artGradientFor(seed);
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

function refreshTimeLabels() {
  document.querySelectorAll(".post-time").forEach(el => {
    const ts = parseInt(el.dataset.timestamp, 10);
    if (!isNaN(ts)) el.textContent = timeAgo(ts);
  });
}

function updateStats() {
  const posts = document.querySelectorAll("#posts .post");
  const statPosts = document.getElementById("statPosts");
  const statLikes = document.getElementById("statLikes");
  if (!statPosts || !statLikes) return;

  let totalLikes = 0;
  posts.forEach(post => {
    const likeSpan = post.querySelector(".like-count");
    totalLikes += likeSpan ? parseInt(likeSpan.textContent, 10) || 0 : 0;
  });

  statPosts.textContent = posts.length;
  statLikes.textContent = totalLikes;
}

// --- Character Counter ---
const commentsBox = document.getElementById("comments");
const charCount = document.getElementById("charCount");

commentsBox.addEventListener("input", () => {
  const length = commentsBox.value.length;
  charCount.textContent = `${length} / 300`;
  charCount.style.color = length > 250 ? "#ff9f4a" : "#93939c";
});

// --- CAPTCHA Setup ---
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  document.getElementById("captchaQuestion").textContent = `What is ${a} + ${b}?`;
  return a + b;
}

let correctAnswer = generateCaptcha();

function resetCaptcha() {
  correctAnswer = generateCaptcha();
  document.getElementById("captchaAnswer").value = "";
}

// --- Show Modal on Form Submit ---
document.getElementById("postForm").addEventListener("submit", e => {
  e.preventDefault();
  resetCaptcha();
  const modal = new bootstrap.Modal(document.getElementById("verifyModal"));
  modal.show();
});

// --- Add New Post ---
function addPost(username, song, artist, comment) {
  const timestamp = Date.now();
  const artSeed = `${song} ${artist}`;

  const postDiv = document.createElement("article");
  postDiv.classList.add("post", "rounded-3", "p-3", "mb-3", "d-flex", "gap-3");
  postDiv.dataset.timestamp = timestamp;

  postDiv.innerHTML = `
    <div class="post-art rounded-3 flex-shrink-0" data-art-seed="${escapeHtml(artSeed)}" aria-hidden="true"></div>
    <div class="post-body flex-grow-1 min-w-0">
      <div class="post-top d-flex align-items-baseline justify-content-between gap-2">
        <h4 class="post-user mb-0 small">${escapeHtml(username)}</h4>
        <time class="post-time small text-nowrap" data-timestamp="${timestamp}">just now</time>
      </div>
      <p class="post-comment small mb-0">🎵 ${escapeHtml(song)} — ${escapeHtml(artist)}<br>${escapeHtml(comment)}</p>
      <div class="post-actions d-flex gap-2 mt-2">
        <button class="like-btn btn rounded-pill d-inline-flex align-items-center gap-2 small px-3 py-1 border" type="button">
          <svg class="icon-heart" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.4 5.1c2.4-1.2 5 .1 6.6 2.4 1.6-2.3 4.2-3.6 6.6-2.4 3 1.5 3.6 5 1.7 7.8C18.7 16.65 12 21 12 21z"/></svg>
          <span class="like-count">0</span>
        </button>
        <button class="comment-btn btn rounded-pill d-inline-flex align-items-center gap-2 small px-3 py-1 border" type="button">
          <svg class="icon-comment" viewBox="0 0 24 24" width="16" height="16"><path d="M4 4h16v12H8l-4 4V4z"/></svg>
          <span class="comment-count">0</span>
        </button>
      </div>
      <div class="comments mt-2 ps-3 border-start border-2"></div>
    </div>
  `;

  document.getElementById("posts").prepend(postDiv);
  paintArt(postDiv.querySelector(".post-art"));
  updateStats();
  refreshTimeLabels();
}


// --- Handle Verification ---
document.getElementById("verifyBtn").addEventListener("click", () => {
  const userAnswerField = document.getElementById("captchaAnswer").value.trim();
  const captchaMsg = document.getElementById("captchaMessage");
  captchaMsg.textContent = "";

  if (!userAnswerField) {
    captchaMsg.textContent = "❌ Please fill in the answer to the math question.";
    captchaMsg.style.color = "#ff5d6c";
    return;
  }

  const userAnswer = parseInt(userAnswerField, 10);

  if (userAnswer !== correctAnswer) {
    captchaMsg.textContent = "❌ That answer isn’t correct. Please try again.";
    captchaMsg.style.color = "#ff5d6c";
    resetCaptcha();
    return;
  }

  const usernameField = document.getElementById("popupUsername").value.trim();
  const stayAnon = document.getElementById("stayAnonymous").checked;
  let username = stayAnon ? "Anonymous" : usernameField;

  if (!username) {
    captchaMsg.textContent = "❌ Please enter a username or tick 'Anonymous'.";
    captchaMsg.style.color = "#ff5d6c";
    return;
  }

  const song = document.getElementById("song").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const comment = document.getElementById("comments").value.trim();

  if (!song || !artist || !comment) {
    const formMessage = document.getElementById("formMessage");
    formMessage.textContent = "❌ Please fill in all fields.";
    formMessage.style.color = "#ff5d6c";
    return;
  }

  const modalEl = document.getElementById("verifyModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  addPost(username, song, artist, comment);

  document.getElementById("postForm").reset();
  document.getElementById("popupUsername").value = "";
  document.getElementById("stayAnonymous").checked = false;
  document.getElementById("captchaAnswer").value = "";
  charCount.textContent = "0 / 300";

  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = "✅ Post added successfully!";
  formMessage.style.color = "#34e0c9";
});

// --- Handle Likes ---
document.addEventListener("click", e => {
  const likeBtn = e.target.closest(".like-btn");
  if (!likeBtn) return;

  const countSpan = likeBtn.querySelector(".like-count");
  countSpan.textContent = parseInt(countSpan.textContent, 10) + 1;

  likeBtn.classList.add("liked");
  setTimeout(() => likeBtn.classList.remove("liked"), 400);

  updateStats();
});

// --- Handle Comments ---
document.addEventListener("click", e => {
  const commentBtn = e.target.closest(".comment-btn");
  if (!commentBtn) return;

  const post = commentBtn.closest(".post");
  const commentsDiv = post.querySelector(".comments");

  if (commentsDiv.querySelector(".comment-input")) return;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Write a comment...";
  input.classList.add("form-control", "mt-2", "comment-input");

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Post Comment";
  submitBtn.classList.add("btn", "btn-sm", "btn-warning", "mt-2");

  submitBtn.addEventListener("click", () => {
    if (input.value.trim()) {
      const commentWrapper = document.createElement("div");
      commentWrapper.classList.add("comment", "mt-2", "ps-3", "border-start", "border-2");

      const p = document.createElement("p");
      p.classList.add("m-0", "text-light", "fs-6");
      p.textContent = input.value.trim();

      commentWrapper.appendChild(p);
      commentsDiv.appendChild(commentWrapper);

      const countSpan = post.querySelector(".comment-count");
      countSpan.textContent = parseInt(countSpan.textContent, 10) + 1;

      input.remove();
      submitBtn.remove();
    }
  });

  commentsDiv.appendChild(input);
  commentsDiv.appendChild(submitBtn);
});

// --- Handle Tab Switching ---
document.querySelectorAll(".forum-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".forum-tab").forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    const selected = tab.dataset.tab;
    const postsContainer = document.getElementById("posts");
    const posts = Array.from(postsContainer.querySelectorAll(".post"));

    if (selected === "top") {
      posts.sort((a, b) =>
        parseInt(b.querySelector(".like-count").textContent, 10) -
        parseInt(a.querySelector(".like-count").textContent, 10)
      );
    } else if (selected === "commented") {
      posts.sort((a, b) =>
        parseInt(b.querySelector(".comment-count").textContent, 10) -
        parseInt(a.querySelector(".comment-count").textContent, 10)
      );
    } else if (selected === "random") {
      posts.sort(() => Math.random() - 0.5);
    } else if (selected === "latest") {
      posts.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
    }

    posts.forEach(post => postsContainer.appendChild(post));
  });
});

// --- Initial paint: album art, time labels, seed likes/comments, stats ---
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".post-art").forEach(paintArt);
  refreshTimeLabels();

  document.querySelectorAll("#posts .post").forEach(post => {
    const likeSpan = post.querySelector(".like-count");
    const commentSpan = post.querySelector(".comment-count");

    if (likeSpan) likeSpan.textContent = Math.floor(Math.random() * 50);
    if (commentSpan) commentSpan.textContent = Math.floor(Math.random() * 10);
  });

  updateStats();

  // Keep "time ago" labels fresh without a page reload
  setInterval(refreshTimeLabels, 60000);
});
