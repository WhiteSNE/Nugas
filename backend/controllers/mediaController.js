const { Media, User } = require('../models');
const fs = require('fs');
const path = require('path');

// @desc    Upload file baru ke galeri
// @route   POST /api/media/upload
// @access  Private/Admin
exports.uploadMedia = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Mohon upload sebuah file' });
		}

		const { title } = req.body;
		if (!title) {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({ message: 'Mohon berikan judul' });
		}
		const absolutePath = req.file.path.replace(/\\/g, '/');
		const relativePath = 'uploads/' + absolutePath.split('/uploads/')[1];

		const newMedia = await Media.create({
			title,
			path: relativePath,
			uploader_id: req.user.id,
			type: 'gallery'
		});

		res.status(201).json(newMedia);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Mendapatkan semua media dengan tipe 'gallery'
// @route   GET /api/media
// @access  Public
exports.getAllMedia = async (req, res) => {
	try {
		const media = await Media.findAll({
			where: { type: 'gallery' },
			order: [['created_at', 'DESC']],
			include: { model: User, attributes: ['id', 'name'] }
		});
		res.status(200).json(media);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Hapus file media
// @route   DELETE /api/media/:id
// @access  Private/Admin
exports.deleteMedia = async (req, res) => {
	try {
		const media = await Media.findByPk(req.params.id);
		if (!media) {
			return res.status(404).json({ message: 'Media tidak ditemukan' });
		}

		const fullPath = path.join(__dirname, '..', 'public', media.path);
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
		}

		await media.destroy();
		res.status(200).json({ message: 'File media berhasil dihapus' });
	} catch (error) {
		console.error('Error saat menghapus media:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// @desc    Update metadata media (termasuk mengganti file)
// @route   PUT /api/media/:id
// @access  Private/Admin
exports.updateMedia = async (req, res) => {
	try {
		const media = await Media.findByPk(req.params.id);
		if (!media) {
			if (req.file) fs.unlinkSync(req.file.path);
			return res.status(404).json({ message: 'Media tidak ditemukan' });
		}

		media.title = req.body.title || media.title;

		if (req.file) {
			const oldFullPath = path.join(__dirname, '..', 'public', media.path);
			if (fs.existsSync(oldFullPath)) {
				fs.unlinkSync(oldFullPath);
			}
			const absolutePath = req.file.path.replace(/\\/g, '/');
			const relativePath = 'uploads/' + absolutePath.split('/uploads/')[1];

			media.path = relativePath;
		}

		await media.save();
		res.status(200).json(media);
	} catch (error) {
		console.error('Error saat update media:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};