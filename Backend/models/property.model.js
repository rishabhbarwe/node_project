// models/property.model.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  building_name: { type: String },
  owner_name: { type: String, default: "Unknown" },
  building_image: { type: String }, // Cloudinary image URL

  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },

  mobile: { type: String },
  alt_mobile: { type: String },
  email: { type: String },
  alt_email: { type: String },

  rent_from: { type: Number },
  rent_to: { type: Number },

  facilities: {
    type: Map,
    of: String,
    default: {}
  },

  room_types: [
    {
      type: Object
      // should include: {type: "1BHK", image: "url", etc.}
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
