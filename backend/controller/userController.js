import User from '../models/userModel.js';

export async function updateProfile(req, res) {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.location = req.body.location !== undefined ? req.body.location : user.location;

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    location: updated.location,
  });
}

export async function getUserStats(req, res) {
  const [Product] = await Promise.all([
    import('../models/productModel.js').then((m) => m.default),
  ]);

  const productCount = await Product.countDocuments({ seller: req.user._id });
  const activeCount = await Product.countDocuments({
    seller: req.user._id,
    isAvailable: true,
  });

  res.json({
    totalListings: productCount,
    activeListings: activeCount,
  });
}
