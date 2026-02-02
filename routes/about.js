import express from 'express';
import About from '../models/About.js'; // Import Mongoose model

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch all about content
router.get('/', async (req, res) => {
  try {
    const aboutData = await About.find().sort({ createdAt: -1 });
    res.json(aboutData);
  } catch (err) {
    console.error('❌ Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// PUT - Update content by ID
router.put('/:id', async (req, res) => {
  const { para1, para2, line1, line2, line3, line4, line5, line6 } = req.body;

  if (!para1 || !para2 || !line1 || !line2 || !line3 || !line4 || !line5 || !line6) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updated = await About.findByIdAndUpdate(
      req.params.id,
      { para1, para2, line1, line2, line3, line4, line5, line6 },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: '✅ Content updated successfully', data: updated });
  } catch (err) {
    console.error('❌ Error updating content:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// routes/about.js - Add this POST route
router.post('/', async (req, res) => {
  const { para1, para2, line1, line2, line3, line4, line5, line6 } = req.body;

  if (!para1 || !para2 || !line1 || !line2 || !line3 || !line4 || !line5 || !line6) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newAbout = new About({ 
      para1, para2, line1, line2, line3, line4, line5, line6 
    });
    const savedAbout = await newAbout.save();
    
    res.status(201).json({ 
      message: '✅ Content created successfully', 
      data: savedAbout 
    });
  } catch (err) {
    console.error('❌ Error creating content:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

export default router;
