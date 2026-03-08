const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['HANDICRAFTS', 'ORGANIC_FOOD', 'ECO_FRIENDLY', 'ART', 'CLOTHING', 'OTHER'],
    required: true
  },
  tags: [String],
  images: [String],
  stock: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  impactStory: String,
  soldCount: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ ngoId: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
