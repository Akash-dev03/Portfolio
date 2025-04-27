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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Login route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { passcode } = req.body;
        const admin = yield prisma_1.default.admin.findUnique({
            where: { passcode }
        });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid passcode' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name
            }
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get current admin
router.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield prisma_1.default.admin.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Change passcode (protected)
router.put('/change-passcode', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPasscode } = req.body;
        if (!newPasscode) {
            return res.status(400).json({ message: 'New passcode is required' });
        }
        yield prisma_1.default.admin.update({
            where: { id: req.user.id },
            data: { passcode: newPasscode }
        });
        res.json({ message: 'Passcode updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
