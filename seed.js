import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

// ─── Nakhrali Seed Data ─────────────────────────────────────────────────────
// Categories:    Kurtis | Sets | Co-ords | Sarees
// SubCategories: Festive | Casual | Printed | Embroidered
// ─────────────────────────────────────────────────────────────────────────────

const products = [
    {
        "name": "Hand-Block Printed Anarkali Kurta",
        "description": "A beautifully crafted Anarkali kurta featuring vibrant Jaipur hand-block prints. Lightweight, breathable cotton — perfect for daily wear or casual outings.",
        "price": 999,
        "image": ["https://images.unsplash.com/photo-1545959739-8c6501c518d6?q=80&w=2670&auto=format&fit=crop"],
        "category": "Kurtis",
        "subCategory": "Printed",
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": true,
        "date": 1715423896000
    },
    {
        "name": "Cotton Embroidered Straight Kurta",
        "description": "Soft cotton kurta with delicate embroidered neckline detailing. Easy to style and comfortable for all-day wear.",
        "price": 1299,
        "image": ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop"],
        "category": "Kurtis",
        "subCategory": "Embroidered",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "bestseller": false,
        "date": 1715423896001
    },
    {
        "name": "Festive Embroidered Kurta Set",
        "description": "Stunning festive kurta set with intricate thread work paired with matching palazzo pants. Perfect for weddings, pujas, and celebrations.",
        "price": 3500,
        "image": ["https://images.unsplash.com/photo-1594595821045-bf25d1945199?q=80&w=2670&auto=format&fit=crop"],
        "category": "Sets",
        "subCategory": "Festive",
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": true,
        "date": 1715423896002
    },
    {
        "name": "Designer Kurta Set with Palazzo",
        "description": "Contemporary kurta set with matching palazzo pants. Chic, comfortable, and perfect for casual outings or office wear.",
        "price": 1850,
        "image": ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop"],
        "category": "Sets",
        "subCategory": "Casual",
        "sizes": ["M", "L", "XL"],
        "bestseller": true,
        "date": 1715423896003
    },
    {
        "name": "Floral Print Co-ord Set",
        "description": "Elegant co-ord set featuring a hand-block printed kurta paired with matching palazzo pants. A complete statement look for any occasion.",
        "price": 2200,
        "image": ["https://images.unsplash.com/photo-1545959739-8c6501c518d6?q=80&w=2670&auto=format&fit=crop"],
        "category": "Co-ords",
        "subCategory": "Printed",
        "sizes": ["S", "M", "L"],
        "bestseller": false,
        "date": 1715423896004
    },
    {
        "name": "Rayon Printed Co-ord Set",
        "description": "Soft rayon co-ord set with vibrant modern prints. Easy breezy style for brunches, outings, and casual events.",
        "price": 1750,
        "image": ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2670&auto=format&fit=crop"],
        "category": "Co-ords",
        "subCategory": "Casual",
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": false,
        "date": 1715423896005
    },
    {
        "name": "Banarasi Silk Saree",
        "description": "Pure Banarasi silk saree with golden zari border. A timeless classic for every wardrobe and every occasion.",
        "price": 4500,
        "image": ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2670&auto=format&fit=crop"],
        "category": "Sarees",
        "subCategory": "Festive",
        "sizes": ["Free Size"],
        "bestseller": false,
        "date": 1715423896006
    },
    {
        "name": "Geometric Art Silk Saree",
        "description": "Elegant saree with a modern geometric print, made from soft art silk. Blouse piece included. Perfect for festive and formal occasions.",
        "price": 3550,
        "image": ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop"],
        "category": "Sarees",
        "subCategory": "Printed",
        "sizes": ["Free Size"],
        "bestseller": true,
        "date": 1715423896007
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        try {
            await mongoose.connection.db.dropCollection('products');
            console.log('Dropped existing products collection');
        } catch (error) {
            if (error.code === 26) {
                console.log('Collection does not exist, skipping drop');
            } else {
                console.error('Error dropping collection:', error);
            }
        }

        await Product.create(products);
        console.log('✅ Seeded 8 Nakhrali products successfully');
        console.log('Categories: Kurtis | Sets | Co-ords | Sarees');
        console.log('Types: Festive | Casual | Printed | Embroidered');

        mongoose.connection.close();
        console.log('Connection closed');
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
