import { useEffect, useState } from 'react';
import { adminService } from '../../services/AdminService';
import { CheckCircle, Mail, Phone, MessageSquare } from 'lucide-react';

type ContactRequest = Awaited<ReturnType<typeof adminService.getContactRequests>>[0];

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await adminService.getContactRequests();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (id: string) => {
    try {
      await adminService.updateContactRequest(id, {
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      });
      await loadContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
      alert('Failed to update contact request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Requests</h1>
        <p className="text-slate-600 mt-1">Manage incoming contact form submissions</p>
      </div>

      <div className="grid gap-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No contact requests found</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{contact.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : contact.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
                {contact.status === 'pending' && (
                  <button
                    onClick={() => markAsResolved(contact.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </button>
                )}
              </div>

              {contact.subject && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700">Subject:</p>
                  <p className="text-slate-900">{contact.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Message:</p>
                <p className="text-slate-900 whitespace-pre-wrap">{contact.message}</p>
              </div>

              {contact.notes && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-1">Admin Notes:</p>
                  <p className="text-slate-600">{contact.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
                Submitted: {new Date(contact.created_at).toLocaleDateString()} at{' '}
                {new Date(contact.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
