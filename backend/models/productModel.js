import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ['Clothing', 'Electronics', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other'],
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerName: { type: String, required: true },
    location: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    sustainabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ seller: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
