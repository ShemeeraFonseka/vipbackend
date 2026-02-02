import mongoose from 'mongoose';
const VipContactInfoSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('VipContactInfo', VipContactInfoSchema);