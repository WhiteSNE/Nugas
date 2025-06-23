// Ganti isi file: routes/mediaRoutes.js

const express = require('express');
const router = express.Router();
const { uploadMedia, getAllMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware'); // <-- Impor authorize
const upload = require('../middleware/uploadMiddleware');

// Public route untuk mendapatkan semua media
router.get('/', getAllMedia);

// Route privat yang dilindungi
router.post('/upload', protect, authorize('admin'), upload.single('image'), uploadMedia); // <-- Tambahkan authorize('admin')
router.delete('/:id', protect, deleteMedia); // Logika otorisasi sudah ada di controller

module.exports = router;