import express from 'express';
import VipGallery from '../vipmodels/VipGallery.js';
import { upload, uploadToGridFS, deleteFromGridFS } from '../config/gridfsConfig.js';

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch all gallery items
router.get('/', async (req, res) => {
  try {
    const items = await VipGallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('❌ Error fetching gallery items:', err);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// POST - Create new gallery item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name || !req.file) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    // Upload image to GridFS
    const imageResult = await uploadToGridFS(req.file);

    const newItem = new VipGallery({
      name,
      image: imageResult.filename
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      message: '✅ Gallery item created successfully',
      item: savedItem
    });
  } catch (err) {
    console.error('❌ Error creating gallery item:', err);
    res.status(500).json({ error: 'Failed to create gallery item', details: err.message });
  }
});

// PUT - Update gallery item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Find existing item
    const existingItem = await VipGallery.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Prepare update object
    const updateData = {
      name,
      image: existingItem.image
    };

    // Handle image update
    if (req.file) {
      // Delete old image from GridFS if it exists
      if (existingItem.image) {
        try {
          await deleteFromGridFS(existingItem.image);
          console.log('✅ Deleted old image from GridFS');
        } catch (err) {
          console.log('⚠️ Could not delete old image:', err.message);
        }
      }
      
      // Upload new image to GridFS
      const imageResult = await uploadToGridFS(req.file);
      updateData.image = imageResult.filename;
    }

    const updated = await VipGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ 
      message: '✅ Gallery item updated successfully',
      item: updated
    });
  } catch (err) {
    console.error('❌ Error updating gallery item:', err);
    res.status(500).json({ error: 'Failed to update gallery item', details: err.message });
  }
});

// DELETE - Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    const item = await VipGallery.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Delete image from GridFS
    if (item.image) {
      try {
        await deleteFromGridFS(item.image);
        console.log('✅ Deleted image from GridFS');
      } catch (err) {
        console.log('⚠️ Could not delete image:', err.message);
      }
    }

    await VipGallery.findByIdAndDelete(req.params.id);

    res.json({ message: '✅ Gallery item deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting gallery item:', err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

export default router;