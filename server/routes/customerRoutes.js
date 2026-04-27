const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addNote,
  getCustomerStats,
} = require('../controllers/customerController');

router.use(auth);

router.get('/stats', getCustomerStats);
router.get('/', getCustomers);
router.get('/:id', getCustomer);

router.post('/', [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
], validate, createCustomer);

router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/:id/notes', [
  body('text').trim().notEmpty().withMessage('Note text is required'),
], validate, addNote);

module.exports = router;
