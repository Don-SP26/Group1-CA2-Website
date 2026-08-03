// Get HTML elements
console.log("JavaScript is working!");

const popup = document.getElementById("songPopup");
const readMoreBtns = document.querySelectorAll(".btn-read");
const closeBtn = document.querySelector(".close-btn");

const popupTitle = document.getElementById("popupTitle");
const popupInfo = document.getElementById("popupInfo");
const popupBadge = document.getElementById("popupBadge");
const popupBehind = document.getElementById("popupBehind");
const popupAchievements = document.getElementById("popupAchievements");
const popupImpact = document.getElementById("popupImpact");

// Open popup when Read More is clicked
readMoreBtns.forEach(function(button){

    button.addEventListener("click", function(){

        // Get information from the button's data attributes
        popupTitle.textContent = this.dataset.title;

        popupInfo.textContent =
            this.dataset.artist + " • Released: " + this.dataset.year;

        popupBadge.textContent = this.dataset.badge;

        popupBehind.textContent = this.dataset.behind;

        popupImpact.textContent = this.dataset.impact;


        // Clear previous achievements
        popupAchievements.innerHTML = "";

        // Convert achievements into bullet points
        const achievements = this.dataset.achievements.split("|");

        achievements.forEach(function(item){

            popupAchievements.innerHTML += `<li>${item}</li>`;

        });


        // Show popup
        popup.classList.add("show");

    });

});

// Close popup

closeBtn.addEventListener("click", function(){

    popup.classList.remove("show");

});


// Close popup when clicking outside it
popup.addEventListener("click", function(event){

    if(event.target === popup){

        popup.classList.remove("show");

    }

});
