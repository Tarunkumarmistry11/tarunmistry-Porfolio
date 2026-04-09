const mongoose = require("mongoose");

const awardSchema = new mongoose.Schema({
  title: String,
  festival: String,
  festivalUrl: String,
  year: String,
});

const pressSchema = new mongoose.Schema({
  name: String,
  url: String,
  formats: [String], // ["digital", "print"]
});

const podcastSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const aboutSchema = new mongoose.Schema({
  bio: { type: String },
  brands: [{ name: String, logoUrl: String }],
  awards: [awardSchema],
  press: [pressSchema],
  podcasts: [podcastSchema],
  portraitWarm: { type: String },
  portraitCold: { type: String },
  portraitVideo: { type: String },
  photos: [{ type: String }],
});

module.exports = mongoose.model("About", aboutSchema);