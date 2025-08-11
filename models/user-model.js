const mongoose =  require("mongoose");
mongoose.connect("mongodb://localhost:27017/PsBooks").then(() => console.log("MongoDb is connected!")).catch(err => console.error(err))


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedBooks: Array,
  readingHistory: Array,
  readingGoal: {
    inProgress: { type: Boolean, default: false },
    targetNumberOfBooks: Number,
    deadline: Date,
    readBooks: Array,
    duration: Number,
    durationUnit: String,
    goalName: String ,
    startDate: Date,
    readingHours: Number
  },
  currentlyReading: Array,
  studyGoal: mongoose.Schema.Types.Mixed
});

const User = mongoose.model('User', userSchema);

module.exports = User;