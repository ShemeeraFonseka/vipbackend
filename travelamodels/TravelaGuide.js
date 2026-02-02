// models/Guide.js
import mongoose from 'mongoose';
const TravelaGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('TravelaGuide', TravelaGuideSchema);
