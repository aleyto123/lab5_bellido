// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/NotificationController");

// GET /notifications
router.get("/", notificationController.list);

module.exports = router;
