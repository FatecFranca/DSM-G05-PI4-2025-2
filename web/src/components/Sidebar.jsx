import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you will create a CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Condo Access</h2>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/visitors">Visitors</Link>
          </li>
          <li>
            <Link to="/vehicles">Vehicles</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;