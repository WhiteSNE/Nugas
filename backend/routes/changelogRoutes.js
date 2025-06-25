const express = require('express');
const router = express.Router();

const {
  getAllChangelogs,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
  uploadChangelogImage
} = require('../controllers/changelogController');

const { protect, authorize } = require('../middleware/authMiddleware');


const createUploader = require('../middleware/uploadMiddleware');
const bannerUploader = createUploader('banners');
const contentImageUploader = createUploader('changelogs');

router.get('/', getAllChangelogs);
router.get('/:id', getChangelogById);
router.post(
  '/upload-image',
  protect,
  authorize('admin'),
  contentImageUploader.single('image'),
  uploadChangelogImage
);
router.post('/', protect, authorize('admin'), bannerUploader.single('bannerImage'), createChangelog);
router.put('/:id', protect, authorize('admin'), bannerUploader.single('bannerImage'), updateChangelog);
router.delete('/:id', protect, authorize('admin'), deleteChangelog);

module.exports = router;