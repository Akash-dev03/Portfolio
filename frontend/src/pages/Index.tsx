
import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Internships from '@/components/Internships';
import { recordVisit } from '@/utils/adminStorage';

const Index = () => {
  // Record a site visit on component mount
  useEffect(() => {
    recordVisit();
  }, []);
  
  // Optimize reveal elements on scroll with useCallback
  const handleScroll = useCallback(() => {
    const reveals = document.querySelectorAll('.reveal');
    
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check on initial load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <Hero />
      <About />
      <Skills />
      <Internships />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </motion.div>
  );
};

export default React.memo(Index);
