import { fetchData } from './readingList.js';


const menuBtn = document.querySelector('.menu-toggle-btn');
menuBtn.addEventListener("click", (e) => {
  const menu = e.target.parentNode.querySelector(".mobile-nav");

  menu.classList.toggle('slide-In');

})
// First, let's modify the existing fetch logic in users.js
const saveBtns = document.querySelectorAll(".save-btn");
saveBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    let Books;
    const id = e.target.getAttribute('data-id');
    Books = await fetchData();
    const saveB = Books.Books.find(b => b.id == id);

    fetch('/users/saveBook', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(saveB),
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        // Instead of alert, create and show the modal
        createSaveModal(saveB.title, "has been added to your saved books.");
      }
    }).catch(error => {
      createSaveModal(saveB.title, "already exists in your saved books.")
    });
  });
});

// New function to create and manage the save modal
export function createSaveModal(bookTitle, Text) {
  // Create modal container
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close-btn');
  closeBtn.innerHTML = '&times;'; // × symbol

  // Create message
  const message = document.createElement('p');
  message.textContent = bookTitle + " " + Text;

  // Assemble modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(message);
  modalOverlay.appendChild(modalContent);

  // Add to document body
  document.body.appendChild(modalOverlay);

  // Add event listener to close button
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });

  // Optional: Close modal if clicking outside the modal content
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay);
    }
  });
}
