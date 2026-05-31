import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import ClaimCashback from './pages/ClaimCashback';
import HostDashboard from './pages/HostDashboard';
import GuestDashboard from './pages/GuestDashboard';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/claim/:id" element={<ClaimCashback />} />
              <Route path="/host" element={<HostDashboard />} />
              <Route path="/guest" element={<GuestDashboard />} />
              <Route path="/login" element={<Auth />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
