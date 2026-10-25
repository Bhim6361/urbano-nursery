const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to generate readable order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `URB-${timestamp}-${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer / Any authenticated user)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, deliveryNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery address details',
      });
    }

    // Verify stock and fetch accurate real prices from database
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} was not found`,
        });
      }

      const qty = parseInt(item.quantity, 10) || 1;

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${product.name}'. Only ${product.stock} units left.`,
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.images && product.images[0] ? product.images[0] : '',
        nursery: product.nursery,
      });

      // Decrement stock
      product.stock -= qty;
      await product.save();
    }

    // Server-side calculation
    // Free shipping above 999 INR, otherwise 99 INR
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const totalAmount = subtotal + shippingFee;

    const paymentStatus = paymentMethod === 'Demo Online Payment (Card / UPI)' ? 'Paid' : 'Pending';

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus,
      orderStatus: 'Pending',
      subtotal,
      shippingFee,
      totalAmount,
      deliveryNotes: deliveryNotes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
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

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner, Vendor for their items, or Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images botanicalName price')
      .populate('items.nursery', 'name nurseryProfile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization: Customer owner, Admin, or Vendor with item in order
    const isOwner = order.customer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isItemVendor = order.items.some(
      (item) => item.nursery && item.nursery._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isAdmin && !isItemVendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (Customer can cancel if Pending; restores stock)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isOwner = order.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`,
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (For Admin or Nursery Vendor)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin or Nursery)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isItemVendor = order.items.some(
      (item) => item.nursery && item.nursery.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isItemVendor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status for this order',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor's incoming orders
// @route   GET /api/orders/vendor/incoming
// @access  Private (Approved Nursery)
const getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'items.nursery': req.user._id,
    })
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getVendorOrders,
};
