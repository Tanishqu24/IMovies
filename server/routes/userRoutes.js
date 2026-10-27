const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getManagers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/managers/list', authorize('admin'), getManagers);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;

