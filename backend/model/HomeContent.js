import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'homepage', unique: true },
    heroTitle: { type: String, default: 'Farm Fresh Organic Groceries' },
    heroSubtitle: { type: String, default: 'From Nepal’s Koshi region to your table.' },
    tagline: { type: String, default: 'Koshi Organic Agro Food' },
    trustBadges: [{ type: String }],
    benefits: [
      {
        title: String,
        description: String,
        imageUrl: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('HomeContent', homeContentSchema);
