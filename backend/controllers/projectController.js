const Project = require("../models/Project");

const getAllProjects = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const projects = await Project.find(filter).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

const getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProjects, getProjectBySlug, getFeaturedProjects };