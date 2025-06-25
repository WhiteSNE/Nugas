const express = require('express');
const router = express.Router();

// adminRoutes.js
const {
  convertPreRegistrations,
  getAllPreRegistrations
} = require('../controllers/registrationController');
const {
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  adminResetPassword
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

router.post('/convert-pre-registrations', protect, authorize('admin'), convertPreRegistrations);
router.post('/reset-password', protect, authorize('admin'), adminResetPassword);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/registrations', protect, authorize('admin'), getAllPreRegistrations);

module.exports = router;
