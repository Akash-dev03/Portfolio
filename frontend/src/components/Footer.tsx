import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-display font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-glow to-glow-secondary">
                Akash
              </span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Computer Science and Engineering Student</p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://github.com/Akash-dev03" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/akash-5302461b3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:a03akash@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a 
              href="tel:+916361661409" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Phone"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Akash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
