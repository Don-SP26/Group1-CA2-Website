// Character counter
const commentsBox = document.getElementById("comments");
const charCount = document.getElementById("charCount");

commentsBox.addEventListener("input", () => {
  charCount.textContent = `${commentsBox.value.length} / 300`;
  charCount.style.color = commentsBox.value.length > 250 ? "orange" : "#ccc";
});

// CAPTCHA setup
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
  document.getElementById("captchaMessage").textContent = "";
}

// Show modal on form submit
document.getElementById("postForm").addEventListener("submit", e => {
  e.preventDefault();
  resetCaptcha();
  const modal = new bootstrap.Modal(document.getElementById("verifyModal"));
  modal.show();
});

// Add new post
function addPost(song, artist, comment) {
  const postDiv = document.createElement("div");
  postDiv.classList.add("post");
  postDiv.innerHTML = `
    <h4>Anonymous</h4>
    <p><strong>${song}</strong> by ${artist}<br>${comment}</p>
    <div class="post-actions">
      <button class="like-btn">❤️ Like (<span class="like-count">0</span>)</button>
      <button class="comment-btn">💬 Comment</button>
    </div>
    <div class="comments"></div>
  `;
  document.getElementById("posts").prepend(postDiv);
}

// Handle verification
document.getElementById("verifyBtn").addEventListener("click", () => {
  const userAnswer = parseInt(document.getElementById("captchaAnswer").value);
  const message = document.getElementById("captchaMessage");

  if (userAnswer === correctAnswer) {
    message.textContent = "✅ Verified!";
    message.style.color = "lightgreen";

    setTimeout(() => {
      const modalEl = document.getElementById("verifyModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      const song = document.getElementById("song").value.trim();
      const artist = document.getElementById("artist").value.trim();
      const comment = document.getElementById("comments").value.trim();
      const formMessage = document.getElementById("formMessage");

      if (!song || !artist || !comment) {
        formMessage.textContent = "❌ Please fill in all fields.";
        formMessage.style.color = "red";
        return;
      }

      addPost(song, artist, comment);

      // Reset form + counter
      document.getElementById("postForm").reset();
      charCount.textContent = "0 / 300";
      formMessage.textContent = "✅ Post added successfully!";
      formMessage.style.color = "lightgreen";
    }, 1000);
  } else {
    message.textContent = "❌ Wrong answer, try again.";
    message.style.color = "red";
    resetCaptcha(); // regenerate new question on failure
  }
});

// Handle likes
document.addEventListener("click", e => {
  if (e.target.classList.contains("like-btn")) {
    const countSpan = e.target.querySelector(".like-count");
    let count = parseInt(countSpan.textContent);
    countSpan.textContent = count + 1;
  }
});

// Handle comments
document.addEventListener("click", e => {
  if (e.target.classList.contains("comment-btn")) {
    const post = e.target.closest(".post");
    const commentsDiv = post.querySelector(".comments");
    const newComment = prompt("Enter your comment:");
    if (newComment) {
      const p = document.createElement("p");
      p.textContent = newComment;
      commentsDiv.appendChild(p);
    }
  }
});
