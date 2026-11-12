import Product from '../models/productModel.js';

const CATEGORIES = [
  'Clothing',
  'Electronics',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

function computeSustainabilityScore(condition) {
  const map = {
    New: 30,
    'Like New': 70,
    Good: 85,
    Fair: 95,
  };

  return map[condition] ?? 50;
}

export async function getProducts(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 24, 60);
    const skip = (page - 1) * limit;

    const filter = { isAvailable: true };

    if (req.query.category && CATEGORIES.includes(req.query.category)) {
      filter.category = req.query.category;
    }

    if (req.query.condition && CONDITIONS.includes(req.query.condition)) {
      filter.condition = req.query.condition;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};

      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    let sort = { createdAt: -1 };

    if (req.query.sort === 'price-low') {
      sort = { price: 1 };
    }

    if (req.query.sort === 'price-high') {
      sort = { price: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('seller', 'name avatar location'),

      Product.countDocuments(filter),
    ]);

    return res.json({
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    console.error('Get products error:', error);

    return res.status(500).json({
      message: 'Failed to load products',
    });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name avatar location bio'
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    return res.json(product);
  } catch (error) {
    console.error('Get product error:', error);

    return res.status(500).json({
      message: 'Failed to load product',
    });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      category,
      condition,
      price,
      images,
      location,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !condition ||
      price === undefined
    ) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
      });
    }

    if (!CONDITIONS.includes(condition)) {
      return res.status(400).json({
        message: 'Invalid condition',
      });
    }

    const parsedPrice = parseFloat(price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        message: 'Please provide a valid price',
      });
    }

    const product = await Product.create({
      title,
      description,
      category,
      condition,
      price: parsedPrice,
      images: images || [],
      location: location || req.user.location || '',
      seller: req.user._id,
      sellerName: req.user.name,
      sustainabilityScore: computeSustainabilityScore(condition),
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);

    return res.status(500).json({
      message: 'Failed to create product',
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to edit this product',
      });
    }

    const updates = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      condition: req.body.condition,
      price:
        req.body.price !== undefined
          ? parseFloat(req.body.price)
          : undefined,
      images: req.body.images,
      location: req.body.location,
      isAvailable: req.body.isAvailable,
    };

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    if (updates.category && !CATEGORIES.includes(updates.category)) {
      return res.status(400).json({
        message: 'Invalid category',
      });
    }

    if (updates.condition && !CONDITIONS.includes(updates.condition)) {
      return res.status(400).json({
        message: 'Invalid condition',
      });
    }

    if (
      updates.price !== undefined &&
      (Number.isNaN(updates.price) || updates.price < 0)
    ) {
      return res.status(400).json({
        message: 'Please provide a valid price',
      });
    }

    if (updates.condition && updates.condition !== product.condition) {
      updates.sustainabilityScore = computeSustainabilityScore(
        updates.condition
      );
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);

    return res.status(500).json({
      message: 'Failed to update product',
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.json({
      message: 'Product removed',
    });
  } catch (error) {
    console.error('Delete product error:', error);

    return res.status(500).json({
      message: 'Failed to delete product',
    });
  }
}

export async function getMyProducts(req, res) {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json(products);
  } catch (error) {
    console.error('Get my products error:', error);

    return res.status(500).json({
      message: 'Failed to load your products',
    });
  }
}

export async function getRelatedProducts(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isAvailable: true,
    })
      .limit(4)
      .sort({ createdAt: -1 });

    return res.json(related);
  } catch (error) {
    console.error('Get related products error:', error);

    return res.status(500).json({
      message: 'Failed to load related products',
    });
  }
}