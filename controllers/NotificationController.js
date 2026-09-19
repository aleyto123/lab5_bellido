// controllers/NotificationController.js
const NotificationService = require("../services/NotificationService");

const notificationService = new NotificationService();

// GET /notifications
const list = (req, res) => {
  try {
    const notifications = notificationService.list();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  list,
};
