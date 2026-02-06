import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();  
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Use a try-catch to handle both ESM and CommonJS environments
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch {
  __dirname = process.cwd();
}

// Import MongoDB connection function
import connectDB from './db.js';
import { initGridFS } from './config/gridfsConfig.js';

// Import routes

import vipAboutRoutes from './viproutes/vipAbout.js';
import vipcontactInfoRoutes from './viproutes/vipContactInfo.js';
import viphomeRoutes from './viproutes/vipHome.js';
import vipGalleryRoutes from './viproutes/vipGallery.js';
import vipDestinationRoutes from './viproutes/vipDestination.js';
import vipTestimonialRoutes from './viproutes/vipTestimonial.js';
import vipPackageRoutes from './viproutes/vipPackage.js';
import vipbookingsRoutes from './viproutes/vipBooking.js';
import imageRoutes from './viproutes/imageRoutes.js';
import vipusersRoutes from './viproutes/vipUser.js';
import vipauthRoutes from './viproutes/vipAuth.js';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Track if GridFS has been initialized
let gridfsInitialized = false;

// Database connection middleware - connect before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    
    // Initialize GridFS only once after DB connection is ready
    if (!gridfsInitialized && mongoose.connection.readyState === 1) {
      try {
        initGridFS();
        gridfsInitialized = true;
        console.log('✅ GridFS initialized successfully');
      } catch (gridfsError) {
        console.error('⚠️ GridFS initialization warning:', gridfsError.message);
        // Continue anyway - GridFS will initialize on first use
      }
    }
    
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes


app.use('/vipapi/about', vipAboutRoutes);
app.use('/vipapi/contact-info', vipcontactInfoRoutes);
app.use('/vipapi/home', viphomeRoutes);
app.use('/vipapi/gallery', vipGalleryRoutes);
app.use('/vipapi/destination', vipDestinationRoutes);
app.use('/vipapi/testimonials', vipTestimonialRoutes);
app.use('/vipapi/packages', vipPackageRoutes);
app.use('/vipapi/bookings', vipbookingsRoutes);
app.use('/vipapi/images', imageRoutes);
app.use('/vipapi/users', vipusersRoutes);
app.use('/vipapi/auth', vipauthRoutes);



app.use('/vipapi/carousel', express.static(path.join(process.cwd(), 'uploads/carousel')));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Initialize GridFS after server starts and DB connects
      if (mongoose.connection.readyState === 1) {
        setTimeout(() => {
          try {
            initGridFS();
            console.log('✅ GridFS initialized on startup');
          } catch (error) {
            console.log('⚠️ GridFS will initialize on first use');
          }
        }, 1000); // Wait 1 second for connection to be fully ready
      }
    } catch (error) {
      console.error('❌ Server startup error:', error);
    }
  });
}

// For Vercel serverless - initialize GridFS on cold start
if (process.env.NODE_ENV === 'production') {
  connectDB().then(() => {
    if (mongoose.connection.readyState === 1) {
      try {
        initGridFS();
        console.log('✅ GridFS initialized for Vercel');
      } catch (error) {
        console.log('⚠️ GridFS will initialize on first request');
      }
    }
  }).catch(err => {
    console.error('❌ Production DB connection error:', err);
  });
}

// Export for Vercel
export default app;