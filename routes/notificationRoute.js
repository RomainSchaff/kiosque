const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/notificationController');

router.put('/toSeen', NotificationController.updateToSeenNotifications);
router.put('/toUnseen', NotificationController.updateToUnseenNotifications);

module.exports = router;