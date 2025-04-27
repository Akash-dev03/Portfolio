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
// Get settings
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield prisma_1.default.settings.findFirst();
        res.json(settings || {});
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Update settings (protected)
router.put('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { aboutText, resumeUrl, githubUrl, linkedinUrl, twitterUrl, emailAddress } = req.body;
        const existingSettings = yield prisma_1.default.settings.findFirst();
        let settings;
        if (existingSettings) {
            settings = yield prisma_1.default.settings.update({
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
        }
        else {
            settings = yield prisma_1.default.settings.create({
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
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Change admin passcode
router.put('/change-passcode', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { newPasscode } = req.body;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!newPasscode || newPasscode.length < 6) {
            return res.status(400).json({
                message: 'Passcode must be at least 6 characters long'
            });
        }
        // Update the admin's passcode
        const updatedAdmin = yield prisma_1.default.admin.update({
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
    }
    catch (error) {
        console.error('Error changing passcode:', error);
        res.status(500).json({ message: 'Failed to update passcode' });
    }
}));
// Test route to verify current passcode (for testing purposes only)
router.get('/verify-passcode', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const admin = yield prisma_1.default.admin.findUnique({
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
    }
    catch (error) {
        console.error('Error verifying passcode:', error);
        res.status(500).json({ message: 'Failed to verify passcode' });
    }
}));
exports.default = router;
