const express = require('express');
const userRouter = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const { timingSafeEqual } = require('crypto');
const { Recoverable } = require('repl');
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

  if (!req.session.currentUser) return res.redirect('/');
  const user = req.session.currentUser;
  res.render('users/savedBooks', {
    username: user.username,
    User: user
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

  let usersReadBooks = []
  user.readingHistory.forEach(rb => {
    let book = data.Books.find(b => b.id == rb);
    if (book) usersReadBooks.push(book)
  });
  res.render('users/readingList', {
    User: user,
    readBooks: usersReadBooks
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
  const userToSave = users.users.find(usr => usr.id == userId);
  // It is safer to check based on unique IDs instead of indexOf the object
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
    book.readingHistory = []
    user.currentlyReading.push(book);
    user.readBooks.push(id)
  }

  // If using session, update it so that the UI (rendered ejs) is up-to-date.
  if (req.session.currentUser && req.session.currentUser.id == userId) {
    req.session.currentUser = user;
  }

  fs.writeFileSync('./users.json', JSON.stringify(users));
  res.sendStatus(200);
});
userRouter.get('/getCurrentlyReading', (req, res) => {
  if (!req.session.currentUser) return res.sendStatus(404);
  const user = req.session.currentUser;
  if (user) {
    res.json(user.currentlyReading.map(book => ({
      id: book.id,
      name: book.name,
      readingHistory: book.readingHistory || [] // Ensure readingHistory is included
    })));
  } else {
    res.sendStatus(404);
  }
});
userRouter.post('/setGoal', (req, res) => {
  const goal = req.body;
 
  const userId = req.cookies.userId;
  const userToSave = users.users.find(usr => usr.id == userId);
  if (userToSave) {
    userToSave.readingGoal.goalName = goal.goalName;
    userToSave.readingGoal.targetNumberOfBooks = goal.bookCount;
    userToSave.readingGoal.duration = goal.duration;
    userToSave.readingGoal.durationUnit = goal.durationUnit;
    userToSave.readingGoal.startDate = new Date();
    userToSave.readingGoal.readingHours = goal.readingHours

const rdate = new Date(userToSave.readingGoal.startDate)

/* const day = (rdate.setDate(rdate.getDate() + goal.duration)) */
let date;
let month;
if(goal.durationUnit == "week"){

  date = rdate.getDate() + (Number(goal.duration) * 7);
  if(date > 30){
    date = 30 - (rdate.getDate() + (Number(goal.duration) * 7))
    month = (rdate.getMonth() + 2)
  }else month = (rdate.getMonth() + 1);
}else{
  date = rdate.getDate() + Number(goal.duration)
  month = (rdate.getMonth() + 1);
}

const year = rdate.getFullYear(); 
console.log(rdate.getDate())
userToSave.readingGoal.deadline = `${year}-${month}-${date}`
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
}
);


//PUT ROUTES 
userRouter.put("/saveCurrentPage/:id", (req, res) => {

  const bookId = req.params.id;
  const page = req.body.page;
  const User = users.users.find(user => user.id == req.session.currentUser.id);
  const bookToUpdate = User.currentlyReading.find(book => book.id == bookId)

  const index = User.currentlyReading.indexOf(bookToUpdate);
  let diffInPages;
  User.currentlyReading[index].currentPage ? diffInPages = page - User.currentlyReading[index].currentPage : console.log(page)
  if(page > bookToUpdate.pageCount) page = bookToUpdate.pageCount;
  User.currentlyReading[index].currentPage = page;
  User.readingGoal.totalGoalPages = pageCountTotal;
  User.readingGoal.currentGoalPages = pageCountCurrent;

  //Save page data for charts


  if (User.currentlyReading[index].readingHistory) {
    User.currentlyReading[index].readingHistory.push({
      date: new Date(),
      pagesRead: diffInPages
    })
  } else {
    User.currentlyReading[index].readingHistory = [];
    User.currentlyReading[index].readingHistory.push({
      date: new Date(),
      pagesRead: diffInPages
    })
  }



  //FIND OUT IF THE BOOK IS COMOLETE AND IF IT IS DELETE THE BOOK FROM CURRENTLY READING AND ADD IT TO THE READ BOOKS IN READING GOAL
  User.currentyReading[index].sypnosis = "";
  if (bookToUpdate.currentPage == bookToUpdate.pageCount) {
    console.log(typeof User.currentlyReading)
    if(!User.readingGoal.readBooks)User.readingGoal.readBooks = [];
    if(!User.readingGoal.readBooks.find(book => book.id == bookToUpdate.id)) {
      User.readingGoal.readBooks.push(bookToUpdate)
      console.log(User, typeof User.currentlyReading)
    User.currentlyReading.splice(index, 1)
    
    }
  }


  
  fs.writeFileSync('./users.json', JSON.stringify(users));
  res.sendStatus(200);
})

userRouter.post('/setStudyGoal', (req, res) => {
  const goal = req.body;
 
  const userId = req.cookies.userId;
  const userToSave = users.users.find(usr => usr.id == userId);
  console.log(userToSave.username, userToSave)
  if (userToSave) {
userToSave.studyGoal = {}
    userToSave.studyGoal.active = true;
    userToSave.studyGoal.mainTopic = goal.goalName;
    console.log(req.body, req.body.subtopic)
    userToSave.studyGoal.subTopics = [...goal.subtopic];

    userToSave.studyGoal.targetNumberOfBooks = goal.topicNumber;
    
    userToSave.studyGoal.duration = goal.duration;
    userToSave.studyGoal.durationUnit = goal.durationUnit;
    userToSave.studyGoal.startDate = new Date();
    userToSave.studyGoal.readingHours = goal.readingHours

const rdate = new Date(userToSave.readingGoal.startDate)
userToSave.studyGoal.subTopics = userToSave.studyGoal.subTopics.map((topic, index) => {
  return {topicName: topic,
  studied: false,
  id: index}
})

/* const day = (rdate.setDate(rdate.getDate() + goal.duration)) */
let date;
let month;
if(goal.durationUnit == "week"){

  date = rdate.getDate() + (Number(goal.duration) * 7);
  if(date > 30){
    date = 30 - (rdate.getDate() + (Number(goal.duration) * 7))
    month = (rdate.getMonth() + 2)
  }else month = (rdate.getMonth() + 1);
}else{
  date = rdate.getDate() + Number(goal.duration)
  month = (rdate.getMonth() + 1);
}

const year = rdate.getFullYear(); 
console.log(rdate.getDate())
userToSave.readingGoal.deadline = `${year}-${month}-${date}`
    fs.writeFileSync('./users.json', JSON.stringify(users));
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
}
);

userRouter.put('/updateStudyGoal/:id', (req, res) => {
  const subTopicId = req.params.id;
  const userId = req.cookies.userId;
  const userToSave = users.users.find(usr => usr.id == userId);
userToSave.studyGoal.subTopics.forEach(topic => {
    if(topic.id == subTopicId.id){
      topic.studied = true;
    }
  })
  if(userToSave.studyGoal.subTopics.every(topic => topic.studied == true)){
    delete userToSave.studyGoal
    fs.writeFileSync('./users.json', JSON.stringify(users));
    return res.sendStatus(200).json({message: "Goal completed"});
  }
  fs.writeFileSync('./users.json', JSON.stringify(users));
  res.sendStatus(200);
})
module.exports = userRouter;