import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: '', trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    subject: { type: String, default: 'general', trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
