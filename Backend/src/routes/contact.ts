import express from 'express';
import { adminService } from '../services/AdminService.js';
import { sendContactNotification } from '../services/mailService.js';

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, inquiryType, preferredContact, newsletter } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name, email and message are required',
      });
    }

    const contact = await adminService.saveContactRequest({
      name,
      email,
      phone,
      subject,
      message,
      inquiry_type: inquiryType || 'general',
      preferred_contact: preferredContact || 'email',
      newsletter: newsletter || false,
    });

    // Send email notification in the background
    sendContactNotification({
      name,
      email,
      phone,
      subject,
      message,
      inquiry_type: inquiryType || 'general',
      preferred_contact: preferredContact || 'email',
      newsletter: newsletter || false,
    }).catch((err) => {
      console.error('Background contact notification failed:', err);
    });

    return res.status(201).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Error saving contact request:', error);
    return res.status(500).json({
      error: 'Failed to submit contact request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/contact (admin)
router.get('/', async (_req, res) => {
  try {
    const contacts = await adminService.getContactRequests();
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch contact requests' });
  }
});

export default router;
