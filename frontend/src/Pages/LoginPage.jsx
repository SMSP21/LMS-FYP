import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from '../assets/onlineLibrary1.png';
import rectangle3 from '../assets/rectangle3.jpeg';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons library
import { useUser } from './usercontext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5002/user/login', {
        username,
        password,
      });
  
      const { success, message } = response.data;
  
      if (success) {
        // Successful login
        console.log('Login successful');
        // Redirect users to their respective dashboards based on userType
        const { token, userData } = response.data;

if (userData.userType === 'staff') {
  localStorage.setItem('token', token);
  localStorage.setItem('userData', JSON.stringify(userData)); // Stringify userData before saving to localStorage
  toast('Login successful!', { type: 'success' }); 
  toast.success('Login sucessfully'); 
  login(userData.userType, username, userData);
  navigate('/staff-dashboard');
}
       
         else {
          // Handle unrecognized user type
          console.error('Unauthorized: User type not recognized');
          toast.error('Unauthorized: User type not recognized');
        
        }
      } else {
        // Login failed
        toast.error(message); // Display error message as a toast
      }
    } catch (error) {
      console.error('Error:', error);
  
      if (error.response && error.response.status === 401) {
        toast.error('Invalid credentials: Please check your username and password.');
      } else {
        toast.error('Internal Server Error');
      }
    }
  };

  return (
    <>
      <div className="header-container">
        <img src={onlinelibrary} className="background-image" alt="Library themed decoration" />
        <div className="header-content">
          <h1 className="header-title">
            Library <span className="highlight-text">Management</span> System
          </h1>
          <div className="main-content">
            <section className="login-section">
              <div className="login-left">
                <img src={rectangle3} className="login-image" alt="Library themed decoration" />
              </div>
              <div className="login-right">
                <form className="login-form">
                  <div className="form-group">
                    <label htmlFor="usernameInput" className="visually-hidden">
                      Username
                    </label>
                    <input
                      type="text"
                      id="usernameInput"
                      className="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="passwordInput" className="visually-hidden">
                      Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                        id="passwordInput"
                        className="form-control"
                        placeholder="Password"
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password-button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon based on showPassword state */}
                      </button>
                    </div>
                  </div>
                  <button type="button" className="login-button" onClick={handleLogin}>
                    Login
                  </button>
                </form>
                
              </div>
            </section>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* ToastContainer for displaying notifications */}
    




      <style jsx>{`
        .header-container {
          position: relative;
          height: 100vh;
        }
        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          opacity: 0.7;
        }
        .header-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #f5f5f5;
          z-index: 2;
        }
        .header-title {
          font-family: 'Inter', sans-serif;
          font-weight: 1000;
          font-size: 80px;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          color: #fff;
        }
        .highlight-text {
          color: #ffcccb; /* Highlight color */
        }
        .main-content {
          box-shadow: 0px 15px 4px rgba(0, 0, 0, 0.25);
          background-color: rgba(119, 51, 51, 0.99);
          padding: 40px;
          margin-top: 20px;
          border-radius: 10px;
          width: 80%;
          margin: auto;
        }
        @media (max-width: 991px) {
          .header-title {
            font-size: 36px;
          }
          .main-content {
            padding: 20px;
          }
        }
        .login-section {
          display: flex;
          gap: 20px;
        }
        @media (max-width: 991px) {
          .login-section {
            flex-direction: column;
          }
        }
        .login-left, .login-right {
          flex: 1;
        }
        .login-right {
          flex: 1;
          margin-left: 20px; /* Add margin to create a gap between login-left and login-right */
        }
        
        .login-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px; /* Add vertical gap between form elements */
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-control {
          width: calc(100% - 20px); /* Make the text fields take up the full width minus padding */
          height: 47px;
          padding: 0 10px; /* Add padding to maintain equal gaps */
          border-radius: 5px;
        }
        
        
        .login-button {
          width: 30%; /* Make the button take up the full width */
          padding: 10px 0; /* Adjust padding to keep the height consistent */
          font-family: 'Inter', sans-serif;
          font-style: italic;
          cursor: pointer;
          border-radius: 5px;
          align-self: center;
        }
        
        .visually-hidden {
          border: 0;
          clip: rect(0 0 0 0);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }
        .register-now {
          margin-top: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #fff;
        }
        .register-now a {
          color: #d9d9d9;
          text-decoration: none;
        }
        .register-now a:hover {
          text-decoration: underline;
        }
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .popup-content {
          background-color: #fefefe;
          padding: 20px;
          border-radius: 5px;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }

        .close:hover {
          color: black;
        }
        .password-input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%; /* Ensure the container takes up the full width */
        }
        .toggle-password-button {
          background: none;
          border: none;
          cursor: pointer;
          position: absolute;
          right: 20px; /* Position the eye icon button to the right of the password input */
          opacity: 0.6; /* Set initial opacity */
          transition: opacity 0.3s ease; /* Add transition effect for opacity */
        }
        
        .toggle-password-button:hover {
          opacity: 1; /* Increase opacity on hover */
        }
        .absolute {
          position: absolute;
          right: 10px;
        }
      `}</style>

    </>
  );
}

export default LoginPage;
