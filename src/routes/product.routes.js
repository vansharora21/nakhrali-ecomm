import express from "express";
import Product from "../models/Product.js";
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";
import { v2 as cloudinary } from "cloudinary";
import upload from "../middleware/multer.js";

const router = express.Router();

// CREATE
router.post("/", verifyTokenAndAdmin, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now()
    };

    console.log(productData);

    const product = new Product(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  console.log("GET /api/products hit. Query:", req.query);
  try {
    let products;

    if (qNew) {
      console.log("Fetching new products (limit 1)");
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      console.log("Fetching products by category:", qCategory);
      products = await Product.find({ category: qCategory });
    } else {
      console.log("Fetching all products");
      products = await Product.find();
    }
    console.log(`Found ${products.length} products`);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;