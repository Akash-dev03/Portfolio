import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, imageUrl, liveUrl, githubUrl, technologies, featured } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies,
        featured: featured || false
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, imageUrl, liveUrl, githubUrl, technologies, featured } = req.body;

    const project = await prisma.project.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies,
        featured
      }
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 