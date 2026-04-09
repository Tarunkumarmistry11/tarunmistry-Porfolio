const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ["stills", "motion"], required: true },
    date: { type: String, required: true },       // e.g. "March 2023"
    location: { type: String, required: true },   // e.g. "Greenland"
    description: { type: String },
    coverImageLeft: { type: String },
    coverImageRight: { type: String },
    videoUrl: { type: String },                   // for motion projects
    colorPalette: [{ type: String }],             // hex colors
    images: [{ type: String }],                   // gallery image URLs
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);