alert("hello")
const booklist = document.querySelector(".booklist");
let Books;

fetch("http://localhost:3000/data.json")
  .then((response) => response.json())
  .then((data) => {
    const books = data.Books;
    console.log(books, typeof books);
  });

function createB(book) { }

const Addbtn = document.querySelector(".addBtn");
const title = document.querySelector(".tit");
const author = document.querySelector(".aut");
const price = document.querySelector(".pri");
const bookDivs = document.querySelectorAll('.book')
bookDivs.forEach((div) => {
  console.log(bookDivs, div)
  div.querySelector(".deleteBtn").addEventListener("click", (e) => deleteB(e,
    div))
})
/* function postB() {
const book = {
name: title.value,
author: author.value,
price: price.value,
};
console.log(book);
fetch("/post", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(book),
});
} */

function editB(parent) {

  const wrapper = document.createElement("div");

  const ainput = document.createElement("input");
  const pinput = document.createElement("input");
  const savebtn = document.createElement("button");
  const inputs = [ainput,
    pinput];


  ainput.value = parent.querySelector(".aut").innerHTML;
  pinput.value = parent.querySelector(".pri").innerHTML;
  savebtn.innerHTML = "SAVE";

  inputs.forEach((input) => {
    input.classList.add("editInput");
    wrapper.appendChild(input);
  });
  wrapper.appendChild(savebtn)
  parent.appendChild(wrapper)
  console.log(parent)
  savebtn.addEventListener("click", () => {

    parent.querySelector(".aut").innerHTML = ainput.value;
    parent.querySelector(".pri").innerHTML = pinput.value;

    const targetB = Books.find(book =>
      book.name == parent.querySelector('.tit').innerHTML
    )
    const targetIndex = Books.indexOf(targetB)

    console.log(targetB)
    targetB.author = ainput.value
    targetB.price = pinput.value
    console.log(targetB)

    parent.removeChild(wrapper)

    fetch(`/put/${targetB.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(targetB)
    })
  });
}
function deleteB(e, parent) {
  alert(`You have clicked the book with an ID of ${e.target.getAttribute("data-id")}`);
  const id = e.target.getAttribute("data-id");
  fetch(`/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    document.removeChild(parent);
  });
}




function CreateModal(text, yFunction, nFunction) {
  const modal = document.createElement("div");
  const modalinner = document.createElement("div");
  const modalText = document.createElement("p");
  const modalBtnY = document.createElement("button");
  const modalBtnN = document.createElement("button");
}