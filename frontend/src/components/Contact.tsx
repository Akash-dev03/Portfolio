import React, { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin, Download, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contactApi } from '@/services/api';

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactApi.submit(formData);
      
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-glow/10 via-dark to-dark"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Get In <span className="text-glow">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto mb-4"></div>
          <p className="text-gray-300 max-w-xl mx-auto">
            Feel free to reach out for collaborations, opportunities, or just a friendly chat!
          </p>
        </div>

        <div ref={ref} className="reveal">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-morphism rounded-2xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-glow/10 text-glow">
                      <Mail />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href="mailto:john.doe@example.com" className="text-white hover:text-glow transition-colors">
                        a03akash@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-glow/10 text-glow">
                      <Github />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">GitHub</p>
                      <a 
                        href="https://github.com/Akash-dev03" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-glow transition-colors"
                      >
                        github.com/Akash-dev03
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-glow/10 text-glow">
                      <Linkedin />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">LinkedIn</p>
                      <a 
                        href="https://www.linkedin.com/in/akash-5302461b3" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-glow transition-colors"
                      >
                        linkedin.com/in/akash-5302461b3
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-glow/10 text-glow">
                      <Phone />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <a 
                        href="tel:+916361661409" 
                        className="text-white hover:text-glow transition-colors"
                      >
                        +91 6361661409
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/akash_resume.pdf"
                download="akash_resume.pdf"
                className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-glow to-glow-secondary text-white font-medium hover:shadow-lg hover:shadow-glow/30 transition-all transform hover:-translate-y-1 text-center justify-center"
              >
                <Download size={18} /> Download Resume
              </a>
            </div>
            
            <div className="glass-morphism rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-display font-bold text-white mb-6">
                Send Me a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
                    placeholder="Vijay Kumar"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
                    placeholder="vijay@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
                    placeholder="Hello, I'd like to discuss..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-glow to-glow-secondary text-white font-medium hover:shadow-lg hover:shadow-glow/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
