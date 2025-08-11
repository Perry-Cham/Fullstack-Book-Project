const mongoose = require("mongoose")
//Connect Mongoose 
mongoose.connect("mongodb://localhost:27017/PsBooks").then(() => console.log("MongoDb is connected!")).catch(err => console.error(err))
//Create a mongoose schema
const bookSchema = mongoose.Schema({
   title: String,
      author: String,
      price: String,
      cover:String,
      sypnosis:String,
      id: Number,
      pageCount: Number,
      publishedDate: String
})
const Books = new mongoose.model('Book', bookSchema,'Book_List');
module.exports = Books;