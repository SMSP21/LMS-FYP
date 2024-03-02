import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
      <li><Link to="/HomePage">Login</Link></li>
        <li><Link to="/LoginPage">Login</Link></li>
        <li><Link to="/RegistrationForm">Register</Link></li>
        {/* Add other navigation links as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;