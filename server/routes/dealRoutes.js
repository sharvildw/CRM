const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getDeals,
  getPipeline,
  getDeal,
  createDeal,
  updateDeal,
  updateStage,
  deleteDeal,
  getDealStats,
} = require('../controllers/dealController');

router.use(auth);

router.get('/stats', getDealStats);
router.get('/pipeline', getPipeline);
router.get('/', getDeals);
router.get('/:id', getDeal);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Deal title is required'),
  body('value').isNumeric().withMessage('Deal value must be a number'),
], validate, createDeal);

router.put('/:id', updateDeal);
router.put('/:id/stage', [
  body('stage').notEmpty().withMessage('Stage is required'),
], validate, updateStage);
router.delete('/:id', deleteDeal);

module.exports = router;
