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
const email_1 = require("../lib/email");
const router = express_1.default.Router();
// Submit contact form (public)
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        const contact = yield prisma_1.default.contact.create({
            data: {
                name,
                email,
                message
            }
        });
        // Send confirmation email to the sender
        const emailSent = yield (0, email_1.sendEmail)(email, 'Thank you for contacting me', `Hi ${name},\n\nThank you for reaching out. I have received your message and will get back to you soon.\n\nBest regards,\n${process.env.SMTP_FROM_NAME}`, `<p>Hi ${name},</p>
      <p>Thank you for reaching out. I have received your message and will get back to you soon.</p>
      <p>Best regards,<br>${process.env.SMTP_FROM_NAME}</p>`);
        if (!emailSent) {
            console.error('Failed to send confirmation email');
        }
        res.status(201).json(contact);
    }
    catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get all contacts (protected)
router.get('/', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield prisma_1.default.contact.findMany({
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
    }
    catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get unread contacts count (protected)
router.get('/unread', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield prisma_1.default.contact.count({
            where: {
                read: false
            }
        });
        res.json({ count });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Mark contact as read (protected)
router.put('/:id/read', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield prisma_1.default.contact.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Add reply to contact (protected)
router.post('/:id/reply', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const contactId = parseInt(req.params.id);
        // Get the contact details first
        const contact = yield prisma_1.default.contact.findUnique({
            where: { id: contactId }
        });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        // Update the contact with the reply
        const updatedContact = yield prisma_1.default.contact.update({
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
        const emailSent = yield (0, email_1.sendEmail)(contact.email, 'Reply to your message', `Hi ${contact.name},\n\nThank you for your message. Here's my reply:\n\n${message}\n\nBest regards,\n${process.env.SMTP_FROM_NAME}`, `<p>Hi ${contact.name},</p>
      <p>Thank you for your message. Here's my reply:</p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p>Best regards,<br>${process.env.SMTP_FROM_NAME}</p>`);
        if (!emailSent) {
            console.error('Failed to send reply email');
        }
        res.json(updatedContact);
    }
    catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Delete contact (protected)
router.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.contact.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.json({ message: 'Contact deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
