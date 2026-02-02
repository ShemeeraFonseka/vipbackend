import express from 'express';
import Booking from '../travelamodels/TravelaBooking.js';

const router = express.Router();

// ================== ROUTES ==================

// GET - Fetch all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET - Fetch single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('❌ Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST - Create new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, bookingdatetime, destination, request, datetime } = req.body;

    if (!name || !email || !bookingdatetime || !destination) {
      return res.status(400).json({
        error: 'Name, email, booking datetime, and destination are required'
      });
    }

    const booking = new Booking({
      name,
      email,
      bookingdatetime: new Date(bookingdatetime),
      destination,
      request: request || '',
      datetime: datetime ? new Date(datetime) : new Date(),
      status: 'pending'
    });

    const savedBooking = await booking.save();
    res.status(201).json({
      message: '✅ Booking created successfully',
      bookingID: savedBooking._id,
      status: savedBooking.status
    });
  } catch (err) {
    console.error('❌ Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT - Update booking details
router.put('/:id', async (req, res) => {
  try {
    const { name, email, bookingdatetime, destination, request, status } = req.body;

    if (!name || !email || !bookingdatetime || !destination) {
      return res.status(400).json({
        error: 'Name, email, booking datetime, and destination are required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        bookingdatetime: new Date(bookingdatetime),
        destination,
        request: request || '',
        status: status || 'pending'
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: '✅ Booking updated successfully', data: updated });
  } catch (err) {
    console.error('❌ Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// PATCH - Update booking status only
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: `✅ Booking status updated to ${status} successfully`,
      data: updated
    });
  } catch (err) {
    console.error('❌ Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// GET - Fetch bookings by status
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookings = await Booking.find({ status }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching bookings by status:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// DELETE - Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: '✅ Booking deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
