// models/request.model.js
const mongoose = require('mongoose');

const propertyRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },

  message: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Prevent duplicate requests per tenant-property pair
propertyRequestSchema.index({ tenant: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('PropertyRequest', propertyRequestSchema);
