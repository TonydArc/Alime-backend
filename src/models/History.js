const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', index: true },
  progress: { type: Number, default: 0 },
  watchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);