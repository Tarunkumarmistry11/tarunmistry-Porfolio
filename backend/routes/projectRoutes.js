const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectBySlug,
  getFeaturedProjects,
} = require("../controllers/projectController");

// Async wrapper (reusable)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects (optional filter by type)
 * @access  Public
 */
router.get("/", asyncHandler(getAllProjects));

/**
 * @route   GET /api/v1/projects/featured
 * @desc    Get featured projects
 * @access  Public
 */
router.get("/featured", asyncHandler(getFeaturedProjects));

/**
 * @route   GET /api/v1/projects/:slug
 * @desc    Get single project by slug
 * @access  Public
 */
router.get("/:slug", asyncHandler(getProjectBySlug));

module.exports = router;