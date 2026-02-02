import express from 'express';
import { getGridFSBucket } from '../config/gridfsConfig.js';

const router = express.Router();

// GET - Fetch image by filename
router.get('/:filename', async (req, res) => {
  try {
    const gridfsBucket = getGridFSBucket();
    
    const files = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const file = files[0];

    // Check if it's an image
    if (file.contentType && file.contentType.startsWith('image/')) {
      // Set proper headers
      res.set('Content-Type', file.contentType);
      res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      
      // Stream the image
      const downloadStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
      
      downloadStream.on('error', (error) => {
        console.error('Stream error:', error);
        res.status(404).json({ error: 'Error streaming file' });
      });
      
      downloadStream.pipe(res);
    } else {
      res.status(404).json({ error: 'Not an image file' });
    }
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// DELETE - Delete image by filename
router.delete('/:filename', async (req, res) => {
  try {
    const gridfsBucket = getGridFSBucket();
    
    const files = await gridfsBucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await gridfsBucket.delete(files[0]._id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;