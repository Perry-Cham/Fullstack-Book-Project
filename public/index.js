const booklist = document.querySelector(".booklist");
let Books;

fetch("http://localhost:3000/data.json").then((response) =>
  response.json().then((data) => {
    const books = data.Books;
    console.log(books, typeof books);
    books.forEach((book) => createB(book));
    Books = data.Books;
  })
);

function createB(book) {
  const div = document.createElement("div");
  const title = document.createElement("h4");
  title.classList.add("tit");
  const author = document.createElement("p");
  author.classList.add("aut");
  const price = document.createElement("p");
  price.classList.add("pri");
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit"
  

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "Delete"
  
  title.innerHTML = book.name.toUpperCase();
  author.innerHTML = book.author;
  price.innerHTML = book.price;

  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(price);
  div.appendChild(editBtn)
  div.appendChild(deleteBtn)

  booklist.appendChild(div);
  div.setAttribute("data-id", book.id);
 
  editBtn.addEventListener('click', (e) => edit(e.target.parentNode))
  deleteBtn.addEventListener("click", (e) => {
    const id = e.target.parentNode.getAttribute("data-id");
    const book = Books.find((book) => book.id == id);
    console.log(id);
    fetch(`/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then(() => {
      booklist.removeChild(div);
    });
  });
}

const btn = document.querySelector(".ex");
const title = document.querySelector(".tit");
const author = document.querySelector(".aut");
const price = document.querySelector(".pri");

function po() {
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
}
btn.addEventListener("click", () => po());

function CreateModal(text, yFunction, nFunction) {
  const modal = document.createElement("div");
  const modalinner = document.createElement("div");
  const modalText = document.createElement("p");
  const modalBtnY = document.createElement("button");
  const modalBtnN = document.createElement("button");
}

function edit(parent) {
 
  const wrapper = document.createElement("div");
  
  const ainput = document.createElement("input");
  const pinput = document.createElement("input");
  const savebtn = document.createElement("button");
  const inputs = [ ainput, pinput];

  
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
      method:'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(targetB)
    })
  }); 
}
