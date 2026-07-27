// Waits for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
    
    // Create a new Intersection Observer 
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // If the element is in the viewport, add the 'active' class
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    // Select all elements with the class '.reveal' and observe them
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((element) => {
        observer.observe(element);
    });
});