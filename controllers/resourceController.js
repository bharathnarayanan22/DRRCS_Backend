const Resource = require('../models/resourceModel');

const createResource = async (req, res) => {
  const { type, quantity, location } = req.body;
  const donor = req.user;

  try {
    const resource = new Resource({ type, quantity, location, donor });
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('donor', ['name', 'email']);
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateResource = async (req, res) => {;
  const { id } = req.params;

  try {
    const resource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateResourceStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const resource = await Resource.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
  
      res.json(resource);
    } catch (err) {
      console.error('Error updating resource status:', err.message);
      res.status(500).send('Server error');
    }
  };

  const deleteResource = async (req, res) => {
    const { id } = req.params;
  
    try {
      const resource = await Resource.findByIdAndDelete(id);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
  
      res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err.message);
      res.status(500).send('Server error');
    }
  };

module.exports = { createResource, getResources, updateResource, updateResourceStatus, deleteResource }