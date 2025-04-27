
import React, { useEffect, useRef, memo } from 'react';
import { Code, Database, Terminal, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

// Extract InterestItem into its own component
const InterestItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-glow/20 rounded-lg text-glow">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-medium text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const About = () => {
  const ref = useRef<HTMLDivElement>(null);

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
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const interests = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building modern, responsive web applications'
    },
    {
      icon: Terminal,
      title: 'AI & Machine Learning',
      description: 'Creating intelligent systems and algorithms'
    },
    {
      icon: Database,
      title: 'Cloud Computing',
      description: 'Deploying scalable applications in the cloud'
    },
    {
      icon: Laptop,
      title: 'Cybersecurity',
      description: 'Securing applications and protecting data'
    }
  ];

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1
      }
    }
  };

  return (
    <section id="about" className="section-padding bg-dark relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About <span className="text-glow">Me</span>
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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <motion.p 
                className="text-lg text-gray-300 mb-6"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                I'm a passionate computer science engineering student graduating in May 2025, with a strong foundation in full-stack development. I love building innovative solutions that combine cutting-edge technologies with elegant user experiences.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-300 mb-6"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                My journey in tech began with web development, which quickly expanded to machine learning, cloud computing, and cybersecurity. I enjoy tackling complex problems and continuously learning new technologies to stay at the forefront of the industry.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-300 mb-6"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                I'm particularly interested in the MERN stack, AI/ML applications, and building secure, scalable cloud solutions. When I'm not coding, you can find me contributing to open source projects or exploring the latest technological advancements.
              </motion.p>
            </div>

            <motion.div 
              className="glass-morphism rounded-2xl p-6 md:p-8 h-fit"
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-display font-bold mb-6 text-white">My Interests</h3>
              
              <div className="space-y-6">
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <InterestItem 
                      icon={interest.icon} 
                      title={interest.title} 
                      description={interest.description} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(About);
