import express from 'express';
import { upload, uploadToGridFS, deleteFromGridFS } from '../config/gridfsConfig.js';
import Vipvippackage from '../vipmodels/VipPackage.js';

const router = express.Router();

// Helper function to delete image
const deleteGridFSImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    await deleteFromGridFS(filename);
  } catch (err) {
    console.error('Error deleting GridFS image:', err);
  }
};

// GET - Fetch all vippackages
router.get('/', async (req, res) => {
  try {
    const vippackages = await Vipvippackage.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(vippackages);
  } catch (err) {
    console.error('❌ Error fetching vippackages:', err);
    res.status(500).json({ error: 'Failed to fetch vippackages' });
  }
});

// GET - Fetch only active vippackages
router.get('/active', async (req, res) => {
  try {
    const vippackages = await Vipvippackage.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(vippackages);
  } catch (err) {
    console.error('❌ Error fetching active vippackages:', err);
    res.status(500).json({ error: 'Failed to fetch active vippackages' });
  }
});

// GET - Fetch single vippackage by packageId
router.get('/:packageId', async (req, res) => {
  try {
    const vippackage = await Vipvippackage.findOne({ packageId: req.params.packageId, isActive: true });
    
    if (!vippackage) {
      return res.status(404).json({ error: 'vippackage not found' });
    }

    res.json(vippackage);
  } catch (err) {
    console.error('❌ Error fetching vippackage:', err);
    res.status(500).json({ error: 'Failed to fetch vippackage' });
  }
});

// POST - Create new vippackage
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sectionImages', maxCount: 10 }
]), async (req, res) => {
  const { packageId, title, description, price, detailedTitle, detailedIntro, sections, proTip, isActive, displayOrder } = req.body;

  if (!packageId || !title || !description || !price || !req.files['image']) {
    return res.status(400).json({ error: 'Package ID, title, description, price, and image are required' });
  }

  try {
    // Check if packageId already exists
    const existingvippackage = await Vipvippackage.findOne({ packageId });
    if (existingvippackage) {
      return res.status(400).json({ error: 'Package ID already exists' });
    }

    // Upload main image to GridFS
    const mainImageFile = await uploadToGridFS(req.files['image'][0]);
    const mainImageUrl = `/vipapi/images/${mainImageFile.filename}`;

    // Parse sections
    let parsedSections = [];
    if (sections) {
      parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      
      // Upload section images if provided
      if (req.files['sectionImages']) {
        for (let i = 0; i < req.files['sectionImages'].length; i++) {
          const sectionImageFile = await uploadToGridFS(req.files['sectionImages'][i]);
          if (parsedSections[i]) {
            parsedSections[i].sectionImage = `/vipapi/images/${sectionImageFile.filename}`;
          }
        }
      }
    }

    const newvippackage = new Vipvippackage({
      packageId,
      title,
      description,
      price,
      image: mainImageUrl,
      detailedTitle,
      detailedIntro,
      sections: parsedSections,
      proTip,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0
    });

    const savedvippackage = await newvippackage.save();

    res.status(201).json({
      message: '✅ Package created successfully',
      vippackage: savedvippackage
    });
  } catch (err) {
    console.error('❌ Error creating vippackage:', err);
    res.status(500).json({ error: 'Failed to create vippackage' });
  }
});

