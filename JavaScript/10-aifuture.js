/* ================================================================
   Sections:
   1. Setup — grab elements, bail out if the page has no lightbox
   2. Open / close logic
   3. Event listeners (click, keyboard, backdrop, Escape)
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. SETUP */
  const overlay = document.getElementById("lightboxOverlay");
  const overlayImg = document.getElementById("lightboxImage");
  const overlayCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  // Guard clause: if this page has no lightbox markup or no trigger
  // images, skip everything below instead of erroring on null elements
  if (!overlay || !overlayImg || triggers.length === 0) return;

  // Remembers which element was focused before the lightbox opened,
  // so focus can be restored to it on close (keyboard users shouldn't
  // lose their place on the page)
  let lastFocused = null;


  /* 2. OPEN / CLOSE LOGIC */
  function openLightbox(imgEl) {
    lastFocused = document.activeElement;

    // Dynamically set the enlarged image + caption from the source image
    overlayImg.src = imgEl.src;
    overlayImg.alt = imgEl.alt;
    overlayCaption.textContent = imgEl.alt;

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open"); // locks page scroll

    // Moves keyboard focus into the overlay (onto the close button)
    // so keyboard/screen-reader users land somewhere sensible
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    // Clear src so the browser isn't holding the full-size image in an
    // invisible element, and so screen readers don't announce stale content
    overlayImg.src = "";
    overlayCaption.textContent = "";

    // Returns focus to whatever was focused before the lightbox opened
    if (lastFocused) lastFocused.focus();
  }


  /* 3. EVENT LISTENERS */
  // Open on click, or on Enter/Space (images are focusable via tabindex,
  // so keyboard users need a non-click way to activate them too)
  triggers.forEach(img => {
    img.addEventListener("click", () => openLightbox(img));

    img.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  // Close on close-button click
  closeBtn.addEventListener("click", closeLightbox);

  // Close on clicking the dark backdrop (but not the image/figure itself —
  // checking e.target === overlay excludes clicks that bubbled up from
  // the image or caption)
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeLightbox();
  });

  // Close on Escape key, only while the lightbox is actually open
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeLightbox();
    }
  });
});