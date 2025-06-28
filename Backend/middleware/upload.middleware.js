// middleware/upload.middleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'property_images', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

// Set up multer
const upload = multer({ storage });

module.exports = upload;
