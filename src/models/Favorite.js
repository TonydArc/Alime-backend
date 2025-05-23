const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', index: true },
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
