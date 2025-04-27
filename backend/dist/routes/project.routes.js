"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Get all projects
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma_1.default.project.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get featured projects
router.get('/featured', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma_1.default.project.findMany({
            where: {
                featured: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching featured projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get single project
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield prisma_1.default.project.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Create project (protected)
router.post('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageUrl, liveUrl, githubUrl, technologies, featured } = req.body;
        const project = yield prisma_1.default.project.create({
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
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Update project (protected)
router.put('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageUrl, liveUrl, githubUrl, technologies, featured } = req.body;
        const project = yield prisma_1.default.project.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Delete project (protected)
router.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.project.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
