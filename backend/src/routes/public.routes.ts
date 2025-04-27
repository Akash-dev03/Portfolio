import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// Public Skills Route
router.get('/skills', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 