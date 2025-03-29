import { fetchData } from './readingList.js';
import { createSaveModal } from './users.js';

const deleteBtns = document.querySelectorAll('.delete.btn')
deleteBtns.forEach((btn) => {btn.addEventListener('click', async (e) => {
  const books = await fetchData;
  const id = e.target.getAttribute('data-id');
  const book = e.target.parentNode.parentNode;
  document.removeChild(book)
  const toDelete = books.Books.find((book) => book.id == id);
  fetch(`/users/deleteBook/${id}`, {
    method: 'DELETE',
    headers: { type: 'application/json' },
    credentials: 'include'
  }).then((response) => {
    if (response.ok) {
      createSaveModal(toDelete.title, "has been deleted from your account")
    }
  })
})})