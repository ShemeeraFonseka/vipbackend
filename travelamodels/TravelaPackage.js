// models/Package.js
import mongoose from 'mongoose';
const TravelaPackageSchema = new mongoose.Schema(
  {
    place: { type: String, required: true },
    days: { type: Number, required: true },
    persons: { type: Number, required: true },
    price: { type: Number, required: true },
    stars: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('TravelaPackage', TravelaPackageSchema);
