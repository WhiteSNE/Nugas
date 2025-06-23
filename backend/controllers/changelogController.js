const { Changelog, User, Sequelize } = require('../models');

// @desc    Get all changelogs
// @route   GET /api/changelogs
// @access  Public
exports.getAllChangelogs = async (req, res) => {
  try {
    const { category } = req.query;

    const whereClause = {};
    if (category && category.toLowerCase() !== 'latest') {
      // Gunakan Sequelize.where untuk perbandingan case-insensitive
      whereClause.category = Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('category')), 
        '=', 
        category.toLowerCase()
      );
    }

    const changelogs = await Changelog.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: {
        model: User,
        attributes: ['id', 'name'],
      },
    });

    res.status(200).json(changelogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single changelog by ID
// @route   GET /api/changelogs/:id
// @access  Public
exports.getChangelogById = async (req, res) => {
    try {
        const changelog = await Changelog.findByPk(req.params.id, {
          include: { model: User, attributes: ['id', 'name'] },
        });
        if (!changelog) {
            return res.status(404).json({ message: 'Changelog not found' });
        }
        res.status(200).json(changelog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new changelog
// @route   POST /api/changelogs
// @access  Private/Admin
exports.createChangelog = async (req, res) => {
    const { title, category, content } = req.body;
    try {
        const newChangelog = await Changelog.create({
            title,
            category,
            content,
            user_id: req.user.id // Diambil dari middleware 'protect'
        });
        res.status(201).json(newChangelog);
    } catch (error) {
        console.error("Error creating changelog:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a changelog
// @route   PUT /api/changelogs/:id
// @access  Private/Admin
exports.updateChangelog = async (req, res) => {
  try {
    const changelog = await Changelog.findByPk(req.params.id);
    if (!changelog) {
      return res.status(404).json({ message: 'Changelog not found' });
    }
    const updatedChangelog = await changelog.update(req.body);
    res.status(200).json(updatedChangelog);
  } catch (error) {
    console.error("Error updating changelog:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a changelog
// @route   DELETE /api/changelogs/:id
// @access  Private/Admin
exports.deleteChangelog = async (req, res) => {
  try {
    const changelog = await Changelog.findByPk(req.params.id);
    if (!changelog) {
      return res.status(404).json({ message: 'Changelog not found' });
    }
    await changelog.destroy();
    res.status(200).json({ message: 'Changelog removed' });
  } catch (error) {
    console.error("Error deleting changelog:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};