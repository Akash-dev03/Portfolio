import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string | null;
  githubUrl: string | null;
  technologies: string;
  featured: string;
  createdAt: string;
  updatedAt: string;
}

interface SkillData {
  id: string;
  name: string;
  category: string;
  devicon: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminData {
  id: string;
  passcode: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

async function importProjects() {
  try {
    console.log('Importing projects...');
    await prisma.project.deleteMany({});
    await prisma.$executeRaw`SELECT setval('"Project_id_seq"', 1, false);`;
    
    const csvFilePath = 'C:/Users/Akash/Downloads/output_project.csv';
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as ProjectData[];

    for (const record of records) {
      const technologies = JSON.parse(record.technologies) as string[];
      await prisma.project.create({
        data: {
          id: parseInt(record.id),
          title: record.title,
          description: record.description,
          imageUrl: record.imageUrl || null,
          liveUrl: record.liveUrl || null,
          githubUrl: record.githubUrl || null,
          technologies: technologies,
          featured: record.featured === 'true',
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt)
        }
      });
      console.log(`Imported project: ${record.title}`);
    }

    const maxProjectId = Math.max(...records.map(r => parseInt(r.id)));
    await prisma.$executeRaw`SELECT setval('"Project_id_seq"', ${maxProjectId}, true);`;
    console.log('Projects import completed');
  } catch (error) {
    console.error('Error importing projects:', error);
  }
}

async function importSkills() {
  try {
    console.log('Importing skills...');
    await prisma.skill.deleteMany({});
    await prisma.$executeRaw`SELECT setval('"Skill_id_seq"', 1, false);`;
    
    const csvFilePath = 'C:/Users/Akash/Downloads/output_skill.csv';
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as SkillData[];

    for (const record of records) {
      await prisma.skill.create({
        data: {
          id: parseInt(record.id),
          name: record.name,
          category: record.category,
          devicon: record.devicon || null,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt)
        }
      });
      console.log(`Imported skill: ${record.name}`);
    }

    const maxSkillId = Math.max(...records.map(r => parseInt(r.id)));
    await prisma.$executeRaw`SELECT setval('"Skill_id_seq"', ${maxSkillId}, true);`;
    console.log('Skills import completed');
  } catch (error) {
    console.error('Error importing skills:', error);
  }
}

async function importAdmins() {
  try {
    console.log('Importing admins...');
    await prisma.admin.deleteMany({});
    await prisma.$executeRaw`SELECT setval('"Admin_id_seq"', 1, false);`;
    
    const csvFilePath = 'C:/Users/Akash/Downloads/output_admin.csv';
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as AdminData[];

    for (const record of records) {
      await prisma.admin.create({
        data: {
          id: parseInt(record.id),
          passcode: record.passcode,
          name: record.name,
          createdAt: new Date(record.createdAt),
          updatedAt: new Date(record.updatedAt)
        }
      });
      console.log(`Imported admin: ${record.name}`);
    }

    const maxAdminId = Math.max(...records.map(r => parseInt(r.id)));
    await prisma.$executeRaw`SELECT setval('"Admin_id_seq"', ${maxAdminId}, true);`;
    console.log('Admins import completed');
  } catch (error) {
    console.error('Error importing admins:', error);
  }
}

async function migrateAllData() {
  try {
    await importProjects();
    await importSkills();
    await importAdmins();
    console.log('All data migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAllData(); 