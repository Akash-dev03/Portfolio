import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl: string;
  technologies: string[];
  featured: boolean;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [uniqueTechnologies, setUniqueTechnologies] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add focus event listener to refetch projects when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      // Extract unique technologies
      const techs = new Set<string>();
      projects.forEach(project => {
        project.technologies.forEach(tech => techs.add(tech));
      });
      setUniqueTechnologies(Array.from(techs).sort());

      // Filter projects by technology only
      let filtered = projects;
      if (selectedTech !== 'all') {
        filtered = filtered.filter(project =>
          project.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase())
        );
      }
      setFilteredProjects(filtered);
    }
  }, [projects, selectedTech]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      const fetchedProjects = response.data;
      setProjects(fetchedProjects);
      
      // Filter by technology if needed
      let filtered = fetchedProjects;
      if (selectedTech !== 'all') {
        filtered = filtered.filter(project =>
          project.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase())
        );
      }
      setFilteredProjects(filtered);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add polling to check for updates
  useEffect(() => {
    // Initial fetch
    fetchProjects();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchProjects, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we want this to run only once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-dark/90 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Loading <span className="text-glow">Projects</span>...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark/90 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 text-red-500">
              {error}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark/90 pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
        </div>

        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My <span className="text-glow">Projects</span>
          </motion.h1>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.7 }}
          />
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore my portfolio of projects that demonstrate my passion for building innovative solutions
            and my expertise in various technologies.
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={() => setSelectedTech('all')}
            className={`rounded-full px-4 py-2 ${
              selectedTech === 'all'
                ? 'bg-gradient-to-r from-glow to-glow-secondary text-white'
                : 'bg-secondary text-gray-300 hover:text-white'
            }`}
          >
            All Technologies
          </Button>
          {uniqueTechnologies.map((tech) => (
            <Button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`rounded-full px-4 py-2 ${
                selectedTech === tech
                  ? 'bg-gradient-to-r from-glow to-glow-secondary text-white'
                  : 'bg-secondary text-gray-300 hover:text-white'
              }`}
            >
              {tech}
            </Button>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="glass-morphism rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
              </div>

              <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-glow/10 text-glow"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Github size={20} />
                      <span>Source</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-glow hover:text-glow-secondary transition-colors"
                      >
                        <ExternalLink size={20} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No projects found with the selected technology.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;