import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { contactApi } from '@/services/api';
import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://portfolio-bfnh.onrender.com/api';


interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  replies: any[];
}

const Dashboard = () => {
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [unreadContacts, setUnreadContacts] = useState<number>(0);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [contactData, setContactData] = useState<any[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalSkills, setTotalSkills] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts data
        const contacts: Contact[] = await contactApi.getAll();
        const unreadCount = await contactApi.getUnreadCount();
        
        // Fetch projects count
        const projectsResponse = await axios.get(`${API_URL}/projects`);
        setTotalProjects(projectsResponse.data.length);

        // Fetch skills count
        const skillsResponse = await axios.get(`${API_URL}/skills`);
        setTotalSkills(skillsResponse.data.length);
        
        if (Array.isArray(contacts)) {
          setTotalContacts(contacts.length);
          
          // Get 5 most recent contacts
          const sortedContacts = [...contacts].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentContacts(sortedContacts.slice(0, 5));

          // Process contacts for chart data
          const monthlyData = contacts.reduce((acc, contact) => {
            const date = new Date(contact.createdAt);
            const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
          }, {});

          const chartData = Object.entries(monthlyData).map(([name, contacts]) => ({
            name,
            contacts,
          }));

          setContactData(chartData);
        } else {
          setTotalContacts(0);
          setRecentContacts([]);
          setContactData([]);
        }
        
        setUnreadContacts(unreadCount?.count || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setTotalContacts(0);
        setUnreadContacts(0);
        setRecentContacts([]);
        setContactData([]);
        setTotalProjects(0);
        setTotalSkills(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <StatCard 
          title="Total Projects" 
          value={totalProjects} 
          trend={totalProjects === 0 ? "No projects added" : `${totalProjects} projects showcased`}
          trendType="neutral"
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
        />
        <StatCard 
          title="Total Skills" 
          value={totalSkills} 
          trend={totalSkills === 0 ? "No skills added" : `${totalSkills} skills listed`}
          trendType="neutral"
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
        />
        <StatCard 
          title="Total Contacts" 
          value={totalContacts} 
          trend={totalContacts === 0 ? "No contacts yet" : `${totalContacts} total messages`}
          trendType="neutral"
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
        />
        <StatCard 
          title="Unread Messages" 
          value={unreadContacts} 
          trend={unreadContacts === 0 ? "All messages read" : `${unreadContacts} messages need attention`}
          trendType={unreadContacts > 0 ? "negative" : "positive"}
          className="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
        />
      </div>

      {/* Contact Chart */}
      {totalContacts > 0 && (
        <div className="glass-morphism rounded-xl p-4 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Contact Form Activity</h3>
          <ChartContainer
            config={{
              contacts: { label: "Messages" },
            }}
            className="h-80"
          >
            <BarChart data={contactData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <ChartTooltip />
              <Bar dataKey="contacts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {/* Recent Contacts */}
      <div className="glass-morphism rounded-xl p-4 mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Messages</h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              Loading messages...
            </div>
          ) : recentContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">No Messages Yet</p>
              <p className="text-gray-500">When visitors send messages through your contact form, they'll appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contact.read 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {contact.read ? 'Read' : 'Unread'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const StatCard = ({ title, value = 0, trend, trendType = 'positive', className = '' }: StatCardProps) => (
  <div className={`glass-morphism rounded-xl p-6 ${className}`}>
    <p className="text-gray-400 mb-1">{title}</p>
    <h3 className="text-3xl font-bold text-white">{value.toLocaleString()}</h3>
    <p className={`text-sm mt-2 ${
      trendType === 'positive' 
        ? 'text-green-400' 
        : trendType === 'negative' 
        ? 'text-red-400' 
        : 'text-gray-400'
    }`}>
      {trend}
    </p>
  </div>
);

export default Dashboard;
