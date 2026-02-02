// models/Service.js
import mongoose from 'mongoose';
const travekaServiceSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true }
});

export default mongoose.model('TravelaService', travekaServiceSchema);
