// models/Genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  genreName: { type: String, required: true, unique: true, trim: true },
  description: String
}, { timestamps: true });


module.exports = mongoose.model('Genre', genreSchema);
