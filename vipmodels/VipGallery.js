import mongoose from 'mongoose';

const VipGallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('VipGallery', VipGallerySchema);