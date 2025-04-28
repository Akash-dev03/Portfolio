import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { toast } from '@/hooks/use-toast';
import api from "@/services/api";

const Settings = () => {
  const [adminPasscode, setAdminPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminPasscode !== confirmPasscode) {
      toast({
        title: "Passcodes don't match",
        description: "Please make sure both passcodes match",
        variant: "destructive",
      });
      return;
    }
    
    if (adminPasscode.length < 6) {
      toast({
        title: "Passcode too short",
        description: "Please use at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPasscode(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(
        '/settings/change-passcode',
        { newPasscode: adminPasscode }
      );

      toast({
        title: "Passcode updated",
        description: "Your admin passcode has been changed successfully",
      });
      
      setAdminPasscode('');
      setConfirmPasscode('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update passcode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPasscode(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="glass-morphism rounded-xl p-6 max-w-2xl">
        <h3 className="text-xl font-medium text-white mb-6">Admin Settings</h3>
        
        <div className="space-y-8">
          <section>
            <h4 className="text-lg text-white mb-4">Change Admin Passcode</h4>
            <form onSubmit={handleChangePasscode} className="space-y-4">
              <div>
                <label htmlFor="new-passcode" className="block text-sm text-gray-400 mb-1">New Passcode</label>
                <input
                  id="new-passcode"
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
                  placeholder="Enter new passcode"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirm-passcode" className="block text-sm text-gray-400 mb-1">Confirm Passcode</label>
                <input
                  id="confirm-passcode"
                  type="password"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50"
                  placeholder="Confirm new passcode"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isChangingPasscode}
                className="px-6 py-2.5 rounded-md bg-gradient-to-r from-glow to-glow-secondary text-white hover:shadow-lg hover:shadow-glow/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isChangingPasscode ? 'Updating...' : 'Update Passcode'}
              </button>
            </form>
          </section>
          
          <section>
            <h4 className="text-lg text-white mb-2">About Admin Panel</h4>
            <p className="text-gray-300">
              This admin panel allows you to manage your portfolio content, view visitor statistics, and handle contact form submissions.
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              Version 1.0.0
            </p>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
