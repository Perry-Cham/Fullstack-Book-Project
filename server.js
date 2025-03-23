const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require("axios");
const app = express();
const port = 3000;
const data = JSON.parse(fs.readFileSync("./data.json"));
app.listen(port, () => {
console.log("server is running on port 3000");
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
app.set("view engine", "ejs");

// Set up session middleware
app.use(
session( {
secret: "your_secret_key", // Replace with a strong secret key
resave: false,
saveUninitialized: true,
cookie: {
secure: false
}, // Set to true if using HTTPS
})
);
app.use(express.static('./public'))


const users = JSON.parse(fs.readFileSync("./users.json"));
app.get("/data.json", (req, res) => {
fs.readFile("data.json", (err, data) => {
res.send(data);
});
});

app.get("/", (req, res) => {
if (req.session.userLoggedIn) {
res.render("users", {
user: req.session.currentUser, books: data.Books
});
} else {
res.render("sign up and login/login");
}
});

app.get("/admin", (req, res) => {
if (req.session.currentUser && req.session.currentUser.username === "Admin") {
res.render("admin", {
username: "Admin", books: data.Books
})} else res.render("sign up and login/login")
});

app.get("/login", (req, res) => {
res.render("sign up and login/login");
});

app.get("/signup", (req, res) => {
res.render("sign up and login/signup");
});

app.post("/loginform", (req, res) => {
const user = users.users.find((user) => user.username == req.body.username);
console.log(req.body.username);
//Admin Login
if (user.username == "Admin" && req.body.password == user.password) {
res.render("admin", {
username: "Admin", books: data.Books
})
req.session.currentUser = user;
req.session.userLoggedIn = true;
return;
}
//User Login
if (user && req.body.password == user.password) {
req.session.userLoggedIn = true;
req.session.currentUser = user;
res.render("users", {
user: user, books: data.Books
});
console.log(req.session.currentUser, req.session.userLoggedIn)
} else {
res.send("Invalid username or password");
}
});

app.post("/post", (req, res) => {
console.log(req.body);
const nbook = {
name: req.body.name,
author: req.body.author,
price: req.body.price,
id: data.Books.length + 1
};

data.Books.push(nbook);
console.log(data, nbook);
fs.writeFileSync("./data.json", JSON.stringify(data));
console.log("./data.json");
res.sendStatus(201);
});

app.post("/signupform", (req, res) => {
const nuser = req.body;
if (!users.users.find((user) => user.username === nuser.username)) {
nuser.id = users.users.length + 1;
users.users.push(nuser);
fs.writeFileSync("./users.json", JSON.stringify(users));
res.sendStatus(201);
} else {
res.send(`Error: user ${req.body.username} already exists`);
}
});

app.delete("/delete/:id", (req, res) => {
const id = req.params.id;
const book = data.Books.find((book) => book.id == id);
data.Books = data.Books.filter((book) => book.id != id);
fs.writeFileSync("./data.json", JSON.stringify(data));
res.send(`The book ${book.name} has been deleted`);
});

app.put("/put/:id", (req, res) => {
const edBook = req.body;
const id = req.params.id;
const book = data.Books.find((book) => book.id == id);
data.Books.splice(data.Books.indexOf(book), 1, edBook);
fs.writeFileSync("./data.json", JSON.stringify(data));
res.send(`The book ${book.name} has been updated`);
});

// Route to render the users.ejs file
app.get("/users", (req, res) => {
if (req.session.userLoggedIn) {
res.render("users", {
user: req.session.currentUser, books: data.Books
});
} else {
res.redirect("/login");
}
});

// Route to handle logout
app.get("/logout", (req, res) => {
req.session.destroy((err) => {
if (err) {
return res.redirect("/");
}
res.clearCookie("connect.sid");
res.redirect("/login");
});
});


app.get('/download/:id', (req,res) => {
bookId = req.params.id;
const Book = data.Books.find(book => bookId == book.id)
res.render('users/download', {book:Book})
})


// Function to fetch books by genre from Open Library API
/*const fetchBooksByGenre = async (genre) => {
try {
const response = await
axios.get(`https://openlibrary.org/subjects/${genre}.json?limit=10`);
console.log(response.data)
return response.data.works.map(book => ({
title: book.title,
author: book.authors?.[0]?.name || "Unknown",
cover: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`: null
}));
} catch (error) {
console.error(`Error fetching books for genre "${genre}":`, error.message);
return [];
}
};

// Function to fetch multiple genres and save to `data.json`
const saveBooksToJSON = async () => {
const genres = ["fiction", "mystery", "science", "history", "adventure",
"romance", "action"]; // Example genres
let bookCollection = [];

for (let genre of genres) {
const books = await fetchBooksByGenre(genre);
bookCollection = [...bookCollection, ...books];
}

fs.writeFileSync("./data.json", JSON.stringify(bookCollection, null, 2));
console.log("Books saved to data.json!");
};

// Run the function
saveBooksToJSON();*/