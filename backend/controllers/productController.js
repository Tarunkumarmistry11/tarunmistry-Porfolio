const Product = require("../models/Product");

// GET /api/shop?category=presets&sort=price_asc
const getAllProducts = async (req, res, next) => {
  try {
    const { category, sort } = req.query;

    const filter = { active: true };

    // Filter by category
    if (category && category !== "all") {
      filter.category = category;
    }

    // Sorting logic
    let sortObj = {};

    switch (sort) {
      case "price_asc":
        sortObj = { "price.US": 1 };        // Lowest price first
        break;
      case "price_desc":
        sortObj = { "price.US": -1 };       // Highest price first
        break;
      case "top_reviews":
        sortObj = { avgRating: -1, totalReviews: -1 }; // Best rated first
        break;
      case "new":
        sortObj = { createdAt: -1 };        // Most recent first
        break;
      case "relevance":
      default:
        sortObj = { order: 1, featured: -1 }; // Default relevance + featured on top
        break;
    }

    const products = await Product.find(filter)
      .select("-downloadFiles")   // Never expose download paths
      .sort(sortObj);

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/shop/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      active: true,
    }).select("-downloadFiles");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/shop/:slug/reviews
const addReview = async (req, res, next) => {
  try {
    const { name, email, rating, comment } = req.body;

    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findOne({
      slug: req.params.slug,
      active: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push({
      name,
      email,
      rating: Number(rating),
      comment,
    });

    product.recalcRating();
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      avgRating: product.avgRating,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  addReview,
};