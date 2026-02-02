import express from 'express';
import VipTestimonial from '../vipmodels/VipTestimonial.js';

const router = express.Router();

// GET - Fetch all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await VipTestimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error('❌ Error fetching testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// GET - Fetch only active testimonials (for public display)
router.get('/active', async (req, res) => {
  try {
    const testimonials = await VipTestimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error('❌ Error fetching active testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch active testimonials' });
  }
});

// POST - Create new testimonial
router.post('/', async (req, res) => {
  const { name, role, quote, isActive } = req.body;

  if (!name || !role || !quote) {
    return res.status(400).json({ error: 'Name, role, and quote are required' });
  }

  try {
    const newTestimonial = new VipTestimonial({
      name,
      role,
      quote,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedTestimonial = await newTestimonial.save();

    res.status(201).json({
      message: '✅ Testimonial created successfully',
      testimonial: savedTestimonial
    });
  } catch (err) {
    console.error('❌ Error creating testimonial:', err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// PUT - Update testimonial
router.put('/:id', async (req, res) => {
  const { name, role, quote, isActive } = req.body;

  if (!name || !role || !quote) {
    return res.status(400).json({ error: 'Name, role, and quote are required' });
  }

  try {
    const updated = await VipTestimonial.findByIdAndUpdate(
      req.params.id,
      { name, role, quote, isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ 
      message: '✅ Testimonial updated successfully',
      testimonial: updated
    });
  } catch (err) {
    console.error('❌ Error updating testimonial:', err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// DELETE - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await VipTestimonial.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: '✅ Testimonial deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// PATCH - Toggle active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const testimonial = await VipTestimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.json({ 
      message: `✅ Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
      testimonial
    });
  } catch (err) {
    console.error('❌ Error toggling testimonial status:', err);
    res.status(500).json({ error: 'Failed to toggle testimonial status' });
  }
});

export default router;