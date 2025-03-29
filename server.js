const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");
const userRouter = require('./routes/users/userRoutes');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cookie = require('cookie-parser')
const port = 3000;
const data = JSON.parse(fs.readFileSync("./data.json"));
const users = JSON.parse(fs.readFileSync("./users.json"));

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server);
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookie())

app.set("view engine", "ejs");

// Set up session middleware
app.use(
  session({
    secret: "your_secret_key", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    }, // Set to true if using HTTPS
  })
);

app.use('/users', userRouter)

app.get('/data.json', (req, res) => {
  //res.json(data)
  res.json(data)
})
app.get("/", (req, res) => {
  if (req.session.userLoggedIn && req.session.currentUser.username !== 'Admin') {
    res.render("users/users", {
      user: req.session.currentUser, books: data.Books
    })
  } else if (req.session.currentUser && req.session.currentUser.username == 'Admin') {
    res.redirect('/admin')
  } else {
    res.render("sign up and login/login");
  }
});

app.get("/admin", (req, res) => {
  if (req.session.currentUser.username === "Admin") {
    res.render("admin", {
      username: "Admin", books: data.Books
    })
  } else res.render("sign up and login/login")
});

app.get("/login", (req, res) => {
  res.render("sign up and login/login");
});
app.get("/signup", (req, res) => {
  res.render("sign up and login/signup");
});

app.post("/loginform", (req, res) => {
  const user = users.users.find((user) => user.username == req.body.username);

  //Admin Login
  if (user.username == "Admin" && req.body.password == user.password) {
    /*res.render("admin", {
    username: "Admin", books: data.Books
    })*/
    req.session.currentUser = user;
    req.session.userLoggedIn = true;
    res.redirect('/')
    return;
  }
  //User Login
  if (user && req.body.password == user.password) {
    req.session.userLoggedIn = true;
    req.session.currentUser = user;
    res.cookie('userId', user.id, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.redirect("/")
  } else {
    res.send("Invalid username or password");
  }
});

app.post("/post", (req, res) => {
  const nbook = {
    name: req.body.name,
    author: req.body.author,
    price: req.body.price,
    id: data.Books.length + 1
  };

  data.Books.push(nbook);

  fs.writeFileSync("./data.json", JSON.stringify(data));

  res.sendStatus(201);
});

app.post("/signupform", (req, res) => {
  const nuser = req.body;
  if (!users.users.find((user) => user.username === nuser.username)) {
    nuser.id = users.users.length + 1;
    users.users.push(nuser);
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.sendStatus(201);
    res.redirect('/')
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



  // Add more socket event handlers as needed

