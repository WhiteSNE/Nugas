const express = require('express');
const router = express.Router();
const {
  createChangelog,
  getAllChangelogs,
  getChangelogById,
  updateChangelog,
  deleteChangelog,
} = require('../controllers/changelogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllChangelogs);
router.get('/:id', getChangelogById);

// Admin-only routes
router.post('/', protect, authorize('admin'), createChangelog);
router.put('/:id', protect, authorize('admin'), updateChangelog);
router.delete('/:id', protect, authorize('admin'), deleteChangelog);

module.exports = router;