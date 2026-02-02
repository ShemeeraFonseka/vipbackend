// routes/packages.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Package from '../travelamodels/TravelaPackage.js';

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

// GET - Fetch all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    console.error('❌ Error fetching packages:', err);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// GET - Fetch single package by ID
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    console.error('❌ Error fetching package:', err);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// POST - Create new package (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  const { place, days, persons, price, stars, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!place || !days || !persons || !price || !stars || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newPackage = new Package({
      place,
      days,
      persons,
      price,
      stars,
      description,
      image,
    });

    await newPackage.save();

    res.status(201).json({
      message: '✅ Package created successfully',
      package: newPackage,
    });
  } catch (err) {
    console.error('❌ Error creating package:', err);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// PUT - Update package (image optional)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { place, days, persons, price, stars, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!place || !days || !persons || !price || !stars || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updateData = { place, days, persons, price, stars, description };
    if (image) updateData.image = image;

    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({
      message: '✅ Package updated successfully',
      package: updatedPackage,
    });
  } catch (err) {
    console.error('❌ Error updating package:', err);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// DELETE - Delete package
router.delete('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    // remove image file if exists
    if (pkg.image) {
      const imagePath = path.join(uploadDir, pkg.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pkg.deleteOne();

    res.json({ message: '🗑️ Package deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting package:', err);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

export default router;
