class User {
  constructor(name, password, id) {
    this.username = name;
    this.password = password;
    this.id = id;
    this.currentlyReading = [];
    this.savedBooks = [];
    this.readBooks = [];
    this.readingGoal = {
      targetNumberOfBooks: null,
      deadline: null,
      startDate: null,
      readingHours: null,
      CurrentBook: null,
      readBooks: null,
    };
  }
}
module.exports = User;
