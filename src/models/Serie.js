const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Series', seriesSchema);