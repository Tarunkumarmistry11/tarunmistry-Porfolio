const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt:{ type: Date, default: Date.now },
    source:      { type: String, default: "product_page" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);