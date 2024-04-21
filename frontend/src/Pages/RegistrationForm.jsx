import React, { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import onlinelibrary from "../assets/onlineLibrary1.png";
import rectangle3 from "../assets/rectangle3.jpeg";
import axios from 'axios'; // Import axios

function RegistrationForm() {
  const [formData, setFormData] = useState({
    userFullName: '',
    userEmail: '',
    userUserName: '',
    userPassword: '',
    userConfirmPassword: '',
    userType:'member',
  }); 

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
            // Redirect to the member page
            window.location.href = '/member';
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
      <main>
        <header className="header-container">
          <img src={onlinelibrary} alt="Header Decorative" className="header-image" />
          <div className="header-overlay">
            <h1 className="header-title">Library Management System</h1>
            <section className="form-section">
              <article className="form-container">
                <aside className="image-aside">
                  <img src={rectangle3} alt="Side Decorative" className="side-image" />
                </aside>
                <form className="registration-form"  onSubmit={handleSubmit}>
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
                  disabled // Disable the select element to prevent user interaction
                >
                  <option value="member">Member</option>
                </select>

                </div>
                  <button type="submit" className="form-submit">Register</button>
                </form>
              </article>
            </section>
            <div className="login-container">
              <p>Already have an account? <Link to="/login">Login Here</Link></p>
            </div>
          </div>
        </header>
      </main>
      <ToastContainer />
      
      <style jsx>{`
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-container {
          position: relative;
          min-height: 80vh;
        }

        .header-image {
          
          opacity: 0.7;
          
        }

        .header-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
        }

        .header-title {
          font-size: 36px;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          letter-spacing: 2px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .form-section {
          box-shadow: 0px 15px 4px 0px rgba(0, 0, 0, 0.25);
          background-color: rgba(119, 51, 51, 0.99);
          padding: 10px;
          width: 80%;
          border-radius: 8px;
          margin: 10px 0;
          max-width: 1200px;
        }

        .form-container {
          display: flex;
          gap: 10px;
        }

        .image-aside {
          flex-basis: 50%;
        }

        .side-image {
          width:100%;
          height: auto;
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
      `}</style>
    </>
  )};


export default RegistrationForm;
