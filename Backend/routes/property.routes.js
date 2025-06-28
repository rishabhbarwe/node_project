// routes/property.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  createProperty,
  getMyProperties,
  getPropertiesByOwnerName,
  getAllProperties
} = require('../controllers/property.controller');

// Image upload middleware (Cloudinary + Multer)
const upload = require('../middleware/upload.middleware'); // I'll give this too if you want

// Create property (authenticated owner, image upload optional)
router.post('/', auth, upload.single('building_image'), createProperty);

// Get properties created by the logged-in owner
router.get('/my', auth, getMyProperties);

// Get all properties (public)
router.get('/all', getAllProperties);

// Get properties by owner's name
router.get('/owner/:owner_name', getPropertiesByOwnerName);

module.exports = router;
