import mongoose from 'mongoose';

const BookingStepSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('BookingStep', BookingStepSchema);
