const About = require("../models/About");

const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about) {
      res.status(404);
      throw new Error("About content not found");
    }
    res.json(about);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAbout };