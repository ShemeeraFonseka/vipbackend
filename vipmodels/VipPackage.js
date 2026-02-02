import mongoose from 'mongoose';

const VipPackageSchema = new mongoose.Schema({
  packageId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  
  
  // Detailed content fields
  detailedTitle: { type: String },
  detailedIntro: { type: String },
  
  // Multiple sections for detailed content
  sections: [{
    sectionTitle: { type: String },
    sectionContent: { type: String },
    sectionImage: { type: String }
  }],
  
  proTip: { type: String },
  
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('VipPackage', VipPackageSchema);