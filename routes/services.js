// routes/services.js
import express from 'express';
import Service from '../models/Service.js'; // Import MongoDB model

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ _id: -1 }); // Sort by newest
    res.json(services);
  } catch (err) {
    console.error('❌ Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// PUT - Update service by ID
router.put('/:id', async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { topic, description },
      { new: true } // returns updated document
    );

    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: '✅ Service updated successfully', service: updatedService });
  } catch (err) {
    console.error('❌ Error updating service:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// routes/services.js - Add this POST route
router.post('/', async (req, res) => {
  const { topic, description } = req.body;

  if (!topic || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newService = new Service({ topic, description });
    const savedService = await newService.save();
    
    res.status(201).json({ 
      message: '✅ Service created successfully', 
      service: savedService 
    });
  } catch (err) {
    console.error('❌ Error creating service:', err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

export default router;
