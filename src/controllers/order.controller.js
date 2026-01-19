import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (req, res) => {
  const { items, shippingAddress, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items" });
  }

  // reduce stock
  for (let item of items) {
    const product = await Product.findById(item.product);
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    totalAmount,
  });

  res.status(201).json(order);
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
  res.json(order);
};
