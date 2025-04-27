import React, { useEffect, useRef, useState } from 'react';
import { SkillCategory } from '../data/skills';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  devicon: string;
}

interface CategoryButtonProps {
  id: SkillCategory | 'all';
  label: string;
  activeCategory: SkillCategory | 'all';
  setActiveCategory: (category: SkillCategory | 'all') => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.5 }
  }
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

// Category button component
const CategoryButton = React.memo(({ id, label, activeCategory, setActiveCategory }: CategoryButtonProps) => (
  <motion.button
    key={id}
    onClick={() => setActiveCategory(id)}
    className={`px-4 py-2 rounded-full text-sm transition-all ${
      activeCategory === id
        ? 'bg-gradient-to-r from-glow to-glow-secondary text-white'
        : 'bg-secondary text-gray-300 hover:text-white'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {label}
  </motion.button>
));

// Skill card component
const SkillCard = ({ skill, index }) => (
  <motion.div 
    key={skill.name}
    className="glass-morphism rounded-xl p-5 text-center flex flex-col items-center justify-between gap-3 overflow-hidden relative group"
    variants={itemVariants}
    whileHover={{ 
      y: -8,
      boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)',
      backgroundColor: 'rgba(30, 30, 40, 0.7)'
    }}
    transition={{ duration: 0.3 }}
  >
    <motion.div 
      className="absolute -right-10 -top-10 w-20 h-20 rounded-full bg-gradient-to-br from-glow/10 to-glow-secondary/10 blur-md"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
    />
    
    <motion.div 
      className="mb-2 text-4xl flex justify-center items-center h-14 relative"
      variants={iconVariants}
      animate={floatingVariants.animate}
      whileHover="hover"
    >
      <i className={`${skill.devicon} text-5xl`}></i>
    </motion.div>
    
    <motion.h3 
      className="text-gray-200 font-medium relative z-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      {skill.name}
    </motion.h3>
    
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-glow to-glow-secondary"
      initial={{ width: 0 }}
      whileInView={{ width: '100%' }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
    />
  </motion.div>
);

const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('languages');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState([
    { id: 'all', label: '🧠 All' },
    { id: 'languages', label: '💻 Languages' },
    { id: 'frontend', label: '🚀 Frontend' },
    { id: 'backend', label: '⚙️ Backend' },
    { id: 'tools', label: '🛠️ Tools' },
    { id: 'other', label: '🔍 Other' }
  ]);

  const handleCategoryChange = (category: SkillCategory | 'all') => {
    // If clicking the same category, force a re-render by toggling and then setting back
    if (category === activeCategory) {
      setActiveCategory('all');
      setTimeout(() => setActiveCategory(category), 0);
    } else {
      setActiveCategory(category);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${API_URL}/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Fixed filtering function to handle case insensitivity correctly
  const filteredSkills = React.useMemo(() => {
    console.log('Filtering skills. Active category:', activeCategory);
    console.log('Total skills:', skills.length);
    
    if (activeCategory === 'all') return skills;
    
    const filtered = skills.filter(skill => {
      const normalizedSkillCategory = String(skill.category).toLowerCase().trim();
      const normalizedActiveCategory = String(activeCategory).toLowerCase().trim();
      return normalizedSkillCategory === normalizedActiveCategory;
    });
    
    console.log('Filtered skills count:', filtered.length);
    return filtered;
  }, [skills, activeCategory]);

  // Log for debugging
  useEffect(() => {
    if (skills.length > 0) {
      console.log('Current skills count:', skills.length);
      console.log('Active category:', activeCategory);
      console.log('Filtered skills count:', filteredSkills.length);
      
      // Log all unique categories in the dataset to diagnose the issue
      const uniqueCategories = [...new Set(skills.map(s => String(s.category).toLowerCase().trim()))];
      console.log('Unique categories in data:', uniqueCategories);
      console.log('Normalized active category:', String(activeCategory).toLowerCase().trim());
    }
  }, [skills, activeCategory, filteredSkills]);

  if (loading) {
    return (
      <section id="skills" className="section-padding bg-dark/90 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Loading <span className="text-glow">Skills</span>...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-padding bg-dark/90 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My <span className="text-glow">Skills</span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div ref={ref} className="reveal">
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {categories.map((category) => (
              <CategoryButton 
                key={category.id}
                id={category.id as SkillCategory | 'all'} 
                label={category.label} 
                activeCategory={activeCategory} 
                setActiveCategory={handleCategoryChange}
              />
            ))}
          </motion.div>

          <motion.div 
            key={activeCategory} // Add key to force re-render
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </motion.div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No skills found in this category. Try checking the category spelling in your database.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;