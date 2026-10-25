const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Create new service booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      serviceId,
      gardenerId,
      bookingDate,
      timeSlot,
      serviceAddress,
      paymentMethod,
      notes,
    } = req.body;

    if (!serviceId || !gardenerId || !bookingDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service, gardener, date, and time slot',
      });
    }

    if (!serviceAddress || !serviceAddress.fullName || !serviceAddress.phone || !serviceAddress.addressLine || !serviceAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete service location details',
      });
    }

    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Gardening service not found',
      });
    }

    // Verify gardener exists and is approved
    const gardener = await User.findOne({
      _id: gardenerId,
      role: 'gardener',
      vendorStatus: 'approved',
    });
    if (!gardener) {
      return res.status(404).json({
        success: false,
        message: 'Gardener not found or not currently active',
      });
    }

    // Check if slot is already booked for this gardener on the requested date
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      gardener: gardenerId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['Pending', 'Confirmed', 'In Progress'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `This time slot (${timeSlot}) is already booked for ${gardener.name}. Please select another time slot or date.`,
      });
    }

    const price = service.basePrice;
    const paymentStatus = paymentMethod === 'Demo Online Payment (Card / UPI)' ? 'Paid' : 'Pending';

    const booking = await Booking.create({
      customer: req.user._id,
      gardener: gardenerId,
      service: serviceId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      serviceAddress,
      price,
      paymentMethod: paymentMethod || 'Cash after Service',
      paymentStatus,
      status: 'Pending',
      notes: notes || '',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'name slug category icon image basePrice')
      .populate('gardener', 'name email phone avatar gardenerProfile');

    res.status(201).json({
      success: true,
      message: 'Service appointment requested successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'name slug category icon image')
      .populate('gardener', 'name email phone avatar gardenerProfile')
      .sort({ bookingDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gardener's incoming bookings
// @route   GET /api/bookings/gardener/incoming
// @access  Private (Approved Gardener)
const getGardenerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ gardener: req.user._id })
      .populate('service', 'name slug category basePrice durationMinutes')
      .populate('customer', 'name email phone')
      .sort({ bookingDate: -1 });

    // Calculate earnings summary
    const completedBookings = bookings.filter((b) => b.status === 'Completed');
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const activeBookings = bookings.filter((b) => ['Pending', 'Confirmed', 'In Progress'].includes(b.status));

    res.status(200).json({
      success: true,
      count: bookings.length,
      summary: {
        totalBookings: bookings.length,
        completedCount: completedBookings.length,
        activeCount: activeBookings.length,
        totalEarnings,
      },
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('gardener', 'name email phone avatar gardenerProfile')
      .populate('service', 'name slug category basePrice durationMinutes features');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isGardener = booking.gardener._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isGardener && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Accept, Reject, In Progress, Complete, Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Gardener, Customer to cancel, or Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isGardener = booking.gardener.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Customer can only cancel
    if (isCustomer && !isGardener && !isAdmin) {
      if (status !== 'Cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only cancel appointments',
        });
      }
      if (booking.status === 'Completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel a completed service',
        });
      }
    } else if (!isGardener && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    if (status) {
      booking.status = status;
      if (status === 'Completed') {
        booking.completedAt = new Date();
        booking.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service', 'name slug category')
      .populate('gardener', 'name email phone')
      .populate('customer', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${booking.status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getGardenerBookings,
  getBookingById,
  updateBookingStatus,
};
