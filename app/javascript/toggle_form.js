document.addEventListener("turbo:load", function() {
  function toggleForm() {
    const contributeButton = document.getElementById("contribute-button");
    const submitSection = document.getElementById("submit");
    const overlay = document.querySelector('.form-popup-overlay');

    if (!contributeButton || !submitSection || !overlay) {
      return; // Exit the function if any of the required elements are missing
    }

    const closeButton = submitSection.querySelector('.close-button');

    contributeButton.addEventListener("click", function(event) {
      event.preventDefault();
      if (submitSection.classList.contains("show")) {
        submitSection.classList.remove("show");
        setTimeout(() => {
          submitSection.classList.add("hidden");
          overlay.classList.add("hidden");
          contributeButton.classList.remove("hidden");
        }, 500);
      } else {
        submitSection.classList.remove("hidden");
        overlay.classList.remove("hidden");
        setTimeout(() => {
          submitSection.classList.add("show");
        }, 10);
        contributeButton.classList.add("hidden");
      }
    });

    overlay.addEventListener('click', () => {
      if (submitSection.classList.contains("show")) {
        submitSection.classList.remove("show");
        setTimeout(() => {
          submitSection.classList.add("hidden");
          overlay.classList.add("hidden");
          contributeButton.classList.remove("hidden");
        }, ); // Match the transition duration
      }
    });

    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (submitSection.classList.contains("show")) {
        submitSection.classList.remove("show");
        setTimeout(() => {
          submitSection.classList.add("hidden");
          overlay.classList.add("hidden");
          contributeButton.classList.remove("hidden");
        }, ); // Match the transition duration
      }
    });
  }

  function createOverlayIfNotExists() {
    let overlay = document.querySelector('.form-popup-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'form-popup-overlay hidden';
      document.body.appendChild(overlay);
    }
  }

  createOverlayIfNotExists();
  toggleForm();
});

document.addEventListener("DOMContentLoaded", function() {
  document.dispatchEvent(new Event('turbo:load'));
});
