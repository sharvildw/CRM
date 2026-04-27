const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { getSettings, updateSettings } = require('../controllers/settingController');

router.use(auth);
router.get('/', getSettings);
router.put('/', roleAuth('Admin'), updateSettings);

module.exports = router;
