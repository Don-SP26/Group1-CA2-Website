// --- Character Counter ---
const commentsBox = document.getElementById("comments");
const charCount = document.getElementById("charCount");

commentsBox.addEventListener("input", () => {
  const length = commentsBox.value.length;
  charCount.textContent = `${length} / 300`;
  charCount.style.color = length > 250 ? "orange" : "#ccc";
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
  const postDiv = document.createElement("div");
  postDiv.classList.add("post", "rounded-3", "p-3", "mb-3");
  postDiv.dataset.timestamp = Date.now(); // store creation time

  postDiv.innerHTML = `
    <h4 class="mb-2 fs-6 text-warning">${username}</h4>
    <p class="m-0 text-light fs-6"><strong>${song}</strong> by ${artist}<br>${comment}</p>
    <div class="post-actions d-flex gap-2 mt-2">
      <button class="like-btn btn">❤️ Like (<span class="like-count">0</span>)</button>
      <button class="comment-btn btn">💬 Comment (<span class="comment-count">0</span>)</button>
    </div>
    <div class="comments mt-2 ps-3 border-start border-2"></div>
  `;
  document.getElementById("posts").prepend(postDiv);
}

// --- Handle Verification ---
document.getElementById("verifyBtn").addEventListener("click", () => {
  const userAnswerField = document.getElementById("captchaAnswer").value.trim();
  const captchaMsg = document.getElementById("captchaMessage");
  captchaMsg.textContent = ""; // clear old message

  // Empty math answer
  if (!userAnswerField) {
    captchaMsg.textContent = "❌ Please fill in the answer to the math question.";
    captchaMsg.style.color = "red";
    return;
  }

  const userAnswer = parseInt(userAnswerField);

  // Wrong math answer
  if (userAnswer !== correctAnswer) {
    captchaMsg.textContent = "❌ That answer isn’t correct. Please try again.";
    captchaMsg.style.color = "red";
    resetCaptcha();
    return;
  }

  // ✅ Math passed — check username
  const usernameField = document.getElementById("popupUsername").value.trim();
  const stayAnon = document.getElementById("stayAnonymous").checked;
  let username = stayAnon ? "Anonymous" : usernameField;

  if (!username) {
    captchaMsg.textContent = "❌ Please enter a username or tick 'Anonymous'.";
    captchaMsg.style.color = "red";
    return;
  }

  // Check form fields
  const song = document.getElementById("song").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const comment = document.getElementById("comments").value.trim();

  if (!song || !artist || !comment) {
    const formMessage = document.getElementById("formMessage");
    formMessage.textContent = "❌ Please fill in all fields.";
    formMessage.style.color = "red";
    return;
  }

  // ✅ All checks passed → hide modal and add post
  const modalEl = document.getElementById("verifyModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  addPost(username, song, artist, comment);

  // Reset form
  document.getElementById("postForm").reset();
  document.getElementById("popupUsername").value = "";
  document.getElementById("stayAnonymous").checked = false;
  document.getElementById("captchaAnswer").value = "";
  charCount.textContent = "0 / 300";

  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = "✅ Post added successfully!";
  formMessage.style.color = "lightgreen";
});

// --- Handle Likes ---
document.addEventListener("click", e => {
  if (e.target.classList.contains("like-btn")) {
    const countSpan = e.target.querySelector(".like-count");
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
  }
});

// --- Handle Comments ---
document.addEventListener("click", e => {
  if (e.target.classList.contains("comment-btn")) {
    const post = e.target.closest(".post");
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

        // Increment comment count
        const countSpan = post.querySelector(".comment-count");
        countSpan.textContent = parseInt(countSpan.textContent) + 1;

        input.remove();
        submitBtn.remove();
      }
    });

    commentsDiv.appendChild(input);
    commentsDiv.appendChild(submitBtn);
  }
});

// --- Handle Tab Switching ---
document.querySelectorAll(".forum-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".forum-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const selected = tab.dataset.tab;
    const postsContainer = document.getElementById("posts");
    const posts = Array.from(postsContainer.querySelectorAll(".post"));

    if (selected === "top") {
      posts.sort((a, b) =>
        parseInt(b.querySelector(".like-count").textContent) -
        parseInt(a.querySelector(".like-count").textContent)
      );
    } else if (selected === "commented") {
      posts.sort((a, b) =>
        parseInt(b.querySelector(".comment-count").textContent) -
        parseInt(a.querySelector(".comment-count").textContent)
      );
    } else if (selected === "random") {
      posts.sort(() => Math.random() - 0.5);
    } else if (selected === "latest") {
      posts.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
    }

    posts.forEach(post => postsContainer.appendChild(post));
  });
});

// --- Seed Random Likes/Comments for Sample Posts ---
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#posts .post").forEach(post => {
    const likeSpan = post.querySelector(".like-count");
    const commentBtn = post.querySelector(".comment-btn");

    if (likeSpan) likeSpan.textContent = Math.floor(Math.random() * 50);

    if (!commentBtn.querySelector(".comment-count")) {
      commentBtn.innerHTML = `💬 Comment (<span class="comment-count">${Math.floor(Math.random() * 10)}</span>)`;
    } else {
      commentBtn.querySelector(".comment-count").textContent = Math.floor(Math.random() * 10);
    }
  });
});
