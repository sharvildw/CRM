const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');

router.use(auth);

router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.get('/:id', getTask);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required'),
], validate, createTask);

router.put('/:id', updateTask);
router.put('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

module.exports = router;
