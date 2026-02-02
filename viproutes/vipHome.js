import express from 'express';
import ContactInfo from '../vipmodels/VipHome.js';
import { upload, uploadToGridFS, deleteFromGridFS } from '../config/gridfsConfig.js';

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch latest home content
router.get('/', async (req, res) => {
  try {
    const info = await ContactInfo.findOne().sort({ createdAt: -1 });
    if (info) {
      res.json(info);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('❌ Error fetching home content:', err);
    res.status(500).json({ error: 'Failed to fetch home content' });
  }
});

// POST - Create new home content (WITHOUT carousel images initially)
router.post('/', async (req, res) => {
  const { topic, line,  
          servicetopic1, servicepara1, servicetopic2, servicepara2, 
          servicetopic3, servicepara3, servicetopic4, servicepara4 } = req.body;

  if (!topic || !line ||  
      !servicetopic1 || !servicepara1 || !servicetopic2 || !servicepara2 || 
      !servicetopic3 || !servicepara3 || !servicetopic4 || !servicepara4) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newInfo = new ContactInfo({
      topic, line, 
      servicetopic1, servicepara1, servicetopic2, servicepara2,
      servicetopic3, servicepara3, servicetopic4, servicepara4,
      carouselImages: [] // Initialize empty array
    });
    
    const savedInfo = await newInfo.save();

    res.status(201).json({
      message: '✅ Home Content created successfully',
      infoId: savedInfo._id
    });
  } catch (err) {
    console.error('❌ Error creating home content:', err);
    res.status(500).json({ error: 'Failed to create home content' });
  }
});

// PUT - Update existing home content (WITHOUT carousel images)
router.put('/:id', async (req, res) => {
  const { topic, line, 
          servicetopic1, servicepara1, servicetopic2, servicepara2,
          servicetopic3, servicepara3, servicetopic4, servicepara4 } = req.body;

  if (!topic || !line || 
      !servicetopic1 || !servicepara1 || !servicetopic2 || !servicepara2 ||
      !servicetopic3 || !servicepara3 || !servicetopic4 || !servicepara4) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updated = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      {
        topic, line, 
        servicetopic1, servicepara1, servicetopic2, servicepara2,
        servicetopic3, servicepara3, servicetopic4, servicepara4
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Home Content not found' });
    }

    res.json({ message: '✅ Home Content updated successfully' });
  } catch (err) {
    console.error('❌ Error updating Home Content:', err);
    res.status(500).json({ error: 'Failed to update Home Content' });
  }
});

// POST - Upload carousel images to GridFS (SEPARATE ROUTE)
router.post('/:id/carousel', upload.array('carouselImages', 10), async (req, res) => {
  try {
    const info = await ContactInfo.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ error: 'Home Content not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Delete old carousel images from GridFS
    if (info.carouselImages && info.carouselImages.length > 0) {
      for (const img of info.carouselImages) {
        try {
          await deleteFromGridFS(img);
          console.log(`✅ Deleted old carousel image: ${img}`);
        } catch (err) {
          console.log(`⚠️ Could not delete old carousel image: ${img}`, err.message);
        }
      }
    }

    // Upload new images to GridFS
    const uploadedImages = [];
    for (const file of req.files) {
      try {
        const result = await uploadToGridFS(file);
        uploadedImages.push(result.filename);
        console.log(`✅ Uploaded carousel image to GridFS: ${result.filename}`);
      } catch (err) {
        console.error(`❌ Error uploading image to GridFS:`, err);
      }
    }

    // Update database with new image filenames
    info.carouselImages = uploadedImages;
    await info.save();

    res.json({ 
      message: '✅ Carousel images uploaded successfully to GridFS',
      imageCount: uploadedImages.length 
    });
  } catch (err) {
    console.error('❌ Error uploading carousel images:', err);
    res.status(500).json({ error: 'Failed to upload carousel images' });
  }
});

// DELETE a specific carousel image from GridFS
router.delete('/:id/carousel/:imageName', async (req, res) => {
  try {
    const info = await ContactInfo.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ error: 'Home Content not found' });
    }

    // Remove image from database array
    info.carouselImages = info.carouselImages.filter(img => img !== req.params.imageName);
    await info.save();

    // Delete from GridFS
    try {
      await deleteFromGridFS(req.params.imageName);
      console.log(`✅ Deleted carousel image from GridFS: ${req.params.imageName}`);
    } catch (err) {
      console.log(`⚠️ Could not delete image from GridFS: ${req.params.imageName}`, err.message);
    }

    res.json({ message: '✅ Carousel image deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting carousel image:', err);
    res.status(500).json({ error: 'Failed to delete carousel image' });
  }
});

export default router;