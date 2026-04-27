const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  convertToCustomer,
  getLeadStats,
} = require('../controllers/leadController');

router.use(auth);

router.get('/stats', getLeadStats);
router.get('/', getLeads);
router.get('/:id', getLead);

router.post('/', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
], validate, createLead);

router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/:id/notes', [
  body('text').trim().notEmpty().withMessage('Note text is required'),
], validate, addNote);
router.post('/:id/convert', convertToCustomer);

module.exports = router;
