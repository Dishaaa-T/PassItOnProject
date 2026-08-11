import Product from '../models/productModel.js';

const CATEGORIES = ['Clothing', 'Electronics', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

function computeSustainabilityScore(condition) {
  const map = { New: 30, 'Like New': 70, Good: 85, Fair: 95 };
  return map[condition] ?? 50;
}

export async function getProducts(req, res) {
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
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'price-low') sort = { price: 1 };
  if (req.query.sort === 'price-high') sort = { price: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name avatar location'),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'name avatar location bio'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
}

export async function createProduct(req, res) {
  const { title, description, category, condition, price, images, location } = req.body;

  if (!title || !description || !category || !condition || price === undefined) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  if (!CATEGORIES.includes(category)) {
    res.status(400);
    throw new Error('Invalid category');
  }

  if (!CONDITIONS.includes(condition)) {
    res.status(400);
    throw new Error('Invalid condition');
  }

  const product = await Product.create({
    title,
    description,
    category,
    condition,
    price: parseFloat(price),
    images: images || [],
    location: location || req.user.location || '',
    seller: req.user._id,
    sellerName: req.user.name,
    sustainabilityScore: computeSustainabilityScore(condition),
  });

  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to edit this product');
  }

  const updates = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    condition: req.body.condition,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : undefined,
    images: req.body.images,
    location: req.body.location,
    isAvailable: req.body.isAvailable,
  };

  Object.keys(updates).forEach(
    (key) => updates[key] === undefined && delete updates[key]
  );

  if (updates.condition && updates.condition !== product.condition) {
    updates.sustainabilityScore = computeSustainabilityScore(updates.condition);
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
}

export async function getMyProducts(req, res) {
  const products = await Product.find({ seller: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(products);
}

export async function getRelatedProducts(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isAvailable: true,
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.json(related);
}
