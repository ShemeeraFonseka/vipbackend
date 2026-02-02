import mongoose from 'mongoose';
const VipAboutSchema = new mongoose.Schema({

  section1: {
    heading: { type: String, required: true, default: 'About VIP tours' },
    paragraph1: { type: String, required: true },
    paragraph2: { type: String, required: true },
    image: { type: String, required: true }
  },
  section2: {
    paragraph1: { type: String, required: true },
    paragraph2: { type: String, required: true },
    paragraph3: { type: String, required: true },
    image: { type: String, required: true }


  }
}, { timestamps: true });

export default mongoose.model('VipAbout', VipAboutSchema);