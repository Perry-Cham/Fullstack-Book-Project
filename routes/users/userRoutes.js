const express = require('express');
const userRouter = express.Router();
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const App = express();

App.use(cookie())
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({ extended: true }))
const data = JSON.parse(fs.readFileSync("./data.json"));
const users = JSON.parse(fs.readFileSync("./users.json"));



/*userRouter.get('/download/:id', (req, res) => {
  const bookId = req.params.id;
  const Book = data.Books.find(book => bookId == book.id)
  res.render('users/download', { book: Book })
})*/
userRouter.get('/download/:id', (req, res) => {
  const bookId = req.params.id;
  const Book = data.Books.find(book => bookId == book.id)
  res.render('users/download', { book: Book })
})
userRouter.get('/savedBooks', (req, res) => {
  const user = req.session.currentUser;
  res.render('users/savedBooks', {
    username: user.username,
    books: user.savedBooks
  })
})
userRouter.get('/readingList', (req, res) => {
  res.render('users/readingList')
})
userRouter.get('/News', (req, res) => {
  res.render('users/news')
})

userRouter.post('/saveBook', (req, res) => {
  const Book = req.body;
  const userId = req.cookies.userId;
  console.log(Book)
  const userToSave = users.users.find(usr => usr.id == userId)
  if (data.Books.indexOf(Book) == -1) {
    userToSave.savedBooks.push(req.body)
    res.sendStatus(200)
    fs.writeFileSync('./users.json', JSON.stringify(users))
  } else {
    res.sendStatus(400);
  }
})

App.delete('/deleteBook/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id == req.cookie.userId);
  user.savedBooks.splice(id, 1);
})
//Messenger implementation


module.exports = userRouter;