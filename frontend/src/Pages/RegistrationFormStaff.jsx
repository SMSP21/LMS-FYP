import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from "../assets/onlineLibrary1.png";
import profileIcon from "../assets/profileIcon.jpg";
import rectangle3 from "../assets/rectangle3.jpeg";
import axios from 'axios';
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import Button from "./button";

function RegistrationFormStaff() {
  const [formData, setFormData] = useState({
    userFullName: '',
    userEmail: '',
    userUserName: '',
    userPassword: '',
    userConfirmPassword: '',
    userType:'member',
  }); 
  const userData =JSON.parse(localStorage.getItem('userData'));
  const username = userData.username;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple form validation
    if (
      !formData.userFullName ||
      !formData.userEmail ||
      !formData.userUserName ||
      !formData.userPassword ||
      !formData.userConfirmPassword ||
      !formData.userType
    ) {
      // If any required field is missing, show an error message
      toast.error('All fields are required');
      return;
    }

    if (formData.userPassword !== formData.userConfirmPassword) {
      // If passwords do not match, show an error message
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      // Make API call to register user with formData
      const response = await fetch('http://localhost:5002/register/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Check if registration was successful
      if (response.ok) {
        // Registration successful, show success message
        toast.success('Registration successful!');
      } else {
        // Registration failed, show error message
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Internal Server Error. Please try again later.');
    }
  };



  return (
    <>
      <div className="titleAndProfile">
        <h1 className="title">Library Management System</h1>
        <div className="profileIcon">
        <button className="panel-button view-profile-button" onClick={toggleProfileModal}>
        View Profile
      </button>
        </div>
      </div>

      <img src={onlinelibrary} alt="" className="backgroundImage" />
      <nav className="navigationContainer">
      <Link to="/add-shelfs">
                <button className="menuButton">Add Shelfs</button>
              </Link>
      <Link to="/add-books"><button className="menuButton">Add Books</button></Link>
              <Link to="/book-searchs"><button className="menuButton">Book Search</button></Link>
              <Link to="/RegistrationStaff"><button className="menuButton">Register User</button></Link>
              <Link to="/view-reservations"><button className="menuButton">View Reservation</button></Link>
              <Link to="/user-detail">
              <Link to="/user-detail">
                <button className="menuButton">User Detail</button>
              </Link>
              </Link>
              <Link to="/Signout">
              <Button >
                Signout
              </Button>
              </Link>
      </nav>
      <section className="form-section">
        <article className="form-container">
          <aside className="image-aside">
            <img src={rectangle3} alt="Side Decorative" className="side-image" />
          </aside>
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userFullName" className="visually-hidden">Full Name</label>
              <input
                type="text"
                id="userFullName"
                className="form-input"
                aria-label="Full Name"
                placeholder="Full Name"
                value={formData.userFullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userUserName" className="visually-hidden">Username</label>
              <input
                type="text"
                id="userUserName"
                className="form-input"
                aria-label="Username"
                placeholder="Username"
                value={formData.userUserName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail" className="visually-hidden">Email</label>
              <input
                type="email"
                id="userEmail"
                className="form-input"
                aria-label="Email"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userPassword" className="visually-hidden">Password</label>
              <input
                type="password"
                id="userPassword"
                className="form-input"
                aria-label="Password"
                placeholder="Password"
                value={formData.userPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userConfirmPassword" className="visually-hidden">Confirm Password</label>
              <input
                type="password"
                id="userConfirmPassword"
                className="form-input"
                aria-label="Confirm Password"
                placeholder="Confirm Password"
                value={formData.userConfirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userType" className="visually-hidden">
                User Type
              </label>
              <select
                id="userType"
                className="form-input"
                aria-label="User Type"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="member">Member</option>
                <option value="staff">Staff</option> {/* Fixed value */}
              </select>
            </div>
            <button type="submit" className="form-submit">Register</button>
          </form>
        </article>
      </section>
            {/* View Profile Modal */}
            {isProfileModalOpen && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={toggleProfileModal}>
              &times;
            </span>
            <ViewProfile />
          </div>
        </div>
      )}
      <ToastContainer />
      
      <style jsx>{`
        .titleAndProfile {
          display: flex;
          align-items: center;
        }

        .title {
          margin: 5rem;
          font-size: 3rem;
          color: #f5f5f5;
        }

        .profileIcon {
          cursor: pointer;
          width: 15px;
          margin-left: 15rem;
        }

        .backgroundImage {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          object-position: center;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          opacity: 0.8;
        }

        .navigationContainer {
          background-color: rgba(119, 51, 51, 0.99);
          display: flex;
          justify-content: space-around;
          padding: 1rem 0;
          color: #f5f5f5;
          position: relative;
        }

        .menuButton {
          font-family: Inter, sans-serif;
          border-radius: 30px;
          box-shadow: 0px 20px 4px 0px rgba(0, 0, 0, 0.25);
          padding: 1rem;
          background-color: rgba(29, 2, 33, 0.58);
          color: #e6f624;
          cursor: pointer;
        }

       

        .form-container {
          display: flex;
          justify-content: center;
        }

        .form-section {
          box-shadow: 0px 15px 4px 0px rgba(0, 0, 0, 0.25);
          background-color: rgba(119, 51, 51, 0.99);
          padding: 10px;
          border-radius: 8px;
          margin: 20px 0;
         
        }

        .image-aside {
          flex-basis: 50%;
        }

        .side-image {
          width:90%;
          height: auto;
          padding-left: 20px;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-basis: 50%;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input {
          background-color: #d9d9d9;
          height: 35px;
          padding: 8px;
          margin-top: 5px;
          border: none;
          font-size: 16px;
          border-radius: 5px;
        }

        .form-submit {
          background-color: #d9d9d9;
          color: #000;
          padding: 12px 24px;
          font: italic 700 18px Inter, sans-serif;
          align-self: flex-end;
          cursor: pointer;
          border: none;
          border-radius: 5px;
        }

        .login-container {
          margin-top: 20px;
          text-align: center;
          padding-bottom: 20px
        }

        .login-container p {
          color: #fff;
          font-size: 14px;
        }

        .login-container a {
          color: #fff;
          text-decoration: underline;
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        @media (max-width: 768px) {
          .header-title {
            font-size: 24px;
          }

          .header-overlay {
            background-size: cover;
          }

          .form-section {
            width: 100%;
            padding: 10px;
          }

          .form-container {
            flex-direction: column;
          }

          .image-aside,
          .registration-form {
            flex-basis: 100%;
          }

          .form-input {
            font-size: 14px;
          }

          .form-submit {
            font-size: 16px;
          }
        }
        .panel-button.view-profile-button {
          position: absolute;
          top: 20px; /* Adjust the distance from the top as needed */
          right: 20px; /* Adjust the distance from the right as needed */
          z-index: 999; /* Ensure it's above other content */
          padding: 10px 20px;
          border-radius: 5px;
          background-color: #
        }
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        .popup-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
          z-index: 2;
        }
        .panel-button.view-profile-button:hover {
          background-color: #1a18b6;
        }
      `}</style>
    </>
  );
}

export default RegistrationFormStaff;
