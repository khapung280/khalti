import ContactMessage from '../model/ContactMessage.js';

export const createContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, email, and message are required.',
      });
    }

    const doc = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName?.trim() || '',
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'general',
      message: message.trim(),
    });

    res.status(201).json({
      message: 'Contact message saved successfully',
      contact: doc,
    });
  } catch (err) {
    console.error('createContactMessage:', err);
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
};

export const listContactMessages = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const items = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ count: items.length, messages: items });
  } catch (err) {
    console.error('listContactMessages:', err);
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
};
