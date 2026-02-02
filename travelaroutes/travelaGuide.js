// routes/guides.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Guide from '../travelamodels/TravelaGuide.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Multer Config ==================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ================== ROUTES ==================

// GET - Fetch all guides
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (err) {
    console.error('❌ Error fetching guides:', err);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// GET - Fetch single guide by ID
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    console.error('❌ Error fetching guide:', err);
    res.status(500).json({ error: 'Failed to fetch guide' });
  }
});

// POST - Create new guide (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  const { name, designation } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !designation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newGuide = new Guide({ name, designation, image });
    await newGuide.save();

    res.status(201).json({
      message: '✅ Guide created successfully',
      guide: newGuide,
    });
  } catch (err) {
    console.error('❌ Error creating guide:', err);
    res.status(500).json({ error: 'Failed to create guide' });
  }
});

// PUT - Update guide (image optional)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, designation } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !designation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updateData = { name, designation };
    if (image) updateData.image = image;

    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedGuide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    res.json({ message: '✅ Guide updated successfully', guide: updatedGuide });
  } catch (err) {
    console.error('❌ Error updating guide:', err);
    res.status(500).json({ error: 'Failed to update guide' });
  }
});

// DELETE - Delete guide
router.delete('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ error: 'Guide not found' });

    // remove uploaded image file if exists
    if (guide.image) {
      const imagePath = path.join(uploadDir, guide.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await guide.deleteOne();

    res.json({ message: '🗑️ Guide deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting guide:', err);
    res.status(500).json({ error: 'Failed to delete guide' });
  }
});

export default router;
