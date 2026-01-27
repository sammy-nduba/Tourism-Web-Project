import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '../../services/AdminService';
import { StatCard } from '../components/StatCard';
import { Map, Users, MessageSquare, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with Wild Horizon Adventures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Tours"
          value={stats?.totalTours || 0}
          icon={<Map className="w-6 h-6 text-white" />}
          color="blue"
        />
        <StatCard
          title="Total Programs"
          value={stats?.totalPrograms || 0}
          icon={<Users className="w-6 h-6 text-white" />}
          color="green"
        />
        <StatCard
          title="Pending Contacts"
          value={stats?.pendingContacts || 0}
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          color="orange"
        />
        <StatCard
          title="Pending Volunteers"
          value={stats?.pendingVolunteers || 0}
          icon={<UserCheck className="w-6 h-6 text-white" />}
          color="purple"
        />
        <StatCard
          title="Total Donations"
          value={stats?.totalDonations || 0}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="green"
        />
        <StatCard
          title="Recent Activity"
          value={stats?.recentActivity || 0}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
              <p className="font-medium text-emerald-900">Add New Tour</p>
              <p className="text-sm text-emerald-600">Create a new adventure experience</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <p className="font-medium text-blue-900">Add New Program</p>
              <p className="text-sm text-blue-600">Create conservation or volunteer program</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <p className="font-medium text-orange-900">Review Applications</p>
              <p className="text-sm text-orange-600">Process volunteer applications</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Authentication</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Last Backup</span>
              <span className="text-slate-900 font-medium">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
