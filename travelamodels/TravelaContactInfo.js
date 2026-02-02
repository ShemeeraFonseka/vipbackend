import mongoose from 'mongoose';
const TravelaContactInfoSchema = new mongoose.Schema({
  office: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  mapUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('TravelaContactInfo', TravelaContactInfoSchema);