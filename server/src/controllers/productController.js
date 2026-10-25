const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with searching, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      indoorOutdoor,
      difficulty,
      minPrice,
      maxPrice,
      inStock,
      featured,
      nursery,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { botanicalName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    // Category filter (support category ObjectId or slug)
    if (category && category !== 'all') {
      const isId = category.match(/^[0-9a-fA-F]{24}$/);
      if (isId) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Indoor/Outdoor filter
    if (indoorOutdoor && indoorOutdoor !== 'all') {
      query.indoorOutdoor = { $in: [indoorOutdoor, 'both'] };
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Nursery filter
    if (nursery) {
      query.nursery = nursery;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { ratingsAverage: -1, ratingsQuantity: -1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };
    else if (sort === 'name-desc') sortOptions = { name: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .populate('nursery', 'name nurseryProfile')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details by ID with related items
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon description')
      .populate('nursery', 'name email phone nurseryProfile');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch related products from the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Approved Nursery or Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      botanicalName,
      description,
      shortDescription,
      price,
      originalPrice,
      stock,
      category,
      images,
      indoorOutdoor,
      careGuide,
      difficulty,
      isFeatured,
      tags,
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category specified',
      });
    }

    const product = await Product.create({
      name,
      botanicalName,
      description,
      shortDescription: shortDescription || (description ? description.slice(0, 150) + '...' : ''),
      price,
      originalPrice: originalPrice || Math.round(Number(price) * 1.25),
      stock,
      category,
      images: images && images.length > 0 ? images : undefined,
      indoorOutdoor: indoorOutdoor || 'both',
      careGuide: careGuide || undefined,
      difficulty: difficulty || 'Beginner Friendly',
      nursery: req.user._id,
      isFeatured: req.user.role === 'admin' ? Boolean(isFeatured) : false,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Product listing created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product Owner Nursery or Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (
      product.nursery.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product listing',
      });
    }

    // If changing category, verify new category
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category specified',
        });
      }
    }

    // Only admin can toggle isFeatured
    if (req.body.isFeatured !== undefined && req.user.role !== 'admin') {
      delete req.body.isFeatured;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('nursery', 'name nurseryProfile');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product Owner Nursery or Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (
      product.nursery.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product listing',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current nursery vendor's products
// @route   GET /api/products/vendor/my-products
// @access  Private (Approved Nursery)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ nursery: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
