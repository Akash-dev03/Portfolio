
// Types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SiteVisit {
  date: string;
  count: number;
}

// Helper functions to save and retrieve data from localStorage
export const saveContacts = (contacts: ContactMessage[]): void => {
  localStorage.setItem('portfolio_contacts', JSON.stringify(contacts));
};

export const getContacts = (): ContactMessage[] => {
  const contacts = localStorage.getItem('portfolio_contacts');
  return contacts ? JSON.parse(contacts) : [];
};

export const addContact = (contact: Omit<ContactMessage, 'id' | 'date' | 'read'>): void => {
  const contacts = getContacts();
  const newContact: ContactMessage = {
    id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    ...contact,
    date: new Date().toISOString().split('T')[0], // Simple YYYY-MM-DD format
    read: false
  };
  
  contacts.push(newContact);
  saveContacts(contacts);
};

export const recordVisit = (): void => {
  const today = new Date().toISOString().split('T')[0];
  const visits = getVisits();
  
  const todayIndex = visits.findIndex(visit => visit.date === today);
  
  if (todayIndex >= 0) {
    visits[todayIndex].count += 1;
  } else {
    visits.push({ date: today, count: 1 });
  }
  
  localStorage.setItem('portfolio_visits', JSON.stringify(visits));
};

export const getVisits = (): SiteVisit[] => {
  const visits = localStorage.getItem('portfolio_visits');
  return visits ? JSON.parse(visits) : [];
};

export const getTotalVisits = (): number => {
  return getVisits().reduce((total, visit) => total + visit.count, 0);
};

export const getContactsStats = () => {
  const contacts = getContacts();
  return {
    total: contacts.length,
    unread: contacts.filter(contact => !contact.read).length,
    read: contacts.filter(contact => contact.read).length
  };
};
