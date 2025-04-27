import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const openWebsite = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="flex h-screen bg-dark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-secondary border-b border-gray-700 shadow-md">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-display font-bold text-white">{title}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={openWebsite}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-md transition-colors"
              >
                <ExternalLink size={16} />
                <span>View Website</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-dark/90 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
