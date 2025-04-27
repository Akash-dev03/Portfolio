import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { sendEmail } from '../lib/email';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message
      }
    });

    // Send confirmation email to the sender
    const emailSent = await sendEmail(
      email,
      'Thank you for contacting me',
      `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you soon.\n\nBest regards,\n${process.env.SMTP_FROM_NAME}`,
      `<p>Hi ${name},</p>
      <p>Thank you for reaching out. I have received your message and will get back to you soon.</p>
      <p>Best regards,<br>${process.env.SMTP_FROM_NAME}</p>`
    );

    if (!emailSent) {
      console.error('Failed to send confirmation email');
    }

    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread contacts count (protected)
router.get('/unread', authMiddleware, async (req, res) => {
  try {
    const count = await prisma.contact.count({
      where: {
        read: false
      }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark contact as read (protected)
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        read: true
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to contact (protected)
router.post('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const contactId = parseInt(req.params.id);

    // Get the contact details first
    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update the contact with the reply
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId
      },
      data: {
        read: true,
        replies: {
          create: {
            message
          }
        }
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    // Send email to the original sender
    const emailSent = await sendEmail(
      contact.email,
      'Reply to your message',
      `Hi ${contact.name},\n\nThank you for your message. Here's my reply:\n\n${message}\n\nBest regards,\n${process.env.SMTP_FROM_NAME}`,
      `<p>Hi ${contact.name},</p>
      <p>Thank you for your message. Here's my reply:</p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p>Best regards,<br>${process.env.SMTP_FROM_NAME}</p>`
    );

    if (!emailSent) {
      console.error('Failed to send reply email');
    }

    res.json(updatedContact);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.contact.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 