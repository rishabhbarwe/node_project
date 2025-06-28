// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/properties', require('./property.routes'));
router.use('/requests', require('./request.routes'));

module.exports = router;
