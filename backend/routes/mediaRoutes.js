const express = require('express');
const router = express.Router();
const { uploadMedia, getAllMedia, deleteMedia, updateMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route untuk mendapatkan semua media
router.get('/', getAllMedia);

// Route privat yang dilindungi untuk admin
router.post('/upload', protect, authorize('admin'), upload.single('image'), uploadMedia);
router.delete('/:id', protect, authorize('admin'), deleteMedia); 
router.put('/:id', protect, authorize('admin'), updateMedia);

module.exports = router;