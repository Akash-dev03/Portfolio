import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = express.Router();

// Hero Section Routes
router.get('/hero', async (req, res) => {
  try {
    const hero = await prisma.heroSection.findFirst();
    res.json(hero || {});
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/hero', authMiddleware, async (req, res) => {
  try {
    const { name, roles } = req.body;
    const existingHero = await prisma.heroSection.findFirst();

    let hero;
    if (existingHero) {
      hero = await prisma.heroSection.update({
        where: { id: existingHero.id },
        data: { name, roles }
      });
    } else {
      hero = await prisma.heroSection.create({
        data: { name, roles }
      });
    }

    res.json(hero);
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// About Section Routes
router.get('/about', async (req, res) => {
  try {
    const about = await prisma.aboutSection.findFirst();
    res.json(about || {});
  } catch (error) {
    console.error('Error fetching about section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/about', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const existingAbout = await prisma.aboutSection.findFirst();

    let about;
    if (existingAbout) {
      about = await prisma.aboutSection.update({
        where: { id: existingAbout.id },
        data: { content }
      });
    } else {
      about = await prisma.aboutSection.create({
        data: { content }
      });
    }

    res.json(about);
  } catch (error) {
    console.error('Error updating about section:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Skills Routes
router.get('/skills', authMiddleware, async (req, res) => {
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

router.post('/skills', authMiddleware, async (req, res) => {
  try {
    const { name, category, devicon } = req.body;
    const skill = await prisma.skill.create({
      data: { name, category, devicon }
    });
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/skills/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, devicon } = req.body;
    const skill = await prisma.skill.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, devicon }
    });
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/skills/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Education Routes
router.get('/education', async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { startDate: 'desc' }
    });
    res.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/education', authMiddleware, async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, grade, achievements } = req.body;
    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        grade,
        achievements
      }
    });
    res.status(201).json(education);
  } catch (error) {
    console.error('Error creating education entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/education/:id', authMiddleware, async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, grade, achievements } = req.body;
    const education = await prisma.education.update({
      where: { id: parseInt(req.params.id) },
      data: {
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        grade,
        achievements
      }
    });
    res.json(education);
  } catch (error) {
    console.error('Error updating education entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/education/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.education.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 