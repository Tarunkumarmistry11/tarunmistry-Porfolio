const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductBySlug,
  addReview,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.post("/:slug/reviews", addReview);

module.exports = router;