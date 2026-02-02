import express from 'express';
import BookingStep from '../models/BookingStep.js'; // Mongo model

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch all steps
router.get('/', async (req, res) => {
  try {
    const steps = await BookingStep.find().sort({ createdAt: -1 });
    res.json(steps);
  } catch (err) {
    console.error('❌ Error fetching steps:', err);
    res.status(500).json({ error: 'Failed to fetch steps' });
  }
});

// PUT - Update step by ID
router.put('/:id', async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updated = await BookingStep.findByIdAndUpdate(
      req.params.id,
      { topic, description },
      { new: true } // Return updated document
    );

    if (!updated) {
      return res.status(404).json({ error: 'Step not found' });
    }

    res.json({ message: '✅ Step updated successfully', data: updated });
  } catch (err) {
    console.error('❌ Error updating step:', err);
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// routes/bookingSteps.js - Add this POST route
router.post('/', async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newStep = new BookingStep({ topic, description });
    const savedStep = await newStep.save();
    
    res.status(201).json({ 
      message: '✅ Step created successfully', 
      data: savedStep 
    });
  } catch (err) {
    console.error('❌ Error creating step:', err);
    res.status(500).json({ error: 'Failed to create step' });
  }
});

export default router;
