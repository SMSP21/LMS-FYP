import React from 'react';

const Button = ({ children }) => {
  const handleClick = () => {
    // Remove 'token' from localStorage
    localStorage.removeItem('token');

    // Remove 'userData' from localStorage
    localStorage.removeItem('userData');
  };

  return (
    <button className='menuButton panel-button signout-button' onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;