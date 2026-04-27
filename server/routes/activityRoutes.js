const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getActivities, createActivity, getRecentActivities } = require('../controllers/activityController');

router.use(auth);
router.get('/recent', getRecentActivities);
router.get('/', getActivities);
router.post('/', createActivity);

module.exports = router;
