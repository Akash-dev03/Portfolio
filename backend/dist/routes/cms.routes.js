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
// Hero Section Routes
router.get('/hero', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hero = yield prisma_1.default.heroSection.findFirst();
        res.json(hero || {});
    }
    catch (error) {
        console.error('Error fetching hero section:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/hero', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, roles } = req.body;
        const existingHero = yield prisma_1.default.heroSection.findFirst();
        let hero;
        if (existingHero) {
            hero = yield prisma_1.default.heroSection.update({
                where: { id: existingHero.id },
                data: { name, roles }
            });
        }
        else {
            hero = yield prisma_1.default.heroSection.create({
                data: { name, roles }
            });
        }
        res.json(hero);
    }
    catch (error) {
        console.error('Error updating hero section:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// About Section Routes
router.get('/about', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const about = yield prisma_1.default.aboutSection.findFirst();
        res.json(about || {});
    }
    catch (error) {
        console.error('Error fetching about section:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/about', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const existingAbout = yield prisma_1.default.aboutSection.findFirst();
        let about;
        if (existingAbout) {
            about = yield prisma_1.default.aboutSection.update({
                where: { id: existingAbout.id },
                data: { content }
            });
        }
        else {
            about = yield prisma_1.default.aboutSection.create({
                data: { content }
            });
        }
        res.json(about);
    }
    catch (error) {
        console.error('Error updating about section:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Skills Routes
router.get('/skills', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = yield prisma_1.default.skill.findMany({
            orderBy: { category: 'asc' }
        });
        res.json(skills);
    }
    catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.post('/skills', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, devicon } = req.body;
        const skill = yield prisma_1.default.skill.create({
            data: { name, category, devicon }
        });
        res.status(201).json(skill);
    }
    catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/skills/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, devicon } = req.body;
        const skill = yield prisma_1.default.skill.update({
            where: { id: parseInt(req.params.id) },
            data: { name, category, devicon }
        });
        res.json(skill);
    }
    catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.delete('/skills/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.skill.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Skill deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Education Routes
router.get('/education', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education = yield prisma_1.default.education.findMany({
            orderBy: { startDate: 'desc' }
        });
        res.json(education);
    }
    catch (error) {
        console.error('Error fetching education:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.post('/education', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { institution, degree, field, startDate, endDate, grade, achievements } = req.body;
        const education = yield prisma_1.default.education.create({
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
    }
    catch (error) {
        console.error('Error creating education entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/education/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { institution, degree, field, startDate, endDate, grade, achievements } = req.body;
        const education = yield prisma_1.default.education.update({
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
    }
    catch (error) {
        console.error('Error updating education entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.delete('/education/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.education.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Education entry deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting education entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
