import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

// Typing animation component
const TypeWriter = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const text = texts[currentTextIndex];
    
    const handleTyping = () => {
      // If deleting
      if (isDeleting) {
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          setTypingSpeed(150);
          return;
        }
        
        setCurrentText(text.substring(0, currentText.length - 1));
        setTypingSpeed(50);
        return;
      }
      
      // If typing
      if (currentText.length === text.length) {
        // Pause at the end
        setTypingSpeed(2000);
        setIsDeleting(true);
        return;
      }
      
      setCurrentText(text.substring(0, currentText.length + 1));
      setTypingSpeed(150);
    };
    
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed]);

  return (
    <span>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Animated background shapes component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-glow/10 via-dark to-dark" />
      
      {/* Animated shapes */}
      <div className="absolute inset-0">
        {/* Top right blob */}
        <motion.div
          className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-glow/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Left middle blob */}
        <motion.div
          className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-glow-secondary/5 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Floating particles */}
        {Array(8).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-glow-secondary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Code-like aesthetic elements */}
      <div className="absolute left-10 top-1/4 text-glow/10 text-5xl font-mono opacity-30">
        {"{"}
      </div>
      <div className="absolute right-10 bottom-1/4 text-glow-secondary/10 text-5xl font-mono opacity-30">
        {"}"}
      </div>
    </div>
  );
};

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const roles = [
    'Full-Stack Developer 💻',
    'AI/ML Explorer 🤖', 
    'Cybersecurity Learner 🔒', 
    'Diving into Cloud Computing ☁️', 
    'Tech Enthusiast 🚀'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16">
      {/* Enhanced animated background */}
      <AnimatedBackground />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="reveal md:w-1/2"
          >
            <div className="max-w-3xl mx-auto text-center md:text-left md:mx-0">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.span 
                  className="block"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Hi, I'm
                </motion.span>
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-glow to-glow-secondary"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Akash
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <TypeWriter texts={roles} />
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <motion.a
                  href="#projects"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-glow to-glow-secondary text-white font-medium hover:shadow-lg hover:shadow-glow/30 transition-all transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Projects
                </motion.a>
                <motion.a
                  href="/akash_resume.pdf"
                  download="akash_resume.pdf"
                  className="px-6 py-3 rounded-full bg-transparent border-2 border-glow/50 text-white font-medium hover:border-glow transition-all transform hover:-translate-y-1 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} /> Download Resume
                </motion.a>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex items-center gap-6 justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <motion.a 
                  href="https://github.com/Akash-dev03" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={24} />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/akash-5302461b3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a 
                  href="mailto:a03akash@gmail.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail size={24} />
                </motion.a>
                <motion.a 
                  href="tel:+916361661409" 
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Phone size={24} />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Animated illustration */}
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <div className="relative w-full max-w-md">
              {/* Code editor-like frame */}
              <motion.div 
                className="rounded-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur p-4 shadow-xl border border-gray-700/50 overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
              >
                {/* Editor header */}
                <div className="flex items-center mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  </div>
                  <div className="ml-4 px-2 py-0.5 rounded text-xs bg-gray-700/50 text-gray-300/80">
                    developer.ts
                  </div>
                </div>
                
                {/* Code content */}
                <div className="font-mono text-sm">
                  <div className="text-gray-500">1&nbsp;&nbsp;class <span className="text-purple-400">Developer</span> {" {"}</div>
                  <div className="text-gray-500">2&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">constructor</span>() {" {"}</div>
                  <div className="text-gray-500">3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">this</span>.<span className="text-green-400">name</span> = <span className="text-yellow-300">"Akash"</span>;</div>
                  <div className="text-gray-500">4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">this</span>.<span className="text-green-400">skills</span> = [<span className="text-yellow-300">"Web"</span>, <span className="text-yellow-300">"AI"</span>, <span className="text-yellow-300">"Cloud"</span>];</div>
                  <motion.div 
                    className="text-gray-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">this</span>.<span className="text-green-400">passion</span> = <span className="text-yellow-300">"Building amazing apps"</span>;
                  </motion.div>
                  <div className="text-gray-500">6&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</div>
                  <div className="text-gray-500">7</div>
                  <div className="text-gray-500">8&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">createValue</span>() {" {"}</div>
                  <div className="text-gray-500">9&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-yellow-300">"Innovative solutions"</span>;</div>
                  <div className="text-gray-500">10&nbsp;&nbsp;&nbsp;{"}"}</div>
                  <div className="text-gray-500">11 {"}"}</div>
                </div>
              </motion.div>
              
              {/* Floating elements around the code editor */}
              <motion.div 
                className="absolute -top-6 -right-6 w-12 h-12 rounded-lg bg-glow/20 blur-md"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              />
              <motion.div 
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-glow-secondary/20 blur-md"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.a 
          href="#about" 
          className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-sm mb-2">Scroll</span>
          <ArrowDown className="animate-bounce" size={20} />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;