const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);