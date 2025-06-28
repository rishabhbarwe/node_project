// controllers/request.controller.js
const PropertyRequest = require('../models/request.model');
const Property = require('../models/property.model');

// Create a request for a property (tenant only)
exports.createPropertyRequest = async (req, res) => {
  try {
    const user = req.user;
    if (user.usertype !== 'tenant') {
      return res.status(403).json({ error: 'Only tenants can request properties' });
    }

    const { property_id, message } = req.body;

    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const existing = await PropertyRequest.findOne({ tenant: user._id, property: property._id });
    if (existing) {
      return res.status(400).json({ error: 'Request already exists for this property' });
    }

    const newRequest = new PropertyRequest({
      property: property._id,
      tenant: user._id,
      owner: property.owner,
      message
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

// Owner: Get received requests
exports.getReceivedRequests = async (req, res) => {
  try {
    const user = req.user;
    if (user.usertype !== 'owner') {
      return res.status(403).json({ error: 'Only owners can view requests' });
    }

    const requests = await PropertyRequest.find({ owner: user._id })
      .populate('property')
      .populate('tenant');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Tenant: Get sent requests
exports.getSentRequests = async (req, res) => {
  try {
    const user = req.user;
    if (user.usertype !== 'tenant') {
      return res.status(403).json({ error: 'Only tenants can view sent requests' });
    }

    const requests = await PropertyRequest.find({ tenant: user._id })
      .populate('property');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Owner: Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const requestObj = await PropertyRequest.findById(request_id).populate('property');
    if (!requestObj) {
      return res.status(404).json({ error: 'Request not found' });
    }

    requestObj.status = status;
    await requestObj.save();

    // Send owner details if accepted
    let message_to_tenant = `Your request for '${requestObj.property.building_name}' has been ${status}.`;
    if (status === 'accepted') {
      message_to_tenant += `\nContact Owner: ${requestObj.property.owner_name}, ${requestObj.property.email}, ${requestObj.property.mobile}`;
    }

    res.json({
      success: `Request ${status} successfully.`,
      message_to_tenant
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Tenant: Delete request
exports.deletePropertyRequest = async (req, res) => {
  try {
    const user = req.user;
    const { property_id } = req.params;

    const request = await PropertyRequest.findOne({ tenant: user._id, property: property_id });
    if (!request) {
      return res.status(404).json({ error: 'No request found for this property by user' });
    }

    await request.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

// Tenant: Get requested property IDs
exports.getRequestedPropertyIds = async (req, res) => {
  try {
    const requests = await PropertyRequest.find({ tenant: req.user._id });
    const ids = requests.map(req => req.property);
    res.json({ requested_property_ids: ids });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requested property IDs' });
  }
};
