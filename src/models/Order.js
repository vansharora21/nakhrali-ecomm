import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, enum: ["Placed", "Shipped", "Delivered"], default: "Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false }, // true if paid
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    date: { type: Number, required: true },
    trackingHistory: [
      {
        status: { type: String },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);