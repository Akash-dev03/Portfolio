import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { skills, type SkillCategory } from '@/data/skills';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, Filter, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://portfolio-bfnh.onrender.com/api';


interface Skill {
  id: number;
  name: string;
  category: string;
  devicon: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  technologies: string[];
  featured: boolean;
}

const CMS = () => {
  return (
    <AdminLayout title="Content Management">
      <div className="glass-morphism rounded-xl p-6">
        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="mb-6 bg-dark/70">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills">
            <SkillsForm />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsForm />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const SkillsForm = () => {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    category: 'frontend' as SkillCategory, 
    devicon: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const categories: SkillCategory[] = ['languages', 'frontend', 'backend', 'tools', 'other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to access this feature",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(
        `${API_URL}/cms/skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSkillsData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Please log in again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
        });
      }
      console.error('Error fetching skills:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_URL}/cms/skills`,
        newSkill,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSkillsData([...skillsData, response.data]);
      setNewSkill({ name: '', category: 'frontend', devicon: '' });
      toast({
        title: "Skill added",
        description: "New skill has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (id: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_URL}/cms/skills/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSkillsData(skillsData.filter(skill => skill.id !== id));
      toast({
        title: "Skill removed",
        description: "Skill has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkill = async (id: number, updatedSkill: Skill) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/cms/skills/${id}`,
        updatedSkill,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSkillsData(skillsData.map(skill => 
        skill.id === id ? response.data : skill
      ));
      setEditingSkill(null);
      toast({
        title: "Success",
        description: "Skill has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkills = skillsData
    .filter(skill => {
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Skills ({skillsData.length})</h3>
        <Button onClick={() => document.getElementById('addSkillSection')?.focus()} className="bg-glow hover:bg-glow/90">
          <Plus className="mr-2" /> Add New Skill
        </Button>
      </div>

      {editingSkill ? (
        <Card className="bg-secondary/20 border-gray-800">
          <CardHeader>
            <CardTitle>Edit Skill</CardTitle>
            <CardDescription>Update the skill details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Skill Name</label>
                <input
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. React"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Category</label>
                <Select
                  value={editingSkill.category}
                  onValueChange={(value: SkillCategory) => setEditingSkill({...editingSkill, category: value})}
                >
                  <SelectTrigger className="bg-dark/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-gray-700">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Icon HTML (Devicon)</label>
                <input
                  value={editingSkill.devicon}
                  onChange={(e) => setEditingSkill({...editingSkill, devicon: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. devicon-react-original colored"
                />
                <a 
                  href="https://devicon.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-glow hover:underline"
                >
                  Find icons at devicon.dev
                </a>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => setEditingSkill(null)} 
                variant="outline"
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateSkill(editingSkill.id, editingSkill)} 
                className="bg-glow hover:bg-glow/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-secondary/20 border-gray-800">
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
            <CardDescription>Fill in the details to add a new skill to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Skill Name</label>
                <input
                  id="addSkillSection"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. React"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Category</label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value: SkillCategory) => setNewSkill({...newSkill, category: value})}
                >
                  <SelectTrigger className="bg-dark/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-gray-700">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Icon HTML (Devicon)</label>
                <input
                  value={newSkill.devicon}
                  onChange={(e) => setNewSkill({...newSkill, devicon: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. devicon-react-original colored"
                />
                <a 
                  href="https://devicon.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-glow hover:underline"
                >
                  Find icons at devicon.dev
                </a>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleAddSkill} 
                className="bg-glow hover:bg-glow/90"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Skill'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-secondary/20 border-gray-800">
        <CardHeader>
          <CardTitle>Manage Skills</CardTitle>
          <CardDescription>View and manage your skills</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value: SkillCategory | 'all') => setSelectedCategory(value)}
            >
              <SelectTrigger className="bg-dark/50 border-gray-700 text-white w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-dark/50">
              <TableRow>
                <TableHead className="text-gray-400">Icon</TableHead>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((skill) => (
                <TableRow key={skill.id} className="border-b border-gray-800">
                  <TableCell className="text-white">
                    <div className="flex items-center justify-center">
                      <i className={`${skill.devicon} text-2xl`}></i>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{skill.name}</TableCell>
                  <TableCell className="capitalize text-gray-300">{skill.category}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-blue-900/50 text-blue-400"
                      onClick={() => setEditingSkill(skill)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-red-900/50 text-red-400"
                      onClick={() => handleRemoveSkill(skill.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No skills found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectsForm = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to access this feature",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.get(
        `${API_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProjects(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Please log in again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      }
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
      };
      
      const response = await axios.post(
        `${API_URL}/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setProjects([...projects, response.data]);
      setNewProject({
        title: '',
        description: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        technologies: '',
        featured: false
      });
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (id: number, updatedData: Partial<Project>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // If trying to unstar a project, check if it's the last featured one
      if (updatedData.hasOwnProperty('featured') && !updatedData.featured) {
        const starredProjects = projects.filter(p => p.featured && p.id !== id);
        if (starredProjects.length === 0) {
          toast({
            title: "Error",
            description: "At least one project must be featured",
            variant: "destructive",
          });
          return;
        }
      }
      
      // If trying to star a project, check the maximum limit
      if (updatedData.featured) {
        const starredProjects = projects.filter(p => p.featured && p.id !== id);
        if (starredProjects.length >= 6) {
          toast({
            title: "Error",
            description: "Maximum 6 projects can be featured",
            variant: "destructive",
          });
          return;
        }
      }

      const currentProject = projects.find(p => p.id === id);
      if (!currentProject) return;

      // For star toggle, only send the featured status
      const dataToUpdate = updatedData.hasOwnProperty('featured') 
        ? { featured: updatedData.featured }
        : { ...currentProject, ...updatedData };

      const response = await axios.put(
        `${API_URL}/projects/${id}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Immediately update the local state
      setProjects(projects.map(project => 
        project.id === id ? { ...project, ...dataToUpdate } : project
      ));
      
      // Then fetch fresh data from server to ensure consistency
      fetchProjects();
      
      setEditingProject(null);
      toast({
        title: "Success",
        description: updatedData.hasOwnProperty('featured') 
          ? `Project ${updatedData.featured ? 'featured' : 'unfeatured'} successfully`
          : "Project updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      // Refresh projects list to ensure UI is in sync with server
      fetchProjects();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProject = async (id: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_URL}/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: "Success",
        description: "Project removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold text-white">Projects ({projects.length})</h3>
        <Button onClick={() => document.getElementById('addProjectSection')?.focus()} className="bg-glow hover:bg-glow/90">
          <Plus className="mr-2" /> Add New Project
        </Button>
      </div>

      {editingProject ? (
        <Card className="bg-secondary/20 border-gray-800">
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>Update the project details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Project Title *</label>
                <input
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. AI Chat Application"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Image URL</label>
                <input
                  value={editingProject.imageUrl}
                  onChange={(e) => setEditingProject({...editingProject, imageUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Description *</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  rows={3}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="Project description"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Tech Stack (comma separated)</label>
                <input
                  value={editingProject.technologies.join(', ')}
                  onChange={(e) => setEditingProject({...editingProject, technologies: e.target.value.split(',').map(t => t.trim())})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">GitHub URL</label>
                <input
                  value={editingProject.githubUrl}
                  onChange={(e) => setEditingProject({...editingProject, githubUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Live URL</label>
                <input
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({...editingProject, liveUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({...editingProject, featured: e.target.checked})}
                    className="form-checkbox h-4 w-4 text-glow rounded border-gray-700 bg-dark/50"
                  />
                  <span className="text-sm text-gray-400">Featured Project (max 6)</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => setEditingProject(null)} 
                variant="outline"
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateProject(editingProject.id, editingProject)} 
                className="bg-glow hover:bg-glow/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-secondary/20 border-gray-800">
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
            <CardDescription>Fill in the details to add a new project to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Project Title *</label>
                <input
                  id="addProjectSection"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="e.g. AI Chat Application"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Image URL</label>
                <input
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Description *</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="Project description"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Tech Stack (comma separated)</label>
                <input
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">GitHub URL</label>
                <input
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Live URL</label>
                <input
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-2 text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newProject.featured}
                    onChange={(e) => setNewProject({...newProject, featured: e.target.checked})}
                    className="form-checkbox h-4 w-4 text-glow rounded border-gray-700 bg-dark/50"
                  />
                  <span className="text-sm text-gray-400">Featured Project</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddProject} 
                className="bg-glow hover:bg-glow/90"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-secondary/20 border-gray-800">
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>Manage your existing projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-dark/50">
              <TableRow>
                <TableHead className="text-gray-400">Title</TableHead>
                <TableHead className="text-gray-400">Technologies</TableHead>
                <TableHead className="text-gray-400">Featured</TableHead>
                <TableHead className="text-right text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="border-b border-gray-800">
                  <TableCell className="text-white">{project.title}</TableCell>
                  <TableCell className="text-gray-300">
                    {project.technologies.join(', ')}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {project.featured ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-gray-700"
                      onClick={() => handleUpdateProject(project.id, { featured: !project.featured })}
                    >
                      <Star className={`h-4 w-4 ${project.featured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-blue-900/50 text-blue-400"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-red-900/50 text-red-400"
                      onClick={() => handleRemoveProject(project.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMS;
