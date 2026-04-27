const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getCommunications, getCommunication, createCommunication, updateCommunication, deleteCommunication } = require('../controllers/communicationController');

router.use(auth);
router.get('/', getCommunications);
router.get('/:id', getCommunication);
router.post('/', [
  body('type').notEmpty().withMessage('Type is required'),
  body('relatedToType').notEmpty().withMessage('Related type is required'),
  body('relatedToId').notEmpty().withMessage('Related ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
], validate, createCommunication);
router.put('/:id', updateCommunication);
router.delete('/:id', deleteCommunication);

module.exports = router;
