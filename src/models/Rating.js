const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', index: true},
  content: { type: String, required: true },
  score: { type: Number, min: 1, max: 10, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
