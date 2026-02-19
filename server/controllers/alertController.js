const Alert = require('../models/Alert');

// Get all alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.findAll();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    next(error);
  }
};

// Get alert by ID
const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    next(error);
  }
};

// Get alerts by status
const getAlertsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const alerts = await Alert.findByStatus(status);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts by status:', error);
    next(error);
  }
};

// Create a new alert
const createAlert = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const alert = await Alert.create({ title, description, status });
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    next(error);
  }
};

// Update an alert
const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const alert = await Alert.update(id, { title, description, status });
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    next(error);
  }
};

// Delete an alert
const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Alert.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    next(error);
  }
};

module.exports = {
  getAlerts,
  getAlertById,
  getAlertsByStatus,
  createAlert,
  updateAlert,
  deleteAlert
};
