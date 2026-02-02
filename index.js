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
import packagesRoutes from './routes/packages.js';
import bookingStepsRoutes from './routes/bookingSteps.js';
import bookingsRoutes from './routes/bookings.js';
import servicesRoutes from './routes/services.js';
import guidesRoutes from './routes/guides.js';
import aboutRoutes from './routes/about.js';
import contactInfoRoutes from './routes/contactInfo.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

import travelaAboutRoutes from './travelaroutes/travelaAbout.js';
import travelaServiceRoutes from './travelaroutes/travelaService.js';
import travelaPackageRoutes from './travelaroutes/travelaPackage.js';
import travelaGuideRoutes from './travelaroutes/travelaGuide.js';
import travelabookingsRoutes from './travelaroutes/travelaBooking.js';
import travelausersRoutes from './travelaroutes/travelaUser.js';
import travelacontactInfoRoutes from './travelaroutes/travelaContactInfo.js';
import traveladashboardRoutes from './travelaroutes/travelaDashboard.js';
import travelaauthRoutes from './travelaroutes/travelaAuth.js';

import vipAboutRoutes from './viproutes/vipAbout.js';
import vipcontactInfoRoutes from './viproutes/vipContactInfo.js';
import viphomeRoutes from './viproutes/vipHome.js';
import vipGalleryRoutes from './viproutes/vipGallery.js';
import vipDestinationRoutes from './viproutes/vipDestination.js';
import vipTestimonialRoutes from './viproutes/vipTestimonial.js';
import vipPackageRoutes from './viproutes/vipPackage.js';
import vipbookingsRoutes from './viproutes/vipBooking.js';
import imageRoutes from './viproutes/imageRoutes.js';



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
app.use('/api/packages', packagesRoutes);
app.use('/api/bookingSteps', bookingStepsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/travelaapi/about', travelaAboutRoutes);
app.use('/travelaapi/services', travelaServiceRoutes);
app.use('/travelaapi/packages', travelaPackageRoutes);
app.use('/travelaapi/guides', travelaGuideRoutes);
app.use('/travelaapi/bookings', travelabookingsRoutes);
app.use('/travelaapi/users', travelausersRoutes);
app.use('/travelaapi/contact-info', travelacontactInfoRoutes);
app.use('/travelaapi/dashboard', traveladashboardRoutes);
app.use('/travelaapi/auth', travelaauthRoutes);

app.use('/vipapi/about', vipAboutRoutes);
app.use('/vipapi/contact-info', vipcontactInfoRoutes);
app.use('/vipapi/home', viphomeRoutes);
app.use('/vipapi/gallery', vipGalleryRoutes);
app.use('/vipapi/destination', vipDestinationRoutes);
app.use('/vipapi/testimonials', vipTestimonialRoutes);
app.use('/vipapi/packages', vipPackageRoutes);
app.use('/vipapi/bookings', vipbookingsRoutes);
app.use('/vipapi/images', imageRoutes);

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