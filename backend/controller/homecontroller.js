import HomeContent from '../model/HomeContent.js';

const defaultHomePayload = {
  key: 'homepage',
  heroTitle: 'Farm Fresh Organic Groceries',
  heroSubtitle: 'Premium produce, grains, and pantry essentials from Nepal’s Koshi region.',
  tagline: 'Koshi Organic Agro Food',
  trustBadges: [
    'Certified Organic',
    'Same-Day Delivery',
    'Fair Trade Farmers',
    'Secure Payments',
  ],
  benefits: [
    {
      title: '100% Organic',
      description: 'No harmful chemicals — grown the natural way.',
      imageUrl:
        'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    },
    {
      title: 'Farm Fresh',
      description: 'Harvested daily from partner farms in Koshi.',
      imageUrl:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    },
    {
      title: 'Direct from Farmers',
      description: 'Fair prices for growers and families.',
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    },
  ],
};

/** GET /api/home — returns homepage content (creates default doc if missing) */
export const getHomeContent = async (req, res) => {
  try {
    let doc = await HomeContent.findOne({ key: 'homepage' }).lean();

    if (!doc) {
      const created = await HomeContent.create(defaultHomePayload);
      doc = created.toObject();
    }

    res.json(doc);
  } catch (err) {
    console.error('getHomeContent:', err);
    res.status(500).json({ error: 'Failed to load home content', details: err.message });
  }
};

/** PUT /api/home — merge fields into homepage document (demo / CMS-style) */
export const updateHomeContent = async (req, res) => {
  try {
    let doc = await HomeContent.findOne({ key: 'homepage' });
    if (!doc) {
      doc = await HomeContent.create(defaultHomePayload);
    }

    const allowed = ['heroTitle', 'heroSubtitle', 'tagline', 'trustBadges', 'benefits'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        doc[key] = req.body[key];
      }
    }
    doc.key = 'homepage';
    await doc.save();

    res.json({ message: 'Homepage content updated', home: doc.toObject() });
  } catch (err) {
    console.error('updateHomeContent:', err);
    res.status(500).json({ error: 'Failed to update home content', details: err.message });
  }
};

/** POST /api/home/reset — restores default seeded content */
export const resetHomeContent = async (req, res) => {
  try {
    await HomeContent.findOneAndUpdate(
      { key: 'homepage' },
      { $set: defaultHomePayload },
      { upsert: true, new: true }
    );

    const doc = await HomeContent.findOne({ key: 'homepage' }).lean();
    res.status(200).json({ message: 'Homepage reset to defaults', home: doc });
  } catch (err) {
    console.error('resetHomeContent:', err);
    res.status(500).json({ error: 'Failed to reset home content', details: err.message });
  }
};
