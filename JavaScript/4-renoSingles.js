// RENOWNED SINGLES - POPUP

// Get all the song cards
const cards = document.querySelectorAll(".single-card");


// Get the popup
const modal = document.getElementById("singleModal");


// Get the close button
const closeButton = document.getElementById("modalClose");


// Get the elements inside the popup
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalArtist = document.getElementById("modalArtist");
const modalYear = document.getElementById("modalYear");
const modalDescription = document.getElementById("modalDescription");
const modalBehind = document.getElementById("modalBehind");
const modalAchievements = document.getElementById("modalAchievements");
const modalSpotify = document.getElementById("modalSpotify");

// CLICK ON A CARD
cards.forEach(function(card) {

    card.addEventListener("click", function() {

        // Get information from the card
        const title = card.dataset.title;
        const artist = card.dataset.artist;
        const year = card.dataset.year;
        const image = card.dataset.image;
        const description = card.dataset.description;
        const behind = card.dataset.behind;
        const achievements = card.dataset.achievements;
        const spotify = card.dataset.spotify;


        // Put information into popup
        modalTitle.textContent = title;

        modalArtist.textContent = artist;

        modalYear.textContent = year;

        modalImage.src = image;

        modalImage.alt = title;

        modalDescription.textContent = description;

        modalBehind.textContent = behind;

        // ACHIEVEMENTS
        modalAchievements.innerHTML = "";


        const achievementList = achievements.split("|");


        achievementList.forEach(function(achievement) {

            const li = document.createElement("li");

            li.textContent = achievement;

            modalAchievements.appendChild(li);

        });


        // =================================================
        // SPOTIFY
        // =================================================

        modalSpotify.src = spotify;


        // SHOW POPUP
        modal.classList.add("show");

    });

});

// CLOSE BUTTON

closeButton.addEventListener("click", function() {

    modal.classList.remove("show");

    // Stop Spotify when closing
    modalSpotify.src = "";

});

// CLICK OUTSIDE POPUP TO CLOSE
modal.addEventListener("click", function(event) {

    if (event.target === modal) {

        modal.classList.remove("show");

        // Stop Spotify
        modalSpotify.src = "";

    }

});

// ESC KEY TO CLOSE
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        modal.classList.remove("show");

        modalSpotify.src = "";

    }

});