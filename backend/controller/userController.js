import User from '../models/userModel.js';

export async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    user.name = req.body.name || user.name;

    user.avatar =
      req.body.avatar !== undefined
        ? req.body.avatar
        : user.avatar;

    user.bio =
      req.body.bio !== undefined
        ? req.body.bio
        : user.bio;

    user.location =
      req.body.location !== undefined
        ? req.body.location
        : user.location;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters',
        });
      }

      user.password = req.body.password;
    }

    const updated = await user.save();

    return res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      bio: updated.bio,
      location: updated.location,
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return res.status(500).json({
      message: 'Failed to update profile',
    });
  }
}

export async function getUserStats(req, res) {
  try {
    const Product = (
      await import('../models/productModel.js')
    ).default;

    const productCount = await Product.countDocuments({
      seller: req.user._id,
    });

    const activeCount = await Product.countDocuments({
      seller: req.user._id,
      isAvailable: true,
    });

    return res.json({
      totalListings: productCount,
      activeListings: activeCount,
    });
  } catch (error) {
    console.error('Get user stats error:', error);

    return res.status(500).json({
      message: 'Failed to load user statistics',
    });
  }
}