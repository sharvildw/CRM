const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const r = require('../controllers/reportController');

router.use(auth);
router.get('/dashboard', r.getDashboardStats);
router.get('/lead-conversion', r.getLeadConversion);
router.get('/lead-sources', r.getLeadSources);
router.get('/sales-performance', r.getSalesPerformance);
router.get('/deal-stages', r.getDealStages);
router.get('/revenue', r.getRevenueTrends);
router.get('/task-completion', r.getTaskCompletion);
router.get('/customer-growth', r.getCustomerGrowth);
router.get('/top-performers', r.getTopPerformers);
router.get('/won-vs-lost', r.getWonVsLost);

module.exports = router;
