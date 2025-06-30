// controllers/property.controller.js
const Property = require('../models/property.model');
const User = require('../models/user.model');

// Create property (for owner)
exports.createProperty = async (req, res) => {
  try {
    const {
      building_name, owner_name, address, city, state,
      pincode, mobile, alt_mobile, email, alt_email,
      rent_from, rent_to, room_types
    } = req.body;

    const building_image = req.file?.path || null; // Cloudinary image URL (set via multer + cloudinary)

    let facilities = req.body.facilities;

    if (typeof facilities === 'string') {
       try {
          facilities = JSON.parse(facilities);
       } catch (err) {
            return res.status(400).json({ message: "Invalid facilities format" });
      }
    }


    const property = new Property({
      owner: req.user._id, // set by auth middleware
      building_name,
      owner_name,
      building_image,
      address,
      city,
      state,
      pincode,
      mobile,
      alt_mobile,
      email,
      alt_email,
      rent_from,
      rent_to,
      facilities,
      room_types: room_types || []
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error('Property Create Error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// Get properties for current owner
exports.getMyProperties = async (req, res) => {
  try {
    const user = req.user;
    if (user.usertype !== 'owner') {
      return res.status(403).json({ error: 'Only owners can view properties' });
    }

    const properties = await Property.find({ owner: user._id });
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get properties by owner's name
exports.getPropertiesByOwnerName = async (req, res) => {
  try {
    const { owner_name } = req.params;
    const properties = await Property.find({ owner_name });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Get all properties (public)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};
