import mongoose from 'mongoose';
import multer from 'multer';
import Grid from 'gridfs-stream';
import crypto from 'crypto';
import path from 'path';

let gfs, gridfsBucket;

// Initialize GridFS after MongoDB connection
export const initGridFS = () => {
  const conn = mongoose.connection;
  
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'vippackages'
  });
  
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('vippackages');
  
  console.log('✅ GridFS Initialized');
  return gfs;
};

// Get GridFS instance
export const getGridFS = () => {
  if (!gfs) {
    throw new Error('GridFS not initialized. Call initGridFS() first.');
  }
  return gfs;
};

// Get GridFSBucket instance
export const getGridFSBucket = () => {
  if (!gridfsBucket) {
    // Try to initialize if not already done
    if (mongoose.connection.readyState === 1) {
      initGridFS();
    } else {
      throw new Error('GridFSBucket not initialized. MongoDB connection not ready.');
    }
  }
  return gridfsBucket;
};

// Create storage engine (memory storage)
const createStorage = () => {
  return multer.memoryStorage();
};

// Configure multer
export const upload = multer({
  storage: createStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to upload file to GridFS
export const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    // Get or initialize GridFSBucket
    let bucket;
    try {
      bucket = getGridFSBucket();
    } catch (error) {
      return reject(error);
    }

    const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        uploadDate: new Date()
      }
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.on('finish', () => {
      // Use uploadStream properties instead of event parameter
      resolve({
        filename: filename,
        id: uploadStream.id,
        contentType: file.mimetype
      });
    });

    uploadStream.end(file.buffer);
  });
};

// Helper function to delete file from GridFS
export const deleteFromGridFS = async (filename) => {
  try {
    const bucket = getGridFSBucket();
    const files = await bucket.find({ filename }).toArray();
    
    if (files && files.length > 0) {
      await bucket.delete(files[0]._id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting from GridFS:', error);
    throw error;
  }
};