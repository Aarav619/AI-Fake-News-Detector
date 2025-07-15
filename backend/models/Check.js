const mongoose = require('mongoose');

const CheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  verdict: String,
  reasoning: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Check', CheckSchema);
