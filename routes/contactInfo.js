import express from 'express';
import ContactInfo from '../models/ContactInfo.js'; // MongoDB model

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch latest contact info (returns single object)
router.get('/', async (req, res) => {
  try {
    const info = await ContactInfo.findOne().sort({ createdAt: -1 });

    if (info) {
      res.json(info);
    } else {
      res.json({});
    }
  } catch (err) {
    console.error('❌ Error fetching contact info:', err);
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
});

// POST - Create new contact info
router.post('/', async (req, res) => {
  const { office, mobile, email, mapUrl, description } = req.body;

  if (!office || !mobile || !email || !mapUrl) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newInfo = new ContactInfo({ office, mobile, email, mapUrl, description });
    const savedInfo = await newInfo.save();

    res.status(201).json({
      message: '✅ Contact info created successfully',
      infoId: savedInfo._id
    });
  } catch (err) {
    console.error('❌ Error creating contact info:', err);
    res.status(500).json({ error: 'Failed to create contact info' });
  }
});

// PUT - Update existing contact info
router.put('/:id', async (req, res) => {
  const { office, mobile, email, mapUrl, description } = req.body;

  if (!office || !mobile || !email || !mapUrl) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updated = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      { office, mobile, email, mapUrl, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    res.json({ message: '✅ Contact info updated successfully' });
  } catch (err) {
    console.error('❌ Error updating contact info:', err);
    res.status(500).json({ error: 'Failed to update contact info' });
  }
});

export default router;
