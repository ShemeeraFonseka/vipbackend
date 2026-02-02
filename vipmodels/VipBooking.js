import mongoose from 'mongoose';
const VipBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  destination: { type: String, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  request: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('VipBooking', VipBookingSchema);