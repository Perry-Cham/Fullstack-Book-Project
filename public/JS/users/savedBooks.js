import { fetchData } from "./readingList.js";
import { createSaveModal } from "./users.js";

const deleteBtns = document.querySelectorAll(".delete-btn");
const readBtns = document.querySelectorAll(".read-btn");
console.log(deleteBtns);
deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const books = await fetchData();
    console.log(books);
    const id = e.target.getAttribute("data-id");
    const book = e.target.parentNode.parentNode;
    const bookParent = book.parentNode;
    console.log(book);
    bookParent.removeChild(book);
    const toDelete = books.Books.find((book) => book.id == id);
    fetch(`/users/deleteBook/${id}`, {
      method: "DELETE",
      headers: { type: "application/json" },
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        createSaveModal(toDelete.title, "has been deleted from your account");
      }
    });
  });
});

readBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    fetch(`/users/startReading/${id}`, {
      method: "POST",
      headers: {
        type: "application/JSON",
      },
    }).then((response) => {
      if (response.ok) {
        createSaveModal(
          "Book Title",
          "Congratulations you've just started a new book!"
        );
      }
    });
  });
});
