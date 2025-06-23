const express = require('express');
const router = express.Router();

// Impor controller yang sudah ada dan yang baru
const { convertPreRegistrations } = require('../controllers/registrationController');
const { getStats } = require('../controllers/adminController'); // <-- PASTIKAN INI DIIMPOR

// Impor middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Rute yang sudah ada
router.post('/convert-pre-registrations', protect, authorize('admin'), convertPreRegistrations);

// ===== TAMBAHKAN RUTE BARU UNTUK STATISTIK DI SINI =====
router.get('/stats', protect, authorize('admin'), getStats);
// ========================================================

module.exports = router;