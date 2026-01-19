import './src/config/env.js';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT ||5000;

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

app.listen(PORT,async()=>{
    await connectDB();
    console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET); 
    console.log(`server running on port ${PORT}`);

});
