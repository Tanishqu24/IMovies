const express = require('express');
const { getAdminStats, getManagerStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminStats);
router.get('/manager', authorize('manager', 'admin'), getManagerStats);

module.exports = router;

