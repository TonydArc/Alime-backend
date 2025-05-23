const mongoose = require('mongoose');

const animeGenreSchema = new mongoose.Schema({
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true, index: true },
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('AnimeGenre', animeGenreSchema);