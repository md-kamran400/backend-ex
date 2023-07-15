const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    title: String,
    genre: String,
    author: String,
    publishing_year: Number,
});

const BookModel = mongoose.model("book", bookSchema);

module.exports = BookModel;