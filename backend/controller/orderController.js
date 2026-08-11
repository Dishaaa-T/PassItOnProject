import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export async function createOrder(req, res) {
  const { productId, shippingAddress } = req.body;

  if (!productId || !shippingAddress) {
    res.status(400);
    throw new Error('Product and shipping address are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!product.isAvailable) {
    res.status(400);
    throw new Error('This product is no longer available');
  }

  if (product.seller.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot buy your own listing');
  }

  const order = await Order.create({
    buyer: req.user._id,
    product: product._id,
    seller: product.seller,
    price: product.price,
    status: 'paid',
    shippingAddress,
  });

  product.isAvailable = false;
  await product.save();

  const populated = await Order.findById(order._id)
    .populate('product', 'title images category')
    .populate('seller', 'name')
    .populate('buyer', 'name');

  res.status(201).json(populated);
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('product', 'title images category price')
    .populate('seller', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(orders);
}

export async function getMySales(req, res) {
  const orders = await Order.find({ seller: req.user._id })
    .populate('product', 'title images category price')
    .populate('buyer', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(orders);
}

export async function updateOrderStatus(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isSeller = order.seller.toString() === req.user._id.toString();
  const isBuyer = order.buyer.toString() === req.user._id.toString();

  if (!isSeller && !isBuyer) {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  const { status } = req.body;
  const validTransitions = {
    pending: ['paid', 'cancelled'],
    paid: ['shipped', 'cancelled'],
    shipped: ['completed'],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[order.status].includes(status)) {
    res.status(400);
    throw new Error(`Cannot change status from ${order.status} to ${status}`);
  }

  order.status = status;
  await order.save();

  const updated = await Order.findById(order._id)
    .populate('product', 'title images category price')
    .populate('seller', 'name')
    .populate('buyer', 'name');

  res.json(updated);
}
