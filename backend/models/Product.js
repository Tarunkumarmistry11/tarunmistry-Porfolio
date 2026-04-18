const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true, enum: ["presets", "luts", "prints"] },
    description: { type: String, required: true },
    shortDesc: { type: String, default: "" },

    compatibility: [{ type: String }],
    includes: [{ type: String }],
    howToUse: { type: String, default: "" },

    faqs: [{
      question: { type: String },
      answer: { type: String },
    }],

    coverImage: { type: String, required: true },
    previewImages: [{ type: String }],

    price: {
      IN: { type: Number, required: true },
      US: { type: Number, required: true },
      EU: { type: Number, required: true },
      GB: { type: Number, required: true },
    },
    originalPrice: {
      IN: { type: Number },
      US: { type: Number },
      EU: { type: Number },
      GB: { type: Number },
    },

    downloadFiles: [{ type: String }],   // Supabase paths
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate average rating
productSchema.methods.recalcRating = function () {
  if (!this.reviews.length) {
    this.avgRating = 0;
    this.totalReviews = 0;
    return;
  }
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0);
  this.avgRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

module.exports = mongoose.model("Product", productSchema);