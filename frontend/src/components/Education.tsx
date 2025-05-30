
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Extract Achievement component
const Achievement = ({ text }) => (
  <motion.li 
    className="list-disc list-inside text-gray-300"
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    {text}
  </motion.li>
);

const Education = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      },
      { threshold: 0.07, rootMargin: '0px 0px -100px 0px' }
    );
    
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
    };
  }, []);

  const achievements = [
    "Organized 10+ college events, increasing participation by 40%.",
    "Teaching for Juniors on various topics like Data Structures & Algorithms, Web Development etc.",
    "Member of Coding Club Society",
    "Successfully led hackathons and cultural fests, enhancing student engagement.",
  ];

  return (
    <section id="education" className="section-padding bg-dark/90">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-glow">Education</span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
        </div>
        <div ref={ref} className="reveal max-w-3xl mx-auto animate-fade-in">
          <motion.div 
            className="glass-morphism rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              mass: 1
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-glow/20 to-glow-secondary/20 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                  }}
                  viewport={{ once: true }}
                >
                  <span className="text-glow text-3xl font-display font-bold">BE</span>
                </motion.div>
              </div>
              <div>
                <motion.h3 
                  className="text-2xl font-display font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Bachelor of Engineering  in Information Science & Engineering
                </motion.h3>
                <motion.p 
                  className="text-glow text-lg mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Sri Krishna Institute of Technology, Bengaluru (SKIT)
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-3 items-center mb-6 text-gray-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="bg-glow/10 text-glow px-3 py-1 rounded-full text-sm">
                    2021 - 2025
                  </span>
                </motion.div>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Coursework includes: Data Structures & Algorithms, Web Development, Database Management, Computer Networks, Machine Learning, Cloud Computing, Software Engineering, and Operating Systems, Object Oriented Programming, Computer Organization and Architecture, etc.
                </motion.p>
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h4 className="text-white font-medium mb-2">Achievements</h4>
                  <ul className="space-y-1">
                    {achievements.map((achievement, index) => (
                      <Achievement key={index} text={achievement} />
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Education);
