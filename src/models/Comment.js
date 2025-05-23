const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
