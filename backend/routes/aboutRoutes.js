const express = require("express");
const router = express.Router();
const { getAbout } = require("../controllers/aboutController");

// Optional: async wrapper (if you remove try/catch from controllers later)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @route   GET /api/v1/about
 * @desc    Get about page data
 * @access  Public
 */
router.get("/", asyncHandler(getAbout));

module.exports = router;