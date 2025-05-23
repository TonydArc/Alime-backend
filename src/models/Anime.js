const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  studios: String,
  type: String,
  premiered: String,
  episodes: Number,
  currentEpisodes: Number,
  thumbnailPublicId: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  ratedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed', 'cancelled'], default: 'ongoing' },
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
}, { timestamps: true });


module.exports = mongoose.model('Anime', animeSchema);
