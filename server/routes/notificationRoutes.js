const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController');

router.use(auth);
router.get('/unread-count', getUnreadCount);
router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
