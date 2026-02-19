import './src/config/env.js';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import connectCloudinary from './src/config/cloudinary.js';

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}


app.get("/", (req, res) => {
  res.send("E-Commerce Backend Running");
});
app.listen(PORT, async () => {
  await connectDB();
  await connectCloudinary();
  console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
  console.log(`server running on port ${PORT}`);

});
