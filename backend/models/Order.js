const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  name: { type: String, required: true },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number,
    currency: String,
  }],

  subtotal: { type: Number, required: true },
  currency: { type: String, required: true },
  country: { type: String, default: "US" },

  paymentMethod: { type: String, enum: ["stripe", "razorpay"] },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  downloadLinks: [String],
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);