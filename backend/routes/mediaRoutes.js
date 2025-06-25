const express = require('express');
const router = express.Router();
const { uploadMedia, getAllMedia, deleteMedia, updateMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');

const createUploader = require('../middleware/uploadMiddleware');
const mediaUploader = createUploader('media');

router.get('/', getAllMedia);
router.post('/upload', protect, authorize('admin'), mediaUploader.single('image'), uploadMedia);
router.delete('/:id', protect, authorize('admin'), deleteMedia); 
router.put('/:id', protect, authorize('admin'), mediaUploader.single('image'), updateMedia);

module.exports = router;