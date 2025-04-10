import React from 'react';
import '../styles/nav.css'; // Import the CSS file for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          {/* Replace with your logo or brand name */}
          <a href="/" className="logo-link">Your Brand</a>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="/" className="navbar-link">Home</a>
          </li>
          <li className="navbar-item">
            <a href="/about" className="navbar-link">About</a>
          </li>
          <li className="navbar-item">
            <a href="/services" className="navbar-link">Services</a>
          </li>
          <li className="navbar-item">
            <a href="/contact" className="navbar-link">Contact</a>
          </li>
        </ul>
        {/* Optional: Add buttons or other elements */}
        {/* <div className="navbar-buttons">
          <button className="button primary-button">Sign Up</button>
          <button className="button secondary-button">Log In</button>
        </div> */}
      </div>
    </nav>
  );
}

export default Navbar;