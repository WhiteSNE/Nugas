const express = require('express');
const router = express.Router();
const {
  getAllChangelogs,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog
} = require('../controllers/changelogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rute Publik
router.get('/', getAllChangelogs);
router.get('/:id', getChangelogById);

// Rute Khusus Admin (terproteksi)
router.post('/', protect, authorize('admin'), createChangelog);
router.put('/:id', protect, authorize('admin'), updateChangelog);
router.delete('/:id', protect, authorize('admin'), deleteChangelog);

module.exports = router;