const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Category = require('../models/Category');

// @desc    Get system-wide overview statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalNurseries = await User.countDocuments({ role: 'nursery' });
    const totalGardeners = await User.countDocuments({ role: 'gardener' });

    const pendingApprovalsCount = await User.countDocuments({
      role: { $in: ['nursery', 'gardener'] },
      vendorStatus: 'pending',
    });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });

    // Revenue calculation from completed/paid orders
    const completedOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('gardener', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalNurseries,
        totalGardeners,
        pendingApprovalsCount,
        totalProducts,
        totalOrders,
        totalBookings,
        openComplaints,
        totalRevenue,
      },
      recentOrders,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending vendor/gardener registrations
// @route   GET /api/admin/pending-vendors
// @access  Private (Admin only)
const getPendingVendors = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({
      role: { $in: ['nursery', 'gardener'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      vendors: pendingUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject vendor/gardener registration
// @route   PUT /api/admin/vendors/:id/status
// @access  Private (Admin only)
const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected' | 'pending'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.vendorStatus = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status or update user role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive, vendorStatus } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deactivating own admin account accidentally
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own active admin account',
      });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (vendorStatus) user.vendorStatus = vendorStatus;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User account updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across system
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all service bookings across system
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('gardener', 'name email phone')
      .populate('service', 'name category basePrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getPendingVendors,
  updateVendorStatus,
  getAllUsers,
  updateUser,
  getAllOrders,
  getAllBookings,
};
