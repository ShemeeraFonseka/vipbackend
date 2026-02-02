import express from 'express';
import Booking from '../travelamodels/TravelaBooking.js';
import Package from '../travelamodels/TravelaPackage.js';
import User from '../travelamodels/TravelaUser.js';
import Guide from '../travelamodels/TravelaGuide.js';

const router = express.Router();

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Booking statistics
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({
      status: 'cancelled',
      bookingdatetime: { $gte: startOfMonth }
    });

    // Total packages
    const totalPackages = await Package.countDocuments();

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    // Total guides
    const totalGuides = await Guide.countDocuments();

    // Recent bookings (last 5)
    const recentBookings = await Booking.find()
      .sort({ bookingdatetime: -1 })
      .limit(5)
      .select('name email destination bookingdatetime status');

    // Monthly revenue (confirmed bookings this month)
    const confirmedBookingsThisMonth = await Booking.aggregate([
      {
        $match: {
          status: 'confirmed',
          bookingdatetime: { $gte: startOfMonth }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'destination',
          foreignField: 'place',
          as: 'package'
        }
      },
      { $unwind: '$package' },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$package.price' }
        }
      }
    ]);

    const monthlyRevenue = confirmedBookingsThisMonth[0]?.monthlyRevenue || 0;

    // Popular packages (most booked)
    const popularPackages = await Booking.aggregate([
      { $group: { _id: '$destination', bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: 'place',
          as: 'package'
        }
      },
      { $unwind: '$package' },
      {
        $project: {
          packageID: '$package._id',
          place: '$package.place',
          price: '$package.price',
          days: '$package.days',
          persons: '$package.persons',
          image: '$package.image',
          bookingCount: 1
        }
      }
    ]);

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalPackages,
      totalUsers,
      activeUsers,
      totalGuides,
      monthlyRevenue,
      recentBookings,
      popularPackages
    });
  } catch (err) {
    console.error('Error fetching dashboard statistics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

export default router;
