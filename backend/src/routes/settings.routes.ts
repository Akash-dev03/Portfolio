import express, { Request } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const {
      aboutText,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      emailAddress
    } = req.body;

    const existingSettings = await prisma.settings.findFirst();

    let settings;
    if (existingSettings) {
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          aboutText,
          resumeUrl,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          emailAddress
        }
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          aboutText,
          resumeUrl,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          emailAddress
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change admin passcode
router.put('/change-passcode', authMiddleware, async (req: Request & { user?: { id: number } }, res) => {
  try {
    const { newPasscode } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!newPasscode || newPasscode.length < 6) {
      return res.status(400).json({ 
        message: 'Passcode must be at least 6 characters long' 
      });
    }

    // Update the admin's passcode
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: { passcode: newPasscode }
    });

    res.json({ 
      message: 'Passcode updated successfully',
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name
      }
    });
  } catch (error) {
    console.error('Error changing passcode:', error);
    res.status(500).json({ message: 'Failed to update passcode' });
  }
});

// Test route to verify current passcode (for testing purposes only)
router.get('/verify-passcode', authMiddleware, async (req: Request & { user?: { id: number } }, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        passcode: true
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Current passcode retrieved',
      admin: {
        id: admin.id,
        name: admin.name,
        passcode: admin.passcode
      }
    });
  } catch (error) {
    console.error('Error verifying passcode:', error);
    res.status(500).json({ message: 'Failed to verify passcode' });
  }
});

export default router; 