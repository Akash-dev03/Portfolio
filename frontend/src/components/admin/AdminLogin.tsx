import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

// This is the passcode that can be changed in the code
const ADMIN_PASSCODE = "admin123"; // You should change this to something more secure

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        passcode
      });

      const { token, admin } = response.data;
      
      // Store the token and admin info
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminInfo', JSON.stringify(admin));
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid passcode",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4">
      <div className="glass-morphism rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Admin Login</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-glow to-glow-secondary mx-auto mt-2"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="passcode" className="block text-sm text-gray-400 mb-1">Passcode</label>
            <input
              id="passcode"
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
              placeholder="Enter admin passcode"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-glow to-glow-secondary text-white font-medium hover:shadow-lg hover:shadow-glow/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Verifying...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-glow hover:underline text-sm">
            Return to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
