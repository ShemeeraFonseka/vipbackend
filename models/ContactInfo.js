import mongoose from 'mongoose';

const ContactInfoSchema = new mongoose.Schema({
  office: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  mapUrl: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('ContactInfo', ContactInfoSchema);
