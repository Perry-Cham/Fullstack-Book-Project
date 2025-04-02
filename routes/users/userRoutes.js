const express = require('express');
const userRouter = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const { timingSafeEqual } = require('crypto');
const App = express();

App.use(cookie());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));
const data = JSON.parse(fs.readFileSync("./data.json"));
const users = JSON.parse(fs.readFileSync("./users.json"));

// Download route – ensure we compare IDs correctly (using parseInt)
userRouter.get('/download/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const Book = data.Books.find(book => book.id === bookId);
  res.render('users/download', { book: Book });
});

// Display saved books
userRouter.get('/savedBooks', (req, res) => {

  if(!req.session.currentUser)return res.redirect('/');
  const user = req.session.currentUser;
  res.render('users/savedBooks', {
    username: user.username,
    User:user
  });
});

userRouter.get('/readingList', (req, res) => {
  if (!req.session.currentUser) return res.redirect('/');
  
  // Get fresh user data from users.json
  const users = JSON.parse(fs.readFileSync('./users.json'));
  const user = users.users.find(u => u.id == req.session.currentUser.id);
  
  // Ensure arrays exist
  if (!user.currentlyReading) user.currentlyReading = [];
  if (!user.readBooks) user.readBooks = [];
  
  res.render('users/readingList', { 
    User: user
  });
});

userRouter.get('/News', (req, res) => {
  res.render('users/news');
});

// Save a book route
userRouter.post('/saveBook', (req, res) => {
  const Book = req.body;
  Book.sypnosis = '';
  const userId = req.cookies.userId;
  console.log(req.cookies.userId)
  const userToSave = users.users.find(usr => usr.id == userId);
  // It is safer to check based on unique IDs instead of indexOf the object
  console.log(userToSave)
  if (true) {
    userToSave.savedBooks.push(Book);
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Delete a saved book route (attached to the router)
userRouter.delete('/deleteBook/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.cookies.userId;
  const user = users.users.find((user) => user.id == userId);
  if (user) {
    user.savedBooks = user.savedBooks.filter(book => book.id !== bookId);
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// NEW: Start Reading route – adds a book to the user's currentlyReading list
userRouter.post('/startReading/:id', (req, res) => {
  const id = req.params.id;
  const book = data.Books.find(book => book.id == id)// The book details (including id, title, cover, etc.)
  const userId = req.cookies.userId;
  const user = users.users.find(u => u.id == userId);
  if (!user) return res.sendStatus(404);
  
  // Initialize the property if it doesn't exist
  if (!user.currentlyReading) {
    user.currentlyReading = [];
  }
  
  // Check if the book is already in the currentlyReading list; if not, add it.
  if (!user.currentlyReading.find(b => b.id == book.id)) {
    user.currentlyReading.push(book);
  }
  
  // If using session, update it so that the UI (rendered ejs) is up-to-date.
  if(req.session.currentUser && req.session.currentUser.id == userId) {
    req.session.currentUser = user;
  }
  
  fs.writeFileSync('./users.json', JSON.stringify(users));
  res.sendStatus(200);
});

module.exports = userRouter;