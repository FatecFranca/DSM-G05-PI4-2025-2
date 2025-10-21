import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Vehicles from './pages/Vehicles';
import Users from './pages/Users';
import Settings from './pages/Settings';
import './index.css';

const App = () => {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <PrivateRoute path="/dashboard" element={<Dashboard />} />
            <PrivateRoute path="/visitors" element={<Visitors />} />
            <PrivateRoute path="/vehicles" element={<Vehicles />} />
            <PrivateRoute path="/users" element={<Users />} />
            <PrivateRoute path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;