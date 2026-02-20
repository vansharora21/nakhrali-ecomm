import express from "express";
import Order from "../models/Order.js";
import crypto from 'crypto';
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middleware/verifyToken.js";


const router = express.Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const { paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  let orderData = { ...req.body };

  // Demo Payment for testing - no gateway needed
  if (paymentMethod === 'Demo') {
    orderData.payment = true;
    orderData.status = 'Placed';
  }

  // Razorpay - verify signature before saving order
  if (paymentMethod === 'Razorpay') {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing Razorpay payment details' });
    }
    const sign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expected !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature. Order not saved.' });
    }
    orderData.payment = true;
    orderData.status = 'Placed';
  }

  // COD - payment remains false, status = Placed


  // Auto-log first tracking entry on order creation
  const payNote = paymentMethod === 'Demo'
    ? 'Order confirmed via Demo payment'
    : paymentMethod === 'Razorpay'
      ? 'Order confirmed — Paid via Razorpay'
      : 'Order placed — Cash on Delivery';

  orderData.trackingHistory = [{
    status: 'Placed',
    note: payNote,
    timestamp: new Date()
  }];

  const newOrder = new Order(orderData);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE (Admin) — updates status and appends to tracking history
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { status, note, ...rest } = req.body;

    const updateObj = { $set: rest };

    if (status) {
      updateObj.$set.status = status;
      // Push a new tracking event into history
      updateObj.$push = {
        trackingHistory: {
          status,
          note: note || `Order status updated to ${status}`,
          timestamp: new Date()
        }
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;