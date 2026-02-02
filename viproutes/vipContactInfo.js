import express from 'express';
import ContactInfo from '../vipmodels/VipContactInfo.js';
import { upload, uploadToGridFS, deleteFromGridFS } from '../config/gridfsConfig.js';

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
router.post('/', upload.single('image'), async (req, res) => {
  const { mobile, email, whatsapp } = req.body; // Add whatsapp

  if (!mobile || !email || !whatsapp) { // Add whatsapp validation
    return res.status(400).json({ error: 'Mobile, email, and WhatsApp are required' });
  }

  try {
    const contactData = { mobile, email, whatsapp }; // Add whatsapp

    // Handle image upload to GridFS
    if (req.file) {
      const imageResult = await uploadToGridFS(req.file);
      contactData.image = imageResult.filename;
    }

    const newInfo = new ContactInfo(contactData);
    const savedInfo = await newInfo.save();

    res.status(201).json({
      message: '✅ Contact info created successfully',
      infoId: savedInfo._id,
      data: savedInfo
    });
  } catch (err) {
    console.error('❌ Error creating contact info:', err);
    res.status(500).json({ error: 'Failed to create contact info', details: err.message });
  }
});

// PUT - Update existing contact info
router.put('/:id', upload.single('image'), async (req, res) => {
  const { mobile, email, whatsapp } = req.body; // Add whatsapp

  if (!mobile || !email || !whatsapp) { // Add whatsapp validation
    return res.status(400).json({ error: 'Mobile, email, and WhatsApp are required' });
  }

  try {
    const existingInfo = await ContactInfo.findById(req.params.id);
    if (!existingInfo) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    const updateData = {
      mobile,
      email,
      whatsapp, // Add this
      image: existingInfo.image
    };

    // Handle image update
    if (req.file) {
      if (existingInfo.image) {
        try {
          await deleteFromGridFS(existingInfo.image);
          console.log('✅ Deleted old contact image from GridFS');
        } catch (err) {
          console.log('⚠️ Could not delete old contact image:', err.message);
        }
      }
      
      const imageResult = await uploadToGridFS(req.file);
      updateData.image = imageResult.filename;
    }

    const updated = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ 
      message: '✅ Contact info updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('❌ Error updating contact info:', err);
    res.status(500).json({ error: 'Failed to update contact info', details: err.message });
  }
});

// DELETE - Delete contact info (optional, if you need it)
router.delete('/:id', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findById(req.params.id);
    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact info not found' });
    }

    // Delete image from GridFS if it exists
    if (contactInfo.image) {
      try {
        await deleteFromGridFS(contactInfo.image);
        console.log('✅ Deleted contact image from GridFS');
      } catch (err) {
        console.log('⚠️ Could not delete contact image:', err.message);
      }
    }

    await ContactInfo.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Contact info deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting contact info:', err);
    res.status(500).json({ error: 'Failed to delete contact info' });
  }
});

export default router;