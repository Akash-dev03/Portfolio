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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../lib/prisma");
var projects = [
    {
        title: 'AI Chat Application',
        description: 'A real-time chat application with AI-powered features, including message sentiment analysis and automatic translations.',
        imageUrl: 'https://picsum.photos/seed/project1/600/400',
        technologies: ['React', 'Node.js', 'Socket.io', 'TensorFlow.js', 'MongoDB'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://demo.com',
        featured: true
    },
    {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with product search, shopping cart, payment processing, and admin dashboard.',
        imageUrl: 'https://picsum.photos/seed/project2/600/400',
        technologies: ['React', 'Redux', 'Express', 'MongoDB', 'Stripe API'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://demo.com',
        featured: true
    },
    {
        title: 'Cloud File Manager',
        description: 'A secure cloud-based file storage and sharing application with real-time collaboration features.',
        imageUrl: 'https://picsum.photos/seed/project3/600/400',
        technologies: ['React', 'Firebase', 'Cloud Functions', 'Storage API'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://demo.com',
        featured: false
    },
    {
        title: 'Social Media Dashboard',
        description: 'A comprehensive analytics dashboard that tracks and visualizes social media engagement across multiple platforms.',
        imageUrl: 'https://picsum.photos/seed/project4/600/400',
        technologies: ['React', 'D3.js', 'Node.js', 'Express', 'Social Media APIs'],
        githubUrl: 'https://github.com',
        featured: false
    },
    {
        title: 'Task Management System',
        description: 'A collaborative project management tool with task tracking, team assignments, and progress monitoring.',
        imageUrl: 'https://picsum.photos/seed/project5/600/400',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.io'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://demo.com',
        featured: false
    },
    {
        title: 'Smart Home IoT Dashboard',
        description: 'An IoT dashboard for monitoring and controlling smart home devices with real-time updates and automation rules.',
        imageUrl: 'https://picsum.photos/seed/project6/600/400',
        technologies: ['React', 'MQTT', 'Node.js', 'MongoDB', 'Chart.js'],
        githubUrl: 'https://github.com',
        featured: false
    }
];
function seedProjects() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, projects_1, project, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 9]);
                    // Clear existing projects
                    return [4 /*yield*/, prisma_1.default.project.deleteMany()];
                case 1:
                    // Clear existing projects
                    _a.sent();
                    console.log('Cleared existing projects');
                    _i = 0, projects_1 = projects;
                    _a.label = 2;
                case 2:
                    if (!(_i < projects_1.length)) return [3 /*break*/, 5];
                    project = projects_1[_i];
                    return [4 /*yield*/, prisma_1.default.project.create({
                            data: project
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('Successfully seeded projects');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error seeding projects:', error_1);
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, prisma_1.default.$disconnect()];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
seedProjects();
