import mongoose from 'mongoose';
const TravelaAboutSchema = new mongoose.Schema({
  para1: { type: String, required: true },
  para2: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  line3: { type: String, required: true },
  line4: { type: String, required: true },
  line5: { type: String, required: true },
  line6: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('TravelaAbout', TravelaAboutSchema);