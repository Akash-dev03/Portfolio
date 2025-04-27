import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Check, X, Mail, Trash2, CheckCircle2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from '@/hooks/use-toast';
import { contactApi } from '@/services/api';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  message: string;
  createdAt: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactApi.getAll();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        console.error('Expected array of contacts but got:', data);
        setContacts([]);
        toast({
          title: "Error",
          description: "Failed to load contacts - invalid data format",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(contacts.map(contact => contact.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectContact = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No selection",
        description: "Please select contacts to mark as read",
        variant: "destructive"
      });
      return;
    }

    try {
      const promises = selectedIds.map(id => contactApi.markAsRead(id));
      await Promise.all(promises);
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          selectedIds.includes(contact.id) 
            ? { ...contact, read: true }
            : contact
        )
      );
      
      setSelectedIds([]);
      toast({
        title: "Contacts marked as read",
        description: `${selectedIds.length} contact(s) have been marked as read`,
      });
    } catch (error) {
      console.error('Error marking contacts as read:', error);
      toast({
        title: "Error",
        description: "Failed to update contacts",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No selection",
        description: "Please select contacts to delete",
        variant: "destructive"
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} contact(s)?`)) return;

    try {
      const promises = selectedIds.map(id => contactApi.delete(id));
      await Promise.all(promises);
      
      setContacts(prevContacts => 
        prevContacts.filter(contact => !selectedIds.includes(contact.id))
      );
      
      setSelectedIds([]);
      toast({
        title: "Contacts deleted",
        description: `${selectedIds.length} contact(s) have been deleted`,
      });
    } catch (error) {
      console.error('Error deleting contacts:', error);
      toast({
        title: "Error",
        description: "Failed to delete contacts",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const updatedContact = await contactApi.markAsRead(id);
      if (updatedContact) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === id ? updatedContact : contact
          )
        );
        toast({
          title: "Contact marked as read",
          description: "The contact has been updated",
        });
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await contactApi.delete(id);
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      toast({
        title: "Contact deleted",
        description: "The contact has been removed",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive"
      });
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedContact) return;

    try {
      const updatedContact = await contactApi.reply(selectedContact.id, replyText);
      if (updatedContact) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedContact.id ? updatedContact : contact
          )
        );
        
        toast({
          title: "Reply sent",
          description: `Your response to ${selectedContact.name} has been sent`,
        });
        
        setSelectedContact(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout title="Contact Messages">
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">All Messages</h3>
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors flex items-center gap-1"
              >
                <CheckCircle2 size={16} />
                Mark as Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No messages yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === contacts.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-600 bg-dark/50 text-glow focus:ring-glow"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className={!contact.read ? 'bg-glow/5' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                        className="rounded border-gray-600 bg-dark/50 text-glow focus:ring-glow"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{contact.message}</div>
                    </TableCell>
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
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-1.5 rounded-md bg-glow/10 text-glow hover:bg-glow/20 transition-colors"
                          title="Reply"
                        >
                          <Mail size={16} />
                        </button>
                        {!contact.read && (
                          <button
                            onClick={() => handleMarkAsRead(contact.id)}
                            className="p-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-morphism rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Reply to {selectedContact.name}
            </h3>
            
            <div className="bg-dark/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-400">From: {selectedContact.email}</p>
              <p className="text-sm text-gray-400">Date: {formatDate(selectedContact.createdAt)}</p>
              <p className="mt-3 text-white">{selectedContact.message}</p>
              
              {selectedContact.replies && selectedContact.replies.length > 0 && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Previous Replies</h4>
                  <div className="space-y-3">
                    {selectedContact.replies.map(reply => (
                      <div key={reply.id} className="bg-dark/20 rounded p-3">
                        <p className="text-white text-sm">{reply.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(reply.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendReply}>
              <div className="mb-4">
                <label htmlFor="reply" className="block text-sm text-gray-400 mb-1">Your Reply</label>
                <textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-dark/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-glow/50 min-h-32"
                  placeholder="Type your reply here..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContact(null);
                    setReplyText('');
                  }}
                  className="px-4 py-2 rounded-md bg-gray-700/50 hover:bg-gray-700 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-glow to-glow-secondary text-white hover:shadow-lg hover:shadow-glow/30 transition-all"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Contacts;
