/**
 * Admin Seeder Script
 * Run this once to create an admin user:
 *   node src/createAdmin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// ===== CHANGE THESE =====
const ADMIN_NAME = 'Nakhrali Admin';
const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@nakhrali.com';
const ADMIN_PASSWORD = 'Admin@123';
// ========================

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ username: ADMIN_USERNAME });
        if (existing) {
            // Update existing user to admin
            existing.isAdmin = true;
            await existing.save();
            console.log(`✅ User "${ADMIN_USERNAME}" updated to Admin!`);
        } else {
            const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
            const admin = new User({
                name: ADMIN_NAME,
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                isAdmin: true,
            });
            await admin.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Admin Panel Login Credentials  ');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`  URL:      http://127.0.0.1:5174`);
        console.log(`  Username: ${ADMIN_USERNAME}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
