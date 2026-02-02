// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true }
});

export default mongoose.model('Service', serviceSchema);
