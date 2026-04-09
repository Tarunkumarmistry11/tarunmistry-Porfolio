const About = require("../models/About");

// Custom error helper (optional but recommended)
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne().lean();

    if (!about) {
      return next(createError("About content not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAbout };