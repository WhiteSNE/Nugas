const { Changelog, Media, User } = require('../models');
const fs = require('fs');
const path = require('path');

const createRelativePath = (absolutePath) => {
	const pathWithForwardSlashes = absolutePath.replace(/\\/g, '/');
	return 'uploads/' + pathWithForwardSlashes.split('/uploads/')[1];
};

exports.createChangelog = async (req, res) => {
	const { title, category, content } = req.body;
	try {
		const newChangelog = await Changelog.create({
			title,
			category,
			content,
			author_id: req.user.id
		});

		if (req.file) {
			const bannerPath = createRelativePath(req.file.path);
			await Media.create({
				title: `Banner for changelog: ${title}`,
				path: bannerPath,
				uploader_id: req.user.id,
				type: 'banner',
				status: 'permanent'
			});
			newChangelog.bannerImageUrl = bannerPath;
			await newChangelog.save();
		}
		res.status(201).json(newChangelog);
	} catch (error) {
		if (req.file) fs.unlinkSync(req.file.path);
		console.error('Error creating changelog:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};
exports.updateChangelog = async (req, res) => {
	try {
		const changelog = await Changelog.findByPk(req.params.id);
		if (!changelog) {
			return res.status(404).json({ message: 'Changelog tidak ditemukan' });
		}
		if (req.file) {
			if (changelog.bannerImageUrl) {
				const oldBannerPath = path.join(__dirname, '..', 'public', changelog.bannerImageUrl);
				if (fs.existsSync(oldBannerPath)) {
					fs.unlinkSync(oldBannerPath);
				}
				await Media.destroy({ where: { path: changelog.bannerImageUrl } });
			}
			const newBannerPath = createRelativePath(req.file.path);
			await Media.create({
				title: `Banner for changelog: ${req.body.title || changelog.title}`,
				path: newBannerPath,
				uploader_id: req.user.id,
				type: 'banner'
			});
			changelog.bannerImageUrl = newBannerPath;
		}
		changelog.title = req.body.title || changelog.title;
		changelog.category = req.body.category || changelog.category;
		changelog.content = req.body.content || changelog.content;
		await changelog.save();
		res.status(200).json(changelog);
	} catch (error) {
		if (req.file) fs.unlinkSync(req.file.path);
		console.error('Error updating changelog:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.uploadChangelogImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Mohon upload sebuah file' });
		}
		const imagePath = createRelativePath(req.file.path);
		await Media.create({
			title: `Content image: ${req.file.filename}`,
			path: imagePath,
			uploader_id: req.user.id,
			type: 'content',
			status: 'permanent'
		});
		const fileUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;
		res.status(200).json({ url: fileUrl });
	} catch (error) {
		if (req.file) fs.unlinkSync(req.file.path);
		console.error('Error uploading content image:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getAllChangelogs = async (req, res) => {
	try {
		const { category } = req.query;
		let whereClause = {};

		if (category && category !== 'latest') {
			whereClause.category = category;
		}

		const changelogs = await Changelog.findAll({
			where: whereClause,
			order: [['created_at', 'DESC']],
			include: { model: User, attributes: ['id', 'name'] }
		});
		res.status(200).json(changelogs);
	} catch (error) {
		console.error('Error fetching changelogs:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getChangelogById = async (req, res) => {
	try {
		const changelog = await Changelog.findByPk(req.params.id, {
			include: { model: User, attributes: ['id', 'name'] }
		});

		if (!changelog) {
			return res.status(404).json({ message: 'Changelog tidak ditemukan' });
		}
		res.status(200).json(changelog);
	} catch (error) {
		console.error('Error fetching changelog by ID:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteChangelog = async (req, res) => {
	try {
		const changelog = await Changelog.findByPk(req.params.id);
		if (!changelog) {
			return res.status(404).json({ message: 'Changelog tidak ditemukan' });
		}

		if (changelog.bannerImageUrl) {
			const bannerPath = path.join(__dirname, '..', 'public', changelog.bannerImageUrl);
			if (fs.existsSync(bannerPath)) {
				fs.unlinkSync(bannerPath);
			}
			await Media.destroy({ where: { path: changelog.bannerImageUrl } });
		}

		await changelog.destroy();
		res.status(200).json({ message: 'Changelog berhasil dihapus' });
	} catch (error) {
		console.error('Error deleting changelog:', error);
		res.status(500).json({ message: 'Server error' });
	}
};