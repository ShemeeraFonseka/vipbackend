// routes/about.js
import express from 'express';
import About from '../vipmodels/VipAbout.js';
import { upload, uploadToGridFS, deleteFromGridFS } from '../config/gridfsConfig.js';

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch about content (should only be one document)
router.get('/', async (req, res) => {
  try {
    const aboutData = await About.findOne().sort({ createdAt: -1 });
    if (!aboutData) {
      return res.status(404).json({ error: 'No content found' });
    }
    res.json(aboutData);
  } catch (err) {
    console.error('❌ Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// POST - Create initial about content
router.post('/', upload.fields([
  { name: 'section1Image', maxCount: 1 },
  { name: 'section2Image', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      section1Heading,
      section1Para1,
      section1Para2,
      section2Para1,
      section2Para2,
      section2Para3
    } = req.body;

    // Validate required fields
    if (!section1Para1 || !section1Para2 || !section2Para1 || !section2Para2 || !section2Para3) {
      return res.status(400).json({ error: 'All paragraph fields are required' });
    }

    // Check if content already exists
    const existingContent = await About.findOne();
    if (existingContent) {
      return res.status(400).json({ 
        error: 'About content already exists. Use PUT to update.' 
      });
    }

    const aboutData = {
      section1: {
        heading: section1Heading || 'About VIP Tours',
        paragraph1: section1Para1,
        paragraph2: section1Para2
      },
      section2: {
        paragraph1: section2Para1,
        paragraph2: section2Para2,
        paragraph3: section2Para3
      }
    };

    // Handle section1 image upload to GridFS
    if (req.files?.section1Image) {
      const section1ImageResult = await uploadToGridFS(req.files.section1Image[0]);
      aboutData.section1.image = section1ImageResult.filename;
    }

    // Handle section2 image upload to GridFS
    if (req.files?.section2Image) {
      const section2ImageResult = await uploadToGridFS(req.files.section2Image[0]);
      aboutData.section2.image = section2ImageResult.filename;
    }

    const newAbout = new About(aboutData);
    const savedAbout = await newAbout.save();

    res.status(201).json({ 
      message: '✅ Content created successfully', 
      data: savedAbout 
    });
  } catch (err) {
    console.error('❌ Error creating content:', err);
    res.status(500).json({ error: 'Failed to create content', details: err.message });
  }
});

// PUT - Update about content
router.put('/:id', upload.fields([
  { name: 'section1Image', maxCount: 1 },
  { name: 'section2Image', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      section1Heading,
      section1Para1,
      section1Para2,
      section2Para1,
      section2Para2,
      section2Para3
    } = req.body;

    // Find existing document
    const existingAbout = await About.findById(req.params.id);
    if (!existingAbout) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Prepare update object
    const updateData = {
      section1: {
        heading: section1Heading || existingAbout.section1.heading,
        paragraph1: section1Para1 || existingAbout.section1.paragraph1,
        paragraph2: section1Para2 || existingAbout.section1.paragraph2,
        image: existingAbout.section1.image
      },
      section2: {
        paragraph1: section2Para1 || existingAbout.section2.paragraph1,
        paragraph2: section2Para2 || existingAbout.section2.paragraph2,
        paragraph3: section2Para3 || existingAbout.section2.paragraph3,
        image: existingAbout.section2.image
      }
    };

    // Handle section1 image update
    if (req.files?.section1Image) {
      // Delete old image from GridFS if it exists
      if (existingAbout.section1.image) {
        try {
          await deleteFromGridFS(existingAbout.section1.image);
          console.log('✅ Deleted old section1 image from GridFS');
        } catch (err) {
          console.log('⚠️ Could not delete old section1 image:', err.message);
        }
      }
      
      // Upload new image to GridFS
      const section1ImageResult = await uploadToGridFS(req.files.section1Image[0]);
      updateData.section1.image = section1ImageResult.filename;
    }

    // Handle section2 image update
    if (req.files?.section2Image) {
      // Delete old image from GridFS if it exists
      if (existingAbout.section2.image) {
        try {
          await deleteFromGridFS(existingAbout.section2.image);
          console.log('✅ Deleted old section2 image from GridFS');
        } catch (err) {
          console.log('⚠️ Could not delete old section2 image:', err.message);
        }
      }
      
      // Upload new image to GridFS
      const section2ImageResult = await uploadToGridFS(req.files.section2Image[0]);
      updateData.section2.image = section2ImageResult.filename;
    }

    const updated = await About.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ 
      message: '✅ Content updated successfully', 
      data: updated 
    });
  } catch (err) {
    console.error('❌ Error updating content:', err);
    res.status(500).json({ error: 'Failed to update content', details: err.message });
  }
});

// DELETE - Delete about content
router.delete('/:id', async (req, res) => {
  try {
    const aboutData = await About.findById(req.params.id);
    if (!aboutData) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Delete images from GridFS
    if (aboutData.section1.image) {
      try {
        await deleteFromGridFS(aboutData.section1.image);
        console.log('✅ Deleted section1 image from GridFS');
      } catch (err) {
        console.log('⚠️ Could not delete section1 image:', err.message);
      }
    }

    if (aboutData.section2.image) {
      try {
        await deleteFromGridFS(aboutData.section2.image);
        console.log('✅ Deleted section2 image from GridFS');
      } catch (err) {
        console.log('⚠️ Could not delete section2 image:', err.message);
      }
    }

    await About.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Content deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting content:', err);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;