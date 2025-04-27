import express from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { passcode } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { passcode }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid passcode' });
    }

    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change passcode (protected)
router.put('/change-passcode', authMiddleware, async (req: any, res) => {
  try {
    const { newPasscode } = req.body;

    if (!newPasscode) {
      return res.status(400).json({ message: 'New passcode is required' });
    }

    await prisma.admin.update({
      where: { id: req.user.id },
      data: { passcode: newPasscode }
    });

    res.json({ message: 'Passcode updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 