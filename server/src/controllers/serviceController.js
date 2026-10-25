const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all gardening services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const services = await Service.find(query).sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service details by ID or slug
// @route   GET /api/services/:idOrSlug
// @access  Public
const getService = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const service = isId
      ? await Service.findById(idOrSlug)
      : await Service.findOne({ slug: idOrSlug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Gardening service not found',
      });
    }

    // Find available approved gardeners in the platform
    const availableGardeners = await User.find({
      role: 'gardener',
      vendorStatus: 'approved',
      'gardenerProfile.isAvailable': true,
    }).select('name avatar gardenerProfile phone');

    res.status(200).json({
      success: true,
      service,
      availableGardeners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved gardeners
// @route   GET /api/services/gardeners/list
// @access  Public
const getGardeners = async (req, res, next) => {
  try {
    const gardeners = await User.find({
      role: 'gardener',
      vendorStatus: 'approved',
    }).select('name avatar email phone gardenerProfile createdAt');

    res.status(200).json({
      success: true,
      count: gardeners.length,
      gardeners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gardener profile by ID
// @route   GET /api/services/gardeners/:id
// @access  Public
const getGardenerById = async (req, res, next) => {
  try {
    const gardener = await User.findOne({
      _id: req.params.id,
      role: 'gardener',
    }).select('name avatar email phone gardenerProfile createdAt');

    if (!gardener) {
      return res.status(404).json({
        success: false,
        message: 'Gardener profile not found',
      });
    }

    res.status(200).json({
      success: true,
      gardener,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gardening service
// @route   POST /api/services
// @access  Private (Admin only)
const createService = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, durationMinutes, features, image, icon } = req.body;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingService = await Service.findOne({ slug });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'A service with this name already exists',
      });
    }

    const service = await Service.create({
      name,
      slug,
      description,
      category,
      basePrice,
      durationMinutes,
      features,
      image,
      icon,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getService,
  getGardeners,
  getGardenerById,
  createService,
  updateService,
  deleteService,
};
