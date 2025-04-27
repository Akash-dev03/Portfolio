
import React, { useRef, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Internship data
const internships = [
  {
    company: 'TechVerse Solutions',
    role: 'Full Stack Intern',
    duration: 'Jun 2024 - Sep 2024',
    description: 'Worked on building internal tooling dashboards using React, Node.js, and MongoDB. Improved performance and user experience with real-time charts.'
  },
  {
    company: 'CloudHive Networks',
    role: 'AI/ML Intern',
    duration: 'Dec 2023 - Feb 2024',
    description: 'Developed data pipelines and implemented ML models for anomaly detection using Python and FastAPI. Collaborated on RESTful API services.'
  },
  {
    company: 'CyberCore Labs',
    role: 'Cybersecurity Intern',
    duration: 'May 2023 - Jul 2023',
    description: 'Assisted in penetration testing and automated vulnerability scans. Contributed to documentation and internal security workshops.'
  }
];

// Extracted InternshipCard component
const InternshipCard = ({ internship, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 12
      } 
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="glass-morphism rounded-2xl p-6 h-full flex flex-col shadow-lg hover:shadow-glow/20 transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className="w-10 h-10 bg-glow/10 flex items-center justify-center rounded-full"
          whileHover={{ scale: 1.2, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
        >
          <Briefcase className="text-glow" size={22} />
        </motion.div>
        <div>
          <h4 className="font-bold text-lg text-white">{internship.company}</h4>
          <div className="text-glow text-sm">{internship.role}</div>
        </div>
      </div>
      <div className="text-sm text-gray-300 mb-2">{internship.duration}</div>
      <div className="text-gray-400">{internship.description}</div>
    </motion.div>
  );
};

const Internships = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      }, 
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
    };
  }, []);

  return (
    <section id="internships" className="section-padding bg-dark/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-glow">Internships</span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div ref={ref} className="reveal grid gap-6 md:grid-cols-3">
          {internships.map((internship, idx) => (
            <InternshipCard 
              key={internship.company} 
              internship={internship} 
              index={idx} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Internships);
