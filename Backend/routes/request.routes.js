// routes/request.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  createPropertyRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  deletePropertyRequest,
  getRequestedPropertyIds
} = require('../controllers/request.controller');

// Create a new property request (tenant)
router.post('/', auth, createPropertyRequest);

// Owner: View received requests
router.get('/owner', auth, getReceivedRequests);

// Tenant: View sent requests
router.get('/tenant', auth, getSentRequests);

// Update request status (owner)
router.patch('/:request_id/status', auth, updateRequestStatus);

// Tenant: Delete request
router.delete('/:property_id', auth, deletePropertyRequest);

// Tenant: Get requested property IDs
router.get('/requested-ids', auth, getRequestedPropertyIds);

module.exports = router;
