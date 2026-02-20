import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Create Razorpay instance lazily so missing keys don't crash the server
const getRazorpay = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id.includes('XXXX')) {
        throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    return new Razorpay({ key_id, key_secret });
};

// POST /api/payment/create-order
// Creates a Razorpay order on the server → returns order id to frontend
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        const razorpay = getRazorpay();
        const { amount, currency } = req.body;

        if (!amount) return res.status(400).json({ message: 'Amount is required' });

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay create-order error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/payment/verify
// Verifies Razorpay signature after payment — called from frontend handler
router.post('/verify', verifyToken, (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto.createHmac('sha256', key_secret).update(sign).digest('hex');

        if (expected === razorpay_signature) {
            return res.json({ success: true, message: 'Payment verified' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Razorpay verify error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
