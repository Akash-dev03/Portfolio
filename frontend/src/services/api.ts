import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: 'https://portfolio-bfnh.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Contact APIs
export const contactApi = {
  // Submit a new contact message (public)
  submit: async (data: { name: string; email: string; message: string }) => {
    const response = await api.post('/contacts', data);
    return response.data;
  },

  // Get all contacts (protected)
  getAll: async () => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get unread contacts count (protected)
  getUnreadCount: async () => {
    const response = await api.get('/contacts/unread');
    return response.data;
  },

  // Mark contact as read (protected)
  markAsRead: async (id: number) => {
    const response = await api.put(`/contacts/${id}/read`);
    return response.data;
  },

  // Reply to a contact (protected)
  reply: async (id: number, message: string) => {
    const response = await api.post(`/contacts/${id}/reply`, { message });
    return response.data;
  },

  // Delete a contact (protected)
  delete: async (id: number) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  }
};

export default api; 