// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usertype: {
    type: String,
    enum: ['tenant', 'owner'],
    required: true
  },
  name: { type: String, required: true },
  phone: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
