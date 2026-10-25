const Complaint = require('../models/Complaint');

// @desc    File a new complaint or dispute
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { type, referenceId, subject, description, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both subject and description of your issue',
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      type: type || 'Order',
      referenceId: referenceId || '',
      subject,
      description,
      priority: priority || 'Medium',
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted. Our customer care team will review it shortly.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's filed complaints
// @route   GET /api/complaints/my-complaints
// @access  Private
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints/admin/all
// @access  Private (Admin only)
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email phone role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status and resolution (Admin only)
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Admin only)
const resolveComplaint = async (req, res, next) => {
  try {
    const { status, adminNotes, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint ticket not found',
      });
    }

    if (status) complaint.status = status;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;
    if (resolution !== undefined) complaint.resolution = resolution;
    if (status === 'Resolved') complaint.resolvedAt = new Date();

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  resolveComplaint,
};
