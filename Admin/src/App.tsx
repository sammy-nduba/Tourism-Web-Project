import { useState } from 'react';
import { AuthProvider } from './admin/presentation/hooks/useAuth';
import { ProtectedRoute } from './admin/presentation/components/ProtectedRoute';
import { AdminLayout } from './admin/presentation/layouts/AdminLayout';
import { DashboardPage } from './admin/presentation/pages/DashboardPage';
import { DestinationsPage } from './admin/presentation/pages/DestinationsPage';
import { ToursPage } from './admin/presentation/pages/ToursPage';
import { ProgramsPage } from './admin/presentation/pages/ProgramsPage';
import { BlogPage } from './admin/presentation/pages/BlogPage';
import { EventsPage } from './admin/presentation/pages/EventsPage';
import { ContactsPage } from './admin/presentation/pages/ContactsPage';
import { DonationsPage } from './admin/presentation/pages/DonationsPage';
import { VolunteersPage } from './admin/presentation/pages/VolunteersPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'tours':
        return <ToursPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'blog':
        return <BlogPage />;
      case 'events':
        return <EventsPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'donations':
        return <DonationsPage />;
      case 'volunteers':
        return <VolunteersPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderPage()}
        </AdminLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
