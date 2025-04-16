const mongoose = require('mongoose');
const CommunicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  to: String,
  subject: String,
  body: String,
  type: String,
  status: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Communication', CommunicationSchema);
