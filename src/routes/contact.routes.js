import express from "express";
import { createContact, deleteContact, getContacts } from "../controllers/contact.controller.js";
import { verifyTokenAndAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// POST - Submit a contact message
router.post("/", createContact);

// GET ALL - Admin only
router.get("/", verifyTokenAndAdmin, getContacts);

// DELETE - Admin only
router.delete("/:id", verifyTokenAndAdmin, deleteContact);

export default router;