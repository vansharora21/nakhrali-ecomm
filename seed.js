import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const products = [
    {
        "name": "Women's Embroidered Anarkali Kurta",
        "description": "A beautiful Anarkali kurta featuring intricate embroidery and a flared hem. Perfect for festive occasions.",
        "price": 2499,
        "image": ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": true,
        "date": 1715423896000
    },
    {
        "name": "Men's Classic Cotton Kurta",
        "description": "Crafted from premium cotton, this solid kurta offers comfort and style for everyday wear.",
        "price": 1299,
        "image": ["https://images.unsplash.com/photo-1585412459212-8501e4a460e4?q=80&w=2672&auto=format&fit=crop"],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": ["M", "L", "XL", "XXL"],
        "bestseller": false,
        "date": 1715423896001
    },
    {
        "name": "Geometric Print Saree",
        "description": "Elegant saree with a modern geometric print, made from soft art silk. Blouse piece included.",
        "price": 3550,
        "image": ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Bottomwear",
        "sizes": ["Free Size"],
        "bestseller": true,
        "date": 1715423896002
    },
    {
        "name": "Festive Lehenga Choli Set",
        "description": "Dazzle in this stunning lehenga choli set with mirror work. Ideal for weddings and grand celebrations.",
        "price": 8999,
        "image": ["https://images.unsplash.com/photo-1594595821045-bf25d1945199?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Bottomwear",
        "sizes": ["S", "M", "L"],
        "bestseller": true,
        "date": 1715423896003
    },
    {
        "name": "Hand-block Print Kurti",
        "description": "Traditional hand-block printed kurti in vibrant colors. Breathable fabric for summer comfort.",
        "price": 999,
        "image": ["https://images.unsplash.com/photo-1545959739-8c6501c518d6?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": false,
        "date": 1715423896004
    },
    {
        "name": "Elegant Silk Saree",
        "description": "Pure silk saree with zari border. A timeless classic for every wardrobe.",
        "price": 4500,
        "image": ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Bottomwear",
        "sizes": ["Free Size"],
        "bestseller": false,
        "date": 1715423896005
    },
    {
        "name": "Designer Kurta Set",
        "description": "Contemporary kurta set with palazzo pants. Chic and comfortable.",
        "price": 1850,
        "image": ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop"],
        "category": "Women",
        "subCategory": "Topwear",
        "sizes": ["M", "L", "XL"],
        "bestseller": true,
        "date": 1715423896006
    },
    {
        "name": "Men's Ethnic Jacket",
        "description": "Nehru jacket with intricate embroidery. Adds a festive touch to any outfit.",
        "price": 2200,
        "image": ["https://images.unsplash.com/photo-1586227740560-8cf2732c1531?q=80&w=2661&auto=format&fit=crop"],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": ["M", "L", "XL"],
        "bestseller": false,
        "date": 1715423896007
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Ensure variable matches .env
        console.log('Connected to MongoDB');

        try {
            await mongoose.connection.db.dropCollection('products');
            console.log('Dropped products collection');
        } catch (error) {
            if (error.code === 26) {
                console.log('Collection does not exist, skipping drop');
            } else {
                console.error('Error dropping collection:', error);
            }
        }

        await Product.create(products);
        console.log('Seeded products successfully');

        mongoose.connection.close();
        console.log('Connection closed');
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
