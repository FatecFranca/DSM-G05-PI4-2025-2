import React from 'react';
import './Footer.css'; // Assuming you want to style the footer separately

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Condo Access System. All rights reserved.</p>
        <p>Contact us: support@condoaccess.com</p>
      </div>
    </footer>
  );
};

export default Footer;