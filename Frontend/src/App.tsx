import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './presentation/components/Layout/Layout';
import { HomePage } from './presentation/pages/HomePage';
import { CountriesPage } from './presentation/pages/CountriesPage';
import { CountryToursPage } from './presentation/pages/CountryToursPage';
import { ToursPage } from './presentation/pages/ToursPage';
import { AboutPage } from './presentation/pages/AboutPage';
import { ContactPage } from './presentation/pages/ContactPage';
import { ROUTES } from './shared/constants';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COUNTRIES} element={<CountriesPage />} />
          <Route path={ROUTES.COUNTRY} element={<CountryToursPage />} />
          <Route path={ROUTES.TOURS} element={<ToursPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          
          {/* Placeholder routes for other pages */}
          <Route path={ROUTES.PROGRAMS} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Programs - Coming Soon</h1></div>} />
          <Route path={ROUTES.BLOG} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Stories - Coming Soon</h1></div>} />
          <Route path={ROUTES.DONATE} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Get Involved - Coming Soon</h1></div>} />
          <Route path={ROUTES.SEARCH} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Search - Coming Soon</h1></div>} />
          <Route path={ROUTES.FAQ} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">FAQ - Coming Soon</h1></div>} />
          <Route path={ROUTES.PRIVACY} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Privacy Policy - Coming Soon</h1></div>} />
          <Route path={ROUTES.TERMS} element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Terms - Coming Soon</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;