const { Media, User } = require('../models');
const fs = require('fs');
const path = require('path');

// @desc    Upload a new media file
// @route   POST /api/media/upload
// @access  Private
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title } = req.body;
    if (!title) {
        // If upload fails, delete the orphaned file from disk
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Please provide a title' });
    }

    // Create a URL-friendly path
    const filePath = req.file.path.replace(/\\/g, "/").replace('public/', '');

    const newMedia = await Media.create({
      title,
      path: filePath,
      uploader_id: req.user.id,
    });

    res.status(201).json(newMedia);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all media records
// @route   GET /api/media
// @access  Public
exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.findAll({
            order: [['created_at', 'DESC']],
            include: { model: User, attributes: ['id', 'name'] }
        });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a media file
// @route   DELETE /api/media/:id
// @access  Private
exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        
        // Check if user is the owner or an admin
        if(media.uploader_id !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({ message: 'User not authorized to delete this file' });
        }

        // Delete file from the server's file system
        const fullPath = path.join(__dirname, '..', 'public', media.path);
        fs.unlink(fullPath, (err) => {
            if(err){
                console.error("Error deleting physical file:", err);
                // We won't stop the process, as we still want to delete the DB record
            }
        });

        // Delete record from the database
        await media.destroy();

        res.status(200).json({ message: 'Media file deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};