// PUT - Update vippackage
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'sectionImages', maxCount: 10 }
]), async (req, res) => {
  const { packageId, title, description, price, detailedTitle, detailedIntro, sections, proTip, isActive, displayOrder } = req.body;

  if (!packageId || !title || !description || !price) {
    return res.status(400).json({ error: 'Package ID, title, description, and price are required' });
  }

  try {
    const existingvippackage = await Vipvippackage.findById(req.params.id);
    if (!existingvippackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Check if packageId is being changed
    if (packageId !== existingvippackage.packageId) {
      const duplicatevippackage = await Vipvippackage.findOne({ packageId });
      if (duplicatevippackage) {
        return res.status(400).json({ error: 'Package ID already exists' });
      }
    }

    // Update basic fields
    existingvippackage.packageId = packageId;
    existingvippackage.title = title;
    existingvippackage.description = description;
    existingvippackage.price = price;
    existingvippackage.detailedTitle = detailedTitle || existingvippackage.detailedTitle;
    existingvippackage.detailedIntro = detailedIntro || existingvippackage.detailedIntro;
    existingvippackage.proTip = proTip || existingvippackage.proTip;
    existingvippackage.isActive = isActive !== undefined ? isActive : existingvippackage.isActive;
    existingvippackage.displayOrder = displayOrder !== undefined ? displayOrder : existingvippackage.displayOrder;

    // Update main image if uploaded
    if (req.files && req.files['image']) {
      // Delete old image
      await deleteGridFSImage(existingvippackage.image);
      // Upload new image
      const mainImageFile = await uploadToGridFS(req.files['image'][0]);
      existingvippackage.image = `/vipapi/images/${mainImageFile.filename}`;
    }

    // Update sections
    if (sections) {
      let parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      
      // Delete old section images
      if (existingvippackage.sections) {
        for (const section of existingvippackage.sections) {
          if (section.sectionImage) {
            await deleteGridFSImage(section.sectionImage);
          }
        }
      }
      
      // Upload new section images if provided
      if (req.files && req.files['sectionImages']) {
        for (let i = 0; i < req.files['sectionImages'].length; i++) {
          const sectionImageFile = await uploadToGridFS(req.files['sectionImages'][i]);
          if (parsedSections[i]) {
            parsedSections[i].sectionImage = `/vipapi/images/${sectionImageFile.filename}`;
          }
        }
      }
      
      existingvippackage.sections = parsedSections;
    }

    const updated = await existingvippackage.save();

    res.json({ 
      message: '✅ Package updated successfully',
      vippackage: updated
    });
  } catch (err) {
    console.error('❌ Error updating vippackage:', err);
    res.status(500).json({ error: 'Failed to update vippackage' });
  }
});

// DELETE - Delete vippackage
router.delete('/:id', async (req, res) => {
  try {
    const vippackage = await Vipvippackage.findById(req.params.id);
    
    if (!vippackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Delete main image from GridFS
    await deleteGridFSImage(vippackage.image);

    // Delete section images from GridFS
    if (vippackage.sections) {
      for (const section of vippackage.sections) {
        if (section.sectionImage) {
          await deleteGridFSImage(section.sectionImage);
        }
      }
    }

    await Vipvippackage.findByIdAndDelete(req.params.id);

    res.json({ message: '✅ Package deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting vippackage:', err);
    res.status(500).json({ error: 'Failed to delete vippackage' });
  }
});

// PATCH - Toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const vippackage = await Vipvippackage.findById(req.params.id);
    
    if (!vippackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    vippackage.isActive = !vippackage.isActive;
    await vippackage.save();

    res.json({ 
      message: `✅ Package ${vippackage.isActive ? 'activated' : 'deactivated'} successfully`,
      vippackage
    });
  } catch (err) {
    console.error('❌ Error toggling package status:', err);
    res.status(500).json({ error: 'Failed to toggle package status' });
  }
});

// PATCH - Update display order
router.patch('/:id/order', async (req, res) => {
  const { displayOrder } = req.body;

  if (displayOrder === undefined) {
    return res.status(400).json({ error: 'Display order is required' });
  }

  try {
    const vippackage = await Vipvippackage.findById(req.params.id);
    
    if (!vippackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    vippackage.displayOrder = displayOrder;
    await vippackage.save();

    res.json({ 
      message: '✅ Display order updated successfully',
      vippackage
    });
  } catch (err) {
    console.error('❌ Error updating display order:', err);
    res.status(500).json({ error: 'Failed to update display order' });
  }
});

export default router;