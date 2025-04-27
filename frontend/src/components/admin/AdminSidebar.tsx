
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, User, Settings, FileText, MessageSquare } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="w-16 md:w-64 bg-dark border-r border-gray-700 transition-all duration-300 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white hidden md:block">Portfolio Admin</h2>
        <h2 className="text-lg font-bold text-white md:hidden">PA</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <NavItem to="/admin" icon={<Activity size={20} />} label="Dashboard" end />
          <NavItem to="/admin/cms" icon={<FileText size={20} />} label="CMS" />
          <NavItem to="/admin/contacts" icon={<MessageSquare size={20} />} label="Contacts" />
          <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500 hidden md:block">Admin v1.0.0</p>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const NavItem = ({ to, icon, label, end }: NavItemProps) => (
  <li>
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 ${
          isActive
            ? 'bg-glow/20 text-glow border-l-4 border-glow'
            : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
        } transition-colors rounded-r-md`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  </li>
);

export default AdminSidebar;
