const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "room", required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
  userid: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("message", MessageSchema);