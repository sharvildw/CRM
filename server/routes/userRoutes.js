const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserList,
} = require('../controllers/userController');

router.use(auth);

router.get('/list', getUserList);
router.get('/', roleAuth('Admin', 'Manager'), getUsers);
router.get('/:id', getUser);
router.put('/:id', roleAuth('Admin'), updateUser);
router.delete('/:id', roleAuth('Admin'), deleteUser);

module.exports = router;
