import { useEffect, useState } from 'react';
import { adminService } from '../../services/AdminService';
import { CheckCircle, XCircle, Mail, Phone, MapPin } from 'lucide-react';

type VolunteerApplication = Awaited<ReturnType<typeof adminService.getVolunteerApplications>>[0];

export function VolunteersPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await adminService.getVolunteerApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.updateVolunteerApplication(id, {
        status,
        reviewed_at: new Date().toISOString(),
      });
      await loadApplications();
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Failed to update application');
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
        <h1 className="text-2xl font-bold text-slate-900">Volunteer Applications</h1>
        <p className="text-slate-600 mt-1">Review and manage volunteer program applications</p>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500">No volunteer applications found</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{app.applicant_name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  {app.programs && (
                    <p className="text-sm text-slate-600 mb-2">
                      Program: <span className="font-medium">{app.programs.title}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {app.applicant_email}
                    </div>
                    {app.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {app.phone}
                      </div>
                    )}
                    {app.country && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {app.country}
                      </div>
                    )}
                  </div>
                </div>
                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(app.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'rejected')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {app.date_of_birth && (
                  <div>
                    <p className="text-sm font-medium text-slate-700">Date of Birth:</p>
                    <p className="text-slate-900">{new Date(app.date_of_birth).toLocaleDateString()}</p>
                  </div>
                )}
                {app.preferred_start_date && (
                  <div>
                    <p className="text-sm font-medium text-slate-700">Preferred Start Date:</p>
                    <p className="text-slate-900">{new Date(app.preferred_start_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {app.experience && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">Experience:</p>
                  <p className="text-slate-900 whitespace-pre-wrap">{app.experience}</p>
                </div>
              )}

              {app.motivation && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">Motivation:</p>
                  <p className="text-slate-900 whitespace-pre-wrap">{app.motivation}</p>
                </div>
              )}

              {app.admin_notes && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-1">Admin Notes:</p>
                  <p className="text-slate-600">{app.admin_notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
                Applied: {new Date(app.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
